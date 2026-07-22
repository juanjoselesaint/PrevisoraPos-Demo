import type {
  AuditEventsRequest,
  AuditEventsResponse,
  BranchesResponse,
  CampaignRulesResponse,
  CampaignsListResponse,
  CreateCampaignRequest,
  CatalogBootstrapResponse,
  CatalogListRequest,
  CatalogListResponse,
  DeleteCampaignRequest,
  CommercialQuoteSheetRequest,
  CommercialQuoteSheetResponse,
  UpsertCampaignResponse,
  FinancialRulesRequest,
  FinancialRulesResponse,
  ProductTaxonomyResponse,
  ProductDetailRequest,
  ProductDetailResponse,
  QuoteSummaryRequest,
  QuoteSummaryResponse,
  QuoteSummariesResponse,
  RemoveCampaignRuleRequest,
  SoftlandSendQuoteRequest,
  SoftlandSendQuoteResponse,
  UpdateCampaignRequest,
  UpsertCampaignRuleRequest,
  UpsertCampaignRuleResponse,
  RolesResponse,
  ScenarioFixturesResponse,
  StockSnapshotRequest,
  StockSnapshotResponse,
  UsersResponse,
} from '@core/api/contracts'
import {
  applyNegotiationToQuoteSummary,
  buildCommercialQuoteSheet,
} from '@core/domain/commercial-engine'
import type { PromotionRule } from '@core/domain/models'
import { bootstrapData } from '@mocks/data/bootstrap'
import { domainData } from '@mocks/data/domain'

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function readFromApiOrFallback<T>(url: string, fallback: T): Promise<T> {
  await delay(120)

  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`No se pudo cargar recurso mock: ${url}`)
    }

    return (await response.json()) as T
  }

  return fallback
}

export async function getCatalogBootstrap(): Promise<CatalogBootstrapResponse> {
  return readFromApiOrFallback<CatalogBootstrapResponse>('/api/bootstrap', bootstrapData)
}

export async function listCatalogProducts(
  request: CatalogListRequest,
): Promise<CatalogListResponse> {
  const query = request.query?.toLowerCase().trim()
  const family = request.family?.toLowerCase().trim()
  const normalizedBranchId = request.branchId?.trim()
  const normalizedAvailability = request.availability ?? 'all'

  const hasAvailabilityInBranch = (sku: string) => {
    const snapshots = domainData.stockBySku[sku] ?? []

    if (!normalizedBranchId) {
      return snapshots.some((snapshot) => snapshot.availableUnits > 0)
    }

    return snapshots.some(
      (snapshot) => snapshot.branchId === normalizedBranchId && snapshot.availableUnits > 0,
    )
  }

  const filtered = domainData.catalogItems.filter((item) => {
    const matchesQuery =
      !query ||
      item.sku.includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query)

    const matchesFamily = !family || item.family.toLowerCase() === family
    const matchesPromotion = !request.onlyWithPromotion || item.offerPrice < item.basePrice

    const hasStockInBranch = hasAvailabilityInBranch(item.sku)
    const matchesAvailability =
      normalizedAvailability === 'all' ||
      (normalizedAvailability === 'available' ? hasStockInBranch : !hasStockInBranch)

    return matchesQuery && matchesFamily && matchesPromotion && matchesAvailability
  })

  const params = new URLSearchParams()
  if (request.query) {
    params.set('q', request.query)
  }
  if (request.family) {
    params.set('family', request.family)
  }
  if (request.branchId) {
    params.set('branchId', request.branchId)
  }
  if (request.onlyWithPromotion) {
    params.set('onlyWithPromotion', String(request.onlyWithPromotion))
  }
  if (request.availability && request.availability !== 'all') {
    params.set('availability', request.availability)
  }

  const queryString = params.toString()

  return readFromApiOrFallback<CatalogListResponse>(
    `/api/catalog/products${queryString ? `?${queryString}` : ''}`,
    {
      items: filtered,
      total: filtered.length,
    },
  )
}

export async function getProductDetail(
  request: ProductDetailRequest,
): Promise<ProductDetailResponse> {
  const detail = domainData.productDetailsBySku[request.sku]
  if (!detail) {
    throw new Error(`No se encontro detalle de producto para SKU ${request.sku}`)
  }

  return readFromApiOrFallback<ProductDetailResponse>(`/api/catalog/products/${request.sku}`, {
    detail,
  })
}

export async function getCommercialQuoteSheet(
  request: CommercialQuoteSheetRequest,
): Promise<CommercialQuoteSheetResponse> {
  const responseSheet = buildCommercialQuoteSheet(
    {
      campaigns: domainData.campaigns,
      financialEntities: domainData.financialEntities,
      installmentRules: domainData.installmentRules,
      productDetailsBySku: domainData.productDetailsBySku,
      stockBySku: domainData.stockBySku,
    },
    {
      sku: request.sku,
      branchId: request.branchId,
      customerSegment: request.customerSegment,
      paymentEntityId: request.paymentEntityId,
      negotiationDiscountPercent: request.negotiationDiscountPercent,
    },
  ).sheet

  const params = new URLSearchParams({
    branchId: request.branchId,
    customerSegment: request.customerSegment,
  })

  if (request.paymentEntityId) {
    params.set('paymentEntityId', request.paymentEntityId)
  }

  if (request.negotiationDiscountPercent !== undefined) {
    params.set('negotiationDiscountPercent', String(request.negotiationDiscountPercent))
  }

  return readFromApiOrFallback<CommercialQuoteSheetResponse>(
    `/api/commercial-quote-sheet/${request.sku}?${params.toString()}`,
    {
      sheet: responseSheet,
    },
  )
}

export async function getStockSnapshot(
  request: StockSnapshotRequest,
): Promise<StockSnapshotResponse> {
  const snapshot = domainData.stockBySku[request.sku] ?? []

  return readFromApiOrFallback<StockSnapshotResponse>(`/api/stock/${request.sku}`, {
    snapshot,
  })
}

export async function getFinancialRules(
  _request: FinancialRulesRequest,
): Promise<FinancialRulesResponse> {
  return readFromApiOrFallback<FinancialRulesResponse>('/api/financial-rules', {
    entities: domainData.financialEntities,
    installmentRules: domainData.installmentRules,
  })
}

export async function getQuoteSummary(
  request: QuoteSummaryRequest,
): Promise<QuoteSummaryResponse> {
  const summary = domainData.quoteSummariesById[request.quoteId]
  if (!summary) {
    throw new Error(`No se encontro resumen de cotizacion ${request.quoteId}`)
  }

  const negotiatedSummary = applyNegotiationToQuoteSummary(summary, {
    quoteId: request.quoteId,
    negotiationDiscountPercent:
      request.negotiationDiscountPercent ?? summary.negotiationDiscount?.requestedPercent,
  })

  const params = new URLSearchParams()
  if (request.negotiationDiscountPercent !== undefined) {
    params.set('negotiationDiscountPercent', String(request.negotiationDiscountPercent))
  }

  return readFromApiOrFallback<QuoteSummaryResponse>(
    `/api/quotes/${request.quoteId}/summary${params.toString() ? `?${params.toString()}` : ''}`,
    {
      summary: negotiatedSummary,
    },
  )
}

export async function listQuoteSummaries(): Promise<QuoteSummariesResponse> {
  return readFromApiOrFallback<QuoteSummariesResponse>('/api/quotes', {
    summaries: Object.values(domainData.quoteSummariesById),
  })
}

export async function sendQuoteToSoftland(
  request: SoftlandSendQuoteRequest,
): Promise<SoftlandSendQuoteResponse> {
  await delay(120)

  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const response = await fetch('/api/integrations/softland/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.payload),
    })

    if (!response.ok) {
      throw new Error('No se pudo enviar la cotizacion a Softland')
    }

    return (await response.json()) as SoftlandSendQuoteResponse
  }

  return {
    status: 'accepted',
    referenceId: `softland-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    message: 'Payload recibido en cola de integración Softland.',
  }
}

export async function listCampaigns(): Promise<CampaignsListResponse> {
  return readFromApiOrFallback<CampaignsListResponse>('/api/campaigns', {
    campaigns: domainData.campaigns,
  })
}

export async function createCampaign(
  request: CreateCampaignRequest,
): Promise<UpsertCampaignResponse> {
  await delay(120)

  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('No se pudo crear la campaña')
    }

    return (await response.json()) as UpsertCampaignResponse
  }

  const campaign = {
    id: `camp-${Date.now()}`,
    ...request,
  }
  domainData.campaigns.unshift(campaign)

  return { campaign }
}

export async function updateCampaign(
  request: UpdateCampaignRequest,
): Promise<UpsertCampaignResponse> {
  await delay(120)

  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const response = await fetch(`/api/campaigns/${request.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('No se pudo actualizar la campaña')
    }

    return (await response.json()) as UpsertCampaignResponse
  }

  const index = domainData.campaigns.findIndex((campaign) => campaign.id === request.id)
  if (index < 0) {
    throw new Error('Campaña no encontrada')
  }

  const current = domainData.campaigns[index]
  const campaign = {
    ...current,
    ...request,
  }
  domainData.campaigns[index] = campaign

  return { campaign }
}

export async function listCampaignRules(campaignId: string): Promise<CampaignRulesResponse> {
  const rules = Object.values(domainData.productDetailsBySku)
    .filter((detail) => detail.rule.campaignId === campaignId)
    .map((detail) => ({
      ruleId: detail.rule.id,
      sku: detail.product.sku,
      productDescription: detail.product.description,
      offerType: detail.rule.offerType,
      publicationBand: detail.rule.publicationBand,
      customerSegment: detail.rule.condition.customerSegment,
      paymentFamily: detail.rule.condition.paymentFamily,
      cashDiscountPercent: detail.rule.cashDiscountPercent,
      affiliateExtraDiscountPercent: detail.rule.affiliateExtraDiscountPercent,
    }))

  return readFromApiOrFallback<CampaignRulesResponse>(`/api/campaigns/${campaignId}/rules`, {
    rules,
  })
}

function toCampaignRuleSummary(product: { sku: string; description: string }, rule: PromotionRule) {
  return {
    ruleId: rule.id,
    sku: product.sku,
    productDescription: product.description,
    offerType: rule.offerType,
    publicationBand: rule.publicationBand,
    customerSegment: rule.condition.customerSegment,
    paymentFamily: rule.condition.paymentFamily,
    cashDiscountPercent: rule.cashDiscountPercent,
    affiliateExtraDiscountPercent: rule.affiliateExtraDiscountPercent,
  }
}

export async function upsertCampaignRule(
  request: UpsertCampaignRuleRequest,
): Promise<UpsertCampaignRuleResponse> {
  await delay(120)

  const product = domainData.catalogItems.find((item) => item.sku === request.sku)
  if (!product) {
    throw new Error(`SKU no encontrado en el catalogo: ${request.sku}`)
  }

  const campaign = domainData.campaigns.find((item) => item.id === request.campaignId)
  if (!campaign) {
    throw new Error(`Campaña no encontrada: ${request.campaignId}`)
  }

  const existing = domainData.productDetailsBySku[request.sku]
  const ruleId =
    existing && existing.rule.campaignId === request.campaignId
      ? existing.rule.id
      : `rule-${request.campaignId}-${request.sku}`

  const rule: PromotionRule = {
    id: ruleId,
    campaignId: request.campaignId,
    offerType: request.offerType,
    publicationBand: request.publicationBand,
    affiliateExtraDiscountPercent: request.affiliateExtraDiscountPercent,
    cashDiscountPercent: request.cashDiscountPercent,
    condition: {
      customerSegment: request.customerSegment,
      paymentFamily: request.paymentFamily,
      appliesOfferPrice: request.cashDiscountPercent > 0 || request.affiliateExtraDiscountPercent > 0,
      appliesPequeRate: false,
      isInterestFree: request.paymentFamily !== 'none' && request.paymentFamily !== 'cash',
    },
  }

  domainData.productDetailsBySku[request.sku] = { product, campaign, rule }

  return { rule: toCampaignRuleSummary(product, rule) }
}

export async function removeCampaignRule(request: RemoveCampaignRuleRequest): Promise<{ ok: true }> {
  await delay(120)

  const product = domainData.catalogItems.find((item) => item.sku === request.sku)
  if (!product) {
    throw new Error(`SKU no encontrado en el catalogo: ${request.sku}`)
  }

  const fallbackCampaign = domainData.campaigns.find((item) => item.id === 'camp-catalogo-regular')
  if (!fallbackCampaign) {
    delete domainData.productDetailsBySku[request.sku]
    return { ok: true }
  }

  domainData.productDetailsBySku[request.sku] = {
    product,
    campaign: fallbackCampaign,
    rule: {
      id: `rule-regular-${request.sku}`,
      campaignId: fallbackCampaign.id,
      offerType: 'Regular',
      publicationBand: 'Sin promo',
      affiliateExtraDiscountPercent: 0,
      cashDiscountPercent: 0,
      condition: {
        customerSegment: 'external',
        paymentFamily: 'all',
        appliesOfferPrice: false,
        appliesPequeRate: false,
        isInterestFree: false,
      },
    },
  }

  return { ok: true }
}

export async function deleteCampaign(
  request: DeleteCampaignRequest,
): Promise<{ ok: true }> {
  await delay(120)

  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const response = await fetch(`/api/campaigns/${request.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('No se pudo eliminar la campaña')
    }

    return { ok: true }
  }

  const index = domainData.campaigns.findIndex((campaign) => campaign.id === request.id)
  if (index < 0) {
    throw new Error('Campaña no encontrada')
  }

  domainData.campaigns.splice(index, 1)

  return { ok: true }
}

export async function listAuditEvents(
  request: AuditEventsRequest,
): Promise<AuditEventsResponse> {
  const events = request.entityId
    ? domainData.auditEvents.filter((event) => event.entityId === request.entityId)
    : domainData.auditEvents

  return readFromApiOrFallback<AuditEventsResponse>('/api/audit/events', {
    events,
  })
}

export async function listRoles(): Promise<RolesResponse> {
  return readFromApiOrFallback<RolesResponse>('/api/meta/roles', {
    roles: domainData.roles,
  })
}

export async function listUsers(): Promise<UsersResponse> {
  return readFromApiOrFallback<UsersResponse>('/api/meta/users', {
    users: domainData.users,
  })
}

export async function listBranches(): Promise<BranchesResponse> {
  return readFromApiOrFallback<BranchesResponse>('/api/meta/branches', {
    branches: domainData.branches,
  })
}

export async function getProductTaxonomy(): Promise<ProductTaxonomyResponse> {
  return readFromApiOrFallback<ProductTaxonomyResponse>('/api/meta/product-taxonomy', {
    families: domainData.productFamilies,
    brands: domainData.productBrands,
  })
}

export async function listScenarioFixtures(): Promise<ScenarioFixturesResponse> {
  return readFromApiOrFallback<ScenarioFixturesResponse>('/api/meta/scenarios', {
    scenarios: domainData.scenarioFixtures,
  })
}
