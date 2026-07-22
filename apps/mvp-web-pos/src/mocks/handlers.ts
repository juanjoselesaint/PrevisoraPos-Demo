import { http, HttpResponse } from 'msw'

import { applyNegotiationToQuoteSummary, buildCommercialQuoteSheet } from '@core/domain/commercial-engine'
import { bootstrapData } from '@mocks/data/bootstrap'
import { domainData } from '@mocks/data/domain'

export const handlers = [
  http.get('/api/bootstrap', () => {
    return HttpResponse.json(bootstrapData)
  }),
  http.get('/api/catalog/products', ({ request }) => {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() ?? ''
    const family = searchParams.get('family')?.toLowerCase() ?? ''
    const branchId = searchParams.get('branchId') ?? ''
    const onlyWithPromotion = searchParams.get('onlyWithPromotion') === 'true'
    const availability = searchParams.get('availability') ?? 'all'

    const items = domainData.catalogItems.filter((item) => {
      const matchesQuery =
        !query ||
        item.sku.includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query)

      const matchesFamily = !family || item.family.toLowerCase() === family
      const matchesPromotion = !onlyWithPromotion || item.offerPrice < item.basePrice

      const snapshots = domainData.stockBySku[item.sku] ?? []
      const hasStockInBranch = branchId
        ? snapshots.some((snapshot) => snapshot.branchId === branchId && snapshot.availableUnits > 0)
        : snapshots.some((snapshot) => snapshot.availableUnits > 0)

      const matchesAvailability =
        availability === 'all' ||
        (availability === 'available' ? hasStockInBranch : !hasStockInBranch)

      return matchesQuery && matchesFamily && matchesPromotion && matchesAvailability
    })

    return HttpResponse.json({ items, total: items.length })
  }),
  http.get('/api/catalog/products/:sku', ({ params }) => {
    const sku = String(params.sku)
    const detail = domainData.productDetailsBySku[sku]

    if (!detail) {
      return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 })
    }

    return HttpResponse.json({ detail })
  }),
  http.get('/api/commercial-quote-sheet/:sku', ({ params, request }) => {
    const sku = String(params.sku)
    const searchParams = new URL(request.url).searchParams
    const branchId = searchParams.get('branchId') ?? 'casa-central'
    const segmentParam = searchParams.get('customerSegment')
    const customerSegment = segmentParam === 'affiliate' ? 'affiliate' : 'external'
    const paymentEntityId = searchParams.get('paymentEntityId') ?? undefined
    const negotiationParam = searchParams.get('negotiationDiscountPercent')
    const negotiationDiscountPercent =
      negotiationParam === null ? undefined : Number.parseFloat(negotiationParam)

    const productDetail = domainData.productDetailsBySku[sku]
    if (!productDetail) {
      return HttpResponse.json({ message: 'Ficha no encontrada' }, { status: 404 })
    }

    const sheet = buildCommercialQuoteSheet(
      {
        campaigns: domainData.campaigns,
        financialEntities: domainData.financialEntities,
        installmentRules: domainData.installmentRules,
        productDetailsBySku: domainData.productDetailsBySku,
        stockBySku: domainData.stockBySku,
      },
      {
        sku,
        branchId,
        customerSegment,
        paymentEntityId,
        negotiationDiscountPercent,
      },
    ).sheet

    return HttpResponse.json({ sheet })
  }),
  http.get('/api/stock/:sku', ({ params }) => {
    const sku = String(params.sku)
    const snapshot = domainData.stockBySku[sku] ?? []

    return HttpResponse.json({ snapshot })
  }),
  http.get('/api/financial-rules', () => {
    return HttpResponse.json({
      entities: domainData.financialEntities,
      installmentRules: domainData.installmentRules,
    })
  }),
  http.get('/api/quotes/:quoteId/summary', ({ params, request }) => {
    const quoteId = String(params.quoteId)
    const searchParams = new URL(request.url).searchParams
    const negotiationParam = searchParams.get('negotiationDiscountPercent')
    const negotiationDiscountPercent =
      negotiationParam === null ? undefined : Number.parseFloat(negotiationParam)
    const summary = domainData.quoteSummariesById[quoteId]

    if (!summary) {
      return HttpResponse.json({ message: 'Cotizacion no encontrada' }, { status: 404 })
    }

    const adjustedSummary = applyNegotiationToQuoteSummary(summary, {
      quoteId,
      negotiationDiscountPercent,
    })

    return HttpResponse.json({ summary: adjustedSummary })
  }),
  http.get('/api/quotes', () => {
    return HttpResponse.json({ summaries: Object.values(domainData.quoteSummariesById) })
  }),
  http.post('/api/integrations/softland/quotes', async ({ request }) => {
    const body = await request.json().catch(() => ({}))

    return HttpResponse.json({
      status: 'accepted',
      referenceId: `softland-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      message: 'Payload recibido en cola de integración Softland.',
      payload: body,
    })
  }),
  http.get('/api/campaigns', () => {
    return HttpResponse.json({ campaigns: domainData.campaigns })
  }),
  http.get('/api/campaigns/:id/rules', ({ params }) => {
    const campaignId = String(params.id)
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

    return HttpResponse.json({ rules })
  }),
  http.put('/api/campaigns/:id/rules', async ({ params, request }) => {
    const campaignId = String(params.id)
    const payload = (await request.json()) as {
      sku: string
      offerType: string
      publicationBand: string
      customerSegment: 'external' | 'affiliate' | 'all'
      paymentFamily: string
      cashDiscountPercent: number
      affiliateExtraDiscountPercent: number
    }

    const product = domainData.catalogItems.find((item) => item.sku === payload.sku)
    if (!product) {
      return HttpResponse.json({ message: 'SKU no encontrado' }, { status: 404 })
    }

    const campaign = domainData.campaigns.find((item) => item.id === campaignId)
    if (!campaign) {
      return HttpResponse.json({ message: 'Campaña no encontrada' }, { status: 404 })
    }

    const existing = domainData.productDetailsBySku[payload.sku]
    const ruleId =
      existing && existing.rule.campaignId === campaignId
        ? existing.rule.id
        : `rule-${campaignId}-${payload.sku}`

    const rule = {
      id: ruleId,
      campaignId,
      offerType: payload.offerType,
      publicationBand: payload.publicationBand,
      affiliateExtraDiscountPercent: payload.affiliateExtraDiscountPercent,
      cashDiscountPercent: payload.cashDiscountPercent,
      condition: {
        customerSegment: payload.customerSegment,
        paymentFamily: payload.paymentFamily,
        appliesOfferPrice: payload.cashDiscountPercent > 0 || payload.affiliateExtraDiscountPercent > 0,
        appliesPequeRate: false,
        isInterestFree: payload.paymentFamily !== 'none' && payload.paymentFamily !== 'cash',
      },
    }

    domainData.productDetailsBySku[payload.sku] = { product, campaign, rule }

    return HttpResponse.json({
      rule: {
        ruleId: rule.id,
        sku: product.sku,
        productDescription: product.description,
        offerType: rule.offerType,
        publicationBand: rule.publicationBand,
        customerSegment: rule.condition.customerSegment,
        paymentFamily: rule.condition.paymentFamily,
        cashDiscountPercent: rule.cashDiscountPercent,
        affiliateExtraDiscountPercent: rule.affiliateExtraDiscountPercent,
      },
    })
  }),
  http.delete('/api/campaigns/rules/:sku', ({ params }) => {
    const sku = String(params.sku)
    const product = domainData.catalogItems.find((item) => item.sku === sku)
    if (!product) {
      return HttpResponse.json({ message: 'SKU no encontrado' }, { status: 404 })
    }

    const fallbackCampaign = domainData.campaigns.find((item) => item.id === 'camp-catalogo-regular')
    if (fallbackCampaign) {
      domainData.productDetailsBySku[sku] = {
        product,
        campaign: fallbackCampaign,
        rule: {
          id: `rule-regular-${sku}`,
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
    } else {
      delete domainData.productDetailsBySku[sku]
    }

    return HttpResponse.json({ ok: true })
  }),
  http.post('/api/campaigns', async ({ request }) => {
    const payload = (await request.json()) as {
      name: string
      publicationContext: string
      startsAt: string
      endsAt: string
      status: 'draft' | 'active' | 'expired'
      priority: number
    }

    const campaign = {
      id: `camp-${Date.now()}`,
      ...payload,
    }

    domainData.campaigns.unshift(campaign)

    return HttpResponse.json({ campaign }, { status: 201 })
  }),
  http.put('/api/campaigns/:id', async ({ params, request }) => {
    const id = String(params.id)
    const payload = (await request.json()) as {
      name: string
      publicationContext: string
      startsAt: string
      endsAt: string
      status: 'draft' | 'active' | 'expired'
      priority: number
    }

    const index = domainData.campaigns.findIndex((campaign) => campaign.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: 'Campaña no encontrada' }, { status: 404 })
    }

    const campaign = {
      ...domainData.campaigns[index],
      ...payload,
      id,
    }
    domainData.campaigns[index] = campaign

    return HttpResponse.json({ campaign })
  }),
  http.delete('/api/campaigns/:id', ({ params }) => {
    const id = String(params.id)
    const index = domainData.campaigns.findIndex((campaign) => campaign.id === id)
    if (index < 0) {
      return HttpResponse.json({ message: 'Campaña no encontrada' }, { status: 404 })
    }

    domainData.campaigns.splice(index, 1)
    return HttpResponse.json({ ok: true })
  }),
  http.get('/api/audit/events', ({ request }) => {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entityId')

    const events = entityId
      ? domainData.auditEvents.filter((event) => event.entityId === entityId)
      : domainData.auditEvents

    return HttpResponse.json({ events })
  }),
  http.get('/api/meta/roles', () => {
    return HttpResponse.json({ roles: domainData.roles })
  }),
  http.get('/api/meta/users', () => {
    return HttpResponse.json({ users: domainData.users })
  }),
  http.get('/api/meta/branches', () => {
    return HttpResponse.json({ branches: domainData.branches })
  }),
  http.get('/api/meta/product-taxonomy', () => {
    return HttpResponse.json({
      families: domainData.productFamilies,
      brands: domainData.productBrands,
    })
  }),
  http.get('/api/meta/scenarios', () => {
    return HttpResponse.json({ scenarios: domainData.scenarioFixtures })
  }),
]
