import type {
  Campaign,
  CommercialQuoteSheet,
  CustomerSegment,
  FinancialEntity,
  FinancialRow,
  InstallmentRule,
  ProductDetail,
  QuoteSummary,
  StockSnapshot,
} from '@core/domain/models'
import { parseCardInstallmentCaps, stripPublicationBandMetadata } from '@core/domain/publication-band'

interface EngineDataset {
  campaigns: Campaign[]
  financialEntities: FinancialEntity[]
  installmentRules: InstallmentRule[]
  productDetailsBySku: Record<string, ProductDetail>
  stockBySku: Record<string, StockSnapshot[]>
}

export interface BuildCommercialQuoteSheetInput {
  sku: string
  family?: string
  branchId: string
  customerSegment: CustomerSegment
  paymentEntityId?: string
  negotiationDiscountPercent?: number
  currentDateIso?: string
}

export interface BuildCommercialQuoteSheetOutput {
  sheet: CommercialQuoteSheet
  diagnostics: {
    selectedRuleId: string
    selectedCampaignId: string
    selectedCampaignPriority: number
    excludedReasons: string[]
  }
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

function parseIsoDate(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00.000Z`).getTime()
}

function isDateInRange(date: string, from: string, to: string): boolean {
  const dateTs = parseIsoDate(date)
  return dateTs >= parseIsoDate(from) && dateTs <= parseIsoDate(to)
}

function isNegotiationAllowed(campaignName: string): boolean {
  return campaignName.toLowerCase().includes('flex') || campaignName.toLowerCase().includes('habil')
}

function applyCampaignPriority(details: ProductDetail[], campaignsById: Map<string, Campaign>): ProductDetail[] {
  return [...details].sort((a, b) => {
    const campaignA = campaignsById.get(a.rule.campaignId)
    const campaignB = campaignsById.get(b.rule.campaignId)
    const priorityA = campaignA?.priority ?? 99
    const priorityB = campaignB?.priority ?? 99

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    return a.product.validTo.localeCompare(b.product.validTo)
  })
}

function isEntityAllowedByRule(paymentFamily: string, entity: FinancialEntity): boolean {
  const configuredFamilies = paymentFamily
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (configuredFamilies.length === 0 || configuredFamilies.includes('all')) {
    return true
  }

  if (configuredFamilies.includes('none')) {
    return false
  }

  if (configuredFamilies.includes(entity.id)) {
    return true
  }

  return configuredFamilies.some((family) => {
    if (family === 'credit_card') {
      return entity.family === 'credit_card'
    }

    if (family === 'debit_card') {
      return entity.family === 'debit_card'
    }

    if (family === 'bank_transfer') {
      return entity.family === 'bank_transfer'
    }

    if (family === 'cash') {
      return entity.family === 'cash'
    }

    return false
  })
}

function applyOperationalExclusions(rows: FinancialRow[], stExpression: string): FinancialRow[] {
  const normalizedExpression = stExpression.toUpperCase()

  return rows.map((row) => {
    if (normalizedExpression.includes('NO_NARANJA') && row.entityId === 'naranja-x') {
      return {
        ...row,
        maxInstallments: 0,
        estimatedInstallmentAmount: 0,
        paymentCondition: 'with_interest',
        notes: 'Excluido por combinacion operacional ST',
      }
    }

    return row
  })
}

function getCampaignInstallmentCap(publicationBand: string): number | undefined {
  const cleanBand = stripPublicationBandMetadata(publicationBand)
  const match = cleanBand.match(/(\d{1,2})/)
  if (!match) {
    return undefined
  }

  const parsed = Number.parseInt(match[1], 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function buildFinancialRows(
  detail: ProductDetail,
  entities: FinancialEntity[],
  installmentRules: InstallmentRule[],
  paymentEntityId: string | undefined,
  installmentBaseAmount: number,
): FinancialRow[] {
  const campaignInstallmentCap = getCampaignInstallmentCap(detail.rule.publicationBand)

  const explicitlyRequestedEntity = paymentEntityId
    ? entities.find((entity) => entity.id === paymentEntityId)
    : undefined

  if (
    explicitlyRequestedEntity &&
    !isEntityAllowedByRule(detail.rule.condition.paymentFamily, explicitlyRequestedEntity)
  ) {
    return [
      {
        entityId: explicitlyRequestedEntity.id,
        entityName: explicitlyRequestedEntity.name,
        paymentFamily: explicitlyRequestedEntity.family,
        maxInstallments: 0,
        estimatedInstallmentAmount: 0,
        paymentCondition: 'with_interest',
        notes: 'Medio no aplicable para la regla comercial seleccionada',
      },
    ]
  }

  const allowedEntities = entities.filter((entity) => {
    if (paymentEntityId && entity.id !== paymentEntityId) {
      return false
    }

    return isEntityAllowedByRule(detail.rule.condition.paymentFamily, entity)
  })

  const rows = allowedEntities.map<FinancialRow>((entity) => {
    const matchedRule = installmentRules
      .filter((rule) => rule.entityId === entity.id)
      .sort((a, b) => b.maxInstallments - a.maxInstallments)[0]

    if (!matchedRule) {
      return {
        entityId: entity.id,
        entityName: entity.name,
        paymentFamily: entity.family,
        maxInstallments: 0,
        estimatedInstallmentAmount: 0,
        paymentCondition: 'with_interest',
        notes: 'Sin regla financiera para entidad',
      }
    }

    const cardInstallmentCaps = parseCardInstallmentCaps(detail.rule.publicationBand)
    const specificCardCap = cardInstallmentCaps[entity.id]

    let maxInstallments = matchedRule.maxInstallments
    if (campaignInstallmentCap) {
      maxInstallments = Math.min(maxInstallments, campaignInstallmentCap)
    }
    if (specificCardCap) {
      maxInstallments = Math.min(maxInstallments, specificCardCap)
    }

    const estimatedInstallmentAmount =
      maxInstallments > 0 ? roundMoney(installmentBaseAmount / maxInstallments) : 0

    return {
      entityId: entity.id,
      entityName: entity.name,
      paymentFamily: entity.family,
      maxInstallments,
      estimatedInstallmentAmount,
      paymentCondition: matchedRule.paymentCondition,
      notes: matchedRule.notes,
    }
  })

  return applyOperationalExclusions(rows, detail.product.operational.stExpression)
}

export function resolveRuleForCommercialContext(
  dataset: EngineDataset,
  input: BuildCommercialQuoteSheetInput,
): { selected: ProductDetail; excludedReasons: string[] } {
  const allDetails = Object.values(dataset.productDetailsBySku)
  const skuCandidates = allDetails.filter((detail) => detail.product.sku === input.sku)
  const familyKey = input.family?.trim().toLowerCase()
  const familyCandidates = familyKey
    ? allDetails.filter((detail) => detail.product.family.toLowerCase() === familyKey)
    : []
  const contextualCandidates = skuCandidates.length > 0 ? skuCandidates : familyCandidates

  if (contextualCandidates.length === 0) {
    throw new Error(`No se encontro regla base para SKU ${input.sku}`)
  }

  const uniqueCandidates = contextualCandidates.filter(
    (candidate, index, source) => source.findIndex((item) => item.rule.id === candidate.rule.id) === index,
  )

  const campaignsById = new Map(dataset.campaigns.map((campaign) => [campaign.id, campaign]))
  const now = input.currentDateIso ?? new Date().toISOString().slice(0, 10)
  const excludedReasons: string[] = []

  const validCandidates = uniqueCandidates.filter((candidate) => {
    const campaign = campaignsById.get(candidate.rule.campaignId)

    if (!campaign) {
      excludedReasons.push(`${candidate.rule.id}: campaña inexistente`)
      return false
    }

    if (campaign.status === 'expired' || !isDateInRange(now, campaign.startsAt, campaign.endsAt)) {
      excludedReasons.push(`${candidate.rule.id}: campaña vencida o fuera de vigencia`)
      return false
    }

    if (candidate.rule.condition.customerSegment !== 'all') {
      const configuredSegments = candidate.rule.condition.customerSegment
        .split(',')
        .map((segment) => segment.trim())
        .filter(Boolean)

      const matchesSegment = configuredSegments.includes(input.customerSegment)
      const allowsExternalFallback =
        configuredSegments.includes('external') && input.customerSegment === 'affiliate'

      if (!matchesSegment && !allowsExternalFallback) {
        excludedReasons.push(`${candidate.rule.id}: segmento de cliente no aplicable`)
        return false
      }
    }

    if (!candidate.rule.condition.customerSegment) {
      excludedReasons.push(`${candidate.rule.id}: segmento de cliente no aplicable`)
      return false
    }

    return true
  })

  const ordered = applyCampaignPriority(
    validCandidates.length > 0 ? validCandidates : contextualCandidates,
    campaignsById,
  )
  const selected = ordered[0]

  if (!selected) {
    throw new Error(`No se pudo resolver regla comercial para SKU ${input.sku}`)
  }

  return { selected, excludedReasons }
}

export function buildCommercialQuoteSheet(
  dataset: EngineDataset,
  input: BuildCommercialQuoteSheetInput,
): BuildCommercialQuoteSheetOutput {
  const { selected, excludedReasons } = resolveRuleForCommercialContext(dataset, input)
  const campaign = dataset.campaigns.find((item) => item.id === selected.rule.campaignId)

  if (!campaign) {
    throw new Error(`No se encontro campaña ${selected.rule.campaignId}`)
  }

  const baseForOffer = selected.rule.condition.appliesOfferPrice
    ? selected.product.offerPrice
    : selected.product.basePrice

  // El precio afiliado siempre refleja el beneficio de afiliado (es "cuanto pagaria
  // un afiliado"), independiente del segmento con el que se abre la ficha. Asi el
  // contado afiliado siempre queda por debajo del contado externo cuando hay beneficio.
  const affiliateDiscount = selected.rule.affiliateExtraDiscountPercent

  const affiliatePrice = roundMoney(baseForOffer * (1 - affiliateDiscount))
  const cashPriceExternal = roundMoney(baseForOffer * (1 - selected.rule.cashDiscountPercent))
  const cashPriceAffiliate = roundMoney(affiliatePrice * (1 - selected.rule.cashDiscountPercent))

  const negotiationAllowed = isNegotiationAllowed(campaign.name)
  const negotiationPercent = Math.max(0, input.negotiationDiscountPercent ?? 0)
  const normalizedNegotiation = negotiationAllowed
    ? Math.min(0.15, Math.max(0.05, negotiationPercent || 0.05))
    : 0

  const priceForInstallments = roundMoney(baseForOffer * (1 - normalizedNegotiation))

  const financialRows = buildFinancialRows(
    selected,
    dataset.financialEntities,
    dataset.installmentRules,
    input.paymentEntityId,
    priceForInstallments,
  )

  const localStock = dataset.stockBySku[input.sku]?.find((item) => item.branchId === input.branchId)
  const alternativeStock = dataset.stockBySku[input.sku]?.find(
    (item) => item.branchId !== input.branchId && item.availableUnits > 0,
  )

  const stockNotes: string[] = []
  if (localStock && localStock.availableUnits === 0) {
    stockNotes.push('Sin stock local para la sucursal seleccionada')
  }
  if (alternativeStock) {
    stockNotes.push(`Stock alternativo disponible en ${alternativeStock.branchName}`)
  }

  const negotiationNotes =
    input.negotiationDiscountPercent === undefined
      ? []
      : negotiationAllowed
        ? [`Descuento de negociacion aplicado: ${Math.round(normalizedNegotiation * 100)}%`]
        : ['Descuento de negociacion bloqueado por politica de campaña']

  const sheet: CommercialQuoteSheet = {
    sku: selected.product.sku,
    branchId: input.branchId,
    customerSegment: input.customerSegment,
    title: `Ficha comercial ${selected.product.description}`,
    description: selected.product.description,
    brand: selected.product.brand,
    campaignLabel: campaign.name,
    offerType: selected.rule.offerType,
    publicationBand: stripPublicationBandMetadata(selected.rule.publicationBand),
    validFrom: selected.product.validFrom,
    validTo: selected.product.validTo,
    basePrice: selected.product.basePrice,
    offerPrice: baseForOffer,
    affiliatePrice,
    cashDiscountPercent: selected.rule.cashDiscountPercent,
    cashPriceExternal,
    cashPriceAffiliate,
    financialRows,
    operationalNotes: [...stockNotes, ...negotiationNotes, ...excludedReasons],
    hiddenTrace: {
      sourceRuleId: selected.rule.id,
      sourceCampaignId: selected.rule.campaignId,
      stExpression: selected.product.operational.stExpression,
    },
  }

  return {
    sheet,
    diagnostics: {
      selectedRuleId: selected.rule.id,
      selectedCampaignId: selected.rule.campaignId,
      selectedCampaignPriority: campaign.priority,
      excludedReasons,
    },
  }
}

export interface BuildQuoteSummaryInput {
  quoteId: string
  negotiationDiscountPercent?: number
}

export function applyNegotiationToQuoteSummary(
  summary: QuoteSummary,
  input: BuildQuoteSummaryInput,
): QuoteSummary {
  if (input.negotiationDiscountPercent === undefined || !summary.negotiationDiscount?.enabled) {
    return summary
  }

  const requested = input.negotiationDiscountPercent
  const approved = summary.negotiationDiscount.approved
  const percent = approved ? Math.min(0.15, Math.max(0.05, requested)) : 0

  const adjustedLines = summary.lines.map((line) => {
    const unitPrice = roundMoney(line.unitPrice * (1 - percent))
    return {
      ...line,
      appliedDiscountPercent: percent,
      unitPrice,
      subtotal: roundMoney(unitPrice * line.quantity),
    }
  })

  const totalAfterDiscount = roundMoney(adjustedLines.reduce((acc, line) => acc + line.subtotal, 0))

  return {
    ...summary,
    lines: adjustedLines,
    totalAfterDiscount,
  }
}
