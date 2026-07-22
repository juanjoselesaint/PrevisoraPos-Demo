# Plan de Desarrollo: MVP Web POS para Promociones y Venta Asistida

**Generado**: 2026-07-21 00:00 | **Contexto**: Docs/feature-nt-002-mvp-web-pos/base-context.md | **Tipo**: Feature | **Stack**: Frontend, Backend, Database, Docs

---

## 📋 Checklist de Desarrollo

**Nota**: Este plan define una implementación futura propuesta para construir el primer release del MVP Fase 1. No describe una aplicación ya existente en el repositorio.

## 🧭 Resumen Ejecutivo del Release

**Objetivo del release**: Entregar una app web demo ejecutable que reemplace el Excel de promociones en el flujo comercial principal con datos íntegramente mockeados, UX high-fidelity y arquitectura preparada para conectar luego con Softland sin reescribir el núcleo de la solución.

**Alcance funcional del release**:

- login y cambio de rol simulado;
- cockpit vendedor con accesos rápidos y contexto comercial;
- catálogo completo con búsqueda tipo marketplace y promociones destacadas;
- ficha comercial crítica con precios externo/afiliado, tipo de oferta, vigencia, descuento contado, cuotas sin interés y topes por entidad;
- filtrado de medios de pago no aplicables;
- descuento manual controlado entre 5% y 15%;
- vista de stock por sucursal;
- armado de cotización/operación y resumen listo para enviar a Softland;
- evidencia imprimible y trazabilidad de la consulta/operación;
- backoffice mínimo para campañas, permisos y reglas principales.

**Principios de implementación**:

- mocks ricos desde el día 1, pero con contratos de dominio estables;
- diseño first-class, no decorativo, apoyado en el trabajo previo de mockups;
- flujos vendedor-first con gobierno claro de roles;
- evolución por adaptadores para que Softland sea una dependencia reemplazable;
- la ficha comercial es el epic central del release y condiciona catálogo, reglas, cotización, auditoría y permisos;
- fuerte separación entre MVP Fase 1 y roadmap Fase 2/3.

---

## 🏗️ Propuesta Técnica Futura

### Stack propuesto

- **Frontend**: React 19 + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui como base de primitives, extendido con design system propio del dominio POS
- **Estado cliente**: Zustand para estado de sesión, carrito/cotización, filtros y contexto operativo
- **Estado servidor/mock**: TanStack Query para catálogos, promociones, stock, auditoría y backoffice, incluso si inicialmente responden mocks
- **Mocking y contratos**: MSW o capa fake API equivalente con payloads tipados y escenarios determinísticos
- **Routing**: React Router con separación por áreas vendedor y administración
- **Documentación viva**: Storybook opcional pero recomendado si el primer release necesita acelerar consistencia visual y review funcional

### Arquitectura propuesta

- `app shell` con layout operativo desktop/tablet first
- `core` con router, theme, providers, auth mock, permissions, fake API, telemetry mock y utilidades de dominio común
- `features` separadas por bounded context: `catalog`, `promotions`, `quote-sheet`, `stock`, `negotiation-discounts`, `audit`, `admin-campaigns`, `admin-permissions`
- `adapters` para encapsular lectura de maestros y futura escritura hacia Softland
- `mocks` versionados con datasets semilla y escenarios de negocio reproducibles
- `design system` con tokens, componentes POS y patrones visuales basados en el set de mockups ya definido
- `domain mappers` para transformar la semántica del Excel actual en modelos de negocio legibles y testeables

### Criterios de calidad no funcional del demo

- navegación rápida y legible en desktop y tablet;
- targets táctiles amplios y jerarquía de CTA clara;
- tiempos de respuesta mock inmediatos o creíbles, con estados de carga diseñados;
- consistencia visual y de copy en todo el producto;
- posibilidad de recorrer el flujo completo sin depender de conectividad externa real.

---

## 🧱 Estructura Inicial Propuesta del Proyecto

**Crear**:

- `src/app/` - bootstrap, router, providers, layouts, guards por rol
- `src/core/` - modelos base, design tokens, fake API, servicios de sesión, permisos, utilidades y componentes compartidos
- `src/features/auth/`
- `src/features/dashboard/`
- `src/features/catalog/`
- `src/features/quote-sheet/`
- `src/features/stock/`
- `src/features/promotions/`
- `src/features/negotiation-discounts/`
- `src/features/audit/`
- `src/features/admin-campaigns/`
- `src/features/admin-permissions/`
- `src/mocks/data/` - usuarios, sucursales, familias, productos, imágenes, promociones, entidades financieras, reglas de cuota, stock, cotizaciones, auditoría
- `src/mocks/scenarios/` - producto en promoción, sin promoción, oferta vencida, sin stock, múltiples campañas, descuento bloqueado, etc.
- `src/adapters/softland/` - contratos y fake adapters
- `docs/` o `src/docs/` para decisiones de dominio si se decide mantener ADRs locales del futuro proyecto

**Modificar cuando exista el scaffold**:

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- configuración Tailwind/shadcn
- setup de mocks

**Eliminar**:

- no aplica para este primer plan; no hay base de runtime real previa.

---

## 🚀 Fases del Plan

### Fase 1: Bootstrap del workspace de desarrollo

- [ ] **Crear la base del proyecto frontend propuesta**
  - Inicializar el futuro proyecto con React, Vite y TypeScript.
  - Configurar aliases, linting, formatting y estructura feature-first.
  - Dejar desde el inicio entornos separados para app y mocking.
  - Verificar que el bootstrap no contradiga la realidad actual del repo documental; si se implementa luego, debe convivir sin borrar el material funcional existente.

- [ ] **Descubrir e instalar skills curados para diseño y desarrollo**
  - Ejecutar búsquedas con `npx skills find` para categorías como `design system`, `frontend ui`, `accessibility`, `react best practices`, `documentation` y `review`.
  - Evaluar cada skill por instalación, reputación del owner y calidad del repo fuente antes de instalar.
  - Priorizar fuentes confiables como `vercel-labs`, `anthropics` y `microsoft` cuando existan opciones equivalentes.
  - Instalar solo los skills seleccionados con `npx skills add ... -g -y` y documentar qué problema resuelve cada uno.
  - Registrar fallback si no hay un skill suficientemente confiable para una categoría.

- [ ] **Configurar la capa base de UI y documentación técnica**
  - Instalar Tailwind y primitives visuales base.
  - Configurar librería de componentes o Storybook si se decide usarlo.
  - Definir dónde vivirán los tokens de diseño, estados visuales, reglas de spacing y el inventario de componentes críticos.

### Fase 2: Descubrimiento profundo del dominio y dataset mockeado

- [ ] **Desarmar el Excel actual y convertirlo en conocimiento de dominio explícito**
  - Relevar de forma sistemática las hojas `Productos`, `Asesora Politicas`, `Politicas` y `convinaciones fina`.
  - Mapear sus columnas y celdas de negocio a conceptos del dominio, evitando reproducir nombres crípticos en la futura app salvo cuando sean necesarios para trazabilidad.
  - Documentar equivalencias como `Precio Vta P`, `Precio Oferta`, `Afil Desc`, `Desc Contado`, `Tipo Fciacion`, `CUOTAS.A`, `CUOTAS.N`, `CUOTAS.T`, `Cod Posnet`, `MP Softland`, `FechaInicio`, `FechaFin` y cadenas de combinaciones habilitadas.
  - Detectar reglas que hoy viven implícitas en el armado visual de la planilla o en matrices auxiliares para convertirlas en reglas testeables.

- [ ] **Traducir el Excel y las docs al modelo de dominio del MVP**
  - Mapear entidades: `User`, `Role`, `Branch`, `CustomerSegment`, `ProductFamily`, `Product`, `Offer`, `OfferRule`, `PaymentEntity`, `InstallmentRule`, `CashDiscountRule`, `NegotiationDiscountPolicy`, `StockSnapshot`, `Quote`, `QuoteLine`, `AuditEvent`.
  - Separar claramente datos visibles al vendedor, datos internos del negocio y datos de soporte para auditoría.
  - Explicitar reglas heredadas del Excel: afiliado/externo, descuento contado, cuotas por entidad, topes, vigencia, exclusiones y prioridad.
  - Identificar campos que deben ocultarse por rol o por contexto de pantalla.
  - Modelar explícitamente la diferencia entre dato base de producto, dato comercial calculado y dato operativo heredado de Softland o Posnet.

- [ ] **Diseñar el dataset semilla completo del demo**
  - Crear usuarios mock por rol con permisos diferenciados.
  - Crear sucursales mock, catálogos por familia, imágenes plausibles, entidades financieras, campañas, productos con y sin promoción, estados de stock y cotizaciones previas.
  - Incluir escenarios ricos: oferta activa, próxima a vencer, vencida, sin stock local, stock alternativo, medios no aplicables, campaña prioritaria, descuento negociado y bloqueo por permiso.
  - Sembrar datos con consistencia narrativa para que el demo parezca real, no sintético genérico.
  - Incluir productos inspirados en las familias y marcas reales del Excel de muestra para que el demo conserve verosimilitud comercial.

- [ ] **Definir contratos de fake API y adaptadores futuros**
  - Especificar endpoints o servicios mock para autenticación, catálogo, detalle comercial, stock, cotización, campañas y auditoría.
  - Diseñar las interfaces de lectura y escritura que luego reemplazarán a los mocks cuando aparezca Softland.
  - Asegurar que la UI nunca consuma estructuras acopladas a un JSON improvisado; siempre debe consumir contratos estables del dominio.
  - Separar el endpoint de `product detail` del endpoint de `commercial quote sheet`, porque la ficha no es solo detalle de producto sino una proyección comercial contextual.

### Fase 3: Diseño del producto y design system operativo

- [ ] **Consolidar la dirección visual a partir del trabajo de mockups existente**
  - Tomar [Docs/feature-nt-001-mockups-promociones/mockup.md](Docs/feature-nt-001-mockups-promociones/mockup.md) como baseline visual y convertirlo en reglas de producto reales.
  - Definir tipografías, paleta, radios, sombras, densidad, estados semánticos y patrones de layout para superficies POS.
  - Mantener una estética premium, sobria y comercial, cercana a retail/fintech, evitando aspecto genérico de dashboard.
  - Establecer lineamientos claros para desktop y tablet; móvil puede quedar como adaptación posterior no prioritaria del release.

- [ ] **Construir el inventario de componentes críticos del dominio**
  - Diseñar componentes base: shell, topbar, sidebar, breadcrumbs, buscador omnipresente, filters tray, cards de producto, badges de promoción, tablas de stock, timelines de auditoría.
  - Diseñar componentes de alto valor del negocio: panel de ficha comercial, tabla de medios aplicables, resumen de cotización, drawer/modal de descuento negociado, panel de stock por sucursal y evidencia imprimible.
  - Incorporar estados loading, empty, warning, locked y expired desde el inicio.
  - Diseñar además una vista de impresión o modo cliente para la ficha cuando se necesite ocultar datos internos sensibles.

- [ ] **Diseñar la arquitectura de información y journeys**
  - Journey vendedor: login -> cockpit -> búsqueda -> resultado -> ficha comercial -> cotización -> stock -> resumen -> evidencia.
  - Journey supervisor: revisión de descuentos y observación de auditoría.
  - Journey administrador comercial: campañas, reglas y permisos de descuentos.
  - Journey administrador IT: configuración mock de usuarios, flags y catálogos operativos.

### Fase 4: Implementación del shell y cimientos del frontend

- [ ] **Implementar autenticación mock, selección de rol y permisos de UI**
  - Crear login simulado con cambio rápido de rol para demos controladas.
  - Implementar guards y feature visibility por permisos.
  - Registrar eventos de acceso como parte del hilo de auditoría mock.

- [ ] **Implementar layout operativo y navegación principal**
  - Crear shell vendedor y shell administración con navegación consistente.
  - Incluir quick actions, breadcrumbs y acceso rápido a volver a una cotización abierta.
  - Diseñar persistencia de contexto operativo entre pantallas.

- [ ] **Preparar providers de estado, query y fake API**
  - Configurar TanStack Query, stores globales y servicios mock.
  - Modelar errores, latencias y success states creíbles del demo.
  - Dejar preparado un `feature flag` para alternar entre fake adapters y adapters futuros de integración.

### Fase 5: Catálogo completo y búsqueda tipo marketplace

- [ ] **Implementar catálogo con foco comercial y no administrativo**
  - Mostrar el 100% del catálogo, no solo promociones.
  - Permitir búsqueda por texto, SKU, familia y atajos comerciales.
  - Destacar promociones activas sin sesgar al vendedor a ignorar el resto del inventario.

- [ ] **Implementar filtros y resultados con narrativa de venta**
  - Filtrar por sucursal, tipo de cliente, familia, promoción activa y disponibilidad.
  - Diseñar resultados para lectura rápida: imagen, descripción, precio base, badges de oportunidad y CTA claros `Ver detalle` y `Cotizar`.
  - Resolver estados empty y resultados ambiguos sin romper el flujo.

### Fase 6: Ficha comercial crítica y motor de promociones aplicado

- [ ] **Implementar el motor de lectura comercial para la ficha**
  - Resolver el cruce entre producto/familia, medio de pago, cliente y sucursal.
  - Calcular y exponer solo reglas aplicables según contexto seleccionado.
  - Mantener trazabilidad de por qué una entidad aparece, desaparece o cambia su tope de cuotas.
  - Desacoplar reglas base de cuotas y entidades de la presentación final para poder cambiar la UI sin tocar el núcleo comercial.

- [ ] **Construir la ficha comercial central del MVP**
  - Mostrar precios diferenciados externo/afiliado cuando aplique, tipo de oferta, vigencia, descuento por pago contado y segmento/campaña.
  - Presentar la tabla de medios de pago con cuotas sin interés y tope por entidad, filtrando automáticamente los medios no aplicables.
  - Hacer explícito qué valores son aproximados, qué beneficios dependen de contexto y qué información queda oculta por política de negocio.
  - Convertir la complejidad del Excel actual en una UI clara, jerárquica y segura para el vendedor.
  - Resolver una zona superior de contexto comercial inspirada en la ficha actual: identificador SKU, descripción, vigencia, segmento/oferta y bloques diferenciados para cliente externo y afiliado.
  - Resolver una grilla o tabla de financiación donde cada fila represente entidad/medio y cada columna comunique tope de cuotas, importe estimado, condiciones especiales y restricciones.
  - Incluir un bloque de observaciones operativas y comerciales equivalente al comentario actual del Excel, pero gobernado por reglas o textos configurables.
  - Diseñar un switch o modo de visibilidad para ocultar datos sensibles según rol o según necesidad de mostrar una versión simplificada al cliente.

- [ ] **Modelar estados complejos de la ficha**
  - Oferta activa.
  - Oferta próxima a vencer.
  - Oferta vencida.
  - Producto sin promoción.
  - Medios no compatibles.
  - Producto con más de una regla potencial y prioridad resuelta.
  - Producto con beneficio afiliado adicional.
  - Producto con descuento contado acumulable o bloqueado.
  - Producto con notas especiales de financiación o excepción por entidad.

- [ ] **Implementar descuento de negociación controlado**
  - Permitir aplicar un descuento de entre 5% y 15% cuando el rol y la política central lo habiliten.
  - Mostrar el impacto sobre el precio final y dejar registro del motivo/actor cuando se utilice.
  - Bloquear visual y funcionalmente el flujo cuando el rol no tenga permiso o el rango no aplique.
  - Recalcular la ficha y el resumen de cotización preservando distinción entre descuento promocional, descuento contado y descuento de negociación.

### Fase 7: Stock por sucursal y armado de cotización

- [ ] **Implementar la visualización de stock por sucursal**
  - Mostrar disponibilidad por local con códigos visuales claros.
  - Resolver estados de sin stock local y disponibilidad en otra sucursal.
  - Integrar la consulta de stock dentro de la ficha y de la cotización, sin hacer navegar al usuario a un subsistema aislado.

- [ ] **Implementar el constructor de cotización/operación**
  - Permitir agregar producto, promoción aplicada, descuento negociado y medio de pago elegido.
  - Recalcular resumen comercial en tiempo real con datos mockeados coherentes.
  - Mantener foco en venta asistida, no en simular una caja completa en esta fase.
  - Permitir iniciar la cotización desde `Cotizar` o desde `Armar ficha`, compartiendo el mismo motor comercial y variando solo la intención del flujo.

- [ ] **Preparar el resumen final listo para Softland**
  - Generar una representación clara de la operación prearmada.
  - Incluir payload mock de envío a Softland mediante adapter fake.
  - Dejar visible la reserva conceptual de stock de 24 hs como estado futuro/esperado del ERP.

### Fase 8: Auditoría, respaldo e imprimibles

- [ ] **Implementar trazabilidad de consultas y acciones**
  - Registrar búsqueda, apertura de ficha, aplicación de descuento, armado de cotización y cierre de operación mock.
  - Permitir lectura operativa del historial por rol, sucursal y usuario.

- [ ] **Implementar evidencia comercial imprimible o exportable**
  - Generar una ficha o resumen de condiciones entendible para adjuntar al legajo comercial.
  - Asegurar correspondencia entre lo mostrado en la ficha y lo guardado en auditoría.
  - Evitar depender de capturas manuales como en el proceso actual.

### Fase 9: Backoffice mínimo del motor de promociones

- [ ] **Implementar gestión mock de campañas y reglas**
  - Permitir crear/editar campañas combinando producto/familia, cliente, medio de pago y sucursal.
  - Modelar prioridad, vigencia y exclusiones principales.
  - Hacer visible qué reglas afectan la ficha comercial y cómo impactan la simulación.
  - Incorporar edición de observaciones comerciales y textos operativos que luego se reflejen en la ficha y la evidencia imprimible.

- [ ] **Implementar administración mock de permisos y descuentos**
  - Configurar qué roles pueden negociar, aprobar o solo visualizar.
  - Permitir precargar rangos de descuento y restricciones por segmento o campaña.

### Fase 10: Validación funcional, demo readiness y handoff

- [ ] **Cubrir validaciones críticas del release**
  - Validar manualmente el motor de promociones y descuento negociado con escenarios controlados del dataset mock.
  - Verificar la ficha comercial, la tabla de medios y el resumen de cotización contra el Excel y la captura actual.
  - Recorrer el journey vendedor principal y un journey de supervisor con checklist funcional.
  - Confirmar casos borde: oferta vencida, sin stock, entidad no aplicable, rol bloqueado, datos incompletos.

- [ ] **Ejecutar revisión visual y funcional final**
  - Revisar consistencia contra el set de mockups existente.
  - Validar legibilidad, jerarquía y tiempos del flujo principal.
  - Confirmar que la ficha comercial realmente sustituye y mejora el patrón del Excel actual.

- [ ] **Preparar paquete de demo y roadmap**
  - Documentar qué parte del flujo es real mockeado y qué queda como integración futura.
  - Dejar explícita la transición hacia Fase 2: ARCA, crédito, reserva real y BI.
  - Preparar guion demo para negocio, producto y desarrollo.

---

## 🗂️ Datos Mockeados Requeridos

- [ ] **Usuarios y roles**
  - vendedor senior, vendedor junior, supervisor, administrador comercial, administrador IT
- [ ] **Sucursales**
  - al menos 4 a 6 sucursales con disponibilidad desigual
- [ ] **Catálogo**
  - familias variadas, productos en promoción y fuera de promoción, imágenes creíbles, SKU realistas
- [ ] **Promociones**
  - campañas por producto y por familia, afiliado/externo, contado, entidades financieras, prioridades y vigencias cruzadas
- [ ] **Entidades y medios de pago**
  - bancos, tarjetas, convenios, crédito personal y medios que deben filtrarse según contexto
- [ ] **Matrices y reglas financieras**
  - topes de cuotas por entidad, equivalencias entre tipos de financiación, combinaciones habilitadas y condiciones especiales derivadas del Excel real
- [ ] **Cotizaciones y auditoría**
  - historial de consultas, evidencias imprimibles, descuentos negociados y operaciones listas para enviar
- [ ] **Stock**
  - snapshot por sucursal con estados normal, bajo, agotado y alternativo

---

## ⚠️ Riesgos y Mitigaciones

- **Ambigüedad futura de integración con Softland**
  - Mitigación: contratos/adapters desde el inicio; fake API con payloads equivalentes a integración futura.
- **Crecimiento del alcance por intentar incorporar Fase 2 en el MVP**
  - Mitigación: congelar el primer release en Fase 1 y tratar Fase 2/3 como roadmap explícito.
- **Subestimar la complejidad de la ficha comercial**
  - Mitigación: construir la ficha como epic separada y validarla con prioridad máxima.
- **Perder reglas implícitas del Excel durante la traducción al dominio**
  - Mitigación: relevar hojas y matrices primero; validar reglas con escenarios controlados antes de cerrar la UI.
- **Dataset mock poco creíble**
  - Mitigación: diseñar semilla basada en escenarios comerciales reales y no en lorem ipsum.
- **Instalación indiscriminada de skills**
  - Mitigación: curación previa por reputación, installs y trazabilidad de la decisión.

---

## 📚 Referencias

**Features similares / insumos funcionales**:

- Docs/Investigacion POS.md - benchmark UX, patrones POS y referentes de mercado.
- Docs/Catalogo Ofertas 2026 06 - para desarrolladores.xlsx - fuente operativa de campos, hojas, matrices y ejemplos reales para la ficha comercial.
- Docs/Previsora del Parana - Reemplazo Excel Promociones.docx - fuente funcional central del MVP y de la ficha comercial actual.
- Docs/Previsora del Parana - Roadmap motor de promociones.html - secuencia por fases y límites del MVP.
- .github/documentation/demo-pos-overview.md - síntesis del alcance y reglas del repositorio.
- Docs/feature-nt-001-mockups-promociones/mockup.md - baseline visual ya elaborado para el set high-fidelity.

**Documentación consultada**:

- .github/instructions/architecture.instructions.md
- .github/instructions/tech-stack.instructions.md
- .github/documentation/frontend.md
- .github/documentation/backend.md
- .github/documentation/database.md

**Context7 usado**: No aplica en esta etapa porque todavía no se está implementando ni consultando APIs específicas de librerías.

---

## 🎯 Opciones de Ejecución

1. **Paso a paso**: bootstrap -> dominio mock -> design system -> catálogo -> ficha comercial -> cotización -> auditoría.
2. **Por bloques funcionales**: plataforma base, experiencia vendedor, backoffice, QA.
3. **Por riesgo**: arrancar por la ficha comercial y el motor de promociones, luego completar alrededor.
