import { parseDaum, queries, type Article } from '@/lib/daum';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

let cache: {at:number; body:unknown}|null=null;
let pending: Promise<unknown>|null=null;
async function collect() {
 const started=Date.now(); const results: Article[]=[]; const failed:string[]=[];
 for(let i=0;i<queries.length;i+=3) {
  await Promise.all(queries.slice(i,i+3).map(async q=>{
   try {
    const url='https://search.daum.net/search?'+new URLSearchParams({w:'news',q,sort:'recency',cluster:'y'});
    const res=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{'Accept':'text/html','Accept-Language':'ko,en;q=0.8'}});
    if(!res.ok) { console.warn('Daum HTTP status', res.status, 'query', q); throw new Error('source'); }
    const html=await res.text();
    const articles=parseDaum(html);
    if(!articles.length) { console.warn('Daum returned no parseable articles', q); failed.push(q);return; }
    results.push(...articles);
   }catch(e) { console.warn('Daum query failed', q, e instanceof Error ? e.name : 'Error'); failed.push(q); }
  }));
 }
 if(!results.length) throw new Error('O Daum não retornou resultados legíveis agora. Tente novamente em alguns minutos ou abra a busca original.');
 const seen=new Set<string>();
 const items=results.filter(a=>{const key=a.title.toLowerCase().replace(/\s+/g,'');if(seen.has(a.url)||seen.has(key))return false;seen.add(a.url);seen.add(key);return true;}).sort((a,b)=>(Date.parse(b.publishedAt||'')||0)-(Date.parse(a.publishedAt||'')||0));
 const body={items,checkedAt:new Date(started).toISOString(),queries:queries.length-failed.length,totalQueries:queries.length,failed,translation:'external',scope:'Primeira página dos resultados mais recentes de cada busca no Daum.'};
 cache={at:Date.now(),body};return body;
}
export async function GET() {
 try {
  if(cache&&Date.now()-cache.at<300000) return Response.json(cache.body);
  if(!pending) pending=collect().finally(()=>{pending=null;});
  return Response.json(await pending,{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Não foi possível consultar o Daum.'},{status:502});}
}
