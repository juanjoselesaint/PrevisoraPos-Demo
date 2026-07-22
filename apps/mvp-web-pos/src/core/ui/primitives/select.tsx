import type { SelectHTMLAttributes } from 'react'

import { cn } from '@core/lib/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-[var(--color-surface-300)] bg-white px-3 text-sm text-[var(--color-ink-900)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
