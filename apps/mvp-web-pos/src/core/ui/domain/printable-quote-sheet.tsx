import type { ReactNode } from 'react'

interface PrintableQuoteSheetProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function PrintableQuoteSheet({ title, subtitle, children }: PrintableQuoteSheetProps) {
  return (
    <section className="print-surface rounded-2xl border border-[var(--color-surface-300)] bg-white p-6 shadow-sm">
      <header className="mb-4 border-b border-[var(--color-surface-200)] pb-3">
        <h2 className="font-display text-xl font-semibold text-[var(--color-ink-900)]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-600)]">{subtitle}</p>
      </header>
      {children}
    </section>
  )
}
