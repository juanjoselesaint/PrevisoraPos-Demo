import type { ReactNode } from 'react'

import { Button } from '@core/ui/primitives/button'

interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/25" role="dialog" aria-modal="true">
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-[var(--color-surface-300)] bg-white p-5 shadow-xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-[var(--color-ink-900)]">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </header>
        {children}
      </aside>
    </div>
  )
}
