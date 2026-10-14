import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { validateExam, parseSafeJSON } from '../src/content/schemas/content';
const report=[];
for(const folder of readdirSync('src/content/exams',{withFileTypes:true}).filter(d=>d.isDirectory())){
 const e=validateExam(parseSafeJSON(readFileSync('src/content/exams/'+folder.name+'/exam.json','utf8')));
 const manifest=JSON.parse(readFileSync('src/content/exams/'+folder.name+'/manifest.json','utf8'));
 for(const key of ['id','providerId','code','status','level','category'])if(manifest[key]!==e[key as keyof typeof e])throw new Error('Manifiesto inconsistente: '+key);
 const duplicatePrompts=e.questions.map(q=>q.prompt.toLowerCase().replace(/\s+/g,' ').trim());if(new Set(duplicatePrompts).size!==duplicatePrompts.length)throw new Error('Enunciados duplicados');
 const missing=e.objectives.filter(o=>!o.lessonIds.length);
 const noAssessment=e.objectives.filter(o=>!e.questions.some(q=>q.objectiveIds.includes(o.id)));
 const lengths=e.lessons.map(l=>({id:l.id,words:l.blocks.reduce((n,b)=>n+('body' in b?b.body.split(/\s+/).length:0),0)}));
 report.push({exam:e.id,version:e.contentVersion,objectives:e.objectives.length,lessons:e.lessons.length,questions:e.questions.length,flashcards:e.flashcards.length,labs:e.labs.length,wordCount:lengths.reduce((n,l)=>n+l.words,0),questionTypes:[...new Set(e.questions.map(q=>q.type))],unmappedObjectives:missing.map(o=>o.id),objectivesWithoutDirectAssessment:noAssessment.map(o=>o.id),notIndependentlyVerified:e.objectives.filter(o=>o.status!=='verified').map(o=>o.id),shortLessons:lengths.filter(l=>l.words<180)});
 if(missing.length)throw new Error('Aptitudes sin enlace de lección: '+missing.map(o=>o.id).join(', '));
 console.log(`${e.code}: ${e.lessons.length} lecciones, ${e.questions.length} preguntas, ${e.flashcards.length} tarjetas, ${e.labs.length} laboratorios. Referencias e IDs válidos.`);
 console.log('Pendiente evaluación directa para: '+(noAssessment.map(o=>o.id).join(', ')||'ninguna'));
 const lines=['# Matriz AI-103','',`Temario: ${e.syllabusVersion}. Consulta oficial: ${e.checkedAt}. Contenido: ${e.contentVersion}.`,'','La correspondencia no equivale a cobertura exhaustiva. **Inicial** significa explicación conceptual y actividades locales; las 64 aptitudes necesitan revisión técnica independiente y práctica autorizada en Azure. No se declara preparación completa.','','| ID | Aptitud | Lecciones | Preguntas directas | Labs | Estado |','| --- | --- | --- | --- | --- | --- |',...e.objectives.map(o=>`| ${o.id} | ${o.title} | ${o.lessonIds.join(', ')} | ${e.questions.filter(q=>q.objectiveIds.includes(o.id)).map(q=>q.id).join(', ')||'Pendiente'} | ${e.labs.filter(l=>l.objectiveIds.includes(o.id)).map(l=>l.id).join(', ')||'—'} | Inicial |`),'','## Pendientes comprobables','',...noAssessment.map(o=>'- Añadir evaluación directa de '+o.id+': '+o.title),'- Revisar independientemente cada aptitud, pregunta y distractor.','- Validar SDK, despliegues y condiciones del servicio en un proyecto Azure autorizado.','- Ampliar implementación práctica de generación visual, vídeo y personalización de voz.','- Probar APIs vigentes de Content Understanding; no extrapolar los modos históricos pro/standard.','- Añadir navegación y búsqueda realmente diferidas cuando crezca el catálogo; hoy cada examen es un chunk, pero se precargan los manifiestos registrados.'];
 writeFileSync('docs/AI103_COVERAGE.md',lines.join('\n')+'\n');
}
writeFileSync('docs/content-validation.json',JSON.stringify(report,null,2)+'\n');
