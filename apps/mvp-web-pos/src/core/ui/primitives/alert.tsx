import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@core/lib/cn'

const alertVariants = cva('rounded-xl border p-3 text-sm', {
  variants: {
    variant: {
      info: 'border-[var(--color-surface-300)] bg-[var(--color-surface-50)] text-[var(--color-ink-700)]',
      success: 'border-[var(--color-success-700)] bg-[var(--color-success-100)] text-[var(--color-success-700)]',
      warning: 'border-[var(--color-warning-600)] bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
      danger: 'border-[var(--color-danger-600)] bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}
