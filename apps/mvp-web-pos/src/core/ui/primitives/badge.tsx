import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@core/lib/cn'

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      neutral: 'bg-[var(--color-surface-100)] text-[var(--color-ink-700)]',
      promo: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]',
      success: 'bg-[var(--color-success-100)] text-[var(--color-success-700)]',
      warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
      danger: 'bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
