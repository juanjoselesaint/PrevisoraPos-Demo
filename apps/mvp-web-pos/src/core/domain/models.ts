export type UserRole = 'seller' | 'supervisor' | 'commercial_admin' | 'it_admin'

export type CustomerSegment = 'affiliate' | 'external'

export type CampaignStatus = 'draft' | 'active' | 'expired'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'alternative_branch'

export type QuoteStatus = 'open' | 'ready_to_send' | 'sent' | 'cancelled'

export type AuditEventType =
  | 'search'
  | 'open_quote_sheet'
  | 'apply_negotiation_discount'
  | 'create_quote'
  | 'close_quote'

export interface AppRole {
  code: UserRole
  name: string
  description: string
}

export interface AppUser {
  id: string
  displayName: string
  email: string
  role: UserRole
  branchId: string
}

export interface Branch {
  id: string
  name: string
  city: string
}

export interface ProductOperationalData {
  erpCode: string
  posnetCode: string
  softlandPaymentMapping: string
  cardInstallmentCode: string
  stExpression: string
}

export interface Product {
  sku: string
  description: string
  brand: string
  family: string
  imageUrl: string
  basePrice: number
  offerPrice: number
  savingsPercent: number
  campaignLabel: string
  validFrom: string
  validTo: string
  operational: ProductOperationalData
}

export interface Campaign {
  id: string
  name: string
  publicationContext: string
  startsAt: string
  endsAt: string
  status: CampaignStatus
  priority: number
}

export interface RuleCondition {
  customerSegment: CustomerSegment
  paymentFamily: string
  appliesOfferPrice: boolean
  appliesPequeRate: boolean
  isInterestFree: boolean
}

export interface PromotionRule {
  id: string
  campaignId: string
  offerType: string
  publicationBand: string
  affiliateExtraDiscountPercent: number
  cashDiscountPercent: number
  condition: RuleCondition
}

export interface FinancialEntity {
  id: string
  name: string
  family: string
}

export interface ProductFamily {
  id: string
  name: string
}

export interface ProductBrand {
  id: string
  name: string
}

export interface InstallmentRule {
  id: string
  basePlanType: string
  entityId: string
  maxInstallments: number
  paymentCondition: 'interest_free' | 'with_interest'
  notes?: string
}

export interface FinancialRow {
  entityId: string
  entityName: string
  paymentFamily: string
  maxInstallments: number
  estimatedInstallmentAmount: number
  paymentCondition: 'interest_free' | 'with_interest'
  notes?: string
}

export interface StockSnapshot {
  productSku: string
  branchId: string
  branchName: string
  availableUnits: number
  status: StockStatus
}

export interface QuoteLine {
  sku: string
  description: string
  quantity: number
  unitPrice: number
  appliedDiscountPercent: number
  subtotal: number
}

export interface QuoteSummary {
  id: string
  branchId: string
  customerSegment: CustomerSegment
  status: QuoteStatus
  lines: QuoteLine[]
  totalBeforeDiscount: number
  totalAfterDiscount: number
  paymentEntityId: string
  paymentInstallments: number
  negotiationDiscount?: {
    enabled: boolean
    requestedPercent: number
    approved: boolean
    reason: string
  }
}

export interface AuditEvent {
  id: string
  eventType: AuditEventType
  occurredAt: string
  actorUserId: string
  actorRole: UserRole
  entityType: 'product' | 'quote_sheet' | 'quote' | 'campaign' | 'discount'
  entityId: string
  summary: string
}

export interface ProductDetail {
  product: Product
  campaign: Campaign
  rule: PromotionRule
}

export interface CommercialQuoteSheet {
  sku: string
  branchId: string
  customerSegment: CustomerSegment
  title: string
  description: string
  brand: string
  campaignLabel: string
  offerType: string
  publicationBand: string
  validFrom: string
  validTo: string
  basePrice: number
  offerPrice: number
  affiliatePrice: number
  cashDiscountPercent: number
  cashPriceExternal: number
  cashPriceAffiliate: number
  financialRows: FinancialRow[]
  operationalNotes: string[]
  hiddenTrace: {
    sourceRuleId: string
    sourceCampaignId: string
    stExpression: string
  }
}