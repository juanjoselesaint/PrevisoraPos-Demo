# Orden Exacto de Implementación: MVP Web POS para Promociones y Venta Asistida

**Generado**: 2026-07-21 | **Base**: Docs/feature-nt-002-mvp-web-pos/development-plan.md | **Destino**: handoff para agente Developer

---

## 🎯 Objetivo

Este documento define el **orden exacto de implementación** recomendado para construir el primer release del MVP Web POS sin abrir trabajo en paralelo que genere retrabajo.

La regla principal es simple:

1. primero cerrar el dominio y los contratos,
2. luego construir el motor comercial,
3. después montar la experiencia vendedor alrededor de ese motor,
4. recién al final completar backoffice, auditoría y hardening del demo.

La **ficha comercial** es el centro del release. Todo lo demás debe implementarse en el orden que mejor reduzca el riesgo de rehacer esa pieza.

---

## 🧭 Secuencia Maestra

### Paso 0: Preparación del entorno de desarrollo

**Objetivo**: dejar lista la base operativa del proyecto antes de construir dominio o UI.

**Implementar**:

1. scaffold del proyecto con React, Vite y TypeScript.
2. aliases, linting, formatting y estructura feature-first.
3. Tailwind, primitives base y setup de mocking.
4. TanStack Query, Zustand y capa inicial de fake API.
5. descubrimiento e instalación curada de skills útiles para frontend, design system, accessibility, documentation y review.

**Salida esperada**:

- app vacía ejecutando;
- estructura de carpetas creada;
- base de validación funcional lista;
- skills elegidos documentados.

**No avanzar si falta**:

- bootstrap estable;
- convención de carpetas;
- setup mínimo de estilos y mocking.

---

### Paso 1: Reverse engineering del Excel y documentación del dominio

**Objetivo**: convertir el Excel actual en conocimiento explícito antes de escribir lógica o UI.

**Implementar**:

1. relevar hojas `Productos`, `Asesora Politicas`, `Politicas` y `convinaciones fina`.
2. documentar equivalencias de columnas reales a conceptos de dominio.
3. separar datos base de producto, datos comerciales calculados y datos operativos heredados.
4. identificar reglas implícitas, excepciones, combinaciones y textos operativos.
5. dejar un inventario formal de campos para la ficha comercial.

**Salida esperada**:

- mapa de columnas y reglas;
- lista de entidades del dominio;
- catálogo de campos que deben vivir en la ficha comercial;
- lista de datos sensibles a ocultar por rol.

**Validación obligatoria**:

- la ficha actual del Excel puede explicarse en términos de modelos claros;
- ya se sabe de dónde sale cada dato crítico visible al vendedor.

---

### Paso 2: Modelado de dominio y contratos tipados

**Objetivo**: cerrar el núcleo semántico del sistema antes de montar pantallas.

**Implementar**:

1. modelos de dominio: producto, campaña, regla, entidad financiera, cuotas, stock, cotización, auditoría, usuario, rol.
2. contratos de fake API para catálogo, ficha comercial, stock, cotización, campañas y auditoría.
3. mappers entre semántica del Excel y semántica de aplicación.
4. definición de visible data vs hidden data por rol.

**Salida esperada**:

- tipos estables;
- contratos de lectura listos;
- separación clara entre `product detail` y `commercial quote sheet`.

**No avanzar si falta**:

- contrato específico de la ficha comercial;
- contrato de reglas financieras;
- contrato de resumen de cotización.

---

### Paso 3: Dataset mockeado maestro

**Objetivo**: construir una semilla realista que soporte todo el demo.

**Implementar**:

1. usuarios y roles mock.
2. sucursales y stock snapshot.
3. familias, marcas, productos, imágenes y SKU.
4. campañas, beneficios afiliado/externo y descuentos contado.
5. matrices financieras por entidad y topes de cuotas.
6. escenarios de cotización y eventos de auditoría.

**Escenarios mínimos obligatorios**:

1. producto con promoción activa.
2. producto sin promoción.
3. oferta próxima a vencer.
4. oferta vencida.
5. afiliado con beneficio adicional.
6. medio no aplicable.
7. sin stock local con stock en otra sucursal.
8. descuento negociado habilitado.
9. descuento negociado bloqueado.

**Salida esperada**:

- dataset maestro consistente;
- fixtures listos para validaciones y pantallas;
- escenarios reproducibles del demo.

---

### Paso 4: Motor comercial puro

**Objetivo**: implementar primero la lógica crítica sin depender todavía de UI final.

**Implementar**:

1. resolución de reglas por producto/familia.
2. filtrado por cliente afiliado/externo.
3. filtrado por sucursal.
4. filtrado por medio de pago aplicable.
5. cálculo de descuento contado.
6. cálculo de topes de cuotas e importes estimados.
7. prioridad entre campañas y exclusiones.
8. impacto del descuento de negociación.

**Salida esperada**:

- servicios o funciones puras para generar la ficha comercial;
- payload listo para `commercial quote sheet`;
- reglas independientes de la UI.

**Validación obligatoria**:

1. validación manual de reglas del motor con escenarios controlados.
2. validación manual de combinaciones financieras.
3. validación manual del descuento negociado.

**Regla de secuencia**:

No construir la pantalla principal de la ficha antes de que este paso quede validado con escenarios controlados.

---

### Paso 5: Shell de aplicación y permisos base

**Objetivo**: montar el armazón de navegación una vez que el dominio ya está firme.

**Implementar**:

1. login mock y selector de rol.
2. guards y permisos de UI.
3. layout vendedor.
4. layout administración.
5. navegación principal, breadcrumbs y contexto persistente.

**Salida esperada**:

- ingreso por rol funcionando;
- navegación estable;
- feature visibility resuelta.

---

### Paso 6: Design system operativo mínimo

**Objetivo**: fijar componentes y tokens antes de abrir muchas pantallas.

**Implementar**:

1. tokens de color, spacing, typography y estados.
2. componentes base: botones, inputs, selects, tabs, cards, badges, table, drawer, dialog, alert.
3. componentes de dominio: card de producto, badge de oferta, fila de entidad financiera, bloque de precio, bloque de vigencia, bloque de observaciones.
4. variante imprimible o modo simplificado de ficha.

**Salida esperada**:

- base visual estable;
- componentes reutilizables para catálogo, ficha y backoffice.

**No avanzar si falta**:

- componente de tabla financiera;
- componente de bloque dual afiliado/externo;
- patrón de estados empty/loading/error.

---

### Paso 7: Catálogo y búsqueda tipo marketplace

**Objetivo**: habilitar la entrada natural al flujo vendedor.

**Implementar**:

1. landing de catálogo.
2. búsqueda por texto, SKU y familia.
3. filtros por sucursal, disponibilidad y promoción.
4. resultados con CTA `Ver detalle` y `Cotizar`.

**Salida esperada**:

- búsqueda usable sobre catálogo completo;
- integración con fake API y dataset semilla.

**Validación obligatoria**:

- el usuario llega a la ficha comercial desde un resultado real, no desde una ruta hardcodeada.

---

### Paso 8: Ficha comercial central

**Objetivo**: construir la pieza más importante del MVP usando el motor ya validado.

**Implementar en este orden interno**:

1. encabezado comercial: SKU, descripción, marca, campaña, vigencia.
2. bloque de precios: externo, afiliado y precio de oferta.
3. bloque de descuento contado.
4. tabla de medios aplicables y topes de cuotas.
5. importes estimados por entidad.
6. observaciones operativas/comerciales.
7. modo de visibilidad por rol.
8. estados complejos de la ficha.

**Salida esperada**:

- ficha comercial completa;
- lectura rápida y segura;
- reemplazo funcional superior al Excel actual.

**Validación obligatoria**:

1. comparación visual/funcional contra la captura y el Excel.
2. revisión específica de medios filtrados y topes por entidad.
3. checklist manual del comportamiento por rol y contexto comercial.

---

### Paso 9: Descuento de negociación

**Objetivo**: agregar flexibilidad comercial sin romper la lógica principal.

**Implementar**:

1. políticas mock de descuento 5% a 15%.
2. habilitación por rol.
3. UI de aplicación del descuento.
4. recálculo de ficha y resumen.
5. registro de actor, motivo y resultado.

**Salida esperada**:

- descuento negociado trazable;
- sin mezclarlo semánticamente con promoción ni con contado.

---

### Paso 10: Stock por sucursal

**Objetivo**: incorporar disponibilidad sin quebrar el flujo central ya armado.

**Implementar**:

1. panel de stock embebido o vinculado desde ficha.
2. estados normal, bajo, agotado y alternativo.
3. lectura por sucursal activa.
4. visualización de alternativa en otra sucursal.

**Salida esperada**:

- stock útil para vender;
- no separado como subsistema aislado.

---

### Paso 11: Constructor de cotización y resumen listo para Softland

**Objetivo**: cerrar el journey vendedor completo.

**Implementar**:

1. alta de línea desde `Cotizar` o `Armar ficha`.
2. resumen de producto, beneficio, descuento, medio y sucursal.
3. payload mock de envío a Softland.
4. persistencia temporal de cotización abierta.

**Salida esperada**:

- flujo vendedor de punta a punta resuelto;
- operación prearmada consistente con la ficha.

**Validación obligatoria**:

- el resumen nunca contradice la ficha comercial de origen.

---

### Paso 12: Auditoría y evidencia imprimible

**Objetivo**: resolver el dolor operativo de resguardo manual.

**Implementar**:

1. eventos de búsqueda.
2. eventos de apertura de ficha.
3. eventos de descuento negociado.
4. eventos de cotización y cierre.
5. evidencia imprimible/exportable.

**Salida esperada**:

- trazabilidad completa del flujo principal;
- sustituto creíble de las capturas manuales.

---

### Paso 13: Backoffice mínimo

**Objetivo**: permitir que el demo muestre gobernanza básica sin expandir demasiado el alcance.

**Implementar**:

1. ABM mock de campañas.
2. prioridad, vigencia y exclusiones.
3. permisos de descuentos.
4. observaciones y textos configurables para la ficha.

**Salida esperada**:

- suficiente backoffice para explicar de dónde salen las reglas del vendedor.

**Regla de secuencia**:

No anticiparlo antes de que el flujo vendedor esté cerrado.

---

### Paso 14: QA integral y demo readiness

**Objetivo**: estabilizar el release y dejarlo listo para revisión.

**Implementar**:

1. validación funcional final del motor comercial.
2. checklist de catálogo, ficha, stock y resumen.
3. recorrido manual del journey vendedor.
4. recorrido manual de supervisor sobre descuento o auditoría.
5. revisión visual contra mockups y contra la lógica del Excel.
6. guion de demo y paquete de handoff.

**Salida esperada**:

- demo recorrible de punta a punta;
- validaciones críticas cerradas;
- relato funcional claro para negocio.

---

## ⛔ Orden Prohibido

Para evitar retrabajo, el agente Developer **no debería**:

1. empezar por backoffice antes de cerrar el flujo vendedor.
2. construir la ficha comercial antes del motor comercial y su validación funcional.
3. mockear datos a ojo sin antes cerrar el modelo de dominio.
4. conectar Softland real durante el primer tramo.
5. diseñar una UI final sin haber resuelto antes qué campos salen del Excel y qué reglas los gobiernan.

---

## ✅ Criterios de Paso Entre Etapas

El agente Developer solo debería pasar al siguiente bloque cuando el anterior cumpla esto:

1. código corriendo sin errores de build.
2. validación del bloque cerrada.
3. contratos tipados estables.
4. sin placeholders críticos en el flujo principal.
5. sin contradicciones entre Excel, ficha, cotización y auditoría.

---

## 📌 Orden Resumido para Ejecución Rápida

1. bootstrap técnico y skills.
2. reverse engineering del Excel.
3. modelos de dominio y contratos.
4. dataset mock maestro.
5. motor comercial validado.
6. auth, roles y app shell.
7. design system mínimo.
8. catálogo y búsqueda.
9. ficha comercial.
10. descuento negociado.
11. stock por sucursal.
12. cotización y resumen Softland mock.
13. auditoría e imprimibles.
14. backoffice mínimo.
15. QA integral y paquete demo.

---

## 🤝 Instrucción de Handoff para Developer

Si este documento se pasa al agente Developer, la indicación recomendada es:

"Implementar siguiendo estrictamente el orden de Docs/feature-nt-002-mvp-web-pos/implementation-order.md. No abrir pasos fuera de secuencia salvo bloqueo técnico real. Priorizar la ficha comercial y el motor comercial por encima de cualquier backoffice o integración futura. Mantener actualizado Docs/feature-nt-002-mvp-web-pos/completed-steps.md a medida que se cierre cada bloque."
