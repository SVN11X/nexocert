"""Migrate the authored v1 corpus and compile original v2 additions; stable IDs.
Do not use this compiler to manufacture questions or claim verified coverage.
"""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
old=json.loads((root/'src/content/exams/ai-103/legacy-v1.json').read_text())
DATE='2026-10-12'
SOURCES=[
('guide','Guía oficial AI-103','https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103','Aptitudes de 2026-04-16; página actualizada el 2026-04-14. No se observó una versión posterior del temario.'),
('projects','SDK de proyectos Python','https://learn.microsoft.com/python/api/overview/azure/ai-projects-readme','SDK nuevo y SDK clásico difieren. Ejemplos limitados a construcción del cliente.'),
('deploy','Opciones de despliegue','https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview','Revisar disponibilidad por modelo y región; no se fijan precios.'),
('rbac','Autenticación y autorización','https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry','Distinguir plano de control y plano de datos.'),
('guardrails','Controles de seguridad','https://learn.microsoft.com/en-us/azure/ai-foundry/guardrails/how-to-create-guardrails?view=foundry','Los controles se complementan con permisos y validación en la aplicación.'),
('shields','Inyección de instrucciones','https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-prompt-shields','Documentos y herramientas se tratan como datos no confiables.'),
('hybrid','Búsqueda híbrida','https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview','Búsqueda textual y vectorial en paralelo; fusión RRF.'),
('rrf','Fusión de rankings','https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking','k de RRF no equivale al número de vecinos de la consulta vectorial.'),
('content','Content Understanding','https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview','Revisión de 2026-09-24: GA 2025-11-01 y preview 2026-06-01-preview. El temario menciona pro; se conserva como término histórico, no como garantía de capacidades vigentes.'),
('speech','Reconocimiento de voz','https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text','Consultar modalidades y soporte lingüístico antes de implementar.'),
('translator','Traducción de texto','https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/overview','La API 2026-06-06 tiene cambios incompatibles; ejemplos conceptuales sin fijar contratos antiguos.'),
('observe','Observabilidad generativa','https://learn.microsoft.com/en-us/azure/foundry/concepts/observability','Evaluación, trazas y monitoreo cumplen funciones distintas.'),
('agents','Agentes de Foundry','https://learn.microsoft.com/azure/foundry/agents/quickstarts/prompt-agent?tabs=python','La recuperación de esta página completa falló; el resultado de búsqueda oficial confirmó PromptAgentDefinition. No se incluye un ejemplo de creación de agente sin verificación completa.')]
# Every item below is a concise original Spanish description of one measured skill.
OBJECTIVE_GROUPS=[
('planificar','Selección',[
('p01','Elegir LLM, SLM, modelos multimodales y herramientas según la tarea',['l01','l27']),
('p02','Combinar servicios para generación, grounding, búsqueda y flujos',['l01','l03']),
('p03','Elegir recuperación e indexación',['l03','l22','l23']),
('p04','Integrar memoria, herramientas y conocimiento de agentes',['l10','l11'])]),
('planificar','Configuración',[
('p05','Diseñar infraestructura para aplicaciones y agentes',['l02','l28']),
('p06','Seleccionar modalidades de despliegue',['l02','l28']),
('p07','Configurar despliegues de modelos y agentes',['l02','l08']),
('p08','Integrar proyectos Foundry con CI/CD',['l29'])]),
('planificar','Operación',[
('p09','Administrar cuotas, escalado, límites y consumo',['l04','l30']),
('p10','Monitorear rendimiento, cambios de calidad, seguridad y grounding',['l06','l12','l31']),
('p11','Monitorear ingesta, salud de índices y relevancia',['l26','l50']),
('p12','Configurar identidad, credenciales sin claves, redes y roles',['l05','l32'])]),
('planificar','Responsabilidad',[
('p13','Configurar filtros, controles y detección de riesgos',['l06','l17','l33']),
('p14','Instrumentar evaluadores, seguridad y explicaciones',['l06','l34']),
('p15','Auditar trazas, procedencia y aprobaciones',['l12','l34']),
('p16','Limitar autonomía y acceso a herramientas',['l10','l35'])]),
('generativa','Aplicaciones',[
('g01','Desplegar y consumir modelos de lenguaje, código y modalidades',['l08','l27']),
('g02','Implementar RAG en una aplicación',['l09','l36']),
('g03','Diseñar flujos con herramientas y múltiples etapas',['l10','l39']),
('g04','Evaluar fabricaciones, relevancia, calidad y seguridad',['l12','l37']),
('g05','Integrar SDK y conectores en la aplicación',['l08','l38']),
('g06','Conectar una aplicación a un proyecto Foundry',['l08','l38'])]),
('generativa','Agentes',[
('g07','Definir roles, metas, conversación y esquemas de herramientas',['l10','l35']),
('g08','Combinar recuperación, llamadas a funciones y memoria',['l10','l11','l36']),
('g09','Integrar APIs, búsqueda, almacenes y extracción como herramientas',['l10','l25']),
('g10','Orquestar soluciones de múltiples agentes',['l11','l39']),
('g11','Controlar autonomía, salvaguardas y aprobaciones',['l35','l39']),
('g12','Monitorear agentes y analizar su comportamiento y errores',['l12','l31'])]),
('generativa','Optimización',[
('g13','Ajustar instrucciones y parámetros del modelo',['l07','l40']),
('g14','Evaluar reflexión y autocorrección con evidencia observable',['l37','l41']),
('g15','Instrumentar trazas, tokens, seguridad y latencias',['l12','l31']),
('g16','Orquestar modelos, flujos y reglas deterministas',['l13','l41'])]),
('vision','Generación',[
('v01','Generar imágenes a partir de instrucciones y referencias',['l14']),
('v02','Generar vídeos con texto y medios de referencia',['l15']),
('v03','Editar imágenes con máscaras e inpainting',['l14','l42']),
('v04','Editar vídeos generados',['l15','l43']),
('v05','Seleccionar controles de generación y edición disponibles',['l42','l43'])]),
('vision','Comprensión',[
('v06','Analizar contexto visual con modelos multimodales',['l16','l44']),
('v07','Producir captions breves y detallados',['l16','l44']),
('v08','Responder preguntas sustentadas en evidencia visual',['l16','l44']),
('v09','Generar texto alternativo y descripciones accesibles',['l16','l44']),
('v10','Extraer características visuales con Content Understanding',['l25','l44']),
('v11','Procesar e interpretar segmentos de vídeo',['l43','l44']),
('v12','Distinguir tareas acotadas y análisis avanzado según versión',['l25','l45']),
('v13','Identificar objetos, componentes y regiones',['l16','l44'])]),
('vision','Seguridad',[
('v14','Clasificar contenido visual restringido',['l17','l33']),
('v15','Mitigar instrucciones indirectas en texto de imágenes',['l17','l33']),
('v16','Aplicar políticas visuales y de procedencia',['l17','l42'])]),
('lenguaje','Texto',[
('t01','Extraer entidades, temas, resúmenes y JSON',['l18','l19','l46']),
('t02','Detectar sentimiento, tono, riesgos y contenido sensible',['l18','l46']),
('t03','Traducir con Translator o flujos generativos',['l19','l47']),
('t04','Adaptar salidas a cumplimiento y extracción de dominio',['l19','l46'])]),
('lenguaje','Voz',[
('t05','Integrar speech-to-text y text-to-speech en agentes',['l20','l48']),
('t06','Integrar modalidad de voz y modelos personalizados',['l20','l48']),
('t07','Razonar sobre entradas de audio multimodales',['l21','l48']),
('t08','Traducir voz entre idiomas',['l21','l47'])]),
('extraccion','Recuperación',[
('x01','Ingerir e indexar documentos e inputs multimodales',['l22','l49']),
('x02','Configurar búsqueda semántica, híbrida y vectorial',['l23','l36']),
('x03','Enriquecer texto, imágenes y diseño con skills',['l24','l49']),
('x04','Configurar ingesta RAG y OCR',['l22','l24','l49']),
('x05','Conectar recuperación con herramientas y flujos',['l09','l26'])]),
('extraccion','Documentos',[
('x06','Combinar OCR, layout y extracción de campos',['l24','l49']),
('x07','Producir representaciones limpias y fundamentadas',['l25','l26','l50']),
('x08','Definir analizadores con JSON o Markdown para razonamiento',['l25','l45','l50'])])]
objective_map={}
objectives=[]
for domain,group,items in OBJECTIVE_GROUPS:
 for oid,title,lessons in items:
  objectives.append(dict(id=oid,domainId=domain,group=group,title=title,status='initial',lessonIds=lessons,evidence='Explicación y evaluación conceptual original. Pendiente validación práctica en Azure y revisión técnica independiente.'))
  for lid in lessons: objective_map.setdefault(lid,[]).append(oid)
def markdown(lid,n,title,body):
 return dict(id=f'{lid}-b{n}',version=1,type='markdown',accessibleDescription=title,body=f'## {title}\n\n{body}')
def callout(lid,n,title,body,tone='tip'):
 return dict(id=f'{lid}-b{n}',version=1,type='callout',accessibleDescription=title,title=title,body=body,tone=tone)
# Additional lesson text and exercises are edited separately and compiled unchanged.
additions=json.loads((root/'scripts/editorial.json').read_text())
DEEP=additions['deepening']
LESSONS=[];QUESTIONS=[];CARDS=[]
refs={'planificar':['guide','deploy','rbac','observe'],'generativa':['guide','projects','hybrid','observe'],'vision':['guide','content','shields'],'lenguaje':['guide','speech','translator'],'extraccion':['guide','content','hybrid']}
for l in old['lessons']:
 lid=l['id']; sourceIds=refs[l['domain']]
 blocks=[markdown(lid,i+1,s['heading'],s['body']) for i,s in enumerate(l['sections'])]
 blocks.append(markdown(lid,3,'Del concepto al diseño',DEEP[lid]))
 blocks.append(callout(lid,4,'Caso aplicado',l['scenario'],'example'))
 blocks.append(markdown(lid,5,'Decisiones que debes justificar','\n'.join('- '+s for s in l['steps'])))
 blocks.append(callout(lid,6,'Error frecuente',l['trap'],'warning'))
 blocks.append(callout(lid,7,'Recuerda',l['remember']))
 if lid=='l25': blocks.append(callout(lid,8,'Vigencia de nombres y APIs',SOURCES[8][3],'warning'))
 LESSONS.append(dict(id=lid,domainId=l['domain'],topic=l['title'].split(' · ')[-1],title=l['title'].split(' · ')[-1],summary=l['summary'],objectives=['Explicar '+t[0].lower()+' y justificar su uso en el escenario.' for t in l['terms']],objectiveIds=objective_map[lid],prerequisites=[],difficulty='intermedio',minutes=l.get('readingMinutes',10)+3,concepts=[t[0] for t in l['terms']],blocks=blocks,sourceIds=sourceIds,updatedAt=DATE))
LEGACY_QUESTION_LESSONS={'x01': 'l34', 'x02': 'l27', 'x03': 'l32', 'x04': 'l35', 'x05': 'l01', 'x06': 'l33', 'x07': 'l37', 'x08': 'l10', 'x09': 'l35', 'x10': 'l41', 'x11': 'l35', 'x12': 'l36', 'x13': 'l44', 'x14': 'l17', 'x15': 'l43', 'x16': 'l18', 'x17': 'l46', 'x18': 'l48', 'x19': 'l23', 'x20': 'l49', 'x21': 'l50', 'x22': 'l26', 'a01': 'l05', 'a02': 'l37', 'a03': 'l44', 'a04': 'l48', 'a05': 'l36'}
for q in old['questions']:
 if not q['lessonId']: q['lessonId']=LEGACY_QUESTION_LESSONS[q['id']]
 QUESTIONS.append(dict(id=q['id'],lessonId=q['lessonId'],domainId=q['domain'],objectiveIds=objective_map[q['lessonId']][:1],type='single',prompt=q['prompt'],options=[dict(id=f'o{i}',text=t,explanation=q['explanation'] if i==q['answer'] else 'Esta elección no cumple el requisito del escenario. '+q['explanation']) for i,t in enumerate(q['options'])],correct=[f"o{q['answer']}"],explanation=q['explanation'],difficulty='intermedio',sourceIds=refs[q['domain']],tags=['escenario','v1-preservada']))
for c in old['flashcards']:
 CARDS.append(dict(id=c['id'],lessonId=c['lessonId'],domainId=c['domain'],front=c['front'],back=c['back'],sourceIds=refs[c['domain']]))
for item in additions['lessons']:
 lid=item['id'];domain=item['domain'];blocks=[]
 for i,(heading,body) in enumerate(item['sections']): blocks.append(markdown(lid,i+1,heading,body))
 blocks.append(callout(lid,8,'Caso aplicado',item['case'],'example'))
 blocks.append(markdown(lid,9,'Práctica guiada','\n'.join('- '+v for v in item['steps'])))
 blocks.append(callout(lid,10,'Decisión y alternativa',item['alternative']))
 blocks.append(callout(lid,11,'Error que debes detectar',item['error'],'warning'))
 LESSONS.append(dict(id=lid,domainId=domain,topic=item['topic'],title=item['title'],summary=item['summary'],objectives=item['objectives'],objectiveIds=objective_map[lid],prerequisites=item.get('prerequisites',[]),difficulty=item.get('difficulty','intermedio'),minutes=item.get('minutes',12),concepts=[t[0] for t in item['cards']],blocks=blocks,sourceIds=refs[domain],updatedAt=DATE))
for lid,pairs in additions['cards'].items():
 l=next(l for l in LESSONS if l['id']==lid)
 for i,(front,back) in enumerate(pairs): CARDS.append(dict(id=f'{lid}-c{i+1}',lessonId=lid,domainId=l['domainId'],front=front,back=back,sourceIds=l['sourceIds']))
for item in additions['lessons']:
 l=next(l for l in LESSONS if l['id']==item['id'])
 for i,(front,back) in enumerate(item['cards']): CARDS.append(dict(id=f"{l['id']}-c{i+1}",lessonId=l['id'],domainId=l['domainId'],front=front,back=back,sourceIds=l['sourceIds']))
for lid,items in additions['questions'].items():
 l=next(l for l in LESSONS if l['id']==lid)
 for i,q in enumerate(items):
  options=[dict(id=f'o{j}',text=o[0],explanation=o[1]) for j,o in enumerate(q['options'])]
  QUESTIONS.append(dict(id=f'{lid}-q{i+1}',lessonId=lid,domainId=l['domainId'],objectiveIds=q.get('objectiveIds',[l['objectiveIds'][i%len(l['objectiveIds'])]]),type=q.get('type','single'),prompt=q['prompt'],options=options,correct=[f'o{v}' for v in q.get('correct',[0])],explanation=q['explanation'],difficulty=q.get('difficulty','intermedio'),sourceIds=l['sourceIds'],tags=q.get('tags',['razonamiento']),**({'diagram':q['diagram']} if 'diagram' in q else {})))
# Reusable selectable diagrams, authored and connected to lesson content.
DIAGRAMS={
'l01':(['Requisito','Servicio','Modelo','Evaluación'],['Define modalidad, privacidad, calidad y latencia.','Recuperación o extracción complementa al modelo.','Compara candidatos con el mismo conjunto.','Mide fallos, coste y seguridad, no sólo fluidez.']),
'l09':(['Fuente','Fragmentos','Índice','Recuperación','Respuesta'],['Conserva autor, versión y permiso.','Divide por límites con contexto.','Registra texto y, cuando corresponda, vectores.','Filtra permisos antes de construir contexto.','Cita fuentes y admite ausencia de evidencia.']),
'l10':(['Objetivo','Esquema','Solicitud','Validación','Herramienta'],['La instrucción delimita la tarea.','Tipos y campos describen argumentos.','El modelo propone una llamada.','El runtime valida parámetros y autorización.','La aplicación ejecuta y devuelve datos.']),
'l24':(['Página','OCR','Layout','Campos','Validación'],['Entrada original conserva evidencias.','Detecta caracteres.','Asocia regiones, párrafos y tablas.','Mapea datos a un esquema.','Comprueba importes, tipos y procedencia.'])}
for lid,(nodes,details) in DIAGRAMS.items():
 next(l for l in LESSONS if l['id']==lid)['blocks'].insert(2,dict(id=lid+'-diagram',version=1,type='diagram',accessibleDescription='Selecciona cada etapa. '+'. '.join(nodes),title='Explora el proceso',nodes=nodes,details=details))
code='import os\nfrom azure.identity import DefaultAzureCredential\nfrom azure.ai.projects import AIProjectClient\n\nwith DefaultAzureCredential() as identity:\n    with AIProjectClient(\n        endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],\n        credential=identity,\n    ) as project:\n        # Cliente autenticado; aquí se integra el flujo de la aplicación.\n        pass\n'
next(l for l in LESSONS if l['id']=='l38')['blocks'].append(dict(id='l38-code',type='code',version=1,accessibleDescription='Cliente de proyectos Python con credencial Entra ID',language='python',body=code,explanation='Ejemplo de construcción del cliente contrastado con documentación del SDK. Requiere Python, paquetes y un proyecto Azure real con permisos; no se ejecuta en NexoCert. El endpoint se configura fuera del código. DefaultAzureCredential no concede permisos por sí mismo.'))
labs=json.loads((root/'scripts/labs.json').read_text())
for lab in labs:
 lid=lab.pop('lessonId');next(l for l in LESSONS if l['id']==lid)['blocks'].append(dict(id=lid+'-lab',version=1,type='lab',accessibleDescription='Laboratorio local: '+lab['title'],labId=lab['id']))
for l in LESSONS:
 q=next(q for q in QUESTIONS if q['lessonId']==l['id']);l['blocks'].append(dict(id=l['id']+'-check',version=1,type='question',accessibleDescription='Comprueba la comprensión de la lección',questionId=q['id']))
# Glossary joins duplicate terms instead of duplicating entries.
glossary={}
for c in CARDS:
 if len(c['front'])>65 or '?' in c['front']: continue
 if c['front'] not in glossary:glossary[c['front']]=dict(term=c['front'],definition=c['back'],lessonIds=[])
 if c['lessonId'] not in glossary[c['front']]['lessonIds']:glossary[c['front']]['lessonIds'].append(c['lessonId'])
exam=dict(schemaVersion=2,id='ai-103',certificationId='azure-ai-apps-agents',providerId='microsoft',code='AI-103',title='Developing AI Apps and Agents on Azure',subtitle='Desarrollo de aplicaciones y agentes de IA en Azure',level='Intermedio',category='Inteligencia artificial',description='Comprende decisiones de arquitectura y practica con datos educativos locales antes de trabajar con servicios reales.',status='development',contentVersion='2.0.0',syllabusVersion='2026-04-16',checkedAt=DATE,officialUrl=SOURCES[0][2],prerequisites=['Python básico','Conceptos de Azure','Fundamentos de IA'],sources=[dict(id=i,title=t,url=u,checkedAt=DATE,note=n) for i,t,u,n in SOURCES],domains=[dict(id=d['id'],title=d['title'],description=d['description'],weight=[int(x) for x in re.findall(r'\d+',d['weight'])],topics=[group for dom,group,_ in OBJECTIVE_GROUPS if dom==d['id']],color=d['accent']) for d in old['domains']],objectives=objectives,lessons=LESSONS,questions=QUESTIONS,flashcards=CARDS,labs=labs,glossary=list(glossary.values()))
(root/'src/content/exams/ai-103/exam.json').write_text(json.dumps(exam,ensure_ascii=False,indent=2)+'\n')
print({k:len(exam[k]) for k in ['objectives','lessons','questions','flashcards','labs']})
