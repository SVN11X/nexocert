# Continuar NexoCert con otro modelo

Lee `README.md`, `ARCHITECTURE.md`, `CONTENT_SCHEMA.md`, `AI103_COVERAGE.md`, `ROADMAP.md` y el código que cambiarás antes de actuar. Este repositorio es un motor multiexamen; no introduzcas explicaciones de AI-103 dentro de componentes de UI.

## Contrato de trabajo permanente

- Inspecciona Git y conserva cambios ajenos. No reemplaces carpetas por una versión genérica de plantilla.
- Conserva IDs de lecciones `l01`–`l50`, preguntas v1 `q*`, `x*`, `a*`, tarjetas `c*` y nuevos IDs. El orden visible no determina la identidad.
- Trabaja con fuentes oficiales actuales. Documenta URL, versión, fecha y qué no pudiste verificar. No uses el estado inicial de la matriz como prueba de dominio completo.
- La fuente editorial se recompila con `pnpm content:compile`. Modifica el origen que produce el cambio o documenta un nuevo proceso; evita que la siguiente compilación borre tus aportes.
- Amplía explicaciones con fundamentos, decisiones, casos y errores observables. No añadas volumen con duplicados de definiciones.
- Las tarjetas deben exigir recordar una idea concreta; mantén programación por ID. No cambies un ID para una pregunta distinta.
- Las preguntas deben tener respuesta inequívoca, razones de cada distractor, aptitud y fuente. Revisa enunciados negativos y longitud de opciones; no uses opciones absurdas para facilitar aciertos.
- Los simuladores requieren lógica auténtica, casos límite y señal clara de datos sintéticos. Nunca simules una llamada real ni un intérprete inexistente.
- Al actualizar servicios, separa guía del examen y capacidades del producto vigente. Content Understanding cambió nomenclatura y versiones; SDK nuevo y clásico de Foundry son diferentes.
- Añade un examen con manifiesto y paquete, sin bifurcar motores de aprendizaje ni borrar el anterior.
- Nunca uses MDX importado, `eval`, HTML sin escape, scripts externos o claves de nube en Pages.

## Secuencia para nuevas fuentes

1. Ubica fuente, examen, dominio y aptitudes.
2. Extrae hechos y fecha; comprueba documentación primaria vigente.
3. Compara con lecciones y glosario; identifica contradicciones y duplicados.
4. Diseña ampliación con objetivos y representaciones que aporten valor.
5. Revisa respuestas y distractores contra fuentes; casos sin evidencia también deben evaluarse.
6. Incorpora contenido declarativo, recursos locales e IDs estables.
7. Actualiza versiones, matriz y changelog. Mantén notas e historial para IDs retirados.
8. Ejecuta `pnpm check`, `pnpm build:pages`, `pnpm test:e2e`. Si cambias persistencia añade migración y prueba de notas, repasos y sesiones.
9. Revisa interfaz móvil, teclado y consola. No inventes pruebas; documenta límites del entorno.
10. Publica la compilación del commit revisado y entrega los resultados reales.

Para tareas acotadas, pide al modelo una ampliación concreta con aptitudes y archivo objetivo. No solicites regenerar la plataforma entera cada vez que entregues una captura o un documento.
