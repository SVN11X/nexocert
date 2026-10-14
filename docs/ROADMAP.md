# Pendientes reales

La versión 2.0 cubre interfaz y motor local; el contenido AI-103 sigue en desarrollo. La matriz muestra enlaces conceptuales, no una certificación de suficiencia pedagógica.

- Revisar técnicamente 50 lecciones, 216 preguntas y todos los distractores con un revisor independiente; las preguntas v1 conservadas tienen explicaciones de distractores más generales.
- Validar integración en un entorno Azure autorizado, con SDK y APIs actuales. No se realizaron despliegues reales ni pruebas de facturación.
- Ampliar prácticas de generación/edición de imágenes y vídeo, personalización de voz y analizadores reales. No están implementados como consumo de servicios locales.
- Cargar sólo el examen activo y segmentar búsqueda al crecer a cientos de exámenes; hoy existe división por chunk pero el arranque carga los paquetes registrados.
- Mejorar importación para parches de fuentes, glosario y laboratorios; la versión actual usa paquete completo para esos cambios.
- Añadir mediación de escrituras concurrentes entre varias pestañas. La cola actual serializa dentro de una pestaña; exporta y evita edición simultánea del mismo progreso.
- Ampliar QA a Safari/iOS, Firefox, lectores de pantalla y auditoría WCAG 2.2 completa. Se incluyen controles semánticos, foco y movimiento reducido sin declarar certificación de accesibilidad.
- Permitir guardar borradores de ejercicios de laboratorio; hoy se registra exploración, no cada configuración.
- Confirmar creación y publicación pública de `SVN11X/nexocert` después de subir el código; no se tuvo acceso autenticado a GitHub.
