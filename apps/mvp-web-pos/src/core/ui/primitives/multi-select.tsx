import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@core/lib/cn'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (nextValue: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-[var(--color-surface-300)] bg-white px-3 text-left text-sm text-[var(--color-ink-900)] shadow-sm transition',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]',
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-[var(--color-surface-50)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-[var(--color-ink-500)]">{placeholder}</span>
        ) : (
          <span className="truncate">{selectedOptions.map((option) => option.label).join(', ')}</span>
        )}

        <span className="ml-2 flex items-center gap-2">
          {selectedOptions.length > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-brand-100)] px-1.5 py-0.5 text-xs font-semibold text-[var(--color-brand-700)]">
              {selectedOptions.length}
            </span>
          ) : null}
          <ChevronDown className="h-4 w-4 text-[var(--color-ink-500)]" />
        </span>
      </button>

      {open ? (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-[var(--color-surface-300)] bg-white p-1 shadow-lg">
          <ul role="listbox" aria-multiselectable="true" className="max-h-56 overflow-auto py-1">
            {options.map((option) => {
              const isSelected = value.includes(option.value)

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => onChange(toggleValue(value, option.value))}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm',
                      isSelected
                        ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]'
                        : 'text-[var(--color-ink-800)] hover:bg-[var(--color-surface-100)]',
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded border',
                        isSelected
                          ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)] text-white'
                          : 'border-[var(--color-surface-400)] bg-white text-transparent',
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{option.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
