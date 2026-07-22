import type { UserRole } from '@core/api/contracts'

export type FeatureKey =
  | 'seller_dashboard'
  | 'catalog'
  | 'quote_sheet'
  | 'stock'
  | 'admin_dashboard'
  | 'admin_campaigns'
  | 'admin_permissions'
  | 'audit'

const roleFeatureMatrix: Record<UserRole, FeatureKey[]> = {
  seller: ['seller_dashboard', 'catalog', 'quote_sheet', 'stock'],
  supervisor: [
    'seller_dashboard',
    'catalog',
    'quote_sheet',
    'stock',
    'admin_dashboard',
    'admin_campaigns',
    'admin_permissions',
    'audit',
  ],
  commercial_admin: ['admin_dashboard', 'admin_campaigns', 'admin_permissions', 'audit'],
  it_admin: [
    'seller_dashboard',
    'catalog',
    'quote_sheet',
    'stock',
    'admin_dashboard',
    'admin_campaigns',
    'admin_permissions',
    'audit',
  ],
}

function getRoleFeatures(role: UserRole): FeatureKey[] {
  const features = (roleFeatureMatrix as Record<string, FeatureKey[]>)[role]
  return features ?? []
}

export function hasFeaturePermission(role: UserRole, feature: FeatureKey): boolean {
  return getRoleFeatures(role).includes(feature)
}

export function canAccessSellerArea(role: UserRole): boolean {
  return hasFeaturePermission(role, 'catalog')
}

export function canAccessAdminArea(role: UserRole): boolean {
  return hasFeaturePermission(role, 'admin_dashboard')
}
