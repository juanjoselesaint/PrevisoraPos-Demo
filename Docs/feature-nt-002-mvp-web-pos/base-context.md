# Contexto de Desarrollo: MVP Web POS para Promociones y Venta Asistida

**Generado**: 2026-07-21 | **Ticket**: NT-002 | **Tipo**: Feature | **Partes**: Frontend, Backend, Database, Docs

---

## 📋 Información Original

**Fuente**: Texto del usuario + captura de la ficha actual compartida en la conversacion + Docs/Catalogo Ofertas 2026 06 - para desarrolladores.xlsx + Docs/Investigacion POS.md + Docs/Previsora del Parana - Reemplazo Excel Promociones.docx + Docs/Previsora del Parana - Roadmap motor de promociones.html + .github/documentation/demo-pos-overview.md + Docs/feature-nt-001-mockups-promociones/

**Descripción Original**: Armar un plan completo y detallado para desarrollar una aplicación web que cumpla con el MVP definido. El plan debe contemplar el diseño integral, iniciar con todos los datos mockeados (usuarios, imágenes, productos, cotizaciones, promociones, stock, etc.), auto encargarse de buscar e instalar skills que mejoren diseño y desarrollo, y apoyarse en mejores prácticas y referencias de los POS líderes del mercado. El usuario confirmó tomar como base un primer release centrado en la Fase 1 del MVP, con stack web propuesto moderno, integración inicial mockeada contra Softland mediante contratos/adaptadores y una estrategia de stock inicial simulada. Aclaró además que la ficha comercial posterior a buscar un producto y hacer clic en cotizar o armar ficha es una pieza crítica del MVP: debe mostrar precios diferenciados externo/afiliado, tipo de oferta, descuento por pago contado, medios de pago con cuotas sin interés y tope por entidad, filtrando los medios que no aplican, y permitir descuento de negociación del 5% al 15% cuando el rol lo habilite. Como referencia adicional, cargó el Excel real de ejemplo y una captura de la ficha vigente para que el reemplazo preserve la riqueza funcional actual sin trasladar su complejidad visual.

**Criterios de Aceptación**:

- [ ] El plan cubre el primer release de la Fase 1 del MVP documental.
- [ ] El plan define una propuesta técnica explícita, marcada como futura, para una app web moderna.
- [ ] El plan incluye diseño UX/UI completo y system design de componentes.
- [ ] El plan contempla un arranque íntegramente mockeado, con datos, imágenes, usuarios, promociones, cotizaciones, stock y auditoría simulados.
- [ ] El plan trata la ficha comercial/cotización como flujo crítico y central del MVP.
- [ ] El plan toma el Excel vigente como fuente de descubrimiento de reglas, columnas y combinaciones comerciales reales.
- [ ] El plan incluye estrategia para buscar, evaluar e instalar skills de apoyo a diseño y desarrollo.
- [ ] El plan diferencia claramente alcance MVP vs roadmap posterior (Fase 2 y Fase 3).

---

## 🎯 Objetivo de Negocio

Definir un plan técnico integral para construir una aplicación web de venta asistida que reemplace el Excel de promociones y su lógica de consulta actual, reduzca errores operativos, mejore la velocidad comercial y prepare el terreno para evolucionar luego a un punto de venta transaccional completo.

El primer release debe resolver con credibilidad el problema operativo real de Previsora del Parana: permitir que el vendedor encuentre cualquier producto del catálogo, consulte una ficha comercial confiable con reglas de promoción y financiación aplicables, visualice stock por sucursal, arme una operación con descuento controlado y deje respaldo auditable, todo ello sin depender del Excel actual.

---

## 📝 Descripción Detallada

**Qué se quiere hacer**: Crear un plan de desarrollo detallado para una futura aplicación web del MVP Fase 1, tomando como base el contexto funcional ya documentado y el trabajo previo de mockups high-fidelity. El plan debe definir el camino para pasar de un workspace documental a un producto demo web ejecutable, sin asumir que hoy esa aplicación ya existe.

**Alcance (IN/OUT)**:

- ✅ Incluido: propuesta de stack técnico futura para el MVP; diseño integral de experiencia vendedor/backoffice; design system y arquitectura de información; estrategia de datos mockeados; modelo de dominio del motor de promociones; catálogo completo con promociones destacadas; ficha comercial crítica con precios externo/afiliado, vigencia, descuento contado, cuotas sin interés y topes por entidad; descuento manual entre 5% y 15% por permisos; cotización/armado de operación; stock por sucursal; trazabilidad y auditoría; backoffice mínimo de campañas; bootstrap de skills para mejorar diseño y desarrollo; criterios de calidad y validación funcional; plan de evolución posterior.
- ✅ Incluido: reverse engineering funcional del Excel actual para convertir sus hojas Productos, Asesora Politicas, Politicas y convinaciones fina en reglas explícitas, datasets semilla y contratos de dominio para la futura app.
- ✅ Incluido: uso de referencias de mercado como Square, Shopify POS, Toast, Loyverse y Fudo para patrones de UX, rapidez transaccional, jerarquía visual y diseño operativo.
- ✅ Incluido: contratos y adaptadores para futuras integraciones con Softland, sin exigir integración real en el primer tramo.
- ❌ NO incluido: integración real obligatoria con Softland en el primer release; facturación directa; ARCA; validación de crédito en línea; reserva real de stock; BI con Visionaris; despliegue productivo; hardening de seguridad de producción; migración final de datos históricos del Excel.

---

## 🔗 Relaciones y Dependencias

**Tickets Relacionados**: No tracked

**Integraciones Externas**:

- Softland como fuente maestra futura para productos, familias, listas base, stock y recepción eventual de la operación prearmada.
- Ecosistema de skills vía `npx skills` para reforzar diseño, frontend, accesibilidad y documentación.
- Recursos visuales mockeados e imágenes placeholder curadas para el catálogo demo.
- Excel actual de promociones como fuente primaria de descubrimiento para columnas, nomenclaturas, topes de cuotas, descuentos y combinaciones comerciales hoy operativas.

**Artefactos locales relacionados**:

- Docs/Investigacion POS.md
- Docs/Catalogo Ofertas 2026 06 - para desarrolladores.xlsx
- Docs/Previsora del Parana - Reemplazo Excel Promociones.docx
- Docs/Previsora del Parana - Roadmap motor de promociones.html
- .github/documentation/demo-pos-overview.md
- Docs/feature-nt-001-mockups-promociones/base-context.md
- Docs/feature-nt-001-mockups-promociones/development-plan.md
- Docs/feature-nt-001-mockups-promociones/mockup.md

---

## 📝 Notas Adicionales

- La carpeta de mockups existente debe usarse como insumo visual, no como reemplazo del plan técnico de implementación.
- El stack propuesto para el plan es una SPA moderna con React, Vite, TypeScript, Tailwind, shadcn/ui, Zustand y TanStack Query. Esta definición es una propuesta futura para la implementación; no describe estado real del repo.
- El sistema debe arrancar con datos mockeados pero con contratos reales de dominio, para que reemplazar mocks por integración futura no implique rediseñar la aplicación.
- La ficha comercial debe preservar la riqueza funcional del Excel actual pero con mejor jerarquía, filtrado y legibilidad, ocultando información que no deba exponerse al vendedor o al cliente según rol.
- La simulación debe incluir al menos roles Vendedor, Supervisor/Gerente, Administrador comercial y Administrador IT.
- La estrategia de skills debe ser proactiva y curada: descubrir, evaluar calidad, instalar desde fuentes confiables y registrar decisión de adopción.
- El Excel cargado aporta al menos cuatro superficies de descubrimiento que el plan debe absorber: catálogo de productos/promociones, ficha comercial de consulta, tablas de políticas y matriz de combinaciones financieras.
- La futura ficha comercial debe mejorar drásticamente la legibilidad del Excel actual sin perder estos campos críticos: segmento/campaña, vigencia, precio oferta, precio afiliado, descuento contado, medios habilitados, cuotas por entidad, importes estimados y notas operativas/comerciales.
- Debe contemplarse una vista segura para vendedor y, si se requiere en el flujo, una variante resumida o imprimible sin datos internos sensibles.

---

## 🚦 Siguiente Paso

✨ **Contexto cargado exitosamente**

Usa .github/prompts/dev.create-development-plan.prompt.md
Contexto: Docs/feature-nt-002-mvp-web-pos/base-context.md
