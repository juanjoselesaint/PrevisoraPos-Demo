# Paso 4 - Motor comercial puro

Fecha: 2026-07-21

---

## Objetivo cumplido

Se implementó el motor comercial como funciones puras, independientes de UI, para generar la ficha comercial y aplicar reglas de negocio críticas sobre el dataset maestro.

---

## Implementación realizada

## 1) Servicio puro del motor

Archivo:

- `apps/mvp-web-pos/src/core/domain/commercial-engine.ts`

Funciones principales:

- `resolveRuleForCommercialContext`
- `buildCommercialQuoteSheet`
- `applyNegotiationToQuoteSummary`

Capacidades cubiertas:

1. resolución de reglas por SKU con fallback por familia opcional;
2. filtrado por cliente (`affiliate`/`external`);
3. filtrado por sucursal vía contexto de stock y notas operativas;
4. filtrado por medio de pago aplicable;
5. cálculo de descuento contado;
6. cálculo de topes de cuotas e importes estimados;
7. prioridad entre campañas y exclusiones por vigencia/segmento;
8. impacto del descuento de negociación (habilitado/bloqueado según política).

## 2) Integración sin acoplar UI

Archivos actualizados:

- `apps/mvp-web-pos/src/core/api/fake-api.ts`
- `apps/mvp-web-pos/src/mocks/handlers.ts`

Se reemplazó la construcción estática de ficha por cálculo dinámico con el motor en:

- fake API (modo fallback);
- MSW (modo `VITE_ENABLE_MSW=true`).

## 3) Runner de validación controlada

Archivo:

- `apps/mvp-web-pos/src/core/domain/commercial-engine-validation.ts`

Función:

- `runCommercialEngineControlledValidation()`

Objetivo:

- ejecutar los escenarios obligatorios en forma consistente;
- producir una vista resumida de señales esperadas para revisión manual.

---

## Salida esperada del paso

- servicios puros para generar la ficha comercial: ✅
- payload listo para `commercial quote sheet`: ✅
- reglas independientes de UI: ✅

---

## Validación obligatoria

## 1) Reglas del motor con escenarios controlados

Pruebas en:

- `apps/mvp-web-pos/src/core/domain/commercial-engine.test.ts`

Cobertura:

- resolución por segmento;
- exclusiones de medios no aplicables;
- cálculo de contado;
- topes e importes por cuotas;
- prioridad de campaña;
- impacto de negociación habilitado/bloqueado;
- ajuste de resumen de cotización.

Resultado: `11/11` pruebas OK.

## 2) Combinaciones financieras

Validadas por pruebas de:

- selección de entidades por regla;
- aplicación de exclusiones por `ST`;
- generación de filas bloqueadas con `maxInstallments=0` para medios no aplicables.

## 3) Descuento negociado

Validadas por pruebas de:

- aplicación cuando campaña lo permite (`scenario-8`);
- bloqueo cuando política lo impide (`scenario-9`);
- impacto en importes de cuota y resumen de cotización.

---

## Comandos ejecutados

- `npm run test` ✅
- `npm run build` ✅

Resultado: el Paso 4 queda validado con escenarios controlados sin avanzar a UI de ficha comercial.
