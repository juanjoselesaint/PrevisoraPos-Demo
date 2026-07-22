import { buildCommercialQuoteSheet } from '@core/domain/commercial-engine'
import { domainData } from '@mocks/data/domain'

export interface CommercialEngineValidationRow {
  scenarioId: string
  title: string
  sku: string
  validFrom: string
  validTo: string
  offerType: string
  cashDiscountPercent: number
  financialRows: number
  hasBlockedPaymentRows: boolean
  negotiationNote: string
  stockNotes: string[]
}

export function runCommercialEngineControlledValidation(): CommercialEngineValidationRow[] {
  const dataset = {
    campaigns: domainData.campaigns,
    financialEntities: domainData.financialEntities,
    installmentRules: domainData.installmentRules,
    productDetailsBySku: domainData.productDetailsBySku,
    stockBySku: domainData.stockBySku,
  }

  return domainData.scenarioFixtures
    .filter((scenario) => scenario.requiredByStep3 && scenario.sku)
    .map((scenario) => {
      const input = {
        sku: scenario.sku as string,
        branchId: 'casa-central',
        customerSegment:
          domainData.productDetailsBySku[scenario.sku as string]?.rule.condition.customerSegment ??
          'external',
        negotiationDiscountPercent:
          scenario.id === 'scenario-8-negotiation-enabled' ||
          scenario.id === 'scenario-9-negotiation-blocked'
            ? 0.1
            : undefined,
        currentDateIso: '2026-07-21',
      } as const

      const result = buildCommercialQuoteSheet(dataset, input)
      const blockedRows = result.sheet.financialRows.filter((row) => row.maxInstallments === 0)
      const negotiationNote =
        result.sheet.operationalNotes.find((note) => note.toLowerCase().includes('negociacion')) ?? ''
      const stockNotes = result.sheet.operationalNotes.filter((note) => note.toLowerCase().includes('stock'))

      return {
        scenarioId: scenario.id,
        title: scenario.title,
        sku: result.sheet.sku,
        validFrom: result.sheet.validFrom,
        validTo: result.sheet.validTo,
        offerType: result.sheet.offerType,
        cashDiscountPercent: result.sheet.cashDiscountPercent,
        financialRows: result.sheet.financialRows.length,
        hasBlockedPaymentRows: blockedRows.length > 0,
        negotiationNote,
        stockNotes,
      }
    })
}
