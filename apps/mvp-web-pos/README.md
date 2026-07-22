# MVP Web POS - Paso 0

Base operativa del MVP implementada con React, Vite y TypeScript.

## Stack de bootstrap

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- TanStack Query
- Zustand
- MSW para mocking
- Oxlint + Prettier
- Vitest + Testing Library

## Scripts

- `npm run dev`: levanta app local
- `npm run build`: compila TypeScript y build de Vite
- `npm run lint`: corre Oxlint
- `npm run format`: formatea con Prettier
- `npm run format:check`: valida formato sin escribir
- `npm run test`: corre tests en modo run

## Estructura inicial

- `src/app`: providers y router
- `src/core`: API, stores, utilidades y primitives
- `src/features`: estructura feature-first
- `src/mocks`: handlers y data mock

## Mocking

- El worker de MSW está en `public/mockServiceWorker.js`.
- Activar mocking en desarrollo con `VITE_ENABLE_MSW=true`.
- Ver `.env.example` para variables iniciales.
