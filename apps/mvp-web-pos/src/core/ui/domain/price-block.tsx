import { formatCurrency } from '@core/ui/domain/format'

interface PriceBlockProps {
  basePrice: number
  offerPrice: number
  affiliatePrice: number
  hasPromotion: boolean
}

export function PriceBlock({
  basePrice,
  offerPrice,
  affiliatePrice,
  hasPromotion,
}: PriceBlockProps) {
  if (!hasPromotion) {
    return (
      <>
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-surface-300)] bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">Precio comun</p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(basePrice)}</p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-success-700)] bg-[var(--color-success-100)] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-success-700)]">Precio afiliado</p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(affiliatePrice)}</p>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-[var(--color-surface-300)] bg-[var(--color-surface-100)] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">Estado comercial</p>
          <p className="mt-1 text-sm font-medium text-[var(--color-ink-900)]">Sin promocion activa</p>
          <p className="mt-1 text-xs text-[var(--color-ink-600)]">Se cotiza con precio regular para esta vigencia.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col justify-between rounded-xl border border-[var(--color-surface-300)] bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">Precio de lista</p>
        <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(basePrice)}</p>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-[var(--color-success-700)] bg-[var(--color-success-100)] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-success-700)]">Precio afiliado</p>
        <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(affiliatePrice)}</p>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-[var(--color-brand-500)] bg-[var(--color-brand-100)] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">Precio promocion</p>
        <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">{formatCurrency(offerPrice)}</p>
      </div>
    </>
  )
}
