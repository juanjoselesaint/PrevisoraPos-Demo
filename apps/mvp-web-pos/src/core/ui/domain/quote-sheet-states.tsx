import { Alert } from '@core/ui/primitives/alert'
import { Card } from '@core/ui/primitives/card'

export function QuoteSheetLoadingState() {
  return (
    <Card>
      <p className="text-sm text-[var(--color-ink-700)]">Cargando ficha comercial...</p>
    </Card>
  )
}

interface QuoteSheetErrorStateProps {
  message?: string
}

export function QuoteSheetErrorState({ message }: QuoteSheetErrorStateProps) {
  return (
    <Alert variant="danger">
      {message ?? 'No se pudo calcular la ficha comercial para el producto seleccionado.'}
    </Alert>
  )
}

export function QuoteSheetEmptyState() {
  return (
    <Alert variant="info">
      Selecciona un SKU, sucursal y segmento para ver el resultado del motor comercial.
    </Alert>
  )
}
