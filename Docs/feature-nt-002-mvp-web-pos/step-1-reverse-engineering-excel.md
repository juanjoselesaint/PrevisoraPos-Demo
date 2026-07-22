# Paso 1 - Reverse engineering del Excel y documentación del dominio

Fecha: 2026-07-21  
Fuente principal: Docs/Catalogo Ofertas 2026 06 - para desarrolladores.xlsx  
Fuentes de apoyo: Docs/Previsora del Parana - Reemplazo Excel Promociones.docx, Docs/feature-nt-002-mvp-web-pos/base-context.md

---

## 1) Relevamiento de hojas objetivo

Se relevaron las cuatro hojas definidas en la secuencia de implementación:

1. Productos
2. Asesora Politicas
3. Politicas
4. convinaciones fina

### Rol funcional de cada hoja

- Productos: catálogo maestro de ítems promocionados con precios, descuentos, financiación, códigos operativos y vigencia.
- Asesora Politicas: pantalla operativa de consulta (ficha comercial) construida con referencias al catálogo y tablas de reglas.
- Politicas: reglas por segmento de cliente (afiliado vs consumidor final) y por publicación/tipo de oferta.
- convinaciones fina: matriz de topes/compatibilidades por tipo de financiación y entidad/medio de pago.

---

## 2) Mapa de columnas reales a conceptos de dominio

## 2.1 Hoja Productos (cabecera detectada)

| Columna Excel        | Concepto de dominio propuesto                | Tipo de dato        | Categoría            |
| -------------------- | -------------------------------------------- | ------------------- | -------------------- |
| SKU                  | Product.sku                                  | string              | Base producto        |
| Articulo             | Product.description                          | string              | Base producto        |
| Marca                | Product.brand                                | string              | Base producto        |
| Rubro                | Product.familyOrCategory (pendiente saneo)   | string              | Base producto        |
| Precio Vta P         | Price.basePrice                              | number              | Comercial calculable |
| Ahorro               | Offer.grossReferenceAmount                   | number              | Comercial calculable |
| Precio Oferta        | Offer.offerPrice                             | number              | Comercial calculable |
| En Catalogo          | Campaign.segmentOrLabel                      | string              | Comercial calculable |
| Afil Desc            | Offer.affiliateExtraDiscountPercent          | number (0..1)       | Comercial calculable |
| Desc Contado         | Offer.cashDiscountPercent                    | number (0..1)       | Comercial calculable |
| Tipo Fciación        | Financing.basePlanType                       | string              | Comercial calculable |
| Cuotas:              | Financing.baseInstallments                   | number              | Comercial calculable |
| CUOTAS.A             | Financing.bank.installmentsLabel             | string              | Comercial calculable |
| Importe Cuota A      | Financing.bank.estimatedInstallmentAmount    | number              | Comercial calculable |
| CFT / PTF            | Financing.bank.costFields                    | number              | Operativo heredado   |
| Tasa Naranja         | Financing.naranja.planType                   | string              | Comercial calculable |
| CUOTAS.N             | Financing.naranja.installments               | number              | Comercial calculable |
| Importe Cuota N      | Financing.naranja.estimatedInstallmentAmount | number              | Comercial calculable |
| CUOTAS.T             | Financing.tuya.installments                  | number              | Comercial calculable |
| Importe Cuota T      | Financing.tuya.estimatedInstallmentAmount    | number              | Comercial calculable |
| CFT_1 / PTF_1        | Financing.tuyaOrAlt.costFields               | number              | Operativo heredado   |
| Cod Art              | Product.erpCode                              | string              | Operativo heredado   |
| Venta Tarjeta Cuotas | Financing.operationalQuotaCode               | string/number       | Operativo heredado   |
| Cod Posnet           | PaymentIntegration.posnetCode                | string/number       | Operativo heredado   |
| MP Softland          | PaymentIntegration.softlandPaymentMapping    | string              | Operativo heredado   |
| FechaInicio          | Offer.validFrom                              | date (excel serial) | Comercial calculable |
| FechaFin             | Offer.validTo                                | date (excel serial) | Comercial calculable |
| ST                   | Offer.allowedCombinationsExpression          | string              | Comercial calculable |
| Para Web             | Offer.webInstallmentHint                     | string/number       | Operativo heredado   |

Notas de relevamiento:

- En la fila de ejemplo relevada (SKU 1002631), Rubro aparece vacío o con desalineación histórica de carga (dato a sanear en migración).
- FechaInicio/FechaFin vienen en serial Excel. Ejemplo relevado: 46170 -> 2026-05-28 y 46203 -> 2026-06-30.
- ST contiene un string de combinaciones (ejemplo: 12Sin IntBancarias+12Sin IntNaranja+9Tuya) que hoy encapsula reglas multi-entidad en un único campo.

## 2.2 Hoja Politicas

| Columna lógica                 | Concepto de dominio propuesto      | Observación                                                    |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------- |
| AFILIADOS / CONSUMIDOR FINAL   | CustomerSegment.type               | Segmentación comercial principal                               |
| Catálogo Noviembre             | Campaign.publicationContext        | Contexto de publicación                                        |
| tipo de oferta                 | Offer.offerType                    | En algunas filas aparece con fórmula/objeto no legible directo |
| publicación                    | Offer.publicationInstallmentBand   | Ejemplos: 3 sin interés, 6 a 12 sin interés                    |
| Medio Pago                     | Offer.allowedPaymentFamilies       | Lista textual de familias de medios                            |
| ES precio oferta?              | Offer.appliesOfferPrice            | Flag SI/NO                                                     |
| Es tasa peque?                 | Offer.appliesPequeRate             | Flag SI/NO                                                     |
| Es sin interes?                | Offer.isInterestFree               | Flag SI/NO                                                     |
| Adicional AFILIADOS 5% revista | Offer.affiliateExtraFlag           | Flag SI/NO                                                     |
| + Tiempo, + Beneficio          | Offer.extraBenefitFlag             | Flag SI/NO                                                     |
| Adicional % contado            | Offer.additionalCashDiscountPolicy | Flag/nota                                                      |

Notas de relevamiento:

- La hoja contiene bloques separados para AFILIADOS y CONSUMIDOR FINAL.
- La vigencia general también aparece en serial Excel (45608 -> 2024-11-12; 45623 -> 2024-11-27).

## 2.3 Hoja convinaciones fina

| Columna                          | Concepto de dominio propuesto                  |
| -------------------------------- | ---------------------------------------------- |
| Tipo Cuota Simple                | FinancingCombination.simplePlanType            |
| Naranja                          | FinancingCombination.naranjaPlanType           |
| Peque                            | FinancingCombination.pequeRule                 |
| Medio Cuota Simple               | FinancingCombination.simpleQuotaCap            |
| Medio pago Naranja               | FinancingCombination.naranjaQuotaCap           |
| Medio Pago TUYA                  | FinancingCombination.tuyaQuotaCap              |
| Medio Pago Sidecreer             | FinancingCombination.sidecreerQuotaCap         |
| Medio Pago Consumax              | FinancingCombination.consumaxQuotaCap          |
| Medio Pago Directo CP            | FinancingCombination.directCPQuotaRule         |
| Contado                          | FinancingCombination.cashDiscountPercentOrFlag |
| Bco Nación, BBVA, Galicia, Macro | FinancingCombination.selectedBanksQuotaCap     |

Notas de relevamiento:

- Esta hoja define topes por medio según el tipo de financiación base (por ejemplo Sin Int 3, Sin Int 6, Sin Int 18, Peque 12).
- Incluye excepciones textuales (por ejemplo NO Tiene habilitado, Plan Max, hasta X cuotas con interés) que deben normalizarse.

## 2.4 Hoja Asesora Politicas

| Zona observada                                                 | Concepto de dominio propuesto            |
| -------------------------------------------------------------- | ---------------------------------------- |
| SKU ingresado + ubicación de referencia                        | CommercialQuoteSheet.inputProductRef     |
| Cliente Externo / Afiliados                                    | CommercialQuoteSheet.segmentPrices       |
| Tipo de Oferta / Publicado en / Cuotas sin interés hasta       | CommercialQuoteSheet.offerSummary        |
| Vigente hasta / Segmento                                       | CommercialQuoteSheet.validityAndCampaign |
| Tiene Descuento por Pago Contado                               | CommercialQuoteSheet.cashDiscountBlock   |
| Filas por entidad (ej. Bersa, Nación, BBVA, etc.) con importes | CommercialQuoteSheet.financialRows       |

Notas de relevamiento:

- Esta hoja es la traducción final que ve el vendedor y que hoy se imprime para auditoría.
- Se detecta texto operativo y de guidance embebido en celdas (no estructurado).

---

## 3) Separación por naturaleza de dato

## 3.1 Datos base de producto

- SKU, Articulo, Marca, Rubro/Categoría, Cod Art.

## 3.2 Datos comerciales calculados

- Precio Vta P, Precio Oferta, Ahorro.
- Segmento/campaña/publicación.
- Tipo financiación y cuotas base.
- Descuentos: afiliado y contado.
- Topes de cuotas por entidad y medios aplicables.
- Vigencia de la oferta.

## 3.3 Datos operativos heredados

- Cod Posnet.
- MP Softland.
- Venta Tarjeta Cuotas.
- CFT/PTF y campos duplicados (\_, \_\_, CFT_1, PTF_1) cuando se usen como soporte interno.
- Texto libre de observaciones y expresiones compactas como ST (hasta modelarlas).

---

## 4) Reglas implícitas, excepciones y combinaciones detectadas

1. Segmentación obligatoria por tipo de cliente: reglas separadas para AFILIADOS y CONSUMIDOR FINAL.
2. Aplicabilidad de precio oferta condicionada por política: no toda combinación usa precio oferta aun cuando exista.
3. Descuento afiliado adicional: se habilita por reglas y no en todos los casos.
4. Descuento contado adicional: depende del bloque de política y de combinaciones financieras.
5. Topes de cuotas por entidad dependen del tipo de financiación base (Sin Int X, Peque X, etc.).
6. Existen medios explícitamente no habilitados según combinación (NO Tiene habilitado).
7. Vigencia bloqueante: si FechaFin expira, la oferta no debería exponerse para operar.
8. ST condensa múltiples condiciones en una cadena no normalizada; requiere parser/mapeo previo a motor comercial.
9. Se detectan celdas con fórmula/objeto no legible directo en extracción cruda (por ejemplo System.Xml.XmlElement en tipo de oferta), lo que obliga saneo de datos antes del uso productivo.

---

## 5) Inventario formal de campos para la ficha comercial

## 5.1 Encabezado comercial (obligatorio)

- SKU
- Descripción
- Marca
- Tipo de oferta
- Segmento/campaña/publicación
- Vigencia desde/hasta

## 5.2 Bloque de precios (obligatorio)

- Precio cliente externo
- Precio afiliado
- Precio oferta aplicado
- Ahorro nominal/porcentual

## 5.3 Bloque de descuentos (obligatorio)

- Descuento afiliado adicional (si aplica)
- Descuento contado y precio resultante
- Indicador de acumulabilidad o exclusión

## 5.4 Bloque financiero (obligatorio)

- Medios de pago habilitados
- Tope de cuotas por entidad/medio
- Importe estimado por cuota por entidad
- Condición de interés (sin interés / con interés)

## 5.5 Bloque operativo/comercial de soporte

- Observaciones y notas operativas
- Reglas especiales por entidad
- Referencia a combinación utilizada (traza de regla)

## 5.6 Campos internos de trazabilidad (no visibles al cliente)

- Cod Art
- Cod Posnet
- MP Softland
- Venta Tarjeta Cuotas
- Expresión ST original
- Identificador de regla/política aplicada

---

## 6) Lista de datos sensibles a ocultar por rol

### Ocultar para vista cliente (si se comparte pantalla o impresión simplificada)

- CFT/PTF y campos de costo financiero interno.
- Cod Posnet, MP Softland, Cod Art y códigos operativos.
- Expresiones técnicas internas (ST, ids de regla, mapping de medios).
- Notas operativas internas no comerciales.

### Visibilidad sugerida por rol

- Vendedor: puede ver precios, descuentos aplicables, cuotas y topes; no necesita ver códigos internos.
- Supervisor/Gerente: suma visibilidad de trazabilidad de regla aplicada y razones de bloqueo.
- Administrador comercial: acceso a reglas, prioridades, vigencias, acumulabilidad y textos operativos.
- Administrador IT: acceso completo a mappings técnicos (Softland/Posnet) y diagnóstico.

---

## 7) Validación del paso (obligatoria)

### 7.1 La ficha actual se explica con modelos claros

Sí. La hoja Asesora Politicas puede explicarse como una proyección de un modelo CommercialQuoteSheet compuesto por:

- Product base (SKU, descripción, marca)
- Offer context (segmento, tipo de oferta, vigencia)
- Price block (externo/afiliado/oferta)
- Discount block (afiliado/contado)
- Financing block (medios, cuotas, importes, topes)
- Operational notes and audit trace

### 7.2 Origen de cada dato crítico visible al vendedor

| Dato crítico visible            | Origen primario                                             | Regla/transformación                             |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| SKU, descripción, marca         | Productos                                                   | Lectura directa por fila SKU                     |
| Precio oferta y descuentos base | Productos                                                   | Lectura directa + flags de política              |
| Tipo de oferta / publicación    | Politicas                                                   | Resolución por segmento y contexto               |
| Vigencia                        | Productos.FechaInicio/FechaFin + Politicas vigencia global  | Conversión de serial Excel y validación de fecha |
| Cuotas y medios habilitados     | Productos + convinaciones fina + Politicas                  | Intersección de plan base con matriz por entidad |
| Importe cuota por entidad       | Productos (campos cuota) + Asesora Politicas (presentación) | Cálculo/lectura según regla aplicable            |
| Descuento contado final         | Productos.Desc Contado + Politicas/Combinaciones            | Aplicación condicionada por segmento y medio     |
| Observaciones comerciales       | Asesora Politicas                                           | Texto operativo y de soporte                     |

Resultado: se cumple la validación obligatoria del Paso 1 y queda base explícita para avanzar a modelado de dominio y contratos tipados.
