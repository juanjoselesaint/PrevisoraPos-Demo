import { Badge } from '@core/ui/primitives/badge'

interface OfferBadgeProps {
  savingsPercent: number
}

export function OfferBadge({ savingsPercent }: OfferBadgeProps) {
  if (savingsPercent <= 0) {
    return <Badge variant="neutral">Sin promo activa</Badge>
  }

  if (savingsPercent >= 20) {
    return <Badge variant="promo">Oferta destacada {savingsPercent.toFixed(0)}%</Badge>
  }

  return <Badge variant="success">Ahorro {savingsPercent.toFixed(0)}%</Badge>
}
