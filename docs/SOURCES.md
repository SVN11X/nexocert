# Fuentes y vigencia

Consulta: 2026-10-12 local. Temario oficial observado: 2026-04-16. Página de guía actualizada el 2026-04-14; no se observó temario posterior en la recuperación. Se reescribieron explicaciones y escenarios originales. Las preguntas no son oficiales ni proceden de dumps.

- Guía AI-103: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103
- SDK Python: https://learn.microsoft.com/python/api/overview/azure/ai-projects-readme
- Despliegues: https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview
- Identidad: https://learn.microsoft.com/en-us/azure/foundry/concepts/authentication-authorization-foundry
- Búsqueda híbrida: https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview
- RRF: https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking
- Content Understanding: https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview
- Voz: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text
- Translator: https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/overview
- Observabilidad: https://learn.microsoft.com/en-us/azure/foundry/concepts/observability
- Guardrails: https://learn.microsoft.com/en-us/azure/ai-foundry/guardrails/how-to-create-guardrails?view=foundry
- Prompt Shields: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/content-filter-prompt-shields

La recuperación completa del quickstart de agente nuevo falló; un resultado oficial confirmó PromptAgentDefinition, pero no se entrega un ejemplo de creación de agentes que no pudo verificarse completamente. El ejemplo Python se limita a construcción del cliente, contrastada con el SDK oficial.

La documentación de Content Understanding consultada distingue GA 2025-11-01 y preview 2026-06-01-preview, con actualización de página de 2026-09-24. El término pro del temario se mantiene como referencia histórica. La documentación de Translator identifica cambios de API 2026-06-06; no se fijan contratos antiguos ni precios.

Seguridad de dependencias contrastada con avisos de mantenedores: https://github.com/vitejs/vite/security/advisories y https://github.com/vitest-dev/vitest/security/advisories. Resultados concretos de consulta en `dependency-audit.json`.
