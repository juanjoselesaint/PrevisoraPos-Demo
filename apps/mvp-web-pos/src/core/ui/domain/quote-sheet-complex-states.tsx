import type { FinancialRow } from '@core/domain/models'
import { Alert } from '@core/ui/primitives/alert'

interface QuoteSheetComplexStatesProps {
  validTo: string
  financialRows: FinancialRow[]
  notes: string[]
}

function getDaysToExpiration(validTo: string): number {
  const now = new Date()
  const end = new Date(`${validTo}T00:00:00`)
  const diffMs = end.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function QuoteSheetComplexStates({ validTo, financialRows, notes }: QuoteSheetComplexStatesProps) {
  const daysToExpiration = getDaysToExpiration(validTo)
  const blockedRows = financialRows.filter((row) => row.maxInstallments === 0)
  const hasStockRisk = notes.some((note) => note.toLowerCase().includes('stock'))

  const hasAnyState = daysToExpiration <= 3 || blockedRows.length > 0 || hasStockRisk

  if (!hasAnyState) {
    return null
  }

  return (
    <section className="space-y-2">
      {daysToExpiration < 0 ? (
        <Alert variant="danger">
          Oferta vencida. Revisar campaña vigente antes de avanzar con cotizacion.
        </Alert>
      ) : null}

      {daysToExpiration >= 0 && daysToExpiration <= 3 ? (
        <Alert variant="warning">
          Oferta proxima a vencer. Quedan {daysToExpiration} dias de vigencia comercial.
        </Alert>
      ) : null}

      {blockedRows.length > 0 ? (
        <Alert variant="warning">
          Se detectaron {blockedRows.length} medios financieros no aplicables por regla comercial o
          exclusiones operativas.
        </Alert>
      ) : null}

      {hasStockRisk ? (
        <Alert variant="info">
          Existen alertas de stock en esta ficha. Validar disponibilidad local antes de confirmar la
          operacion.
        </Alert>
      ) : null}
    </section>
  )
}
