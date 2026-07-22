import { cn } from '@core/lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: () => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-[var(--color-brand-600)]' : 'bg-[var(--color-surface-300)]',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  )
}
