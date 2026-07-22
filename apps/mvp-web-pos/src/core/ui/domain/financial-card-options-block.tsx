import type { FinancialRow } from '@core/domain/models'
import { formatCurrency } from '@core/ui/domain/format'
import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableHeadRow,
  TableRow,
} from '@core/ui/primitives/table'

interface FinancialCardOptionsBlockProps {
  rows: FinancialRow[]
  externalPrice: number
  affiliatePrice: number
}

const CARD_IDS = ['naranja-x', 'sidecreer', 'bbva', 'macro'] as const

type CardId = (typeof CARD_IDS)[number]

const cardBrandMeta: Record<CardId, { name: string; short: string; bg: string; fg: string }> = {
  'naranja-x': { name: 'Naranja X', short: 'NX', bg: '#f97316', fg: '#ffffff' },
  sidecreer: { name: 'Sidecreer', short: 'SC', bg: '#2563eb', fg: '#ffffff' },
  bbva: { name: 'BBVA', short: 'BB', bg: '#1d4ed8', fg: '#ffffff' },
  macro: { name: 'Macro', short: 'MA', bg: '#dc2626', fg: '#ffffff' },
}

function logoDataUri(short: string, bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="40" viewBox="0 0 64 40"><rect width="64" height="40" rx="8" fill="${bg}"/><text x="32" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${fg}">${short}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function installmentValue(price: number, installments: number): string {
  if (installments <= 0) {
    return '-'
  }

  return `${installments}x ${formatCurrency(price / installments)}`
}

export function FinancialCardOptionsBlock({
  rows,
  externalPrice,
  affiliatePrice,
}: FinancialCardOptionsBlockProps) {
  const mappedRows = CARD_IDS.map((cardId) => {
    const row = rows.find((item) => item.entityId === cardId)
    const meta = cardBrandMeta[cardId]

    return {
      cardId,
      meta,
      row,
      maxInstallments: row?.maxInstallments ?? 0,
    }
  }).filter((item) => item.row)

  if (!mappedRows.length) {
    return (
      <div className="rounded-xl border border-[var(--color-surface-300)] bg-white p-4 text-sm text-[var(--color-ink-600)]">
        No hay tarjetas disponibles para este producto en la campaña seleccionada.
      </div>
    )
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <TableHeadRow>
            <TableHeaderCell>Tarjeta</TableHeaderCell>
            <TableHeaderCell>Descripcion</TableHeaderCell>
            <TableHeaderCell className="text-right">Cuota cliente externo</TableHeaderCell>
            <TableHeaderCell className="text-right">Cuota cliente afiliado</TableHeaderCell>
          </TableHeadRow>
        </thead>
        <tbody>
          {mappedRows.map(({ cardId, meta, maxInstallments }) => (
            <TableRow key={cardId}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <img
                    src={logoDataUri(meta.short, meta.bg, meta.fg)}
                    alt={`Logo ${meta.name}`}
                    className="h-7 w-11 shrink-0 rounded object-cover"
                  />
                  <span className="font-medium text-[var(--color-ink-900)]">{meta.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-[var(--color-ink-600)]">
                {maxInstallments > 0
                  ? `Hasta ${maxInstallments} cuotas sin interes`
                  : 'No disponible en esta campaña'}
              </TableCell>
              <TableCell className="text-right font-medium text-[var(--color-ink-900)]">
                {installmentValue(externalPrice, maxInstallments)}
              </TableCell>
              <TableCell className="text-right font-medium text-[var(--color-ink-900)]">
                {installmentValue(affiliatePrice, maxInstallments)}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}
