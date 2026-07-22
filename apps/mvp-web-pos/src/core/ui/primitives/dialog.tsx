import type { ReactNode } from 'react'

import { cn } from '@core/lib/cn'
import { Button } from '@core/ui/primitives/button'

interface DialogProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  footer?: ReactNode
  contentClassName?: string
  bodyClassName?: string
  children: ReactNode
}

export function Dialog({
  open,
  title,
  description,
  onClose,
  footer,
  contentClassName,
  bodyClassName,
  children,
}: DialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true">
      <div
        className={cn(
          'w-full max-w-lg rounded-2xl border border-[var(--color-surface-300)] bg-white p-5 shadow-lg',
          contentClassName,
        )}
      >
        <header>
          <h2 className="font-display text-lg font-semibold text-[var(--color-ink-900)]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[var(--color-ink-600)]">{description}</p> : null}
        </header>

        <div className={cn('mt-4', bodyClassName)}>{children}</div>

        <footer className="mt-5 flex justify-end gap-2">
          {footer}
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  )
}
