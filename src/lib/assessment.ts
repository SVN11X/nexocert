import type { Exam, Question } from '../content/schemas/content';
export function evaluate(q: Question, answer: string[]): boolean {
 if (new Set(answer).size !== answer.length || answer.length !== q.correct.length) return false;
 return (q.type==='ordering'||q.type==='matching') ? q.correct.every((v,i)=>answer[i]===v) : q.correct.every(v=>answer.includes(v));
}
export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
 const r=[...items];for(let i=r.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;
}
export function weightedQuestions(e: Exam, amount: number, random=Math.random): Question[] {
 const count=Math.min(Math.max(1,Math.trunc(amount)),e.questions.length);
 const sum=e.domains.reduce((n,d)=>n+(d.weight[0]+d.weight[1])/2,0);
 const groups=e.domains.map(d=>({d,bank:shuffled(e.questions.filter(q=>q.domainId===d.id),random),quota:count*((d.weight[0]+d.weight[1])/2)/sum}));
 const result:Question[]=[];
 for(const g of groups) result.push(...g.bank.splice(0,Math.floor(g.quota)));
 for(const g of [...groups].sort((a,b)=>(b.quota%1)-(a.quota%1))) if(result.length<count && g.bank.length) result.push(g.bank.shift()!);
 const rest=shuffled(groups.flatMap(g=>g.bank),random);result.push(...rest.slice(0,count-result.length));
 return shuffled(result,random);
}
