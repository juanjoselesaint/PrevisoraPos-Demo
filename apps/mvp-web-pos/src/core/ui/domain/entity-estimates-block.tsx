import type { FinancialRow } from '@core/domain/models'
import { formatCurrency } from '@core/ui/domain/format'

interface EntityEstimatesBlockProps {
  rows: FinancialRow[]
}

export function EntityEstimatesBlock({ rows }: EntityEstimatesBlockProps) {
  const applicableRows = rows.filter((row) => row.maxInstallments > 0)

  return (
    <section className="rounded-xl border border-[var(--color-surface-300)] bg-white p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">
        Importes estimados por entidad
      </h4>

      {applicableRows.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--color-ink-600)]">
          No hay entidades aplicables para el contexto comercial actual.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {applicableRows.map((row) => (
            <li
              key={`estimate-${row.entityId}`}
              className="flex items-center justify-between rounded-lg border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-ink-900)]">{row.entityName}</p>
                <p className="text-xs text-[var(--color-ink-600)]">Hasta {row.maxInstallments} cuotas</p>
              </div>
              <p className="text-sm font-semibold text-[var(--color-ink-900)]">
                {formatCurrency(row.estimatedInstallmentAmount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
