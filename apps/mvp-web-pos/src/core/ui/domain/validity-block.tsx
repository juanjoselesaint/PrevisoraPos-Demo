import { CalendarRange } from 'lucide-react'

import { Badge } from '@core/ui/primitives/badge'

interface ValidityBlockProps {
  validFrom: string
  validTo: string
}

function getValidityVariant(validTo: string): 'success' | 'warning' | 'danger' {
  const now = new Date()
  const end = new Date(validTo)
  const diffMs = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'danger'
  }

  if (diffDays <= 3) {
    return 'warning'
  }

  return 'success'
}

function getValidityLabel(validTo: string): string {
  const variant = getValidityVariant(validTo)

  if (variant === 'danger') {
    return 'Vencida'
  }

  if (variant === 'warning') {
    return 'Proxima a vencer'
  }

  return 'Vigente'
}

export function ValidityBlock({ validFrom, validTo }: ValidityBlockProps) {
  const variant = getValidityVariant(validTo)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
          <CalendarRange className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)]">Vigencia</p>
          <p className="text-sm font-medium text-[var(--color-ink-900)]">
            Desde {validFrom} hasta {validTo}
          </p>
        </div>
      </div>
      <Badge variant={variant}>{getValidityLabel(validTo)}</Badge>
    </div>
  )
}
