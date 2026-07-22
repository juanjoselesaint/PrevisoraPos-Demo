import type { ComponentType } from 'react'

import { cn } from '@core/lib/cn'
import { Card } from '@core/ui/primitives/card'

type StatTone = 'brand' | 'accent' | 'success' | 'warning' | 'danger'

const toneStyles: Record<StatTone, string> = {
  brand: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]',
  accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-700)]',
  success: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]',
  warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)]',
  danger: 'bg-[var(--color-danger-100)] text-[var(--color-danger-700)]',
}

interface StatTileProps {
  label: string
  value: string
  hint?: string
  icon: ComponentType<{ className?: string }>
  tone?: StatTone
  className?: string
}

export function StatTile({ label, value, hint, icon: Icon, tone = 'brand', className }: StatTileProps) {
  return (
    <Card className={cn('flex items-start gap-3', className)}>
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', toneStyles[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--color-ink-600)]">{label}</p>
        <p className="font-display text-2xl font-semibold leading-tight text-[var(--color-ink-900)]">{value}</p>
        {hint ? <p className="mt-0.5 truncate text-xs text-[var(--color-ink-500)]">{hint}</p> : null}
      </div>
    </Card>
  )
}
