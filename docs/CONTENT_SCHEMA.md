# Contratos de contenido

Fuente ejecutable del contrato: `src/content/schemas/content.ts`. Esquema v2 estricto; IDs estables `[a-z][a-z0-9_-]{0,95}`. Fuentes externas sólo HTTPS sin credenciales. Texto se renderiza con escape de React y Markdown de subconjunto seguro, sin HTML, imágenes remotas, MDX o JavaScript importado.

Un examen contiene identidad de proveedor/certificación, código, nivel, categoría, descripción, estado, versión de contenido y temario, fecha de consulta, URL oficial, requisitos, fuentes, dominios, aptitudes, lecciones, preguntas, tarjetas, laboratorios y glosario.

Cada lección declara tema, objetivos pedagógicos, aptitudes, prerrequisitos, dificultad, minutos estimados, conceptos, bloques, fuentes y fecha. Los bloques usan `id`, `version: 1` y descripción accesible. Tipos admitidos: markdown, callout, diagrama seleccionable, código, tabla, laboratorio registrado y pregunta registrada.

Cada pregunta tiene alternativas con ID, texto y razón, conjunto o secuencia `correct`, explicación, dificultad, fuentes, etiquetas y aptitudes. `single`/`boolean` requieren una respuesta; `multiple` compara conjuntos sin duplicados; `ordering` compara secuencia; `matching` muestra `concepto||definición` y compara el ID de cada definición en orden de conceptos. Un diagrama opcional aporta nodos y descripción sin scripts.

Los paquetes completos pasan validación de forma y referencias. Un parche tiene `schemaVersion:2`, `kind:'content-patch'`, `examId`, `baseVersion`, `contentVersion` y listas `lessons`, `questions`, `flashcards`. La versión base debe coincidir; las colisiones requieren habilitar reemplazo revisado. Se recalcula la matriz recíproca de lecciones. Los parches no cambian el temario oficial: usa un paquete completo para ese cambio.

Límites: 5 MiB por importación, profundidad 20, 1 000 lecciones, 10 000 preguntas/tarjetas por examen. Claves `__proto__`, `constructor` y `prototype` se rechazan en cualquier nivel. No se fusiona con asignación de objetos arbitrarios; los IDs y esquemas están validados antes de crear mapas.

Progreso v2 preserva notas, favoritos, respuestas fechadas, SM-2, actividad, última lección, simulacros y borrador de sesión. IDs retirados no se eliminan del respaldo; sólo las lecciones conocidas cuentan en el denominador visible. Hasta 5 000 respuestas y 500 simulacros por examen; exporta si necesitas conservar históricos mayores.
