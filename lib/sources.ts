import { clean, makeArticle, parseTime, type Article, type Platform } from './daum';
export type SourceStatus = { platform:Platform; name:string; status:'ok'|'partial'|'unavailable'|'external'; count:number; detail:string; url:string };
export const sourceCatalog:SourceStatus[] = [
 {platform:'Daum',name:'Daum',status:'ok',count:0,detail:'9 buscas sobre o grupo e os integrantes.',url:'https://search.daum.net/search?w=news&q=BTS&sort=recency'},
 {platform:'Naver',name:'Naver',status:'ok',count:0,detail:'Notícias da busca pública do Naver.',url:'https://search.naver.com/search.naver?where=news&query=BTS&sort=1'},
 {platform:'Fóruns coreanos',name:'TheQoo',status:'ok',count:0,detail:'Tópicos públicos do fórum BTS. Conteúdo de comunidade.',url:'https://theqoo.net/bts'},
 {platform:'Fóruns coreanos',name:'Pann',status:'ok',count:0,detail:'FanTalk BTS; pode haver publicações antigas.',url:'https://pann.nate.com/fantalk/2354'},
 {platform:'Weibo',name:'Weibo',status:'external',count:0,detail:'Pesquisa externa. Coleta não conectada: o acesso público retornou uma tela de visitantes.',url:'https://s.weibo.com/weibo?q=BTS'},
 {platform:'X',name:'X',status:'external',count:0,detail:'Pesquisa externa. A coleta oficial exige acesso à API e créditos pagos.',url:'https://x.com/search?q=BTS%20OR%20%EB%B0%A9%ED%83%84%EC%86%8C%EB%85%84%EB%8B%A8&src=typed_query&f=live'},
];
export function parseNaver(html:string,now=Date.now()):Article[]{
 const result:Article[]=[];
 for(const block of html.split('data-sds-comp="Profile">').slice(1)){
  const title=block.match(/<a\b[^>]*href="([^"]+)"[^>]*data-heatmap-target="\.tit"[^>]*>([\s\S]*?)<\/a>/);if(!title)continue;
  const strip=(s:string)=>clean(s).replace(/새 창 열림/g,'').trim();
  const source=strip(block.match(/sds-comps-profile-info-title-text"[^>]*>[\s\S]*?<a\b[^>]*>([\s\S]*?)<\/a>/)?.[1]||'Naver');
  const excerpt=strip(block.match(/<a\b[^>]*data-heatmap-target="\.body"[^>]*>([\s\S]*?)<\/a>/)?.[1]||'');
  const beforeTitle=clean(block.slice(0,block.indexOf('data-heatmap-target=".tit"')));
  const label=beforeTitle.match(/\d+\s*(?:분|시간|일)\s*전|20\d{2}\.\s*\d{1,2}\.\s*\d{1,2}\.?/)?.[0]||'';
  const a=makeArticle({title:strip(title[2]),excerpt,source,url:clean(title[1]),platform:'Naver',publishedAt:parseTime(label,now),timeLabel:label});if(a)result.push(a);
 }return result;
}
function forumTime(label:string,now:number):string|null{
 const korea=new Date(now+9*3600000);
 if(/^\d{2}:\d{2}$/.test(label))return new Date(`${korea.toISOString().slice(0,10)}T${label}:00+09:00`).toISOString();
 if(/^\d{2}\.\d{2}$/.test(label)){let year=korea.getUTCFullYear();if(label.replace('.','-')>korea.toISOString().slice(5,10))year--;return parseTime(`${year}.${label}`,now);}
 if(/^\d{2}\.\d{2}\.\d{2}$/.test(label))return parseTime('20'+label,now);
 return parseTime(label,now);
}
export function parseTheQoo(html:string,now=Date.now()):Article[]{
 const result:Article[]=[];
 for(const row of html.matchAll(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/g)){
  if(/notice/.test(row[1]))continue;
  const b=row[2],m=b.match(/<td class="title"[^>]*>[\s\S]*?<a href="(\/bts\/\d+)"[^>]*>([\s\S]*?)<\/a>/);if(!m)continue;
  const label=clean(b.match(/<td class="time"[^>]*>([\s\S]*?)<\/td>/)?.[1]||'');
  const a=makeArticle({title:clean(m[2]),source:'TheQoo · BTS',url:'https://theqoo.net'+m[1],platform:'Fóruns coreanos',kind:'Comunidade',publishedAt:forumTime(label,now),timeLabel:label});if(a)result.push(a);
 }return result;
}
export function parsePann(html:string,now=Date.now()):Article[]{
 const result:Article[]=[];
 for(const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)){
  const b=row[1];if(!b.includes('class="subject"')||b.includes('ico_noti'))continue;
  const m=b.match(/<h2>\s*<a href="(\/talk\/\d+)"[^>]*>([\s\S]*?)<\/a>/);if(!m)continue;
  const label=clean(b).match(/20\d{2}\.\d{2}\.\d{2}/)?.[0]||'';
  const a=makeArticle({title:clean(m[2]),source:'Pann · FanTalk BTS',url:'https://pann.nate.com'+m[1],platform:'Fóruns coreanos',kind:'Comunidade',publishedAt:forumTime(label,now),timeLabel:label});if(a)result.push(a);
 }return result;
}
export function mergeArticles(input:Article[]):Article[]{
 const byUrl=new Map<string,Article>(),byTitle=new Map<string,Article>(),output:Article[]=[];
 for(const a of input){
  const key=a.title.toLowerCase().replace(/\s+/g,'');
  const existing=byUrl.get(a.url)||(a.kind==='Notícia'?byTitle.get(key):undefined);
  if(existing){for(const o of a.origins)if(!existing.origins.some(p=>p.platform===o.platform&&p.source===o.source))existing.origins.push(o);continue;}
  byUrl.set(a.url,a);if(a.kind==='Notícia')byTitle.set(key,a);output.push(a);
 }return output.sort((a,b)=>(Date.parse(b.publishedAt||'')||0)-(Date.parse(a.publishedAt||'')||0));
}
