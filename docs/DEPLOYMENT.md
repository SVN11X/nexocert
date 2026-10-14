# Publicación

`pnpm build` compila para raíz y `pnpm build:pages` para `/nexocert/`. El script Pages establece la variable de entorno en un proceso Node portable; no depende de sintaxis Bash en Windows. `scripts/offline.mjs` genera un Service Worker con lista y hash de activos de esa misma compilación.

En GitHub crea `SVN11X/nexocert`, usa `main` y selecciona Pages → GitHub Actions. El workflow realiza todas las comprobaciones antes de subir `dist`. La URL prevista sólo será real cuando el despliegue termine. Si cambias nombre del repositorio, modifica `scripts/build-pages.mjs` y la URL documentada.

Para abrir el historial suministrado:

```bash
git clone nexocert.bundle nexocert
cd nexocert
git remote rename origin archive
git remote add origin https://github.com/SVN11X/nexocert.git
git push -u origin main
```

El ZIP también contiene la compilación `dist/`. No subas `node_modules`, respaldos personales ni secretos. Un Pages público contiene sólo recursos educativos, nunca datos privados.

Un Site privado de revisión utiliza `.openai/hosting.json`, sincronización del código y despliegue estático desde `dist/`. Su identidad no se necesita para GitHub Pages. Progreso de ese origen y Pages son independientes; exporta/importa para trasladarlo.

El Service Worker almacena sólo recursos del ámbito actual. Una revisión nueva instala caché aparte y muestra aviso para activar; no cambia IndexedDB. Primera carga y documentación externa necesitan red. Instalación PWA depende de soporte del navegador; no se garantiza disponibilidad universal del aviso de instalación.
