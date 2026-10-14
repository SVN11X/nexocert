import type { Exam } from '../../content/schemas/content';
import type { ExamProgress } from './store';
export function calculateProgress(e:Exam,p:ExamProgress){const known=new Set(e.lessons.map(l=>l.id));const completed=[...new Set(p.completed)].filter(id=>known.has(id));return {completed:completed.length,total:e.lessons.length,percent:e.lessons.length?Math.round(completed.length/e.lessons.length*100):0,attempts:p.answers.length,accuracy:p.answers.length?p.answers.filter(a=>a.correct).length/p.answers.length:null};}
export function weakConcepts(p:ExamProgress){const counts=new Map<string,number>();p.answers.filter(a=>!a.correct).forEach(a=>counts.set(a.questionId,(counts.get(a.questionId)??0)+1));return [...counts.entries()].filter(([,n])=>n>=2).map(([id])=>id);}
