# Demo POS - Sintesis de Producto

## Vision

Previsora del Parana necesita evolucionar desde un manejo manual de promociones en Excel hacia una experiencia de venta mas consistente, auditable y preparada para convertirse en un punto de venta inteligente.

Este repositorio resume y organiza ese camino para que futuras sesiones con IA no tengan que reconstruir el contexto desde cero.

## Problema actual

El esquema actual depende de planillas para definir promociones y asistir la venta. Eso genera friccion operativa, riesgo de errores, mantenimiento manual y dificultad para auditar la aplicacion real de las ofertas.

Tambien limita la visibilidad sobre informacion que el proceso comercial necesita durante la venta, por ejemplo:

- vigencia real de promociones,
- combinaciones por producto, medio de pago, cliente y sucursal,
- stock disponible por sucursal,
- consistencia entre la oferta ofrecida y la operacion que finalmente se cursa.

## Propuesta de solucion

La propuesta es avanzar por fases hacia una plataforma que concentre:

- motor de promociones configurable,
- consulta de catalogo y ofertas,
- apoyo al proceso de cotizacion y venta,
- evolucion posterior a capacidades de punto de venta mas amplias.

El foco inmediato no es construir todo el sistema final, sino ordenar un demo creible que muestre el valor del reemplazo del Excel.

## Alcance del MVP

Segun el roadmap actual, el MVP se centra en el reemplazo del Excel de promociones. Los elementos funcionales mas relevantes son:

- motor de promociones con reglas por producto o familia, medio de pago, tipo de cliente y sucursal,
- vigencia automatica de ofertas,
- busqueda de catalogo orientada a venta,
- ficha de oferta con precios y condiciones visibles,
- visualizacion de stock por sucursal,
- preparacion de la operacion para ser enviada luego al sistema final correspondiente.

En esta etapa, la facturacion final puede seguir ocurriendo fuera del demo. El objetivo es eliminar la dependencia del Excel en la construccion de la oferta y en la asistencia al vendedor.

## Fuentes del contexto

- `Docs/Investigacion POS.md`: aporta patrones de UX, referencias de mercado y pantallas sugeridas para mockups.
- `Docs/Previsora del Parana - Reemplazo Excel Promociones.docx`: insumo funcional del proceso actual.
- `Docs/Previsora del Parana - Roadmap motor de promociones.html`: ordena la evolucion por fases y dependencias.

## Fases siguientes

Despues del MVP documental, la evolucion esperada del proyecto es:

1. definir mockups del flujo principal,
2. validar alcance del demo funcional,
3. decidir stack tecnico e integraciones,
4. planificar e implementar una primera version ejecutable.

## Reglas para futuras sesiones con IA

- No asumir que ya existe backend, frontend o base de datos.
- Diferenciar lo que ya esta confirmado en fuentes funcionales de lo que todavia es una propuesta.
- Usar este documento como puente rapido antes de pasar a los artefactos fuente completos.
