# Memoria de Ejecución: MVP Web POS para Promociones y Venta Asistida

**Última actualización**: 2026-07-21 | **Plan**: Docs/feature-nt-002-mvp-web-pos/development-plan.md

## 💡 Decisiones Tomadas

- Primer release enfocado en Fase 1 del MVP documental.
- Stack propuesto futuro: React + Vite + TypeScript + Tailwind + shadcn/ui + Zustand + TanStack Query.
- Integracion con Softland diferida: primero mocks con contratos y adaptadores.
- Estrategia inicial de stock para el demo: snapshot mockeado por sucursal.
- La ficha comercial pasa a tratarse como epic central del release, no como pantalla secundaria.
- El Excel cargado y la captura de la ficha actual se toman como fuente de descubrimiento de reglas reales del dominio.
- El testing automatizado queda fuera del alcance actual; por ahora solo se exige validacion funcional/manual.

## 🔄 Cambios Durante Ejecución

- Se incorporo la carpeta tecnica Docs/feature-nt-002-mvp-web-pos como ancla del plan MVP web.
- Se refino el plan para absorber la semantica del Excel actual: hojas Productos, Asesora Politicas, Politicas y convinaciones fina.
- Se reforzo el modelado de la ficha comercial con precios afiliado/externo, descuento contado, cuotas por entidad, filtrado de medios, descuento negociado y notas operativas.
- Se removio la obligatoriedad de Vitest, Testing Library y Playwright del plan y del handoff actual.

## ⚠️ Consideraciones Importantes

- El repo sigue siendo documental; todo stack e implementacion del plan son propuestas futuras, no estado actual.
- La complejidad real del dominio no esta solo en el catalogo sino en la combinatoria de reglas financieras y comerciales heredadas del Excel.
- La traduccion de columnas y matrices del Excel a modelos de dominio claros y testeables es un riesgo principal del proyecto.

## 🔗 Referencias Adicionales

- Docs/Catalogo Ofertas 2026 06 - para desarrolladores.xlsx
- Docs/Previsora del Parana - Reemplazo Excel Promociones.docx
- Docs/Previsora del Parana - Roadmap motor de promociones.html
