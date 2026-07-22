import type { CommercialQuoteSheet } from '@core/domain/models'
import type { QuoteDraft } from '@core/stores/quote-draft-store'

export interface SoftlandQuotePayload {
  quoteId: string
  branchId: string
  customerSegment: 'affiliate' | 'external'
  payment: {
    entityId: string
    installments: number
  }
  totals: {
    totalBeforeDiscount: number
    totalAfterDiscount: number
  }
  items: Array<{
    sku: string
    quantity: number
    unitPrice: number
    discountPercent: number
    subtotal: number
  }>
  notes: string
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function normalizeNegotiationPercent(rawValue: number): number {
  if (!Number.isFinite(rawValue)) {
    return 0.05
  }

  return Math.min(0.15, Math.max(0.05, rawValue))
}

export function buildQuoteDraftFromSheet(input: {
  quoteId: string
  sheet: CommercialQuoteSheet
  quantity: number
  paymentEntityId: string
  paymentInstallments: number
  negotiationPercent?: number
  negotiationReason?: string
  negotiationEnabled: boolean
}): QuoteDraft {
  const normalizedQuantity = Math.max(1, Math.floor(input.quantity))
  const discount = input.negotiationEnabled && input.negotiationPercent !== undefined
    ? normalizeNegotiationPercent(input.negotiationPercent)
    : 0

  const unitPrice = roundMoney(input.sheet.offerPrice * (1 - discount))
  const subtotal = roundMoney(unitPrice * normalizedQuantity)

  return {
    id: input.quoteId,
    branchId: input.sheet.branchId,
    customerSegment: input.sheet.customerSegment,
    paymentEntityId: input.paymentEntityId,
    paymentInstallments: Math.max(1, Math.floor(input.paymentInstallments)),
    status: 'open',
    reason: input.negotiationReason,
    lines: [
      {
        sku: input.sheet.sku,
        description: input.sheet.description,
        quantity: normalizedQuantity,
        unitPrice,
        appliedDiscountPercent: discount,
        subtotal,
      },
    ],
  }
}

export function buildSoftlandQuotePayload(quote: QuoteDraft): SoftlandQuotePayload {
  const totalBeforeDiscount = roundMoney(
    quote.lines.reduce((acc, line) => acc + line.unitPrice * line.quantity / (1 - line.appliedDiscountPercent || 1), 0),
  )
  const totalAfterDiscount = roundMoney(quote.lines.reduce((acc, line) => acc + line.subtotal, 0))

  return {
    quoteId: quote.id,
    branchId: quote.branchId,
    customerSegment: quote.customerSegment,
    payment: {
      entityId: quote.paymentEntityId,
      installments: quote.paymentInstallments,
    },
    totals: {
      totalBeforeDiscount,
      totalAfterDiscount,
    },
    items: quote.lines.map((line) => ({
      sku: line.sku,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discountPercent: line.appliedDiscountPercent,
      subtotal: line.subtotal,
    })),
    notes: quote.reason?.trim() ? quote.reason : 'Cotizacion mock lista para integracion Softland',
  }
}
