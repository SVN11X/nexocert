import { describe,it,expect } from 'vitest';
import content from '../../src/content/exams/ai-103/exam.json';
import { parseSafeJSON, validateExam } from '../../src/content/schemas/content';
import { evaluate,weightedQuestions } from '../../src/lib/assessment';
import { schedule } from '../../src/lib/spaced-repetition';
import { searchExam } from '../../src/features/search/search';
import { blankExam,importProgress,migrateLegacy } from '../../src/features/progress/store';
import { calculateProgress,weakConcepts } from '../../src/features/progress/selectors';
import { mergePatch,parsePackage,patchSchema } from '../../src/features/import-export/packages';
import { providers } from '../../src/content/providers/catalog';
import { access,chunkText,generation,orchestrate,quota,retrieve,rrf,validateTool } from '../../src/features/labs/logic';
const e=validateExam(content);
describe('Contenido y contratos',()=>{
 it('valida corpus y catálogo sin duplicados',()=>{expect(e.lessons.length).toBe(50);expect(e.labs.length).toBe(12);expect(new Set(providers.map(p=>p.id)).size).toBe(providers.length);expect(e.domains).toHaveLength(5);expect(e.objectives).toHaveLength(64);});
 it('rechaza IDs, referencias y respuestas inválidas',()=>{expect(()=>validateExam({...e,lessons:[...e.lessons,e.lessons[0]]})).toThrow('duplicados');expect(()=>validateExam({...e,questions:[{...e.questions[0],correct:['missing']},...e.questions.slice(1)]})).toThrow('missing');expect(()=>validateExam({...e,lessons:e.lessons.map((l,i)=>i?l:{...l,objectives:[]})})).toThrow();});
 it('rechaza claves peligrosas, enlaces ejecutables y tamaños grandes',()=>{expect(()=>parseSafeJSON('{"__proto__":{"admin":true}}')).toThrow();expect(()=>parseSafeJSON(' '.repeat(5*1024*1024+1))).toThrow('5 MiB');expect(()=>validateExam({...e,sources:[{...e.sources[0],url:'javascript:alert(1)'}]})).toThrow();});
 it('detecta ciclos de prerrequisitos y bloques inconsistentes',()=>{const copy=structuredClone(e);copy.lessons[0].prerequisites=[copy.lessons[1].id];copy.lessons[1].prerequisites=[copy.lessons[0].id];expect(()=>validateExam(copy)).toThrow('Ciclo');const bad=structuredClone(e);bad.lessons[0].blocks.push(bad.lessons[0].blocks[0]);expect(()=>validateExam(bad)).toThrow('Bloques duplicados');});
});
describe('Evaluación y ponderación',()=>{
 for(const type of ['single','multiple','boolean','ordering','matching'] as const)it('corrige '+type+' y no admite IDs repetidos',()=>{const q=e.questions.find(q=>q.type===type)!;expect(q).toBeDefined();expect(evaluate(q,q.correct)).toBe(true);expect(evaluate(q,[...q.correct,q.correct[0]])).toBe(false);expect(evaluate(q,[])).toBe(false);if(type==='multiple')expect(evaluate(q,[...q.correct].reverse())).toBe(true);if(type==='ordering'||type==='matching')expect(evaluate(q,[...q.correct].reverse())).toBe(false);});
 it('selecciona sin repetir y distribuye dominios por punto medio normalizado',()=>{const chosen=weightedQuestions(e,40,()=>0.42);expect(chosen).toHaveLength(40);expect(new Set(chosen.map(q=>q.id)).size).toBe(40);const sum=e.domains.reduce((n,d)=>n+(d.weight[0]+d.weight[1])/2,0);for(const d of e.domains)expect(Math.abs(chosen.filter(q=>q.domainId===d.id).length-40*((d.weight[0]+d.weight[1])/2)/sum)).toBeLessThanOrEqual(1);expect(weightedQuestions(e,999)).toHaveLength(e.questions.length);});
});
describe('Repaso y progreso',()=>{
 it('SM-2 programa, incrementa y reinicia al olvidar',()=>{const now=new Date('2026-10-12T12:00:00Z');const first=schedule(undefined,4,now);expect(first.interval).toBe(1);const second=schedule(first,4,now);expect(second.interval).toBe(6);const failed=schedule(second,0,now);expect(failed.repetitions).toBe(0);expect(failed.difficult).toBe(true);expect(failed.due).toBe('2026-10-13T12:00:00.000Z');for(let i=0;i<15;i++)expect(schedule(failed,0,now).ease).toBeGreaterThanOrEqual(1.3);});
 it('conserva IDs, notas, favoritos, historial y fechas v1',()=>{const migrated=migrateLegacy({completed:['l01','retired'],bookmarks:['l02'],notes:{l01:'Apunte'},cards:{c011:{repetitions:3,interval:6,ease:2.4,due:1791892800000,lastReview:1791806400000}},quizHistory:[{correct:3,score:60,total:5,date:'2026-10-12T12:00:00Z'}],lastLesson:'l01'},'ai-103');expect(migrated.exams['ai-103'].notes.l01).toBe('Apunte');expect(migrated.exams['ai-103'].cards.c011.repetitions).toBe(3);expect(migrated.exams['ai-103'].simulations[0].correct).toBe(3);expect(calculateProgress(e,migrated.exams['ai-103']).completed).toBe(1);expect(importProgress(JSON.stringify(migrated))).toEqual(migrated);});
 it('cuenta sólo lecciones conocidas y detecta errores repetidos',()=>{const p=blankExam();p.completed=['l01','l01','gone'];p.answers=[0,1].map(()=>({questionId:'q01',selected:[],correct:false,date:new Date().toISOString()}));expect(calculateProgress(e,p).percent).toBe(2);expect(weakConcepts(p)).toEqual(['q01']);});
});
describe('Importación y búsqueda',()=>{
 it('valida paquetes, rechaza colisiones sin permiso y versiones ajenas',()=>{const patch=patchSchema.parse({schemaVersion:2,kind:'content-patch',examId:e.id,baseVersion:e.contentVersion,contentVersion:'2.0.1',lessons:[{...e.lessons[0],summary:'Versión revisada'}]});expect(parsePackage(JSON.stringify(patch)).kind).toBe('patch');expect(()=>mergePatch(e,patch,false)).toThrow('ID existente');expect(mergePatch(e,patch,true).lessons[0].summary).toBe('Versión revisada');expect(()=>mergePatch(e,{...patch,baseVersion:'0'},true)).toThrow('versión');});
 it('busca sin depender de tildes y examina conceptos',()=>{expect(searchExam(e,'extraccion').length).toBeGreaterThan(0);expect(searchExam(e,'rag').some(l=>l.id==='l09')).toBe(true);expect(searchExam(e,'AI-103').length).toBe(50);expect(searchExam(e,'')).toHaveLength(0);});
});
describe('Lógica real de laboratorios',()=>{
 it('fragmenta con avance y reconoce falta de evidencia',()=>{expect(chunkText('a b c d e',3,1)).toEqual(['a b c','c d e']);expect(chunkText('a b c',2,99).length).toBeLessThanOrEqual(3);expect(retrieve('garantía').results).toHaveLength(0);expect(retrieve('devolución').results[0].source).toBe('policy');});
 it('RRF pondera posiciones y softmax conserva masa',()=>{expect(rrf(['a','b'],['b','a'],60,2)[0].id).toBe('b');const cold=generation(.1,.9);const hot=generation(2,1);expect(cold.reduce((a,b)=>a+b,0)).toBeCloseTo(1);expect(cold[0]).toBeGreaterThan(hot[0]);});
 it('cuotas calculan admisión, rechazo y coste hipotético',()=>{const r=quota(100,700,80,50000,300,.01,.02);expect(r.accepted).toBe(50);expect(r.rejected).toBe(50);expect(r.cost).toBeCloseTo(.65);});
 it('herramientas rechazan campos y exigen aprobación específica',()=>{expect(validateTool('{"orderId":"A123","amount":200}',true,false).ok).toBe(false);expect(validateTool('{"orderId":"A123","amount":200}',true,true).ok).toBe(true);expect(validateTool('{"orderId":"A123","admin":true}',false,true).ok).toBe(false);expect(validateTool('{oops}',false,false).ok).toBe(false);});
 it('identidad, ruta y permiso fallan independientemente',()=>{expect(access('write','reader',true,true,true).ok).toBe(false);expect(access('read','reader',false,false,true).ok).toBe(false);expect(access('read','reader',true,true,false).ok).toBe(false);expect(access('read','reader',true,true,true).ok).toBe(true);});
 it('orquestación respeta presupuesto y propaga fallos',()=>{expect(orchestrate(true,false,1500).time).toBe(950);expect(orchestrate(false,false,1000).status).toContain('presupuesto');expect(orchestrate(true,true,1500).status).toContain('evidencia');});
});
