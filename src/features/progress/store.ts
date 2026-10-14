import { z } from 'zod';
import { id, parseSafeJSON } from '../../content/schemas/content';
import type { Review } from '../../lib/spaced-repetition';

const reviewSchema = z.object({ repetitions:z.number().int().nonnegative(),interval:z.number().int().nonnegative(),ease:z.number().min(1.3),due:z.string().datetime(),last:z.string(),difficult:z.boolean(),history:z.array(z.object({date:z.string().datetime(),quality:z.number().int().min(0).max(5)})).max(100) }).strict();
const answerSchema=z.object({questionId:id,selected:z.array(id).max(12),correct:z.boolean(),date:z.string().datetime()}).strict();
const draftSchema=z.object({mode:z.enum(['practice','mock','errors','challenge']),questionIds:z.array(id).min(1).max(1000),answers:z.record(id,z.array(id).max(12)),index:z.number().int().nonnegative(),startedAt:z.number().nonnegative(),deadline:z.number().nonnegative().nullable(),finished:z.boolean()}).strict();
export const examProgressSchema=z.object({completed:z.array(id).max(20000),favorites:z.array(id).max(20000),notes:z.record(id,z.string().max(30000)),answers:z.array(answerSchema).max(5000),cards:z.record(id,reviewSchema),cardFavorites:z.array(id).max(20000),labs:z.array(id).max(5000),studySeconds:z.number().nonnegative(),activity:z.array(z.object({date:z.string().datetime(),text:z.string().max(500)})).max(100),lastLesson:id.nullable(),quiz:draftSchema.nullable(),simulations:z.array(z.object({date:z.string().datetime(),correct:z.number().int().nonnegative(),total:z.number().int().positive(),mode:z.string()})).max(500),contentVersion:z.string()}).strict();
export const progressSchema=z.object({schemaVersion:z.literal(2),exams:z.record(id,examProgressSchema)}).strict();
export type ExamProgress=z.infer<typeof examProgressSchema>;
export type Progress=z.infer<typeof progressSchema>;
export type QuizDraft=z.infer<typeof draftSchema>;
export const blankExam=():ExamProgress=>({completed:[],favorites:[],notes:{},answers:[],cards:{},cardFavorites:[],labs:[],studySeconds:0,activity:[],lastLesson:null,quiz:null,simulations:[],contentVersion:'2.0.0'});
export const blankProgress=():Progress=>({schemaVersion:2,exams:{}});
export function importProgress(raw:string):Progress { const v=parseSafeJSON(raw); if(v && typeof v==='object'&&'schemaVersion' in v&&v.schemaVersion===1&&'progress' in v) return migrateLegacy((v as {progress:unknown}).progress,'ai-103');return progressSchema.parse(v); }
export function migrateLegacy(raw:unknown,examId:string):Progress {
 const legacy=z.object({completed:z.array(id).default([]),bookmarks:z.array(id).default([]),notes:z.record(id,z.string().max(30000)).default({}),cards:z.record(id,z.unknown()).default({}),quizHistory:z.array(z.unknown()).default([]),lastLesson:id.nullable().default(null)}).parse(raw);
 const e=blankExam(); e.completed=legacy.completed;e.favorites=legacy.bookmarks;e.notes=legacy.notes;e.lastLesson=legacy.lastLesson;
 for(const [key,value] of Object.entries(legacy.cards)) {
  if(!value||typeof value!=='object')continue;
  const v=value as Record<string,unknown>; const due=new Date(Number(v.due)||Date.now());
  e.cards[key]={repetitions:Math.max(0,Number(v.repetitions??v.reps)||0),interval:Math.max(0,Math.round(Number(v.interval)||0)),ease:Math.max(1.3,Number(v.ease)||2.5),due:due.toISOString(),last:Number(v.lastReview)?new Date(Number(v.lastReview)).toISOString():'',difficult:!!v.hard,history:[]};
 }
 // Preserve original attempts without inventing question-level accuracy.
 e.simulations=legacy.quizHistory.flatMap(v=>{if(!v||typeof v!=='object')return[];const a=v as Record<string,unknown>;const total=Number(a.total);const correct=Number(a.correct??a.score);const date=new Date(typeof a.date==='string'||typeof a.date==='number'?a.date:Date.now());return Number.isInteger(total)&&total>0&&Number.isInteger(correct)&&correct>=0?[{date:date.toISOString(),correct,total,mode:'v1-migrado'}]:[];}).slice(-500);
 return progressSchema.parse({schemaVersion:2,exams:{[examId]:e}});
}
let connection:Promise<IDBDatabase>|null=null;
function db(){return connection??=(new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('nexocert',1);r.onupgradeneeded=()=>r.result.createObjectStore('data');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Cierra otras pestañas para actualizar el almacenamiento.'));}));}
export async function readDB<T>(key:string):Promise<T|undefined>{const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('data','readonly');const r=t.objectStore('data').get(key);r.onsuccess=()=>resolve(r.result as T|undefined);r.onerror=()=>reject(r.error);});}
export async function writeDB(key:string,value:unknown){const d=await db();return new Promise<void>((resolve,reject)=>{const t=d.transaction('data','readwrite');t.objectStore('data').put(value,key);t.oncomplete=()=>resolve();t.onabort=()=>reject(t.error);t.onerror=()=>reject(t.error);});}
export async function clearDB(){const d=await db();return new Promise<void>((resolve,reject)=>{const t=d.transaction('data','readwrite');t.objectStore('data').clear();t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);});}
export const logActivity=(p:ExamProgress,text:string):ExamProgress=>({...p,activity:[{date:new Date().toISOString(),text},...p.activity].slice(0,100)});
export function dueCount(cards:Record<string,Review>,ids:string[],now=Date.now()){return ids.filter(id=>!cards[id]||new Date(cards[id].due).getTime()<=now).length;}
