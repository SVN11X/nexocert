# Verificación real de la entrega

Ejecutada el 2026-10-13 UTC, noche del 12 de octubre en Chile. Node 24.19.0; Vite 7.3.7; Vitest 4.1.11; Playwright 1.56.1; Chromium 141. Dependencias bloqueadas y overrides de esbuild 0.28.1 y tinypool 2.1.2.

| Comprobación | Resultado |
| --- | --- |
| TypeScript estricto | Sin errores |
| Contratos y corpus | 50 lecciones, 216 preguntas, 176 tarjetas, 12 laboratorios válidos |
| Aptitudes | 64/64 enlazadas a lecciones y preguntas conceptuales |
| Vitest | 21 pruebas pasadas |
| Playwright | 10 pruebas pasadas, sin omisiones ni reintentos |
| Build Pages | Compilación correcta con `/nexocert/` |
| Offline | Recarga y navegación sin red tras precarga verificadas |
| Auditoría pnpm | 0 vulnerabilidades conocidas reportadas en la consulta |
| Responsive | Rutas comprobadas a 390 y 768 px sin desbordamiento horizontal |

Las unitarias comprueban contratos, IDs, fuentes, ciclos, claves peligrosas, respuestas, distribución de dominios, SM-2, progreso, migración v1, paquetes, búsqueda y funciones de laboratorios. Las E2E usan la compilación real y IndexedDB, no mocks de persistencia: catálogo, nota, lectura completada, respuesta, repaso, sesión retomable, resultado, doce laboratorios, paquete seguro, rechazo de clave peligrosa, tema, teclado, Pages, offline, examen nuevo y protección de estado incompatible.

El primer recorrido encontró dos selectores de prueba incorrectos, corregidos para usar el rol de combobox y completar las clasificaciones antes de evaluar. También se corrigieron migración de `repetitions`, agregación de resultados de práctica y protección contra sobrescribir datos inválidos con estado vacío. El ejecutor de validación usa `node --import tsx` para evitar la restricción de canales IPC del entorno.

La revisión de dependencias encontró avisos en versiones iniciales de herramientas de desarrollo. Se actualizaron Vite/Vitest y sus transitivas, se regeneró el lockfile y se repitieron comprobaciones con los resultados indicados. Una auditoría sin avisos no demuestra ausencia de toda vulnerabilidad.

Resultados legibles por máquinas: `content-validation.json`, `e2e-results.json` y `dependency-audit.json`. La matriz no marca aptitudes como verificadas de forma independiente. No se validaron servicios reales Azure, tarifas, despliegues, SDK contra un proyecto real, Safari/iOS o lectores de pantalla; no se declara cumplimiento WCAG certificado.

Reproducción:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:pages
pnpm exec playwright install chromium
pnpm test:e2e
pnpm audit
```

Si la instalación de navegador falla por conectividad, documenta esa limitación y conserva los resultados anteriores; no inventes una E2E pasada. El servidor `scripts/test-server.mjs` se usa exclusivamente como fixture local de Playwright.
