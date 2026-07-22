# Paso 13 - Backoffice minimo

Fecha: 2026-07-22

---

## Objetivo cumplido

Se implemento backoffice mock suficiente para mostrar gobernanza basica de campanas y permisos.

---

## Implementacion realizada

Campanas:

- apps/mvp-web-pos/src/features/admin-campaigns/pages/admin-campaigns-page.tsx
- apps/mvp-web-pos/src/features/admin-campaigns/api/use-campaigns.ts

Permisos:

- apps/mvp-web-pos/src/features/admin-permissions/pages/admin-permissions-page.tsx
- apps/mvp-web-pos/src/features/admin-permissions/api/use-admin-meta.ts

Capacidades agregadas:

- ABM mock de campanas (estado, vigencia, prioridad, notas de exclusion);
- matriz mock de permisos por rol para negociacion y trazabilidad;
- textos operativos/comerciales configurables para ficha;
- listado de usuarios impactados por rol.

---

## Salida esperada del paso

- backoffice suficiente para explicar origen de reglas vendedor: ✅

---

## Validacion tecnica

- npm run build ✅
- npm run test -- --run ✅
