import { describe, expect, it } from 'vitest'

import { domainData } from '@mocks/data/domain'
import {
  buildQuoteDraftFromSheet,
  buildSoftlandQuotePayload,
  normalizeNegotiationPercent,
} from '@features/quote-sheet/lib/quote-builder'

describe('quote builder', () => {
  it('normaliza el descuento de negociacion dentro del rango 5%-15%', () => {
    expect(normalizeNegotiationPercent(0)).toBe(0.05)
    expect(normalizeNegotiationPercent(0.2)).toBe(0.15)
    expect(normalizeNegotiationPercent(0.1)).toBe(0.1)
  })

  it('crea cotizacion desde ficha y aplica descuento cuando corresponde', () => {
    const sheet = domainData.commercialQuoteSheetsBySku['1004700']
    const quote = buildQuoteDraftFromSheet({
      quoteId: 'quote-test',
      sheet,
      quantity: 2,
      paymentEntityId: 'bbva',
      paymentInstallments: 12,
      negotiationPercent: 0.12,
      negotiationEnabled: true,
      negotiationReason: 'Cierre comercial',
    })

    expect(quote.lines).toHaveLength(1)
    expect(quote.lines[0].appliedDiscountPercent).toBe(0.12)
    expect(quote.lines[0].subtotal).toBeGreaterThan(0)
  })

  it('genera payload mock de Softland consistente con la cotizacion', () => {
    const sheet = domainData.commercialQuoteSheetsBySku['1002631']
    const quote = buildQuoteDraftFromSheet({
      quoteId: 'quote-softland',
      sheet,
      quantity: 1,
      paymentEntityId: 'bbva',
      paymentInstallments: 12,
      negotiationEnabled: false,
    })

    const payload = buildSoftlandQuotePayload(quote)

    expect(payload.quoteId).toBe('quote-softland')
    expect(payload.items[0].sku).toBe(sheet.sku)
    expect(payload.totals.totalAfterDiscount).toBe(quote.lines[0].subtotal)
  })
})
