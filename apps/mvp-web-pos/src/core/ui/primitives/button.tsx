import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@core/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand-700)] text-white hover:bg-[var(--color-brand-600)] focus-visible:ring-[var(--color-brand-500)]',
        secondary:
          'bg-[var(--color-surface-100)] text-[var(--color-ink-900)] hover:bg-[var(--color-surface-200)] focus-visible:ring-[var(--color-brand-500)]',
        ghost:
          'bg-transparent text-[var(--color-ink-700)] hover:bg-[var(--color-surface-100)] focus-visible:ring-[var(--color-brand-500)]',
        danger:
          'bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-500)] focus-visible:ring-[var(--color-danger-500)]',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}
