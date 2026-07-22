import type {
  CommercialQuoteSheet,
  CustomerSegment,
  FinancialRow,
  Product,
  ProductDetail,
  PromotionRule,
} from '@core/domain/models'

export interface ExcelProductRow {
  SKU: string
  Articulo: string
  Marca: string
  Rubro?: string
  'Precio Vta P': number
  'Precio Oferta': number
  Ahorro?: number
  'En Catalogo': string
  'Afil Desc'?: number
  'Desc Contado'?: number
  'Tipo Fciación': string
  'CUOTAS.A'?: string
  'Importe Cuota A'?: number
  'CUOTAS.N'?: number
  'Importe Cuota N'?: number
  'CUOTAS.T'?: number
  'Importe Cuota T'?: number
  'Cod Art': string
  'Cod Posnet': string
  'MP Softland': string
  'Venta Tarjeta Cuotas': string
  FechaInicio: number
  FechaFin: number
  ST?: string
}

export interface ExcelPoliticaRow {
  segmento: 'AFILIADOS' | 'CONSUMIDOR FINAL'
  tipoOferta: string
  publicacion: string
  medioPago: string
  esPrecioOferta: 'SI' | 'NO'
  esSinInteres: 'SI' | 'NO'
  adicionalAfiliados: 'SI' | 'NO'
  adicionalContado: 'SI' | 'NO'
}

const EXCEL_EPOCH_OFFSET_DAYS = 25569
const MILLIS_PER_DAY = 86_400_000

export function excelSerialToIsoDate(serial: number): string {
  const timestamp = (serial - EXCEL_EPOCH_OFFSET_DAYS) * MILLIS_PER_DAY
  return new Date(timestamp).toISOString().slice(0, 10)
}

export function mapExcelProductToDomain(row: ExcelProductRow): Product {
  const priceBase = row['Precio Vta P']
  const priceOffer = row['Precio Oferta']
  const computedSavingsPercent =
    priceBase > 0 ? Math.max(0, ((priceBase - priceOffer) / priceBase) * 100) : 0

  return {
    sku: row.SKU,
    description: row.Articulo,
    brand: row.Marca,
    family: row.Rubro?.trim() || 'Sin rubro',
    imageUrl: '/images/products/placeholder-product.jpg',
    basePrice: priceBase,
    offerPrice: priceOffer,
    savingsPercent: row.Ahorro ?? computedSavingsPercent,
    campaignLabel: row['En Catalogo'],
    validFrom: excelSerialToIsoDate(row.FechaInicio),
    validTo: excelSerialToIsoDate(row.FechaFin),
    operational: {
      erpCode: row['Cod Art'],
      posnetCode: row['Cod Posnet'],
      softlandPaymentMapping: row['MP Softland'],
      cardInstallmentCode: row['Venta Tarjeta Cuotas'],
      stExpression: row.ST ?? '',
    },
  }
}

export function mapExcelPoliticaToRule(
  row: ExcelPoliticaRow,
  campaignId: string,
  ruleId: string,
): PromotionRule {
  return {
    id: ruleId,
    campaignId,
    offerType: row.tipoOferta,
    publicationBand: row.publicacion,
    affiliateExtraDiscountPercent: row.adicionalAfiliados === 'SI' ? 0.05 : 0,
    cashDiscountPercent: row.adicionalContado === 'SI' ? 0.15 : 0,
    condition: {
      customerSegment: row.segmento === 'AFILIADOS' ? 'affiliate' : 'external',
      paymentFamily: row.medioPago,
      appliesOfferPrice: row.esPrecioOferta === 'SI',
      appliesPequeRate: false,
      isInterestFree: row.esSinInteres === 'SI',
    },
  }
}

export function mapToProductDetail(product: Product, rule: PromotionRule): ProductDetail {
  return {
    product,
    campaign: {
      id: rule.campaignId,
      name: product.campaignLabel,
      publicationContext: product.campaignLabel,
      startsAt: product.validFrom,
      endsAt: product.validTo,
      status: 'active',
      priority: 1,
    },
    rule,
  }
}

export function mapToCommercialQuoteSheet(
  detail: ProductDetail,
  customerSegment: CustomerSegment,
  financialRows: FinancialRow[],
): CommercialQuoteSheet {
  const affiliatePercent = detail.rule.affiliateExtraDiscountPercent
  const cashPercent = detail.rule.cashDiscountPercent
  const affiliatePrice = detail.product.offerPrice * (1 - affiliatePercent)
  const externalCashPrice = detail.product.offerPrice * (1 - cashPercent)
  const affiliateCashPrice = affiliatePrice * (1 - cashPercent)

  return {
    sku: detail.product.sku,
    branchId: 'casa-central',
    customerSegment,
    title: `Ficha comercial ${detail.product.description}`,
    description: detail.product.description,
    brand: detail.product.brand,
    campaignLabel: detail.campaign.name,
    offerType: detail.rule.offerType,
    publicationBand: detail.rule.publicationBand,
    validFrom: detail.product.validFrom,
    validTo: detail.product.validTo,
    basePrice: detail.product.basePrice,
    offerPrice: detail.product.offerPrice,
    affiliatePrice,
    cashDiscountPercent: cashPercent,
    cashPriceExternal: externalCashPrice,
    cashPriceAffiliate: affiliateCashPrice,
    financialRows,
    operationalNotes: ['Generado desde mapeo Excel -> dominio'],
    hiddenTrace: {
      sourceRuleId: detail.rule.id,
      sourceCampaignId: detail.campaign.id,
      stExpression: detail.product.operational.stExpression,
    },
  }
}
