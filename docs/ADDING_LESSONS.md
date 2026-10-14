# Añadir o enriquecer una lección

Busca primero en título, conceptos y aptitudes. Enriquece una lección existente si la fuente profundiza el mismo tema; crea una nueva cuando hay una decisión o competencia diferenciada.

Conserva ID de un concepto existente. Declara objetivos como acciones observables, no copies párrafos de explicación en ese campo. Separa introducción, fundamento, caso, práctica, alternativa, fallo y síntesis. Usa bloques de texto y una representación útil: diagrama seleccionable, código para leer, tabla o laboratorio.

Vincula aptitudes oficiales mediante `objectiveIds` y actualiza `objectives[].lessonIds`. Prerrequisitos deben existir y no formar ciclos. Cada pregunta y tarjeta enlaza una lección y referencias. No renumeres IDs para ordenar visualmente; el orden depende del array del paquete.

En el corpus generado actual modifica `scripts/editorial.py` o los archivos de autoría complementarios y ejecuta `pnpm content:compile`. También puedes diseñar un parche v2 para revisar cambios localmente antes de incorporarlos al repositorio. El ejemplo `docs/EXAMPLE_PATCH.json` añade una lección sin ejecutar código.
