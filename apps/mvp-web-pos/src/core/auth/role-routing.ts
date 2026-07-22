import type { UserRole } from '@core/api/contracts'

import { canAccessAdminArea, canAccessSellerArea } from '@core/auth/permissions'

export const roleLabels: Record<UserRole, string> = {
  seller: 'Vendedor',
  supervisor: 'Supervisor/Gerente',
  commercial_admin: 'Administrador Comercial',
  it_admin: 'Administrador IT',
}

export function getHomePathForRole(role: UserRole): string {
  if (role === 'seller') {
    return '/seller/dashboard'
  }

  return '/admin/dashboard'
}

export function canRoleAccessPath(role: UserRole, path: string): boolean {
  if (path.startsWith('/admin')) {
    return canAccessAdminArea(role)
  }

  if (path.startsWith('/seller')) {
    return canAccessSellerArea(role)
  }

  if (path === '/login' || path === '/') {
    return true
  }

  return false
}
