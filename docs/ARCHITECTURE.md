# Arquitectura

React y TypeScript renderizan una aplicación estática compilada por Vite. Se usa hash routing para recargar rutas en subdirectorios Pages sin reescrituras del servidor.

| Capa | Responsabilidad |
| --- | --- |
| `app/` | Contexto, arranque, rutas, preferencias y errores recuperables |
| `content/providers/` | Proveedores y estado real de su oferta |
| `content/exams/<id>/` | Manifiesto y paquete educativo aislados |
| `content/schemas/` | Tipos Zod, límites y validación semántica |
| `content/registry/` | Descubrimiento de manifiestos y módulos por examen |
| `features/learning/` | Registro exhaustivo de bloques seguros |
| `features/quizzes/` | Sesiones, evaluación, navegación y resultados |
| `features/labs/` | Componentes y funciones puras verificables |
| `features/progress/` | IndexedDB, migraciones y selectores |
| `features/import-export/` | Paquetes, respaldo y previsualización |

Proveedor → certificación → examen → dominio → tema → lección → bloques y evaluación. `certificationId` permite agrupar múltiples exámenes, `topic` agrupa lecciones y `objectiveIds` conserva trazabilidad. La primera versión del catálogo lista rutas de examen; una vista de certificaciones con varios exámenes debe añadirse cuando haya ese contenido real.

La UI no contiene explicaciones del curso. Los datos educativos son declarativos y cada módulo de examen produce un chunk. Actualmente se cargan los exámenes registrados durante arranque para presentar su contenido disponible. Para cientos de exámenes hay que cargar sólo el activo y construir índices segmentados; no se promete escala ilimitada de memoria.

El estado persistente vive en una base IndexedDB `nexocert` con store `data`: claves `progress` y `exams`. `localStorage` contiene preferencias pequeñas y conserva datos v1 hasta que el usuario decida borrarlos. Escrituras de progreso se serializan en una cola; errores no borran el estado anterior y se muestran al usuario. No hay fallback que afirme un guardado inexistente.

No se necesitan Workers para estos corpus pequeños. Las funciones de laboratorios son acotadas y síncronas; al ampliar tamaños deben trasladarse a Workers con cancelación y contratos. El cronómetro usa una fecha límite persistida y el tiempo de estudio suma intervalos de 15 segundos sólo con página visible y enfocada: es una aproximación, no vigilancia ni medición exacta.
