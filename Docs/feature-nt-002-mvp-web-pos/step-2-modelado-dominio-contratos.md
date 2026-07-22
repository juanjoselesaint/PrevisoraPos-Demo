# Paso 2 - Modelado de dominio y contratos tipados

Fecha: 2026-07-21

---

## Objetivo cumplido

Se cerró el núcleo semántico del sistema con:

1. modelos de dominio tipados;
2. contratos de fake API para lectura;
3. mappers entre semántica Excel y semántica de aplicación;
4. definición de visible data vs hidden data por rol.

---

## Implementación realizada

## 1) Modelos de dominio

Archivo: apps/mvp-web-pos/src/core/domain/models.ts

Modelos implementados:

- producto (`Product`)
- campaña (`Campaign`)
- regla (`PromotionRule`)
- entidad financiera (`FinancialEntity`)
- cuotas/reglas de cuotas (`InstallmentRule`, `FinancialRow`)
- stock (`StockSnapshot`)
- cotización (`QuoteSummary`, `QuoteLine`)
- auditoría (`AuditEvent`)
- usuario y rol (`AppUser`, `AppRole`, `UserRole`)

También se definieron explícitamente:

- `ProductDetail` para detalle de producto;
- `CommercialQuoteSheet` para ficha comercial.

Esta separación evita mezclar detalle de catálogo con proyección comercial contextual.

## 2) Contratos tipados de fake API

Archivo: apps/mvp-web-pos/src/core/api/contracts.ts

Contratos de lectura implementados:

- catálogo:
  - `CatalogListRequest`
  - `CatalogListResponse`
  - `ProductDetailRequest`
  - `ProductDetailResponse`
- ficha comercial (obligatorio):
  - `CommercialQuoteSheetRequest`
  - `CommercialQuoteSheetResponse`
- stock:
  - `StockSnapshotRequest`
  - `StockSnapshotResponse`
- campañas:
  - `CampaignsListResponse`
- auditoría:
  - `AuditEventsRequest`
  - `AuditEventsResponse`
- reglas financieras (obligatorio):
  - `FinancialRulesRequest`
  - `FinancialRulesResponse`
- resumen de cotización (obligatorio):
  - `QuoteSummaryRequest`
  - `QuoteSummaryResponse`

## 3) Fake API y endpoints mock

Archivos:

- apps/mvp-web-pos/src/core/api/fake-api.ts
- apps/mvp-web-pos/src/mocks/handlers.ts
- apps/mvp-web-pos/src/mocks/data/domain.ts

Funciones de lectura agregadas:

- `listCatalogProducts`
- `getProductDetail`
- `getCommercialQuoteSheet`
- `getStockSnapshot`
- `getFinancialRules`
- `getQuoteSummary`
- `listCampaigns`
- `listAuditEvents`

Quedaron disponibles rutas mock equivalentes en MSW para las mismas lecturas.

## 4) Mappers Excel -> dominio

Archivo: apps/mvp-web-pos/src/core/domain/excel-mappers.ts

Se implementó:

- conversión de fechas serial Excel a ISO (`excelSerialToIsoDate`);
- mapeo de fila `Productos` a `Product` (`mapExcelProductToDomain`);
- mapeo de fila `Politicas` a `PromotionRule` (`mapExcelPoliticaToRule`);
- composición a `ProductDetail` (`mapToProductDetail`);
- proyección a `CommercialQuoteSheet` (`mapToCommercialQuoteSheet`).

## 5) Visible vs hidden data por rol

Archivo: apps/mvp-web-pos/src/core/domain/visibility.ts

Política tipada por rol (`roleVisibilityPolicy`) para:

- `seller`
- `supervisor`
- `commercial_admin`
- `it_admin`

Con listas explícitas de campos visibles y ocultos, incluyendo campos operativos y trazas internas.

---

## Validación técnica

Proyecto validado con:

- `npm run build` ✅
- `npm run test` ✅

---

## Criterios obligatorios del Paso 2

- contrato específico de ficha comercial: ✅
- contrato de reglas financieras: ✅
- contrato de resumen de cotización: ✅

Resultado: quedan tipos estables y contratos de lectura listos para avanzar al Paso 3 (dataset mockeado maestro) sin romper la separación entre `product detail` y `commercial quote sheet`.
