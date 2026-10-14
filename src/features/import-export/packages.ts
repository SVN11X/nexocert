import { z } from 'zod';
import { blockSchema, cardSchema, examSchema, id, lessonSchema, parseSafeJSON, questionSchema, validateExam, type Exam } from '../../content/schemas/content';
export const patchSchema=z.object({schemaVersion:z.literal(2),kind:z.literal('content-patch'),examId:id,baseVersion:z.string().min(1),contentVersion:z.string().min(1),lessons:z.array(lessonSchema).max(1000).default([]),questions:z.array(questionSchema).max(10000).default([]),flashcards:z.array(cardSchema).max(10000).default([])}).strict();
export type ContentImport = { kind:'exam'; exam:Exam } | { kind:'patch'; patch:z.infer<typeof patchSchema> };
export function parsePackage(raw:string):ContentImport{
 const input=parseSafeJSON(raw);
 if(input&&typeof input==='object'&&'kind' in input&&input.kind==='content-patch')return {kind:'patch',patch:patchSchema.parse(input)};
 return {kind:'exam',exam:validateExam(examSchema.parse(input))};
}
export function mergePatch(exam:Exam,patch:z.infer<typeof patchSchema>,replace:boolean):Exam{
 if(patch.examId!==exam.id||patch.baseVersion!==exam.contentVersion)throw new Error('El examen o la versión base no coincide.');
 const merge=<T extends {id:string}>(old:T[],incoming:T[])=>{const map=new Map(old.map(v=>[v.id,v]));for(const i of incoming){if(map.has(i.id)&&!replace)throw new Error('ID existente: '+i.id+'. Revisa el reemplazo antes de importarlo.');map.set(i.id,i);}return [...map.values()];};
 const lessons=merge(exam.lessons,patch.lessons);
 const objectives=exam.objectives.map(o=>({...o,lessonIds:lessons.filter(l=>l.objectiveIds.includes(o.id)).map(l=>l.id)}));
 return validateExam({...exam,contentVersion:patch.contentVersion,lessons,objectives,questions:merge(exam.questions,patch.questions),flashcards:merge(exam.flashcards,patch.flashcards)});
}
export function downloadJSON(value:unknown,name:string){const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
// Export a schema for authoring tools without allowing executable components.
export const declarativeBlockSchema=blockSchema;
