import { ClipboardList, LayoutDashboard, Megaphone, ShieldCheck } from 'lucide-react'

import { hasFeaturePermission } from '@core/auth/permissions'
import { useSessionStore } from '@core/stores/session-store'

import { ShellLayout } from '@app/layouts/shell-layout'

export function AdminLayout() {
  const role = useSessionStore((state) => state.role)

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/campaigns', label: 'Campañas', icon: Megaphone },
    { to: '/admin/permissions', label: 'Permisos', icon: ShieldCheck },
    { to: '/admin/audit', label: 'Auditoria', icon: ClipboardList },
  ].filter((item) => {
    if (item.to.includes('campaigns')) {
      return hasFeaturePermission(role, 'admin_campaigns')
    }

    if (item.to.includes('permissions')) {
      return hasFeaturePermission(role, 'admin_permissions')
    }

    if (item.to.includes('audit')) {
      return hasFeaturePermission(role, 'audit')
    }

    return hasFeaturePermission(role, 'admin_dashboard')
  })

  return (
    <ShellLayout
      headerBadge="Modo administracion"
      navItems={navItems}
      title=""
    />
  )
}
