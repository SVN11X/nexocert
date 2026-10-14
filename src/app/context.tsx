import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { type Exam, validateExam } from '../content/schemas/content';
import { loadExam, builtInExams } from '../content/registry';
import { blankExam, blankProgress, migrateLegacy, progressSchema, readDB, writeDB, type ExamProgress, type Progress } from '../features/progress/store';
import { parseSafeJSON } from '../content/schemas/content';
type AppContext={exam:Exam;exams:Exam[];progress:Progress;p:ExamProgress;update:(fn:(p:ExamProgress)=>ExamProgress)=>void;restore:(p:Progress)=>Promise<void>;setImported:(exam:Exam)=>Promise<void>;active:(id:string)=>void;notice:string;saveState:string};
const Context=createContext<AppContext|null>(null);
export function useApp(){const c=useContext(Context);if(!c)throw new Error('Contexto ausente');return c;}
export function Provider({children}:{children:ReactNode}){
 const [exam,setExam]=useState<Exam|null>(null);const [exams,setExams]=useState<Exam[]>([]);const [progress,setProgress]=useState<Progress>(blankProgress);const [notice,setNotice]=useState('');const [saveState,setSaveState]=useState('Cargando…');const [failed,setFailed]=useState('');const [ready,setReady]=useState(false);const [persistEnabled,setPersistEnabled]=useState(true);const queue=useRef(Promise.resolve());
 useEffect(()=>{let live=true;async function start(){try{
  const bundled=await Promise.all(builtInExams.map(e=>loadExam(e.id)));
  let stored:Exam[]=[];let state:Progress=blankProgress();
  try {const raw=await readDB<unknown>('progress');if(raw)state=progressSchema.parse(raw);
   else { const v1=localStorage.getItem('nexocert:progress:ai-103:v1');if(v1)state=migrateLegacy(parseSafeJSON(v1),'ai-103'); }
  }catch(e){if(live)setPersistEnabled(false);if(live)setNotice('No se pudo recuperar o abrir el almacenamiento: '+(e as Error).message+'. Puedes trabajar y exportar una copia; no borraremos los datos previos.');}
  try{const imported=await readDB<unknown[]>('exams');for(const value of imported??[])try{stored.push(validateExam(value));}catch{if(live)setNotice('Un paquete guardado no es válido. Se conserva en almacenamiento y se usa el contenido integrado.');}}catch{ }
  const all=[...new Map([...bundled,...stored].map(e=>[e.id,e])).values()];
  const routeId=location.hash.match(/^#\/exam\/([^/]+)/)?.[1];const wanted=routeId??localStorage.getItem('nexocert-active')??'ai-103';
  if(live){setExams(all);setExam(all.find(e=>e.id===wanted)??all[0]);setProgress(state);setReady(true);}
 }catch(e){if(live)setFailed((e as Error).message);}}void start();return ()=>{live=false;};},[]);
 useEffect(()=>{if(!ready)return;if(!persistEnabled){setSaveState('No guardado: datos anteriores conservados; importa un respaldo válido');return;}setSaveState('Guardando…');queue.current=queue.current.catch(()=>{}).then(async()=>{await writeDB('progress',progress);setSaveState('Guardado en este navegador');}).catch(e=>{setSaveState('No guardado: exporta una copia');setNotice('No se pudo guardar: '+(e as Error).message);});},[progress,ready,persistEnabled]);
 useEffect(()=>{if(!ready)return;const tick=setInterval(()=>{if(document.visibilityState==='visible'&&document.hasFocus()&&exam)setProgress(prev=>({...prev,exams:{...prev.exams,[exam.id]:{...(prev.exams[exam.id]??blankExam()),studySeconds:(prev.exams[exam.id]?.studySeconds??0)+15}}}));},15000);return ()=>clearInterval(tick);},[ready,exam?.id]);
 const active=(id:string)=>{const selected=exams.find(e=>e.id===id);if(!selected){setNotice('El examen solicitado no está disponible.');return;}setExam(selected);try{localStorage.setItem('nexocert-active',id);}catch{}};
 if(failed)return <main className="loading"><h1>No pudimos cargar NexoCert</h1><p>{failed}</p><button onClick={()=>location.reload()}>Volver a intentar</button></main>;
 if(!exam||!ready)return <main className="loading" aria-live="polite"><img src={import.meta.env.BASE_URL+'favicon.svg'} alt="" width="56"/><h1>Conectando tu aprendizaje…</h1><p>Cargando contenido local y progreso.</p></main>;
 const update=(fn:(p:ExamProgress)=>ExamProgress)=>setProgress(prev=>({...prev,exams:{...prev.exams,[exam.id]:fn(prev.exams[exam.id]??blankExam())}}));
 const restore=async(state:Progress)=>{const validated=progressSchema.parse(state);await queue.current.catch(()=>{});await writeDB('progress',validated);setPersistEnabled(true);setProgress(validated);};
 const setImported=async(imported:Exam)=>{const valid=validateExam(imported);const local=await readDB<Exam[]>('exams')??[];const all=[...new Map([...local,valid].map(e=>[e.id,e])).values()];await writeDB('exams',all);setExams(prev=>[...new Map([...prev,valid].map(e=>[e.id,e])).values()]);if(exam.id===valid.id)setExam(valid);};
 return <Context.Provider value={{exam,exams,progress,p:progress.exams[exam.id]??blankExam(),update,restore,setImported,active,notice,saveState}}>{children}</Context.Provider>;
}
