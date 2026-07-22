# Developer Agent - Memoria Frontend

Última actualización: 2026-07-21  
Total de elementos: 13

---

## 🎯 Prácticas Comunes

- **Scaffold base NT-002**: la app vive en `apps/mvp-web-pos` para no mezclar runtime con la capa documental del repo.
- **Arquitectura feature-first**: mantener separación en `src/app`, `src/core`, `src/features` y `src/mocks` desde el inicio.
- **Validación mínima por bloque**: cada cierre técnico se confirma con `lint`, `test`, `build` y chequeo de formato.
- **Shell por áreas**: separar rutas y layouts de vendedor/administración con guards explícitos para mantener navegación predecible.

---

## 🔧 Elementos Reutilizables

- **AppProviders**: integra TanStack Query para providers globales. Ubicación: `apps/mvp-web-pos/src/app/providers/app-providers.tsx` (Agregado: 2026-07-21)
- **Session Store (Zustand)**: estado inicial de rol y mutador `setRole`. Ubicación: `apps/mvp-web-pos/src/core/stores/session-store.ts` (Agregado: 2026-07-21)
- **Fake API bootstrap**: contrato y lectura de bootstrap con fallback mock. Ubicación: `apps/mvp-web-pos/src/core/api/fake-api.ts` (Agregado: 2026-07-21)
- **MSW handlers/browser**: base de mocking para endpoints de demo. Ubicación: `apps/mvp-web-pos/src/mocks/handlers.ts` y `apps/mvp-web-pos/src/mocks/browser.ts` (Agregado: 2026-07-21)
- **Session Store persistente**: auth mock + rol + sucursal + segmento + última ruta con persist de Zustand. Ubicación: `apps/mvp-web-pos/src/core/stores/session-store.ts` (Agregado: 2026-07-21)
- **Matriz de permisos por rol**: helper centralizado de visibilidad de features para menús y rutas. Ubicación: `apps/mvp-web-pos/src/core/auth/permissions.ts` (Agregado: 2026-07-21)
- **Role routing helpers**: etiquetas de rol, landing por rol y validación de acceso por área. Ubicación: `apps/mvp-web-pos/src/core/auth/role-routing.ts` (Agregado: 2026-07-21)
- **Guards y shell de navegación**: controles de acceso y estructura común con breadcrumbs. Ubicación: `apps/mvp-web-pos/src/app/router/guards.tsx`, `apps/mvp-web-pos/src/app/layouts/shell-layout.tsx`, `apps/mvp-web-pos/src/app/router/router.tsx` (Agregado: 2026-07-21)

---

## 🧠 Decisiones Importantes

- **Tailwind v4**: usar plugin `@tailwindcss/vite` en vez de init legacy, por compatibilidad con scaffold actual.
- **Alias tipados**: estándar inicial `@`, `@app`, `@core`, `@features`, `@mocks` para imports consistentes.
- **Permisos centralizados**: resolver autorización de UI en una matriz única para evitar reglas duplicadas en cada pantalla.
- **Breadcrumb por metadata**: usar `handle.breadcrumb` en rutas para desacoplar navegación del contenido de cada vista.

---

## 📚 Información Relevante

- **Skills curados Paso 0**: ver detalle en `Docs/feature-nt-002-mvp-web-pos/step-0-skills.md` y lock efectivo en `skills-lock.json`.
