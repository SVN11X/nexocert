import { z } from 'zod';

export const id = z.string().regex(/^[a-z][a-z0-9_-]{0,95}$/);
const text = z.string().min(1).max(40000);
export const safeUrl = z.string().url().refine(s => { try { const u = new URL(s); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } }, 'Usa una URL HTTPS sin credenciales');
export const sourceSchema = z.object({ id, title: text, url: safeUrl, checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), note: z.string().max(5000).optional() }).strict();
export const LAB_TYPES = ['models','rag','hybrid','functions','agents','multiagent','generation','quota','security','traces','documents','evaluation'] as const;
const blockBase = { id, version: z.literal(1), accessibleDescription: text };
export const blockSchema = z.discriminatedUnion('type', [
 z.object({ ...blockBase, type: z.literal('markdown'), body: text }).strict(),
 z.object({ ...blockBase, type: z.literal('callout'), title: text, body: text, tone: z.enum(['tip','warning','example']) }).strict(),
 z.object({ ...blockBase, type: z.literal('diagram'), title: text, nodes: z.array(text).min(2).max(10), details: z.array(text).min(2).max(10) }).strict(),
 z.object({ ...blockBase, type: z.literal('code'), language: z.enum(['python','json','text']), body: text, explanation: text }).strict(),
 z.object({ ...blockBase, type: z.literal('table'), headings: z.array(text).min(2).max(8), rows: z.array(z.array(text).max(8)).max(50) }).strict(),
 z.object({ ...blockBase, type: z.literal('lab'), labId: id }).strict(),
 z.object({ ...blockBase, type: z.literal('question'), questionId: id }).strict()
]);
export const lessonSchema = z.object({ id, domainId: id, topic: text, title: text, summary: text, objectives: z.array(text).min(1).max(30), objectiveIds: z.array(id).min(1).max(64), prerequisites: z.array(id).max(20), difficulty: z.enum(['base','intermedio','avanzado']), minutes: z.number().int().min(1).max(180), concepts: z.array(text).min(1).max(30), blocks: z.array(blockSchema).min(1).max(100), sourceIds: z.array(id).min(1).max(20), updatedAt: text }).strict();
export const questionSchema = z.object({ id, lessonId: id, domainId: id, objectiveIds: z.array(id).min(1), type: z.enum(['single','multiple','boolean','ordering','matching']), prompt: text, options: z.array(z.object({ id, text, explanation: text }).strict()).min(2).max(12), correct: z.array(id).min(1).max(12), explanation: text, difficulty: z.enum(['base','intermedio','avanzado']), sourceIds: z.array(id).min(1), tags: z.array(text).min(1), diagram: z.object({nodes:z.array(text).min(2).max(10),description:text}).strict().optional() }).strict();
export const cardSchema = z.object({ id, lessonId: id, domainId: id, front: text, back: text, sourceIds: z.array(id).min(1) }).strict();
export const objectiveSchema = z.object({ id, domainId: id, group: text, title: text, status: z.enum(['initial','developed','verified','pending']), lessonIds: z.array(id), evidence: text }).strict();
export const labSchema = z.object({ id, type: z.enum(LAB_TYPES), domainId: id, title: text, objectiveIds: z.array(id).min(1), objective: text, prerequisites: z.array(text).min(1), scenario: text, resources: z.array(text).min(1), steps: z.array(text).min(2), result: text, errors: z.array(text).min(1), reflection: z.array(text).min(1), sourceIds: z.array(id).min(1) }).strict();
export const domainSchema = z.object({ id, title: text, description: text, weight: z.tuple([z.number().min(0).max(100),z.number().min(0).max(100)]), topics: z.array(text).min(1), color: z.string().regex(/^#[0-9a-fA-F]{6}$/) }).strict();
export const examSchema = z.object({ schemaVersion: z.literal(2), id, certificationId: id, providerId: id, code: text, title: text, subtitle: text, level: text, category: text, description: text, status: z.enum(['available','development','planned']), contentVersion: text, syllabusVersion: text, checkedAt: text, officialUrl: safeUrl, prerequisites: z.array(text), sources: z.array(sourceSchema).min(1), domains: z.array(domainSchema).min(1).max(50), objectives: z.array(objectiveSchema).min(1).max(1000), lessons: z.array(lessonSchema).min(1).max(1000), questions: z.array(questionSchema).min(1).max(10000), flashcards: z.array(cardSchema).min(1).max(10000), labs: z.array(labSchema).max(200), glossary: z.array(z.object({ term: text, definition: text, lessonIds: z.array(id).min(1) }).strict()).max(5000) }).strict();
export type Exam = z.infer<typeof examSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Block = z.infer<typeof blockSchema>;
export type Lab = z.infer<typeof labSchema>;
export type Card = z.infer<typeof cardSchema>;

export function parseSafeJSON(raw: string): unknown {
 if (new TextEncoder().encode(raw).length > 5 * 1024 * 1024) throw new Error('El archivo supera 5 MiB.');
 const value: unknown = JSON.parse(raw);
 function walk(v: unknown, depth: number) {
  if (depth > 20) throw new Error('El paquete está demasiado anidado.');
  if (v && typeof v === 'object') for (const [key, child] of Object.entries(v)) {
   if (['__proto__','constructor','prototype'].includes(key)) throw new Error('Clave no permitida: ' + key);
   walk(child,depth+1);
  }
 }
 walk(value,0); return value;
}

export function validateExam(input: unknown): Exam {
 const e = examSchema.parse(input); const errors: string[] = [];
 const sets = { domains: new Set(e.domains.map(x=>x.id)), lessons: new Set(e.lessons.map(x=>x.id)), objectives: new Set(e.objectives.map(x=>x.id)), sources: new Set(e.sources.map(x=>x.id)), questions: new Set(e.questions.map(x=>x.id)), labs: new Set(e.labs.map(x=>x.id)) };
 for (const [name, arr] of Object.entries({ domains:e.domains,lessons:e.lessons,objectives:e.objectives,sources:e.sources,questions:e.questions,flashcards:e.flashcards,labs:e.labs })) if(new Set(arr.map(x=>x.id)).size !== arr.length) errors.push('IDs duplicados en '+name);
 const refs = (ids: string[], set: Set<string>, label: string) => ids.forEach(x=>{ if (!set.has(x)) errors.push(label+': '+x); });
 e.domains.forEach(d=>{ if(!e.lessons.some(l=>l.domainId===d.id)) errors.push('Dominio sin lecciones: '+d.id); if(d.weight[0]>d.weight[1]) errors.push('Ponderación invertida: '+d.id); });
 for(const l of e.lessons) {
  refs([l.domainId],sets.domains,l.id); refs(l.objectiveIds,sets.objectives,l.id); refs(l.sourceIds,sets.sources,l.id); refs(l.prerequisites,sets.lessons,l.id);
  if(l.prerequisites.includes(l.id)) errors.push('Prerrequisito circular: '+l.id);
  if(new Set(l.blocks.map(b=>b.id)).size!==l.blocks.length)errors.push('Bloques duplicados: '+l.id);
  for(const b of l.blocks) {
   if(b.type==='lab') refs([b.labId],sets.labs,l.id);
   if(b.type==='question') refs([b.questionId],sets.questions,l.id);
   if(b.type==='diagram' && b.nodes.length !== b.details.length) errors.push('Diagrama inconsistente: '+b.id);
   if(b.type==='table' && b.rows.some(r=>r.length!==b.headings.length)) errors.push('Tabla inconsistente: '+b.id);
  }
 }
 for(const q of e.questions) {
  refs([q.lessonId],sets.lessons,q.id);refs([q.domainId],sets.domains,q.id);refs(q.objectiveIds,sets.objectives,q.id);refs(q.sourceIds,sets.sources,q.id);
  if(new Set(q.options.map(x=>x.id)).size!==q.options.length || new Set(q.correct).size!==q.correct.length) errors.push('Opciones duplicadas: '+q.id);
  refs(q.correct,new Set(q.options.map(x=>x.id)),q.id);
  if((q.type==='single'||q.type==='boolean')&&q.correct.length!==1) errors.push('Selección inválida: '+q.id);
  if((q.type==='ordering'||q.type==='matching')&&q.correct.length!==q.options.length) errors.push('Secuencia incompleta: '+q.id);
 }
 e.flashcards.forEach(c=>{refs([c.lessonId],sets.lessons,c.id);refs([c.domainId],sets.domains,c.id);refs(c.sourceIds,sets.sources,c.id);});
 e.objectives.forEach(o=>{refs([o.domainId],sets.domains,o.id);refs(o.lessonIds,sets.lessons,o.id);for(const l of o.lessonIds)if(!e.lessons.find(x=>x.id===l)?.objectiveIds.includes(o.id))errors.push('Matriz no recíproca: '+o.id);});
 e.labs.forEach(l=>{refs([l.domainId],sets.domains,l.id);refs(l.objectiveIds,sets.objectives,l.id);refs(l.sourceIds,sets.sources,l.id);});
 e.glossary.forEach(g=>refs(g.lessonIds,sets.lessons,g.term));
 const visited = new Set<string>();const visiting = new Set<string>();
 const visit=(key:string)=>{if(visiting.has(key)){errors.push('Ciclo de prerrequisitos: '+key);return;}if(visited.has(key))return;visiting.add(key);e.lessons.find(l=>l.id===key)?.prerequisites.forEach(visit);visiting.delete(key);visited.add(key);};
 e.lessons.forEach(l=>visit(l.id));
 if(errors.length) throw new Error(errors.slice(0,30).join('\n'));
 return e;
}
