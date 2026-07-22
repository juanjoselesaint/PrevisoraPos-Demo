import { ArrowRight, Boxes, Megaphone, PackageSearch, Receipt, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useCurrentUser } from '@core/auth/use-current-user'
import { useSessionStore } from '@core/stores/session-store'
import { Badge } from '@core/ui/primitives/badge'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { StatTile } from '@core/ui/domain/stat-tile'
import { useCampaigns } from '@features/admin-campaigns/api/use-campaigns'
import { useCatalogFilters } from '@features/catalog/api/use-catalog-filters'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'
import { useQuoteSummaries } from '@features/dashboard/api/use-quote-summaries'

const quickActions = [
  {
    to: '/seller/catalog',
    title: 'Buscar producto',
    description: 'Catalogo completo con filtros por sucursal y promocion.',
    icon: PackageSearch,
  },
  {
    to: '/seller/quote-sheet',
    title: 'Armar ficha y cotizacion',
    description: 'Precio, financiacion y descuento de negociacion.',
    icon: Receipt,
  },
  {
    to: '/seller/stock',
    title: 'Consultar stock',
    description: 'Disponibilidad por sucursal y alternativas.',
    icon: Boxes,
  },
]

const quoteStatusLabel: Record<string, string> = {
  open: 'Abierta',
  ready_to_send: 'Lista para enviar',
  sent: 'Enviada a Softland',
  cancelled: 'Cancelada',
}

const quoteStatusVariant: Record<string, 'neutral' | 'promo' | 'success' | 'warning'> = {
  open: 'warning',
  ready_to_send: 'promo',
  sent: 'success',
  cancelled: 'neutral',
}

const customerSegmentLabel: Record<string, string> = {
  external: 'Externo',
  affiliate: 'Afiliado',
}

export function SellerDashboardPage() {
  const navigate = useNavigate()
  const branchId = useSessionStore((state) => state.branchId)
  const customerSegment = useSessionStore((state) => state.customerSegment)

  const { branchesQuery } = useCatalogFilters()
  const branchName =
    branchesQuery.data?.branches.find((branch) => branch.id === branchId)?.name ?? branchId
  const { currentUser } = useCurrentUser()
  const userName = currentUser?.displayName ?? 'vendedor'

  const promoQuery = useCatalogProducts({ branchId, customerSegment, onlyWithPromotion: true })
  const catalogQuery = useCatalogProducts({ branchId, customerSegment })
  const campaignsQuery = useCampaigns()
  const quotesQuery = useQuoteSummaries()

  const activeCampaigns = (campaignsQuery.data?.campaigns ?? [])
    .filter((campaign) => campaign.status === 'active')
    .sort((a, b) => b.priority - a.priority)

  const quotes = [...(quotesQuery.data?.summaries ?? [])].sort((a, b) => b.id.localeCompare(a.id))
  const branches = branchesQuery.data?.branches ?? []

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden border-none bg-[linear-gradient(120deg,var(--color-brand-800),var(--color-brand-600))] text-white shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-100)]">
              Panel del vendedor · {branchName}
            </p>
            <h1 className="font-display mt-1 text-2xl font-semibold">Hola, {userName}</h1>
            <p className="mt-1 max-w-lg text-sm text-[var(--color-brand-100)]">
              Buscá cualquier producto del catálogo, armá la ficha comercial con precios y financiación, y
              enviá la cotización a Softland sin usar el Excel.
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-fit bg-white text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]"
            onClick={() => navigate('/seller/catalog')}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            Ir al catalogo
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={PackageSearch}
          tone="brand"
          label="Catalogo disponible"
          value={String(catalogQuery.data?.total ?? '—')}
          hint={`Sucursal ${branchName}`}
        />
        <StatTile
          icon={Sparkles}
          tone="accent"
          label="Productos en promocion"
          value={String(promoQuery.data?.total ?? '—')}
          hint="Con descuento activo hoy"
        />
        <StatTile
          icon={Megaphone}
          tone="success"
          label="Campañas activas"
          value={String(activeCampaigns.length)}
          hint="Vigentes en este momento"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <button
            key={action.to}
            type="button"
            onClick={() => navigate(action.to)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-[var(--color-surface-300)] bg-white p-4 text-left shadow-sm transition hover:border-[var(--color-brand-400)] hover:shadow-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
              <action.icon className="h-4.5 w-4.5" />
            </span>
            <p className="font-medium text-[var(--color-ink-900)]">{action.title}</p>
            <p className="text-xs text-[var(--color-ink-600)]">{action.description}</p>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-600)]">
              Ir ahora
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Campañas destacadas</CardTitle>
            <CardDescription>Prioridad comercial vigente para ofrecer primero.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-600)]">No hay campañas activas en este momento.</p>
            ) : (
              <ul className="space-y-2">
                {activeCampaigns.slice(0, 4).map((campaign) => (
                  <li
                    key={campaign.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-surface-200)] bg-[var(--color-surface-50)] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{campaign.name}</p>
                      <p className="text-xs text-[var(--color-ink-600)]">
                        {campaign.publicationContext} · vence {campaign.endsAt}
                      </p>
                    </div>
                    <Badge variant="promo">Prioridad {campaign.priority}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ultimas cotizaciones</CardTitle>
            <CardDescription>Cotizaciones armadas recientemente.</CardDescription>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-600)]">Todavia no armaste cotizaciones.</p>
            ) : (
              <ul className="space-y-2">
                {quotes.slice(0, 4).map((quote) => {
                  const primaryLine = quote.lines[0]
                  const extraLines = quote.lines.length - 1
                  const quoteBranchName =
                    branches.find((branch) => branch.id === quote.branchId)?.name ?? quote.branchId

                  return (
                    <li
                      key={quote.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-surface-200)] px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                          {primaryLine?.description ?? 'Cotizacion sin productos'}
                          {extraLines > 0 ? ` +${extraLines}` : ''}
                        </p>
                        <p className="truncate text-xs text-[var(--color-ink-600)]">
                          {quoteBranchName} · {customerSegmentLabel[quote.customerSegment] ?? quote.customerSegment}
                          {' · '}
                          <span className="font-medium text-[var(--color-ink-700)]">
                            ${quote.totalAfterDiscount.toLocaleString('es-AR')}
                          </span>
                        </p>
                      </div>
                      <Badge variant={quoteStatusVariant[quote.status] ?? 'neutral'}>
                        {quoteStatusLabel[quote.status] ?? quote.status}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
