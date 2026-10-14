import { useState, type ComponentType } from 'react';
import { Markdown } from '../../components/Markdown';
import { InlineQuestion } from '../../components/Question';
import type { Block, Exam } from '../../content/schemas/content';
export function Code({block}:{block:Extract<Block,{type:'code'}>}){const [copied,setCopied]=useState(false);const [error,setError]=useState('');return <section><div className="row between"><span className="badge">{block.language} · ejemplo para leer</span><button onClick={async()=>{try{await navigator.clipboard.writeText(block.body);setCopied(true);}catch{setError('Selecciona y copia el código manualmente.');}}}>{copied?'Copiado':'Copiar código'}</button></div><pre className="code">{block.body.split('\n').map((line,i)=><div key={i}><span className="line-number">{i+1}</span>{line.split(/(\b(?:import|from|with|as|pass|return|def|if|for|in)\b|#.*|"[^"]*")/g).map((s,j)=><span className={s.startsWith('#')?'syntax-comment':s.startsWith('"')?'syntax-string':/^(import|from|with|as|pass|return|def|if|for|in)$/.test(s)?'syntax-keyword':''} key={j}>{s}</span>)}</div>)}</pre><p>{block.explanation}</p>{error&&<p role="status">{error}</p>}</section>;}
function Diagram({block}:{block:Extract<Block,{type:'diagram'}>}){const [selected,setSelected]=useState(0);return <section className="diagram"><h3>{block.title}</h3><div className="diagram-nodes" role="group" aria-label={block.accessibleDescription}>{block.nodes.map((node,i)=><button key={node} aria-pressed={i===selected} className={i===selected?'selected':''} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,'0')}</span>{node}</button>)}</div><div className="diagram-detail" aria-live="polite"><strong>{block.nodes[selected]}</strong><p>{block.details[selected]}</p></div></section>;}
type Props={block:Block;exam:Exam;onAnswer:(id:string,a:string[],ok:boolean)=>void};
// Exhaustive registry: new types must provide a safe component and schema.
const registry:Record<Block['type'],ComponentType<Props>>={
 markdown:({block})=>block.type==='markdown'?<Markdown body={block.body}/>:null,
 callout:({block})=>block.type==='callout'?<aside className={'callout '+block.tone}><strong>{block.title}</strong><p>{block.body}</p></aside>:null,
 diagram:({block})=>block.type==='diagram'?<Diagram block={block}/>:null,
 code:({block})=>block.type==='code'?<Code block={block}/>:null,
 table:({block})=>block.type==='table'?<div className="table-scroll"><table><thead><tr>{block.headings.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{block.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>:null,
 lab:({block,exam})=>block.type==='lab'?<a className="lab-link" href={'#/exam/'+exam.id+'/labs/'+block.labId}>Abrir laboratorio · {exam.labs.find(l=>l.id===block.labId)?.title} →</a>:null,
 question:({block,exam,onAnswer})=>{if(block.type!=='question')return null;const q=exam.questions.find(q=>q.id===block.questionId);return q?<InlineQuestion key={q.id} q={q} onAnswer={(a,ok)=>onAnswer(q.id,a,ok)}/>:null;}
};
export function LearningBlock(props:Props){const Component=registry[props.block.type];return <Component {...props}/>;}
