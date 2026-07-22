# Paso 6 - Design system operativo minimo

Fecha: 2026-07-21

---

## Objetivo cumplido

Se establecio una base visual y de componentes reutilizables para acelerar el flujo vendedor sin abrir todavia una etapa de refinamiento UI final.

---

## Implementacion realizada

## 1) Tokens de color, tipografia, spacing y estados

Archivo:

- `apps/mvp-web-pos/src/index.css`

Se incorporaron:

- tokens de marca y superficies extendidos;
- tokens semanticos de estado (`success`, `warning`, `danger`);
- font stack de UI y font de display;
- base para modo imprimible (`@media print`) y utilidades `no-print` / `print-surface`.

## 2) Componentes base (primitives)

Carpeta:

- `apps/mvp-web-pos/src/core/ui/primitives/`

Componentes implementados:

- `button` (variantes `primary`, `secondary`, `ghost`, `danger` + tamanos);
- `input`;
- `select`;
- `tabs`;
- `card`;
- `badge`;
- `table`;
- `alert`;
- `dialog`;
- `drawer`.

## 3) Componentes de dominio POS

Carpeta:

- `apps/mvp-web-pos/src/core/ui/domain/`

Componentes implementados:

- `product-card`;
- `offer-badge`;
- `financial-row-table`;
- `price-block`;
- `validity-block`;
- `observations-block`;
- `quote-sheet-states` (`loading`, `empty`, `error`);
- `printable-quote-sheet`.

## 4) Variante imprimible / modo simplificado de ficha

Implementado en:

- `apps/mvp-web-pos/src/core/ui/domain/printable-quote-sheet.tsx`
- `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx`

Resultado:

- la ficha ahora alterna entre `vista operativa` y `vista impresion`.

## 5) Integracion inicial en ficha comercial

Archivos:

- `apps/mvp-web-pos/src/features/quote-sheet/api/use-commercial-quote-sheet.ts`
- `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx`

Se reemplazo el placeholder de ficha por una pantalla funcional que:

- consume el endpoint tipado de `commercial quote sheet`;
- muestra bloque de precios y vigencia;
- renderiza tabla financiera reutilizable;
- muestra observaciones operativas;
- incluye estados `loading/empty/error`;
- incluye elementos de dialog/drawer para flujo comercial y visibilidad.

---

## Salida esperada del paso

- base visual estable: ✅
- componentes reutilizables para catalogo, ficha y backoffice: ✅

---

## Cobertura de no avanzar si falta

- componente de tabla financiera: ✅ (`financial-row-table`)
- componente de bloque dual afiliado/externo: ✅ (`price-block`)
- patron de estados `empty/loading/error`: ✅ (`quote-sheet-states`)

---

## Validacion tecnica

- `npm run build` ✅
- `npm run test` ✅

Resultado: el Design System operativo minimo queda disponible para reutilizar en pasos 7 y 8 sin rearmar base visual.
