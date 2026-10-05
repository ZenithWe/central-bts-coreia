import feed from '@/data/social-posts.json';
import { makeArticle, type Article } from './daum';

export const socialCheckedAt=feed.checkedAt;
export function socialArticles():Article[]{
 const result:Article[]=[],seen=new Set<string>();
 for(const post of feed.posts){
  let u:URL;try{u=new URL(post.url);}catch{continue;}
  if(u.protocol!=='https:'||u.username||u.password||u.port)continue;
  const valid=post.platform==='X'?u.hostname==='x.com'&&/^\/[\w]+\/status\/\d+\/?$/.test(u.pathname):post.platform==='Weibo'&&u.hostname==='weibo.com'&&/^\/(?:\d{5,}\/[A-Za-z0-9]+|2\/detail\/\d+)\/?$/.test(u.pathname);
  if(!valid||seen.has(u.href))continue;
  const date=post.publishedDate;
  const publishedAt=date&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date&&Date.parse(date)<=Date.now()?`${date}T12:00:00Z`:null;
  const a=makeArticle({title:post.title,excerpt:post.summary,source:post.author,url:u.href,platform:post.platform as 'X'|'Weibo',kind:'Comunidade',publishedAt});
  if(a){seen.add(u.href);result.push({...a,language:'pt-BR',curated:true,foundAt:post.foundAt,accountType:post.accountType==='Oficial'?'Oficial':'Comunidade'});}
 }
 return result;
}
