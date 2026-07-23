import { LayoutDashboard, PackageSearch, Receipt, ShoppingCart, Warehouse } from 'lucide-react'

import { hasFeaturePermission } from '@core/auth/permissions'
import { useQuoteDraftStore } from '@core/stores/quote-draft-store'
import { useSessionStore } from '@core/stores/session-store'

import { ShellLayout } from '@app/layouts/shell-layout'

export function SellerLayout() {
  const role = useSessionStore((state) => state.role)
  const cartLinesCount = useQuoteDraftStore((state) => state.openQuote?.lines.length ?? 0)

  const navItems = [
    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seller/catalog', label: 'Catalogo', icon: PackageSearch },
    { to: '/seller/quote-sheet', label: 'Ficha y cotizacion', icon: Receipt },
    { to: '/seller/quote-cart', label: 'Carrito de cotizacion', icon: ShoppingCart },
    { to: '/seller/stock', label: 'Stock', icon: Warehouse },
  ].filter((item) => {
    if (item.to.includes('/catalog')) return hasFeaturePermission(role, 'catalog')
    if (item.to.includes('/quote-')) return hasFeaturePermission(role, 'quote_sheet')
    if (item.to.includes('/stock')) return hasFeaturePermission(role, 'stock')
    return hasFeaturePermission(role, 'seller_dashboard')
  })

  return (
    <ShellLayout
      headerBadge="Modo vendedor"
      navItems={navItems}
      title="Shell comercial"
      headerActions={[
        {
          to: '/seller/quote-cart',
          label: 'Carrito',
          icon: ShoppingCart,
          badgeCount: cartLinesCount,
        },
      ]}
    />
  )
}
