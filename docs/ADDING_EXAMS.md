# Añadir exámenes

1. Verifica guía oficial, fecha, nombre, código, estado y todas las aptitudes; no extrapoles otro examen.
2. Crea `src/content/exams/<id>/manifest.json` con `id`, `providerId`, `code`, `title`, `status`, `level` y `category`.
3. Crea `exam.json` completo conforme al contrato v2. Usa un `certificationId` permanente y ponderaciones como rangos, sin inventar valores oficiales.
4. Mantén los campos de manifiesto iguales al paquete. Añade fuentes y fecha de consulta.
5. Ejecuta `pnpm check`, compila y prueba seleccionar el examen. `import.meta.glob` registra ambos archivos automáticamente; no edites componentes centrales.
6. Sólo marca disponible después de revisión; planificado no significa contenido terminado.

Para un proveedor nuevo, añade un elemento tipado a `providers/catalog.ts` con sitio oficial y sigla como marca local. No necesitas SDKs del proveedor para estudiar de forma local. Una importación completa válida registra una ruta sólo en el navegador, sin modificar GitHub.
