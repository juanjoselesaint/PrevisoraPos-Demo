import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Megaphone,
  PackageSearch,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { AuditEventType } from '@core/domain/models'
import { Badge } from '@core/ui/primitives/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { StatTile } from '@core/ui/domain/stat-tile'
import { useAuditEvents } from '@features/audit/api/use-audit-events'
import { useCampaigns } from '@features/admin-campaigns/api/use-campaigns'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'

const quickActions = [
  {
    to: '/admin/campaigns',
    title: 'Campañas',
    description: 'Alta, edicion y prioridad de campañas comerciales.',
    icon: Megaphone,
  },
  {
    to: '/admin/permissions',
    title: 'Permisos',
    description: 'Roles, rangos de descuento y accesos por feature.',
    icon: ShieldCheck,
  },
  {
    to: '/admin/audit',
    title: 'Auditoria',
    description: 'Traza de busquedas, fichas y cotizaciones.',
    icon: ClipboardList,
  },
]

const auditEventLabel: Record<AuditEventType, string> = {
  search: 'Busqueda de producto',
  open_quote_sheet: 'Apertura de ficha',
  apply_negotiation_discount: 'Descuento de negociacion',
  create_quote: 'Cotizacion creada',
  close_quote: 'Cotizacion cerrada',
}

function daysUntil(dateIso: string) {
  const diffMs = new Date(dateIso).getTime() - Date.now()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function AdminDashboardPage() {
  const navigate = useNavigate()

  const campaignsQuery = useCampaigns()
  const catalogQuery = useCatalogProducts({})
  const auditQuery = useAuditEvents()

  const campaigns = campaignsQuery.data?.campaigns ?? []
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active')
  const expiringCampaigns = activeCampaigns
    .map((campaign) => ({ ...campaign, daysLeft: daysUntil(campaign.endsAt) }))
    .filter((campaign) => campaign.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const events = [...(auditQuery.data?.events ?? [])].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  )

  return (
    <section className="space-y-5">
      <Card className="border-none bg-[linear-gradient(120deg,var(--color-brand-800),var(--color-brand-600))] text-white shadow-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-100)]">
          Gobierno comercial
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold">Panel de administracion</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--color-brand-100)]">
          Motor de promociones, permisos por rol y trazabilidad de cada consulta, ficha y cotizacion
          generada desde el panel del vendedor.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Megaphone}
          tone="success"
          label="Campañas activas"
          value={String(activeCampaigns.length)}
          hint={`${campaigns.length} campañas totales`}
        />
        <StatTile
          icon={AlertTriangle}
          tone="warning"
          label="Por vencer (14 dias)"
          value={String(expiringCampaigns.length)}
          hint="Requieren revision de vigencia"
        />
        <StatTile
          icon={PackageSearch}
          tone="brand"
          label="Catalogo total"
          value={String(catalogQuery.data?.total ?? '—')}
          hint="Todas las sucursales"
        />
        <StatTile
          icon={ClipboardList}
          tone="accent"
          label="Eventos auditados"
          value={String(events.length)}
          hint="Trazados hasta el momento"
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
              Administrar
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campañas por vencer</CardTitle>
            <CardDescription>Vigencia dentro de los proximos 14 dias.</CardDescription>
          </CardHeader>
          <CardContent>
            {expiringCampaigns.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-600)]">Sin vencimientos proximos.</p>
            ) : (
              <ul className="space-y-2">
                {expiringCampaigns.map((campaign) => (
                  <li
                    key={campaign.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-warning-300)] bg-[var(--color-warning-50)] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{campaign.name}</p>
                      <p className="text-xs text-[var(--color-ink-600)]">Vence {campaign.endsAt}</p>
                    </div>
                    <Badge variant="warning">{campaign.daysLeft}d</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Ultimos eventos trazados en el panel del vendedor.</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-600)]">Todavia no hay eventos registrados.</p>
            ) : (
              <ul className="space-y-2">
                {events.slice(0, 6).map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-surface-200)] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                        {auditEventLabel[event.eventType] ?? event.eventType}
                      </p>
                      <p className="truncate text-xs text-[var(--color-ink-600)]">{event.summary}</p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--color-ink-500)]">
                      {new Date(event.occurredAt).toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
