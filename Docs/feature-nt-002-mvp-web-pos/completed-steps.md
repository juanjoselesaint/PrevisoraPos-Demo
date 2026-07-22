# Pasos Completados: MVP Web POS para Promociones y Venta Asistida

**Última actualización**: 2026-07-22 | **Plan**: Docs/feature-nt-002-mvp-web-pos/development-plan.md

## 📋 Registro de Implementación

### ✅ Fase 6: Cierre flujo vendedor, trazabilidad y readiness - Pasos 9 a 14 - 2026-07-22 09:40

**Tarea**: continuar desde negociación comercial hasta QA integral según secuencia de `implementation-order.md`.

**Implementación**:

- Paso 9 (negociación):
  - UI y lógica de descuento 5%-15% en `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx`;
  - extensión de contratos y fake API para `negotiationDiscountPercent` en:
    - `apps/mvp-web-pos/src/core/api/contracts.ts`
    - `apps/mvp-web-pos/src/core/api/fake-api.ts`
    - `apps/mvp-web-pos/src/mocks/handlers.ts`;
- Paso 10 (stock):
  - panel de stock por sucursal con estados y alternativas en `apps/mvp-web-pos/src/features/stock/pages/stock-page.tsx`;
  - hook de lectura en `apps/mvp-web-pos/src/features/stock/api/use-stock-snapshot.ts`;
- Paso 11 (cotización + resumen Softland mock):
  - constructor de cotización embebido en ficha;
  - persistencia temporal de cotización abierta en `apps/mvp-web-pos/src/core/stores/quote-draft-store.ts`;
  - builder/payload mock en `apps/mvp-web-pos/src/features/quote-sheet/lib/quote-builder.ts`;
- Paso 12 (auditoría):
  - registro runtime de eventos en `apps/mvp-web-pos/src/core/stores/audit-store.ts`;
  - vista de auditoría filtrable y evidencia imprimible en `apps/mvp-web-pos/src/features/audit/pages/audit-page.tsx`;
- Paso 13 (backoffice mínimo):
  - ABM mock de campañas en `apps/mvp-web-pos/src/features/admin-campaigns/pages/admin-campaigns-page.tsx`;
  - matriz mock de permisos y textos configurables en `apps/mvp-web-pos/src/features/admin-permissions/pages/admin-permissions-page.tsx`;
- Paso 14 (QA readiness):
  - cierre técnico con pruebas/build y documentación de checklist manual.

**Entregables**:

- `Docs/feature-nt-002-mvp-web-pos/step-9-descuento-negociacion.md`
- `Docs/feature-nt-002-mvp-web-pos/step-10-stock-por-sucursal.md`
- `Docs/feature-nt-002-mvp-web-pos/step-11-cotizacion-resumen-softland-mock.md`
- `Docs/feature-nt-002-mvp-web-pos/step-12-auditoria-evidencia-imprimible.md`
- `Docs/feature-nt-002-mvp-web-pos/step-13-backoffice-minimo.md`
- `Docs/feature-nt-002-mvp-web-pos/step-14-qa-integral-demo-readiness.md`

**Validación técnica**:

- `npm run test -- --run` OK (14/14);
- `npm run build` OK;
- `npm run lint` OK con 1 warning preexistente en `apps/mvp-web-pos/src/features/auth/pages/login-page.tsx`.

**Resultado funcional**:

- flujo vendedor extendido hasta negociación, cotización y stock;
- trazabilidad funcional con evidencia exportable;
- backoffice mínimo navegable para gobierno comercial del demo;
- cierre de release listo para validación manual de negocio.

---

### ✅ Fase 5: Ficha comercial central - Paso 8 (Core vendedor) - 2026-07-22 09:10

**Tarea**: implementar la ficha comercial central completa sobre el motor comercial validado, respetando el orden interno del paso 8.

**Implementación**:

- reorganización de la vista de ficha en `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx` por bloques funcionales del paso:
  - encabezado comercial;
  - bloque de precios;
  - descuento contado;
  - tabla de medios/topes;
  - importes por entidad;
  - observaciones;
  - visibilidad por rol;
  - estados complejos;
- ampliación de contrato de `CommercialQuoteSheet` para encabezado comercial completo en:
  - `apps/mvp-web-pos/src/core/domain/models.ts`;
  - `apps/mvp-web-pos/src/core/domain/commercial-engine.ts`;
  - `apps/mvp-web-pos/src/core/domain/excel-mappers.ts`;
  - `apps/mvp-web-pos/src/mocks/data/domain.ts`;
- ajustes y nuevos componentes de dominio POS:
  - `apps/mvp-web-pos/src/core/ui/domain/product-card.tsx`;
  - `apps/mvp-web-pos/src/core/ui/domain/price-block.tsx`;
  - `apps/mvp-web-pos/src/core/ui/domain/financial-row-table.tsx`;
  - `apps/mvp-web-pos/src/core/ui/domain/cash-discount-block.tsx` (nuevo);
  - `apps/mvp-web-pos/src/core/ui/domain/entity-estimates-block.tsx` (nuevo);
  - `apps/mvp-web-pos/src/core/ui/domain/quote-sheet-complex-states.tsx` (nuevo).

**Entregable**:

- `Docs/feature-nt-002-mvp-web-pos/step-8-ficha-comercial-central.md`

**Validación técnica**:

- `npm run build` OK;
- `npm run test -- --run` OK.

**Resultado funcional**:

- ficha comercial central implementada de punta a punta;
- visibilidad de datos gobernada por rol usando matriz centralizada;
- cobertura de estados operativos complejos (vigencia, medios bloqueados y señales de stock).

---

### ✅ Fase 1: Bootstrap del workspace de desarrollo - 2026-07-21 18:15

**Tarea**: Paso 0 - Preparación del entorno de desarrollo

**Implementación**:

- scaffold en `apps/mvp-web-pos` con React + Vite + TypeScript;
- aliases configurados (`@`, `@app`, `@core`, `@features`, `@mocks`);
- estructura feature-first inicial y carpetas base del plan NT-002;
- Tailwind v4 integrado en Vite y tokens base aplicados;
- TanStack Query + Zustand conectados en app providers;
- capa inicial de fake API + MSW con endpoint mock `/api/bootstrap`;
- tooling de lint/format/test configurado (Oxlint, Prettier, Vitest);
- skills curados instalados y documentados.

**Validación**: build, lint, test y arranque local de app en estado bootstrap.

**Notas**: no se avanzó a modelado de dominio ni UI de negocio, en cumplimiento de secuencia.

---

### ✅ Fase 4: Experiencia base - Paso 6 (Design system operativo mínimo) - 2026-07-21 21:15

**Tarea**: fijar componentes y tokens base para sostener catálogo, ficha comercial y pantallas administrativas con consistencia visual.

**Implementación**:

- ampliación de tokens y estilos base en `apps/mvp-web-pos/src/index.css` (paleta extendida, estados semánticos y soporte de impresión);
- primitives reutilizables en `apps/mvp-web-pos/src/core/ui/primitives/`:
  - `button`, `input`, `select`, `tabs`, `card`, `badge`, `table`, `alert`, `dialog`, `drawer`;
- componentes de dominio POS en `apps/mvp-web-pos/src/core/ui/domain/`:
  - `product-card`, `offer-badge`, `financial-row-table`, `price-block`, `validity-block`, `observations-block`, `quote-sheet-states`, `printable-quote-sheet`;
- integración inicial del sistema visual en la ficha comercial:
  - hook `use-commercial-quote-sheet` en `apps/mvp-web-pos/src/features/quote-sheet/api/use-commercial-quote-sheet.ts`;
  - reemplazo del placeholder en `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx` por pantalla funcional con vista operativa/impresión y estados UX.

**Entregable**:

- `Docs/feature-nt-002-mvp-web-pos/step-6-design-system-operativo-minimo.md`

**Validación técnica**:

- `npm run build` OK;
- `npm run test` OK.

**Resultado funcional**:

- base visual estable;
- componentes reutilizables listos para pasos 7 y 8;
- cobertura de tabla financiera, bloque dual afiliado/externo y estados `empty/loading/error`.

---

### ✅ Fase 4: Shell y acceso - Paso 5 (Shell de aplicación y permisos base) - 2026-07-21 21:00

**Tarea**: implementar shell base con login mock, selector de rol, guards, layouts por área y navegación principal con contexto persistente.

**Implementación**:

- store de sesión persistente en `apps/mvp-web-pos/src/core/stores/session-store.ts` con auth, rol, sucursal, segmento y última ruta;
- matriz de permisos y utilidades de ruteo por rol en:
  - `apps/mvp-web-pos/src/core/auth/permissions.ts`
  - `apps/mvp-web-pos/src/core/auth/role-routing.ts`
- login mock con selector de usuario/rol/sucursal en `apps/mvp-web-pos/src/features/auth/pages/login-page.tsx`;
- guards de acceso en `apps/mvp-web-pos/src/app/router/guards.tsx`;
- layouts por área y shell común con breadcrumbs en:
  - `apps/mvp-web-pos/src/app/layouts/shell-layout.tsx`
  - `apps/mvp-web-pos/src/app/layouts/seller-layout.tsx`
  - `apps/mvp-web-pos/src/app/layouts/admin-layout.tsx`
- ruteo anidado por áreas (seller/admin) en `apps/mvp-web-pos/src/app/router/router.tsx`;
- placeholders iniciales de pantallas para navegación base:
  - dashboard vendedor y admin;
  - campañas, permisos, auditoría, stock y ficha/cotización.

**Entregable**:

- `Docs/feature-nt-002-mvp-web-pos/step-5-shell-aplicacion-permisos.md`

**Validación técnica**:

- `npm run build` OK;
- `npm run test` OK.

**Resultado funcional**:

- ingreso por rol funcionando;
- navegación estable por área;
- visibilidad de features resuelta por permisos base.

---

### ✅ Fase 2: Descubrimiento del dominio - Paso 1 (Reverse engineering Excel) - 2026-07-21 19:40

**Tarea**: relevar hojas `Productos`, `Asesora Politicas`, `Politicas` y `convinaciones fina`; documentar equivalencias de columnas, reglas y campos para ficha comercial.

**Implementación**:

- relevamiento técnico del archivo `Docs/Catalogo Ofertas 2026 06 - para desarrolladores.xlsx` sobre las 4 hojas objetivo;
- mapeo de columnas reales a conceptos de dominio para catálogo, políticas, combinaciones y ficha;
- separación explícita entre datos base de producto, datos comerciales calculados y datos operativos heredados;
- identificación de reglas implícitas, excepciones y combinaciones (segmentación afiliado/externo, vigencias, topes por entidad, medios no habilitados, expresión `ST`);
- inventario formal de campos obligatorios para la ficha comercial y lista de datos sensibles por rol.

**Entregable**:

- `Docs/feature-nt-002-mvp-web-pos/step-1-reverse-engineering-excel.md`

**Validación**:

- la ficha actual queda explicada como un modelo claro de `commercial quote sheet`;
- se trazó el origen de cada dato crítico visible al vendedor.

---

### ✅ Fase 2: Descubrimiento del dominio - Paso 2 (Modelado y contratos tipados) - 2026-07-21 20:05

**Tarea**: definir modelos de dominio, contratos tipados de fake API, mappers Excel -> dominio y política visible/hidden por rol.

**Implementación**:

- modelos de dominio en `apps/mvp-web-pos/src/core/domain/models.ts` para producto, campaña, regla, entidad financiera, cuotas, stock, cotización, auditoría, usuario y rol;
- contratos tipados en `apps/mvp-web-pos/src/core/api/contracts.ts` para catálogo, ficha comercial, stock, campañas, auditoría, reglas financieras y resumen de cotización;
- funciones de lectura fake API en `apps/mvp-web-pos/src/core/api/fake-api.ts` y rutas mock MSW en `apps/mvp-web-pos/src/mocks/handlers.ts`;
- dataset base para contratos en `apps/mvp-web-pos/src/mocks/data/domain.ts`;
- mappers de semántica Excel a semántica de aplicación en `apps/mvp-web-pos/src/core/domain/excel-mappers.ts`;
- política de visibilidad por rol en `apps/mvp-web-pos/src/core/domain/visibility.ts`.

**Entregables**:

- `Docs/feature-nt-002-mvp-web-pos/step-2-modelado-dominio-contratos.md`

**Validación**:

- `npm run build` OK;
- `npm run test` OK;
- contrato específico de ficha comercial, contrato de reglas financieras y contrato de resumen de cotización definidos.

---

### ✅ Fase 2: Descubrimiento del dominio - Paso 3 (Dataset mockeado maestro) - 2026-07-21 20:30

**Tarea**: construir semilla mock realista para todo el demo con escenarios funcionales obligatorios.

**Implementación**:

- dataset maestro en `apps/mvp-web-pos/src/mocks/data/domain.ts` con roles, usuarios, sucursales, familias, marcas, productos, imágenes, campañas, matrices financieras, cotizaciones y auditoría;
- ampliación de modelos para soporte de imágenes y negociación en cotización (`apps/mvp-web-pos/src/core/domain/models.ts`);
- actualización de mappers (`apps/mvp-web-pos/src/core/domain/excel-mappers.ts`) para completar campo `imageUrl`;
- ampliación de contratos para fixtures (`apps/mvp-web-pos/src/core/api/contracts.ts`);
- endpoints de lectura para fixtures en fake API y MSW (`apps/mvp-web-pos/src/core/api/fake-api.ts`, `apps/mvp-web-pos/src/mocks/handlers.ts`).

**Escenarios mínimos cubiertos**:

1. producto con promoción activa;
2. producto sin promoción;
3. oferta próxima a vencer;
4. oferta vencida;
5. afiliado con beneficio adicional;
6. medio no aplicable;
7. sin stock local con stock en otra sucursal;
8. descuento negociado habilitado;
9. descuento negociado bloqueado.

**Entregables**:

- `Docs/feature-nt-002-mvp-web-pos/step-3-dataset-mockeado-maestro.md`

**Validación**:

- `npm run build` OK;
- `npm run test` OK;
- fixtures reproducibles publicados en `domainData.scenarioFixtures` y endpoints `/api/meta/*`.

---

### ✅ Fase 3: Motor comercial - Paso 4 (Motor comercial puro) - 2026-07-21 20:55

**Tarea**: implementar lógica crítica del motor comercial sin dependencia de UI final.

**Implementación**:

- servicio puro en `apps/mvp-web-pos/src/core/domain/commercial-engine.ts` con:
  - resolución de reglas por SKU/familia;
  - filtro por cliente;
  - filtro por medio de pago aplicable;
  - cálculo de descuento contado;
  - cálculo de topes e importes de cuotas;
  - prioridad y exclusiones por campaña/vigencia;
  - impacto de descuento de negociación;
- integración del motor en fake API y MSW para generación dinámica de `commercial quote sheet`:
  - `apps/mvp-web-pos/src/core/api/fake-api.ts`
  - `apps/mvp-web-pos/src/mocks/handlers.ts`
- runner de validación controlada en `apps/mvp-web-pos/src/core/domain/commercial-engine-validation.ts`.

**Validación obligatoria**:

1. reglas del motor con escenarios controlados: cubiertas en `apps/mvp-web-pos/src/core/domain/commercial-engine.test.ts`;
2. combinaciones financieras: validadas (aplicabilidad por medio + exclusiones ST + filas bloqueadas);
3. descuento negociado: validado en escenarios habilitado y bloqueado.

**Entregables**:

- `Docs/feature-nt-002-mvp-web-pos/step-4-motor-comercial-puro.md`

**Validación técnica**:

- `npm run test` OK (11/11);
- `npm run build` OK.

---

### ✅ Fase 5: Catálogo y búsqueda - Paso 7 (Marketplace vendedor) - 2026-07-21 19:10

**Tarea**: habilitar la entrada natural del flujo vendedor con catálogo completo, búsqueda operativa, filtros comerciales y CTA a ficha/cotización.

**Implementación**:

- reemplazo del placeholder de catálogo por pantalla funcional en `apps/mvp-web-pos/src/features/catalog/pages/catalog-page.tsx` con:
  - búsqueda por texto (SKU, descripción y marca);
  - filtros por familia, sucursal, disponibilidad y promoción activa;
  - resultados con narrativa comercial y estados `loading/error/empty`;
- hooks dedicados para catálogo en:
  - `apps/mvp-web-pos/src/features/catalog/api/use-catalog-products.ts`;
  - `apps/mvp-web-pos/src/features/catalog/api/use-catalog-filters.ts`;
- ampliación de contrato y fake API para filtros del paso 7 en:
  - `apps/mvp-web-pos/src/core/api/contracts.ts`;
  - `apps/mvp-web-pos/src/core/api/fake-api.ts`;
  - `apps/mvp-web-pos/src/mocks/handlers.ts` (alineado con MSW);
- integración de CTA `Ver detalle` y `Cotizar` hacia `quote-sheet` con `sku` e `intent` por query params;
- sincronización de SKU en ficha comercial desde query params en `apps/mvp-web-pos/src/features/quote-sheet/pages/quote-sheet-page.tsx` para asegurar navegación desde resultado real.

**Entregable**:

- `Docs/feature-nt-002-mvp-web-pos/step-7-catalogo-busqueda-marketplace.md`

**Validación obligatoria**:

- el ingreso a ficha comercial ocurre desde resultados reales del catálogo y no desde rutas hardcodeadas.

**Validación técnica**:

- `npm run build` OK;
- `npm run test` OK.

**Resultado funcional**:

- catálogo operativo como puerta de entrada del journey vendedor;
- integración consistente con dataset semilla, fake API y flujo de ficha/cotización.

---
