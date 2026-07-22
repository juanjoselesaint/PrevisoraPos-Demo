import type { UserRole } from '@core/domain/models'

export interface VisibilityPolicy {
  visible: string[]
  hidden: string[]
}

export const roleVisibilityPolicy: Record<UserRole, VisibilityPolicy> = {
  seller: {
    visible: [
      'sku',
      'description',
      'brand',
      'campaignLabel',
      'validFrom',
      'validTo',
      'basePrice',
      'offerPrice',
      'affiliatePrice',
      'cashDiscountPercent',
      'financialRows.maxInstallments',
      'financialRows.estimatedInstallmentAmount',
      'operationalNotes',
    ],
    hidden: [
      'operational.erpCode',
      'operational.posnetCode',
      'operational.softlandPaymentMapping',
      'operational.cardInstallmentCode',
      'operational.stExpression',
      'hiddenTrace.sourceRuleId',
      'hiddenTrace.sourceCampaignId',
      'hiddenTrace.stExpression',
    ],
  },
  supervisor: {
    visible: [
      'sku',
      'description',
      'brand',
      'campaignLabel',
      'validFrom',
      'validTo',
      'basePrice',
      'offerPrice',
      'affiliatePrice',
      'cashDiscountPercent',
      'financialRows',
      'operationalNotes',
      'hiddenTrace.sourceRuleId',
    ],
    hidden: ['operational.softlandPaymentMapping'],
  },
  commercial_admin: {
    visible: [
      'sku',
      'description',
      'brand',
      'campaignLabel',
      'validFrom',
      'validTo',
      'basePrice',
      'offerPrice',
      'affiliatePrice',
      'cashDiscountPercent',
      'financialRows',
      'operationalNotes',
      'hiddenTrace',
      'operational.stExpression',
    ],
    hidden: ['operational.softlandPaymentMapping'],
  },
  it_admin: {
    visible: ['*'],
    hidden: [],
  },
}
