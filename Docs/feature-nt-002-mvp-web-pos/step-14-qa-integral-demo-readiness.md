# Paso 14 - QA integral y demo readiness

Fecha: 2026-07-22

---

## Objetivo

Estabilizar el release para recorrido demo end-to-end.

---

## Cobertura tecnica ejecutada

- build de app: OK;
- suite de tests: OK;
- smoke de integracion para negociacion, cotizacion, stock, auditoria y backoffice mock.

---

## Checklist funcional recomendado (manual)

1. recorrido vendedor: catalogo -> ficha -> negociacion -> cotizacion -> stock;
2. recorrido supervisor/admin: campanas, permisos y auditoria;
3. validacion visual contra referencia de Excel para SKU criticos;
4. validacion de coherencia entre ficha, resumen y evidencia de auditoria.

---

## Estado de salida

- demo recorrible de punta a punta: ✅
- validaciones manuales de negocio: pendientes de corrida final con usuarios funcionales.

---

## Riesgos abiertos

- no hay persistencia backend real (solo stores/client state);
- no hay integracion real con Softland (payload mock).

Estos riesgos son esperables para el alcance MVP documental/tecnico actual.
