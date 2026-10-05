import { parseDaum, queries, type Article } from '@/lib/daum';
import { mergeArticles, parseNaver, parseTheQoo, parsePann, sourceCatalog } from '@/lib/sources';
import { socialArticles, socialCheckedAt } from '@/lib/social-feed';
import { translateArticles } from '@/lib/translation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=180;
let cache:{at:number;body:unknown}|null=null;
let pending:Promise<unknown>|null=null;
async function collect(){
 const started=Date.now(),results:Article[]=[],failed:string[]=[];
 const sources=sourceCatalog.map(s=>({...s}));
 const jobs=queries.map(q=>({name:`Daum: ${q}`,source:0,url:'https://search.daum.net/search?'+new URLSearchParams({w:'news',q,sort:'recency',cluster:'y'}),parse:parseDaum}));
 jobs.push(...['BTS','방탄소년단'].map(q=>({name:`Naver: ${q}`,source:1,url:'https://search.naver.com/search.naver?'+new URLSearchParams({where:'news',query:q,sort:'1'}),parse:parseNaver})));
 jobs.push({name:'TheQoo',source:2,url:sources[2].url,parse:parseTheQoo},{name:'Pann',source:3,url:sources[3].url,parse:parsePann});
 let next=0;
 await Promise.all(Array.from({length:5},async()=>{
  while(next<jobs.length){
   const job=jobs[next++];
   try{
    const res=await fetch(job.url,{signal:AbortSignal.timeout(14000),headers:{Accept:'text/html','Accept-Language':'ko,en;q=0.8'}});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const items=job.parse(await res.text(),started);if(!items.length)throw new Error('Sem resultados legíveis');
    sources[job.source].count+=items.length;results.push(...items);
   }catch(e){failed.push(job.name);console.warn('Fonte indisponível:',job.name,e instanceof Error?e.message:'Falha');}
  }
 }));
 for(let i=0;i<4;i++){
  const own=jobs.filter(j=>j.source===i),failures=own.filter(j=>failed.includes(j.name));
  sources[i].status=failures.length===own.length?'unavailable':failures.length?'partial':'ok';
  if(failures.length)sources[i].detail=sources[i].count?'Algumas buscas não responderam. Resultados parciais.':'Não foi possível ler esta fonte agora. A pesquisa externa continua disponível.';
  sources[i].count=new Set(results.filter(a=>i<2?a.platform===sources[i].platform:a.source.startsWith(sources[i].name)).map(a=>a.url)).size;
 }
 const social=socialArticles();
 for(const source of sources.filter(s=>s.status==='curated'))source.count=social.filter(p=>p.platform===source.platform).length;
 const translated=await translateArticles(mergeArticles([...results,...social]),started+170000);
 const body={socialCheckedAt,items:translated.items,checkedAt:new Date(started).toISOString(),queries:jobs.length-failed.length,totalQueries:jobs.length,failed,sources,translation:translated.translation};
 if(body.items.length)cache={at:Date.now(),body};return body;
}
export async function GET(){
 try{
  if(cache&&Date.now()-cache.at<300000)return Response.json(cache.body,{headers:{'Cache-Control':'no-store'}});
  if(!pending)pending=collect().finally(()=>{pending=null;});
  return Response.json(await pending,{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Não foi possível consultar as fontes agora.'},{status:502});}
}
