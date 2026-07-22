import { Banknote } from 'lucide-react'

import { formatCurrency } from '@core/ui/domain/format'

interface CashDiscountBlockProps {
  cashDiscountPercent: number
  cashPriceExternal: number
  cashPriceAffiliate: number
}

export function CashDiscountBlock({
  cashDiscountPercent,
  cashPriceExternal,
  cashPriceAffiliate,
}: CashDiscountBlockProps) {
  return (
    <section className="rounded-xl border border-[var(--color-accent-400)] bg-[var(--color-accent-50)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-500)] text-white">
            <Banknote className="h-4.5 w-4.5" />
          </span>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-700)]">
            Descuento por pago contado
          </h4>
        </div>
        <span className="rounded-full bg-[var(--color-accent-500)] px-3 py-1 text-sm font-bold text-white shadow-sm">
          {(cashDiscountPercent * 100).toFixed(0)}% OFF
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-accent-300)] bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
            Contado externo
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">
            {formatCurrency(cashPriceExternal)}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--color-accent-300)] bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
            Contado afiliado
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">
            {formatCurrency(cashPriceAffiliate)}
          </p>
        </div>
      </div>
    </section>
  )
}
