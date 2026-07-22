---
applyTo: "**"
---

# Tech Stack

## Stack actual real

El frontend del MVP (`apps/mvp-web-pos`) esta implementado. Ver `.github/documentation/frontend.md`
para el detalle. Resumen:

- React 19 + Vite + TypeScript
- Tailwind CSS v4, con un design system propio minimo en `src/core/ui`
- Zustand (estado cliente) + TanStack Query (estado servidor/mock)
- Capa "fake API" (`src/core/api/fake-api.ts`) sobre datos mockeados en
  `src/mocks/data/domain.ts`, con espejo opcional via MSW
- React Router v7
- Vitest + Testing Library para los tests existentes

## Lo que no esta definido/implementado todavia

- Backend real / API productiva (hoy todo es mock en el cliente)
- Base de datos
- Integracion real con Softland (hoy es un payload simulado)
- Infraestructura de despliegue
- ARCA, facturacion electronica, validacion de credito online (fuera del alcance de Fase 1)

## Componentes de soporte documental (siguen vigentes)

- Markdown para investigacion y documentacion de apoyo.
- Archivo DOCX como insumo funcional del proceso actual de promociones.
- Archivo HTML como roadmap navegable del producto por fases.
- VS Code como entorno de trabajo principal.
- GitHub Copilot y agentes como capa operativa para analisis, documentacion y planificacion.

## Regla de trabajo

Para el frontend, tratar `apps/mvp-web-pos/src` como fuente de verdad del stack real (no el
listado de "no esta definido" de versiones previas de este archivo). Para todo lo que si sigue
sin implementar (backend, integraciones reales), no asumir frameworks ni arquitectura como si ya
estuvieran elegidos sin una decision explicita.
