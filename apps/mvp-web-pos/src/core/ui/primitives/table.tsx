import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { cn } from '@core/lib/cn'

export function TableContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-[var(--color-surface-300)] bg-white',
        className,
      )}
      {...props}
    />
  )
}

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('min-w-full border-collapse text-sm', className)} {...props} />
}

export function TableHeadRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('bg-[var(--color-surface-100)] text-left', className)} {...props} />
}

export function TableHeaderCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]', className)}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-t border-[var(--color-surface-200)]', className)} {...props} />
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-3 py-2 text-[var(--color-ink-700)]', className)} {...props} />
}
