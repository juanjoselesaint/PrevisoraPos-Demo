---
applyTo: "**"
---

# Arquitectura

## Estado real del repositorio

Existe una aplicacion frontend implementada en `apps/mvp-web-pos` (React 19 + Vite + TypeScript,
datos integramente mockeados, sin backend real). Ver `Docs/feature-nt-002-mvp-web-pos/` para el
plan y el detalle de cada paso ejecutado, y `.github/documentation/frontend.md` para el stack
tecnico real. No hay backend, base de datos ni integracion real con Softland: todo el estado
sirve desde `src/mocks/data/domain.ts` via una capa "fake API" + TanStack Query.

## Estructura vigente

- `apps/mvp-web-pos/`: la aplicacion frontend (codigo fuente real).
- `Docs/`: fuente principal de contexto funcional y de producto, incluye el plan de la feature
  NT-002 (`Docs/feature-nt-002-mvp-web-pos/`) con el detalle tecnico de cada paso implementado.
- `.github/instructions/`: contexto persistente que orienta a Copilot y a los agentes.
- `.github/prompts/`: prompts reutilizables para setup, desarrollo, gestion y mantenimiento documental.
- `.github/agents/`: modos y agentes especializados del workspace.
- `.github/documentation/`: guias de soporte para operar el repositorio con IA.

## Criterios para trabajar en este repo

1. Tratar `Docs/` como fuente de verdad funcional antes de inferir soluciones.
2. Tratar el codigo en `apps/mvp-web-pos/src` como fuente de verdad tecnica del frontend
   implementado; no asumir capacidades (backend, integraciones reales) que no existan en el codigo.
3. Cuando se propongan mockups o un demo funcional, separar claramente:
   - estado actual implementado,
   - decision futura,
   - implementacion eventual.
4. Mantener sincronizados README, instrucciones y documentacion contextual con el estado real del proyecto.

## Evolucion esperada

1. MVP web frontend con datos mockeados (**implementado**, `apps/mvp-web-pos`).
2. Iterar sobre UX/visual y cerrar brechas funcionales contra el requerimiento del cliente
   (en curso).
3. Definir e incorporar integracion real con Softland (backend/API), reemplazando la capa
   "fake API" por servicios reales.
4. Endurecer seguridad, persistencia y despliegue productivo.
