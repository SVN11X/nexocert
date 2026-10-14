# NexoCert · Learning Lab

Plataforma estática de estudio para certificaciones IT, con contenido original, progreso local y simulaciones educativas. Primera ruta: **Microsoft AI-103 — Developing AI Apps and Agents on Azure**.

Esta versión refactoriza NexoCert v1 a React + TypeScript y conserva los IDs de sus 26 lecciones, 53 preguntas y 52 tarjetas. El catálogo distingue contenido **en desarrollo** de proveedores planificados; no hay cursos ficticios publicados para AWS, Google Cloud, Oracle, HashiCorp o SAP.

## Entrega 2.0

- 50 lecciones, más de 12 000 palabras de explicación, casos y prácticas.
- 176 tarjetas con revelado, favoritos, filtros, autocalificación y SM-2 adaptado.
- 216 preguntas originales: selección única/múltiple, verdadero/falso, ordenamiento, asociación, código y arquitecturas.
- 12 laboratorios: selección, RAG, RRF, herramientas, agentes, coordinación, parámetros, cuotas, permisos, trazas, documentos y evaluación.
- 64 aptitudes oficiales enlazadas a explicaciones y evaluación conceptual; matriz generada en `docs/AI103_COVERAGE.md`.
- Notas, favoritos, historial, simulacros retomables, tiempo activo aproximado y recomendaciones por reglas.
- IndexedDB, respaldo JSON con previsualización, migración v1 y paquetes de contenido sin ejecución de código.
- Tema claro/oscuro, rutas por hash, controles de teclado, diseño móvil y offline después de la precarga de producción.

**La correspondencia de aptitudes no equivale a preparación exhaustiva.** Todas están en estado inicial y requieren revisión técnica independiente y práctica autorizada en Azure. Los laboratorios son locales; no consumen Azure, modelos, embeddings ni OCR reales. No hay intérprete Python. El porcentaje de un simulacro no equivale a los 700 puntos escalados oficiales.

## Ejecutar y compilar

Necesitas Node.js 22.12 o posterior. El estudiante no instala dependencias y no necesita una cuenta.

```bash
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Abre la dirección local que imprime Vite. `pnpm-lock.yaml` fija versiones y permite la instalación reproducible. Si prefieres no instalar pnpm globalmente, puedes usar `npx pnpm@11.25.0 install --frozen-lockfile` y `npx pnpm@11.25.0 dev`.

```bash
pnpm check                 # tipos, integridad editorial y 21 pruebas unitarias
pnpm build                 # salida estática dist/ para ruta raíz
pnpm build:pages           # salida dist/ con base /nexocert/
pnpm exec playwright install chromium
pnpm test:e2e              # flujos en Chromium con servidor de prueba local
```

Las E2E usan la compilación previa de `build:pages`, no el servidor de desarrollo. No abras `index.html` con `file://`. Para servir la compilación sin Node, desde `dist/` puedes usar `python -m http.server 8000`; una compilación Pages debe servirse en el subdirectorio `nexocert/`.

## Publicar en SVN11X/nexocert

Se entrega código listo para publicar. No se ha creado ese repositorio de GitHub ni se afirma que Pages esté publicado. El workflow `.github/workflows/pages.yml` ejecuta instalación bloqueada, tipos, validación, unitarias, build y E2E antes de desplegar.

1. Crea el repositorio `SVN11X/nexocert` y sube los archivos de la raíz del ZIP.
2. En **Settings → Pages**, elige **GitHub Actions** como origen.
3. Haz push a `main`. La URL prevista, cuando termine el workflow, es `https://svn11x.github.io/nexocert/`.

Con Git local:

```bash
git init -b main
git add .
git commit -m "Build NexoCert learning engine and AI-103 content"
git remote add origin https://github.com/SVN11X/nexocert.git
git push -u origin main
```

Si descargaste el historial `nexocert.bundle`, consulta `docs/DEPLOYMENT.md`. `.openai/hosting.json` corresponde a la versión privada de revisión y no es necesaria para Pages. Todos los activos de ejecución se empaquetan; no hay fuentes, bibliotecas o analytics de CDN.

## Datos y mantenimiento

El almacenamiento es por origen de navegador. La versión privada de revisión, Pages y localhost tienen avances independientes: usa **Datos y configuración → Exportar progreso** para trasladarlos. Borrar datos del navegador puede eliminar avance; NexoCert no sincroniza con un servidor.

Añade un examen con `manifest.json` y `exam.json` en `src/content/exams/<id>/`; el registro los descubre sin editar la interfaz. Usa paquetes JSON completos o parches versionados para pruebas locales. Leer PDF/Word y convertir material en contenido ocurre en mantenimiento, no mediante un LLM en la web.

La fuente editorial original está en `scripts/editorial.py` y las revisiones de distractores en `scripts/review-assessments.py`. Para recompilar, con Python 3 disponible:

```bash
pnpm content:compile
pnpm check
```

No edites sólo `exam.json` si después vas a regenerarlo: cambia también la fuente editorial o incorpora el contenido directamente con un proceso versionado. Las pruebas de cobertura generan `docs/content-validation.json` y la matriz.

Lee `docs/AI_CONTENT_WORKFLOW.md` antes de continuar con otro modelo. Estado de verificación y límites concretos en `docs/TESTING.md` y `docs/ROADMAP.md`.

## Privacidad y licencia

Sin backend obligatorio, anuncios, rastreadores, autenticación obligatoria ni claves de nube. Sólo se solicitan activos del origen; enlaces oficiales se abren por acción del usuario. MIT para el código y contenido original. NexoCert no está afiliado a Microsoft ni a otros proveedores.
