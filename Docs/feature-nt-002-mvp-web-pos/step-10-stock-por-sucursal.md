# Paso 10 - Stock por sucursal

Fecha: 2026-07-22

---

## Objetivo cumplido

Se implemento panel de stock por sucursal integrado al flujo vendedor, con foco en sucursal activa y alternativa.

---

## Implementacion realizada

Archivo principal:

- apps/mvp-web-pos/src/features/stock/pages/stock-page.tsx

Soporte de datos:

- apps/mvp-web-pos/src/features/stock/api/use-stock-snapshot.ts

Se agrego:

- selector de SKU desde catalogo real del mock;
- lectura de stock por sucursal activa de sesion;
- estados visibles: disponible, bajo, agotado y alternativa;
- tabla completa por sucursal;
- bloque de alternativa cuando hay stock en otro local.

---

## Salida esperada del paso

- stock util para vender: ✅
- no separado como subsistema aislado: ✅

---

## Validacion tecnica

- npm run build ✅
- npm run test -- --run ✅
