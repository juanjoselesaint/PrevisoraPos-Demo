# Paso 3 - Dataset mockeado maestro

Fecha: 2026-07-21

---

## Objetivo cumplido

Se construyó una semilla mock consistente y tipada para soportar el demo completo, incluyendo catálogo, ficha comercial, stock, cotización, auditoría y escenarios obligatorios.

---

## Implementación realizada

## 1) Usuarios y roles mock

Definidos en:

- `apps/mvp-web-pos/src/mocks/data/domain.ts` (`roles`, `users`)

Incluye los 4 roles del dominio:

- `seller`
- `supervisor`
- `commercial_admin`
- `it_admin`

## 2) Sucursales y stock snapshot

Definidos en:

- `apps/mvp-web-pos/src/mocks/data/domain.ts` (`branches`, `stockBySku`)

Se cubren estados de stock:

- `in_stock`
- `low_stock`
- `out_of_stock`
- `alternative_branch`

## 3) Familias, marcas, productos, imágenes y SKU

Definidos en:

- `apps/mvp-web-pos/src/mocks/data/domain.ts` (`productFamilies`, `productBrands`, `catalogItems`)
- `apps/mvp-web-pos/src/core/domain/models.ts` (campo `imageUrl` en `Product`)

La semilla incluye 9 productos con SKU distintos y `imageUrl` realista para uso en pantallas de catálogo/ficha.

## 4) Campañas, beneficios afiliado/externo y descuentos contado

Definidos en:

- `apps/mvp-web-pos/src/mocks/data/domain.ts` (`campaigns`, `productDetailsBySku`, `commercialQuoteSheetsBySku`)

Incluye:

- campañas activas y vencidas;
- beneficio afiliado adicional;
- descuento contado;
- diferenciación por segmento (`affiliate` / `external`).

## 5) Matrices financieras por entidad y topes de cuotas

Definidas en:

- `apps/mvp-web-pos/src/mocks/data/domain.ts` (`financialEntities`, `installmentRules`, `commercialQuoteSheetsBySku[].financialRows`)

Incluye entidades y reglas de tope para:

- bancarias, Naranja, Tuya, Sidecreer, ConsuMax, Directo CP, débito, transferencia y efectivo.

## 6) Escenarios de cotización y eventos de auditoría

Definidos en:

- `apps/mvp-web-pos/src/mocks/data/domain.ts` (`quoteSummariesById`, `auditEvents`, `scenarioFixtures`)

Incluye cotizaciones con negociación habilitada y bloqueada, y eventos de auditoría de aprobación/rechazo.

---

## Cobertura de escenarios mínimos obligatorios

Todos implementados en `scenarioFixtures`:

1. producto con promoción activa -> `1002631`
2. producto sin promoción -> `1004100`
3. oferta próxima a vencer -> `1004200`
4. oferta vencida -> `1004300`
5. afiliado con beneficio adicional -> `1004400`
6. medio no aplicable -> `1004500`
7. sin stock local con stock en otra sucursal -> `1004600`
8. descuento negociado habilitado -> `1004700` / `quote-neg-enabled`
9. descuento negociado bloqueado -> `1004800` / `quote-neg-blocked`

---

## Fixtures listos para validaciones y pantallas

Se exponen fixtures tipados a través de:

- dataset maestro: `apps/mvp-web-pos/src/mocks/data/domain.ts`
- fake API: `apps/mvp-web-pos/src/core/api/fake-api.ts`
- endpoints MSW: `apps/mvp-web-pos/src/mocks/handlers.ts`

Endpoints adicionales de soporte a fixtures:

- `/api/meta/roles`
- `/api/meta/users`
- `/api/meta/branches`
- `/api/meta/product-taxonomy`
- `/api/meta/scenarios`

---

## Validación técnica

- `npm run build` ✅
- `npm run test` ✅

Resultado: dataset maestro consistente, con fixtures reproducibles para avanzar al Paso 4 (motor comercial puro).
