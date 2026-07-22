# Paso 9 - Descuento de negociacion

Fecha: 2026-07-22

---

## Objetivo cumplido

Se agrego el flujo de descuento de negociacion dentro de la ficha comercial, separado semanticamente de promocion y contado.

---

## Implementacion realizada

Archivos principales:

- apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx
- apps/mvp-web-pos/src/features/quote-sheet/api/use-commercial-quote-sheet.ts
- apps/mvp-web-pos/src/core/api/contracts.ts
- apps/mvp-web-pos/src/core/api/fake-api.ts
- apps/mvp-web-pos/src/mocks/handlers.ts
- apps/mvp-web-pos/src/features/quote-sheet/lib/quote-builder.ts

Se incorporo:

- politica de aplicacion por rol (supervisor/commercial_admin/it_admin);
- UI para descuento negociado con rango operativo 5% a 15%;
- motivo comercial de negociacion;
- recalculo de la ficha comercial aplicando negotiationDiscountPercent al motor;
- registro de trazabilidad para intento/aplicacion en auditoria.

---

## Salida esperada del paso

- descuento negociado trazable: ✅
- no mezclar negociacion con promocion/contado: ✅

---

## Validacion tecnica

- npm run build ✅
- npm run test -- --run ✅
