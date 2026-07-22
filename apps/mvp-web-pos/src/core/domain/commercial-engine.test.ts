import { describe, expect, it } from 'vitest'

import {
  applyNegotiationToQuoteSummary,
  buildCommercialQuoteSheet,
  resolveRuleForCommercialContext,
} from '@core/domain/commercial-engine'
import type { Campaign, ProductDetail } from '@core/domain/models'
import { domainData } from '@mocks/data/domain'

const engineDataset = {
  campaigns: domainData.campaigns,
  financialEntities: domainData.financialEntities,
  installmentRules: domainData.installmentRules,
  productDetailsBySku: domainData.productDetailsBySku,
  stockBySku: domainData.stockBySku,
}

describe('Commercial engine', () => {
  it('resuelve regla por SKU y segmento', () => {
    const result = resolveRuleForCommercialContext(engineDataset, {
      sku: '1004400',
      branchId: 'casa-central',
      customerSegment: 'affiliate',
      currentDateIso: '2026-07-21',
    })

    expect(result.selected.product.sku).toBe('1004400')
    expect(result.selected.rule.condition.customerSegment).toBe('affiliate')
  })

  it('respeta exclusiones de medio de pago por expresion ST', () => {
    const result = buildCommercialQuoteSheet(engineDataset, {
      sku: '1004500',
      branchId: 'casa-central',
      customerSegment: 'external',
      paymentEntityId: 'naranja-x',
      currentDateIso: '2026-07-21',
    })

    const naranja = result.sheet.financialRows.find((row) => row.entityId === 'naranja-x')

    expect(naranja).toBeDefined()
    expect(naranja?.maxInstallments).toBe(0)
    expect(naranja?.notes?.toLowerCase()).toContain('excluido')
  })

  it('calcula descuento contado para precios externo y afiliado', () => {
    const result = buildCommercialQuoteSheet(engineDataset, {
      sku: '1002631',
      branchId: 'casa-central',
      customerSegment: 'affiliate',
      currentDateIso: '2026-07-21',
    })

    expect(result.sheet.cashDiscountPercent).toBe(0.15)
    expect(result.sheet.cashPriceAffiliate).toBeLessThan(result.sheet.affiliatePrice)
    expect(result.sheet.cashPriceExternal).toBeLessThan(result.sheet.offerPrice)
  })

  it('calcula topes de cuotas e importes estimados', () => {
    const result = buildCommercialQuoteSheet(engineDataset, {
      sku: '1002631',
      branchId: 'casa-central',
      customerSegment: 'external',
      currentDateIso: '2026-07-21',
    })

    const bankRow = result.sheet.financialRows.find((row) => row.entityId === 'bbva')
    expect(bankRow?.maxInstallments).toBeGreaterThan(0)
    expect(bankRow?.estimatedInstallmentAmount).toBeGreaterThan(0)
  })

  it('agrega señal de sucursal alternativa cuando no hay stock local', () => {
    const result = buildCommercialQuoteSheet(engineDataset, {
      sku: '1004600',
      branchId: 'casa-central',
      customerSegment: 'external',
      currentDateIso: '2026-07-21',
    })

    expect(result.sheet.operationalNotes.join(' | ').toLowerCase()).toContain('stock alternativo')
  })

  it('aplica prioridad de campaña cuando hay mas de una regla válida', () => {
    const campaignHigh: Campaign = {
      id: 'camp-priority-1',
      name: 'Campaña alta prioridad',
      publicationContext: 'Test',
      startsAt: '2026-07-01',
      endsAt: '2026-08-01',
      status: 'active',
      priority: 1,
    }
    const campaignLow: Campaign = {
      id: 'camp-priority-2',
      name: 'Campaña baja prioridad',
      publicationContext: 'Test',
      startsAt: '2026-07-01',
      endsAt: '2026-08-01',
      status: 'active',
      priority: 5,
    }

    const baseDetail = domainData.productDetailsBySku['1002631']
    const detailHigh: ProductDetail = {
      ...baseDetail,
      rule: {
        ...baseDetail.rule,
        id: 'rule-high',
        campaignId: campaignHigh.id,
      },
    }
    const detailLow: ProductDetail = {
      ...baseDetail,
      rule: {
        ...baseDetail.rule,
        id: 'rule-low',
        campaignId: campaignLow.id,
      },
    }

    const localDataset = {
      ...engineDataset,
      campaigns: [campaignHigh, campaignLow],
      productDetailsBySku: {
        primary: detailLow,
        secondary: detailHigh,
      },
    }

    const result = buildCommercialQuoteSheet(localDataset, {
      sku: '1002631',
      branchId: 'casa-central',
      customerSegment: 'external',
      currentDateIso: '2026-07-21',
    })

    expect(result.diagnostics.selectedCampaignId).toBe(campaignHigh.id)
  })

  it('aplica impacto de negociación cuando está habilitado', () => {
    const result = buildCommercialQuoteSheet(engineDataset, {
      sku: '1004700',
      branchId: 'casa-central',
      customerSegment: 'external',
      negotiationDiscountPercent: 0.12,
      currentDateIso: '2026-07-21',
    })

    expect(result.sheet.operationalNotes.join(' | ').toLowerCase()).toContain('negociacion aplicado')
    const bankRow = result.sheet.financialRows.find((row) => row.entityId === 'bbva')
    expect(bankRow?.estimatedInstallmentAmount).toBeLessThan(1299990 / 12)
  })

  it('bloquea impacto de negociación cuando la campaña no lo permite', () => {
    const result = buildCommercialQuoteSheet(engineDataset, {
      sku: '1004800',
      branchId: 'casa-central',
      customerSegment: 'external',
      negotiationDiscountPercent: 0.12,
      currentDateIso: '2026-07-21',
    })

    expect(result.sheet.operationalNotes.join(' | ').toLowerCase()).toContain('negociacion bloqueado')
  })

  it('ajusta resumen de cotización según negociación aprobada', () => {
    const quote = domainData.quoteSummariesById['quote-neg-enabled']
    const adjusted = applyNegotiationToQuoteSummary(quote, {
      quoteId: quote.id,
      negotiationDiscountPercent: 0.12,
    })

    expect(adjusted.totalAfterDiscount).toBeLessThan(quote.totalBeforeDiscount)
    expect(adjusted.lines[0].appliedDiscountPercent).toBe(0.12)
  })

  it('mantiene resumen de cotización cuando la negociación está bloqueada', () => {
    const quote = domainData.quoteSummariesById['quote-neg-blocked']
    const adjusted = applyNegotiationToQuoteSummary(quote, {
      quoteId: quote.id,
      negotiationDiscountPercent: 0.1,
    })

    expect(adjusted.totalAfterDiscount).toBe(quote.totalAfterDiscount)
    expect(adjusted.lines[0].appliedDiscountPercent).toBe(0)
  })
})
