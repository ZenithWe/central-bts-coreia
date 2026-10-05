export const queries = ['BTS', '방탄소년단', '방탄소년단 RM', '방탄소년단 진', '방탄소년단 슈가', '방탄소년단 제이홉', '방탄소년단 지민', '방탄소년단 뷔', '방탄소년단 정국'];
export type Platform = 'Daum' | 'Naver' | 'Fóruns coreanos' | 'Weibo' | 'X';
export type Origin = { platform: Platform; source: string };
export type Article = { platform: Platform; origins: Origin[]; kind: 'Notícia' | 'Comunidade'; id: string; title: string; excerpt: string; source: string; url: string; publishedAt: string | null; timeLabel: string; members: string[]; topic: string; direct: boolean };
const members: Record<string, RegExp> = { RM: /\bRM\b|김남준|남준/i, Jin: /\bJin\b|김석진|방탄소년단\s*진|BTS\s*진/i, Suga: /슈가|민윤기|\bSuga\b|Agust D/i, 'J-Hope': /제이홉|정호석|j.?hope/i, Jimin: /지민|박지민|jimin/i, V: /방탄소년단\s*뷔|뷔|김태형|\bV\b/, Jungkook: /정국|전정국|jungkook/i };
export function clean(s: string) { return s.replace(/<[^>]*>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n,16))).replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
export function parseTime(raw: string, now: number): string | null {
 const rel = raw.match(/(\d+)\s*(분|시간|일)\s*전/);
 if(rel) return new Date(now-Number(rel[1])*({분:60000,시간:3600000,일:86400000}[rel[2]]||0)).toISOString();
 const abs = raw.match(/(20\d{2})[.\-/]\s*(\d{1,2})[.\-/]\s*(\d{1,2})(?:[.\s]+(\d{1,2}):(\d{2}))?/);
 if(abs) return new Date(`${abs[1]}-${abs[2].padStart(2,'0')}-${abs[3].padStart(2,'0')}T${(abs[4]||'00').padStart(2,'0')}:${abs[5]||'00'}:00+09:00`).toISOString();
 return null;
}
export function parseDaum(html: string, now = Date.now()): Article[] {
 const result: Article[]=[];
 for(const match of html.matchAll(/<li\b[^>]*data-docid="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)) {
  const b=match[2], titleMatch=b.match(/class="item-title"[\s\S]*?<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  if(!titleMatch) continue;
  let url: URL; try {url=new URL(clean(titleMatch[1]));} catch {continue;}
  if(!['http:','https:'].includes(url.protocol)) continue;
  if(url.hostname==='v.daum.net') url.protocol='https:';
  const title=clean(titleMatch[2]);
  const excerpt=clean(b.match(/class="conts-desc[^\"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1]||'');
  const source=clean(b.match(/class="tit_item"[^>]*>([\s\S]*?)<\/strong>/)?.[1]||'Daum News');
  const timeLabel=clean(b.match(/class="gem-subinfo"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/)?.[1]||'');
  const all=title+' '+excerpt;
  const found=Object.entries(members).filter(([,re])=>re.test(all)).map(([name])=>name);
  result.push({platform:'Daum',origins:[{platform:'Daum',source}],kind:'Notícia',id:url.href,title,excerpt,source,url:url.href,publishedAt:parseTime(timeLabel,now),timeLabel,members:found,topic:/브라질|브라질리아|상파울루|Brazil/i.test(all)?'Brasil':/투어|콘서트|공연|tour|concert/i.test(all)?'Shows e turnê':/앨범|음원|뮤직비디오|album|music/i.test(all)?'Música':'Geral',direct:/BTS|방탄소년단/i.test(title)||Object.values(members).some(re=>re.test(title))});
 }
 return result;
}

export function makeArticle(input: {title:string;excerpt?:string;source:string;url:string;platform:Platform;kind?:Article['kind'];publishedAt?:string|null;timeLabel?:string}): Article | null {
 let url:URL;try{url=new URL(input.url);}catch{return null;}
 if(!['https:','http:'].includes(url.protocol)||!input.title.trim())return null;
 const all=input.title+' '+(input.excerpt||'');
 return {id:url.href,title:input.title,excerpt:input.excerpt||'',source:input.source,url:url.href,platform:input.platform,origins:[{platform:input.platform,source:input.source}],kind:input.kind||'Notícia',publishedAt:input.publishedAt||null,timeLabel:input.timeLabel||'',members:Object.entries(members).filter(([,re])=>re.test(all)).map(([name])=>name),topic:/브라질|상파울루|Brazil/i.test(all)?'Brasil':/투어|콘서트|공연|tour|concert/i.test(all)?'Shows e turnê':/앨범|음원|뮤직비디오|album|music/i.test(all)?'Música':'Geral',direct:/BTS|방탄소년단/i.test(input.title)||Object.values(members).some(re=>re.test(input.title))};
}
