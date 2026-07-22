# Paso 8 - Ficha comercial central

Fecha: 2026-07-22

---

## Objetivo cumplido

Se implemento la ficha comercial central como pieza principal del MVP, conectada al motor comercial y organizada en el orden funcional definido por implementation-order.md.

---

## Implementacion realizada

## 1) Encabezado comercial

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/product-card.tsx

Se completo el encabezado con:

- SKU;
- descripcion;
- marca;
- campana;
- vigencia;
- tipo de oferta y banda de publicacion.

Los datos salen del payload del motor comercial y no de placeholders.

## 2) Bloque de precios (externo, afiliado, oferta)

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/price-block.tsx

Se reorganizo la grilla para mostrar primero:

- precio externo;
- precio afiliado;
- precio de oferta.

## 3) Bloque de descuento contado

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/cash-discount-block.tsx

Se creo un bloque dedicado que muestra:

- porcentaje de descuento contado;
- precio contado externo;
- precio contado afiliado.

## 4) Tabla de medios aplicables y topes

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/financial-row-table.tsx

Se mantuvo la tabla financiera y se agrego capacidad para ocultar/mostrar columna de condicion segun politica de visibilidad del rol.

## 5) Importes estimados por entidad

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/entity-estimates-block.tsx

Se incorporo un resumen especifico por entidad con:

- entidades aplicables;
- tope de cuotas por entidad;
- importe estimado por cuota.

## 6) Observaciones operativas/comerciales

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/observations-block.tsx

Se mantiene como bloque dedicado y ahora se renderiza con control de visibilidad por rol.

## 7) Modo de visibilidad por rol

Archivos:

- apps/mvp-web-pos/src/core/domain/visibility.ts
- apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx

Se aplico politica de visibilidad de campos en tiempo de render usando la matriz central por rol, ocultando o mostrando bloques de ficha en base al contexto de sesion.

## 8) Estados complejos de la ficha

Archivo:

- apps/mvp-web-pos/src/core/ui/domain/quote-sheet-complex-states.tsx

Se agregaron alertas de estado complejo para:

- oferta vencida;
- oferta proxima a vencer;
- medios financieros bloqueados/no aplicables;
- alertas de stock vinculadas al escenario.

---

## Ajustes de contrato de ficha comercial

Archivos:

- apps/mvp-web-pos/src/core/domain/models.ts
- apps/mvp-web-pos/src/core/domain/commercial-engine.ts
- apps/mvp-web-pos/src/core/domain/excel-mappers.ts
- apps/mvp-web-pos/src/mocks/data/domain.ts

Se extendio CommercialQuoteSheet con campos de encabezado:

- description;
- brand;
- campaignLabel.

Y se alineo toda la cadena (motor, mapper y dataset mock) al nuevo contrato.

---

## Salida esperada del paso

- ficha comercial completa: ✅
- lectura rapida y segura: ✅
- reemplazo funcional superior al Excel actual (nivel MVP demo): ✅

---

## Validacion obligatoria del paso

1. comparacion visual/funcional contra captura y Excel: pendiente de validacion manual de negocio.
2. revision especifica de medios filtrados y topes por entidad: ✅ cubierta por tabla + estados complejos + reglas del motor.
3. checklist manual por rol y contexto comercial: pendiente de corrida manual final.

---

## Validacion tecnica

- npm run build ✅
- npm run test -- --run ✅

Resultado: la ficha comercial central queda implementada en secuencia y conectada al motor validado.
