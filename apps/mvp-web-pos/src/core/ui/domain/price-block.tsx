import { formatCurrency } from '@core/ui/domain/format'

interface PriceBlockProps {
  externalPrice: number
  offerPrice: number
  affiliatePrice: number
}

export function PriceBlock({
  externalPrice,
  offerPrice,
  affiliatePrice,
}: PriceBlockProps) {
  return (
    <>
      <div className="flex flex-col justify-between rounded-xl border border-[var(--color-surface-300)] bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">Precio externo</p>
        <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(externalPrice)}</p>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-[var(--color-success-700)] bg-[var(--color-success-100)] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-success-700)]">Precio afiliado</p>
        <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(affiliatePrice)}</p>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-[var(--color-brand-500)] bg-[var(--color-brand-100)] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">Precio oferta</p>
        <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(offerPrice)}</p>
      </div>
    </>
  )
}
