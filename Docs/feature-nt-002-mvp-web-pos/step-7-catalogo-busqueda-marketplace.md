# Paso 7 - Catalogo y busqueda tipo marketplace

Fecha: 2026-07-21

---

## Objetivo cumplido

Se implemento la entrada natural al flujo vendedor con un catalogo operativo que permite buscar, filtrar y navegar a la ficha/cotizacion desde resultados reales.

---

## Implementacion realizada

## 1) Landing de catalogo con filtros operativos

Archivo:

- `apps/mvp-web-pos/src/features/catalog/pages/catalog-page.tsx`

Se reemplazo el placeholder tecnico por una pantalla funcional que incluye:

- buscador por texto (SKU, descripcion, marca);
- filtro por familia;
- filtro por sucursal;
- filtro por disponibilidad (`todo`, `disponible`, `sin stock`);
- toggle de `solo promociones activas`;
- contador de resultados y estados `loading/error/empty`.

## 2) Integracion de fake API y filtros tipados

Archivos:

- `apps/mvp-web-pos/src/core/api/contracts.ts`
- `apps/mvp-web-pos/src/core/api/fake-api.ts`
- `apps/mvp-web-pos/src/mocks/handlers.ts`

Se amplio el contrato de listado y se implemento filtrado compuesto por:

- query de busqueda;
- familia;
- disponibilidad por sucursal;
- promociones activas.

Tambien se alinearon los handlers de MSW para replicar el mismo comportamiento cuando MSW esta habilitado.

## 3) Hooks de datos para catalogo

Archivos:

- `apps/mvp-web-pos/src/features/catalog/api/use-catalog-products.ts`
- `apps/mvp-web-pos/src/features/catalog/api/use-catalog-filters.ts`

Se incorporaron hooks dedicados para:

- obtener productos filtrados del catalogo;
- cargar ramas/familias para poblar filtros de UI.

## 4) CTA reales a detalle y cotizacion

Archivos:

- `apps/mvp-web-pos/src/features/catalog/pages/catalog-page.tsx`
- `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx`

Cada card de resultado ahora expone:

- `Ver detalle` -> navega a `quote-sheet` con `intent=detalle`;
- `Cotizar` -> navega a `quote-sheet` con `intent=cotizar`.

La ficha comercial toma `sku` desde query params y lo sincroniza con su selector interno, asegurando que el flujo parte de un resultado real del catalogo.

---

## Salida esperada del paso

- busqueda usable sobre catalogo completo: ✅
- integracion con fake API y dataset semilla: ✅

---

## Validacion obligatoria del paso

- el usuario llega a ficha comercial desde resultado real y no por ruta hardcodeada: ✅

---

## Validacion tecnica

- `npm run build` ✅
- `npm run test` ✅

Resultado: el catalogo queda operativo como puerta de entrada al journey vendedor y conectado de forma consistente con la ficha/cotizacion.
