# Componentes interactivos

`LearningBlock` registra todos los tipos del esquema. Un tipo nuevo necesita contrato declarativo estricto, componente accesible, datos de ejemplo y verificación de su resultado. Nunca evalúes contenido importado ni renderices HTML arbitrario.

Los doce laboratorios están registrados por tipo en `labRegistry`. Sus metadatos viven en el paquete; las funciones puras viven en `features/labs/logic.ts`. Agregar un laboratorio del mismo tipo sólo necesita datos; agregar un tipo nuevo requiere schema, registro, componente y pruebas de comportamiento.

| Simulación | Lógica verificable |
| --- | --- |
| Modelos | Restricciones de modalidad, latencia y contexto |
| RAG | Fragmentación, frecuencia y peso IDF local |
| Híbrida | RRF ponderado sobre rankings sintéticos |
| Herramientas | JSON, tipos, valores, campos y aprobación |
| Agentes | Máquina de estados, herramienta y presupuesto |
| Multiagente | Dependencias, camino crítico y fallo |
| Generación | Softmax, temperatura y top-p sintéticos |
| Cuotas | Admisión por RPM/TPM y costes ficticios |
| Seguridad | Identidad, conectividad y permisos simplificados |
| Trazas | Duraciones y estado de spans secuenciales |
| Documentos | Regiones, campos y relación subtotal+impuesto |
| Evaluación | Clasificación de afirmaciones contra evidencia |

No hay llamadas reales, OCR, embeddings ni agentes LLM. Los controles deben cambiar el cálculo, estado o evidencia. Participar en un laboratorio registra exploración, no certifica competencia. Los controles de ordenamiento y asociación funcionan con botones y selectores de teclado; no requieren drag and drop.
