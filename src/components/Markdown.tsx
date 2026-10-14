import type { ReactNode } from 'react';
// React escapes all content; raw HTML, images and executable Markdown are never rendered.
function inline(v:string):ReactNode[]{return v.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((s,i)=>s.startsWith('**')?<strong key={i}>{s.slice(2,-2)}</strong>:s.startsWith('`')?<code key={i}>{s.slice(1,-1)}</code>:s);}
export function Markdown({body}:{body:string}){
 return <div className="markdown">{body.split(/\n\n+/).map((p,i)=>{
  if(p.startsWith('## '))return <h2 key={i}>{inline(p.slice(3))}</h2>;
  if(p.startsWith('### '))return <h3 key={i}>{inline(p.slice(4))}</h3>;
  if(p.split('\n').every(l=>l.startsWith('- ')))return <ul key={i}>{p.split('\n').map((l,j)=><li key={j}>{inline(l.slice(2))}</li>)}</ul>;
  return <p key={i}>{inline(p)}</p>;
 })}</div>;
}
