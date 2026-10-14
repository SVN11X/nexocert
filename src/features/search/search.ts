import type { Exam } from '../../content/schemas/content';
export const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function searchExam(e:Exam, query:string){
 const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 if(!terms.length)return [];
 const score=(v:string)=>terms.every(t=>normalize(v).includes(t));
 return e.lessons.filter(l=>score([e.code,e.providerId,e.title,l.title,l.summary,l.topic,...l.concepts,...l.blocks.map(b=>('body' in b?b.body:'')),e.domains.find(d=>d.id===l.domainId)?.title??''].join(' '))).map(l=>({id:l.id,title:l.title,domainId:l.domainId,summary:l.summary}));
}
