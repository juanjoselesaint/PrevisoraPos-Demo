import type {
  AppRole,
  AppUser,
  AuditEvent,
  Branch,
  Campaign,
  CampaignStatus,
  CommercialQuoteSheet,
  CustomerSegment,
  FinancialEntity,
  InstallmentRule,
  Product,
  ProductBrand,
  ProductDetail,
  ProductFamily,
  QuoteSummary,
  StockSnapshot,
  UserRole,
} from '@core/domain/models'

export type { UserRole }

export interface CatalogBootstrapResponse {
  appName: string
  branchName: string
  role: UserRole
  timestamp: string
}

export interface CatalogListRequest {
  query?: string
  family?: string
  branchId?: string
  customerSegment?: 'affiliate' | 'external'
  onlyWithPromotion?: boolean
  availability?: 'all' | 'available' | 'unavailable'
}

export interface CatalogListResponse {
  items: Product[]
  total: number
}

export interface ProductDetailRequest {
  sku: string
}

export interface ProductDetailResponse {
  detail: ProductDetail
}

export interface CommercialQuoteSheetRequest {
  sku: string
  branchId: string
  customerSegment: 'affiliate' | 'external'
  paymentEntityId?: string
  negotiationDiscountPercent?: number
}

export interface CommercialQuoteSheetResponse {
  sheet: CommercialQuoteSheet
}

export interface StockSnapshotRequest {
  sku: string
}

export interface StockSnapshotResponse {
  snapshot: StockSnapshot[]
}

// Contrato obligatorio del Paso 2: reglas financieras.
export interface FinancialRulesRequest {
  sku: string
  customerSegment: 'affiliate' | 'external'
}

export interface FinancialRulesResponse {
  entities: FinancialEntity[]
  installmentRules: InstallmentRule[]
}

export interface QuoteSummaryRequest {
  quoteId: string
  negotiationDiscountPercent?: number
}

// Contrato obligatorio del Paso 2: resumen de cotización.
export interface QuoteSummaryResponse {
  summary: QuoteSummary
}

export interface QuoteSummariesResponse {
  summaries: QuoteSummary[]
}

export interface SoftlandSendQuoteRequest {
  payload: unknown
}

export interface SoftlandSendQuoteResponse {
  status: 'accepted'
  referenceId: string
  receivedAt: string
  message: string
}

export interface CampaignsListResponse {
  campaigns: Campaign[]
}

export interface CreateCampaignRequest {
  name: string
  publicationContext: string
  startsAt: string
  endsAt: string
  status: CampaignStatus
  priority: number
}

export interface UpdateCampaignRequest {
  id: string
  name: string
  publicationContext: string
  startsAt: string
  endsAt: string
  status: CampaignStatus
  priority: number
}

export interface UpsertCampaignResponse {
  campaign: Campaign
}

export interface DeleteCampaignRequest {
  id: string
}

export interface CampaignRuleSummary {
  ruleId: string
  sku: string
  productDescription: string
  offerType: string
  publicationBand: string
  customerSegment: CustomerSegment
  paymentFamily: string
  cashDiscountPercent: number
  affiliateExtraDiscountPercent: number
}

export interface CampaignRulesRequest {
  campaignId: string
}

export interface CampaignRulesResponse {
  rules: CampaignRuleSummary[]
}

export interface UpsertCampaignRuleRequest {
  campaignId: string
  sku: string
  offerType: string
  publicationBand: string
  customerSegment: CustomerSegment
  paymentFamily: string
  cashDiscountPercent: number
  affiliateExtraDiscountPercent: number
}

export interface UpsertCampaignRuleResponse {
  rule: CampaignRuleSummary
}

export interface RemoveCampaignRuleRequest {
  sku: string
}

export interface AuditEventsRequest {
  entityId?: string
}

export interface AuditEventsResponse {
  events: AuditEvent[]
}

export interface RolesResponse {
  roles: AppRole[]
}

export interface UsersResponse {
  users: AppUser[]
}

export interface BranchesResponse {
  branches: Branch[]
}

export interface ProductTaxonomyResponse {
  families: ProductFamily[]
  brands: ProductBrand[]
}

export interface ScenarioFixture {
  id: string
  title: string
  requiredByStep3: boolean
  sku?: string
  quoteId?: string
  expectedSignals: string[]
}

export interface ScenarioFixturesResponse {
  scenarios: ScenarioFixture[]
}
