import type { InputHTMLAttributes } from 'react'

import { cn } from '@core/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-[var(--color-surface-300)] bg-white px-3 text-sm text-[var(--color-ink-900)] shadow-sm transition placeholder:text-[var(--color-ink-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]',
        className,
      )}
      {...props}
    />
  )
}
