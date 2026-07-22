import { ImageOff } from 'lucide-react'

import { OfferBadge } from '@core/ui/domain/offer-badge'
import { Badge } from '@core/ui/primitives/badge'

interface ProductCardProps {
  sku: string
  description: string
  brand: string
  campaignLabel: string
  offerType: string
  publicationBand: string
  hasPromotion: boolean
  savingsPercent: number
  imageUrl?: string
}

export function ProductCard({
  sku,
  description,
  brand,
  campaignLabel,
  offerType,
  publicationBand,
  hasPromotion,
  savingsPercent,
  imageUrl,
}: ProductCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[var(--color-surface-300)] bg-white p-4 sm:flex-row">
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-100)] sm:h-auto sm:w-40">
        {imageUrl ? (
          <img src={imageUrl} alt={description} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-ink-400)]">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">SKU {sku}</p>
          <OfferBadge savingsPercent={savingsPercent} />
        </div>

        <h3 className="mt-2 text-base font-semibold leading-snug text-[var(--color-ink-900)]">{description}</h3>

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="font-medium text-[var(--color-ink-900)]">Marca:</dt>
            <dd className="text-[var(--color-ink-700)]">{brand}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="font-medium text-[var(--color-ink-900)]">Campaña:</dt>
            <dd className="text-[var(--color-ink-700)]">
              {hasPromotion ? campaignLabel : 'Precio regular (sin promocion)'}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <Badge variant={hasPromotion ? 'promo' : 'neutral'}>
            {hasPromotion ? offerType : 'Sin promocion activa'}
          </Badge>
          <span className="text-xs text-[var(--color-ink-600)]">
            {hasPromotion ? publicationBand : 'Producto en esquema regular'}
          </span>
        </div>
      </div>
    </article>
  )
}
