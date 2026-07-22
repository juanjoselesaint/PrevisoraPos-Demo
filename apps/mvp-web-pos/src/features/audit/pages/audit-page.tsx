import { FileSearch, HandCoins, Printer, Receipt, ReceiptText, SearchCheck } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { AuditEventType } from '@core/domain/models'
import { useAuditStore } from '@core/stores/audit-store'
import { Badge } from '@core/ui/primitives/badge'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Input } from '@core/ui/primitives/input'
import { PrintableQuoteSheet } from '@core/ui/domain/printable-quote-sheet'
import { Select } from '@core/ui/primitives/select'
import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableHeadRow,
  TableRow,
} from '@core/ui/primitives/table'
import { useAuditEvents } from '@features/audit/api/use-audit-events'

type AuditFilterType =
  | 'all'
  | 'search'
  | 'open_quote_sheet'
  | 'apply_negotiation_discount'
  | 'create_quote'
  | 'close_quote'

const eventTypeLabel: Record<AuditEventType, string> = {
  search: 'Busqueda',
  open_quote_sheet: 'Apertura ficha',
  apply_negotiation_discount: 'Negociacion',
  create_quote: 'Crear cotizacion',
  close_quote: 'Cerrar cotizacion',
}

const eventTypeIcon: Record<AuditEventType, typeof FileSearch> = {
  search: FileSearch,
  open_quote_sheet: ReceiptText,
  apply_negotiation_discount: HandCoins,
  create_quote: Receipt,
  close_quote: SearchCheck,
}

export function AuditPage() {
  const [entityFilter, setEntityFilter] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState<AuditFilterType>('all')

  const { data, isLoading, isError, error } = useAuditEvents(entityFilter.trim() || undefined)
  const runtimeEvents = useAuditStore((state) => state.runtimeEvents)
  const clearRuntimeEvents = useAuditStore((state) => state.clearRuntimeEvents)

  const mergedEvents = useMemo(() => {
    const staticEvents = data?.events ?? []
    return [...runtimeEvents, ...staticEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
  }, [data?.events, runtimeEvents])

  const filteredEvents = mergedEvents.filter((event) =>
    eventTypeFilter === 'all' ? true : event.eventType === eventTypeFilter,
  )

  const printableEvidence = JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalEvents: filteredEvents.length,
      events: filteredEvents,
    },
    null,
    2,
  )

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Auditoria y evidencia</CardTitle>
          <CardDescription>
            Traza de busquedas, apertura de ficha, descuentos de negociacion y ciclo de cotizacion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
              Filtrar por entidad
              <Input
                value={entityFilter}
                placeholder="SKU, quote id, campaign id"
                onChange={(event) => setEntityFilter(event.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
              Tipo de evento
              <Select
                value={eventTypeFilter}
                onChange={(event) => setEventTypeFilter(event.target.value as AuditFilterType)}
              >
                <option value="all">Todos</option>
                <option value="search">Busqueda</option>
                <option value="open_quote_sheet">Apertura ficha</option>
                <option value="apply_negotiation_discount">Negociacion</option>
                <option value="create_quote">Crear cotizacion</option>
                <option value="close_quote">Cerrar cotizacion</option>
              </Select>
            </label>

            <div className="flex items-end">
              <Button variant="secondary" onClick={clearRuntimeEvents}>
                Limpiar eventos runtime
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-ink-600)]">Cargando eventos...</CardContent>
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-danger-700)]">
            Error de auditoria: {error instanceof Error ? error.message : 'error desconocido'}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Eventos trazados ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <TableContainer>
              <Table>
                <thead>
                  <TableHeadRow>
                    <TableHeaderCell>Fecha</TableHeaderCell>
                    <TableHeaderCell>Evento</TableHeaderCell>
                    <TableHeaderCell>Entidad</TableHeaderCell>
                    <TableHeaderCell>Resumen</TableHeaderCell>
                  </TableHeadRow>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => {
                    const EventIcon = eventTypeIcon[event.eventType]
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="whitespace-nowrap text-xs text-[var(--color-ink-600)]">
                          {new Date(event.occurredAt).toLocaleString('es-AR')}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5">
                            <EventIcon className="h-3.5 w-3.5 text-[var(--color-brand-600)]" />
                            <Badge variant="neutral">{eventTypeLabel[event.eventType]}</Badge>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-[var(--color-ink-600)]">
                          {event.entityType} / {event.entityId}
                        </TableCell>
                        <TableCell>{event.summary}</TableCell>
                      </TableRow>
                    )
                  })}
                </tbody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <PrintableQuoteSheet
          title="Evidencia de auditoria"
          subtitle={`Generado ${new Date().toLocaleString('es-AR')} · ${filteredEvents.length} eventos trazados`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-surface-200)] pb-3">
            <p className="text-xs text-[var(--color-ink-600)]">
              Comprobante de traza para adjuntar al legajo de la venta, reemplaza la captura de pantalla manual.
            </p>
            <Button variant="secondary" className="no-print shrink-0" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" />
              Imprimir
            </Button>
          </div>

          <ol className="mt-3 space-y-2">
            {filteredEvents.map((event) => {
              const EventIcon = eventTypeIcon[event.eventType]
              return (
                <li key={event.id} className="flex items-start gap-3 rounded-lg border border-[var(--color-surface-200)] p-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
                    <EventIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--color-ink-900)]">
                        {eventTypeLabel[event.eventType]} · {event.entityType} {event.entityId}
                      </p>
                      <span className="text-xs text-[var(--color-ink-500)]">
                        {new Date(event.occurredAt).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-ink-600)]">{event.summary}</p>
                    <p className="text-[11px] text-[var(--color-ink-500)]">
                      Actor: {event.actorUserId} ({event.actorRole})
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          <details className="no-print group mt-4 rounded-lg border border-[var(--color-surface-300)]">
            <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)] group-open:border-b group-open:border-[var(--color-surface-300)]">
              Ver payload tecnico (JSON exportable)
            </summary>
            <pre className="max-h-72 overflow-auto rounded-b-lg bg-[var(--color-surface-50)] p-3 text-xs text-[var(--color-ink-700)]">
              {printableEvidence}
            </pre>
          </details>
        </PrintableQuoteSheet>
      ) : null}
    </section>
  )
}
