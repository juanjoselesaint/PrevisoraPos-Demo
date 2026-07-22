import { useMemo, useState } from 'react'

import { useSessionStore } from '@core/stores/session-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Select } from '@core/ui/primitives/select'
import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableHeadRow,
  TableRow,
} from '@core/ui/primitives/table'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'
import { useStockSnapshot } from '@features/stock/api/use-stock-snapshot'

function mapStockStatus(status: string): string {
  if (status === 'in_stock') {
    return 'Disponible'
  }
  if (status === 'low_stock') {
    return 'Bajo'
  }
  if (status === 'out_of_stock') {
    return 'Agotado'
  }
  if (status === 'alternative_branch') {
    return 'Alternativa'
  }

  return status
}

export function StockPage() {
  const branchId = useSessionStore((state) => state.branchId)

  const { data: catalogData } = useCatalogProducts({ branchId })
  const skuOptions = useMemo(
    () =>
      (catalogData?.items ?? []).map((item) => ({
        sku: item.sku,
        label: `${item.sku} - ${item.description}`,
      })),
    [catalogData?.items],
  )

  const [selectedSku, setSelectedSku] = useState<string>(skuOptions[0]?.sku ?? '1002631')
  const { data, isLoading, isError, error } = useStockSnapshot(selectedSku)

  const localSnapshot = (data?.snapshot ?? []).find((item) => item.branchId === branchId)
  const alternativeSnapshots = (data?.snapshot ?? []).filter(
    (item) => item.branchId !== branchId && item.availableUnits > 0,
  )

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stock por sucursal</CardTitle>
          <CardDescription>
            Disponibilidad por sucursal activa y visualizacion de alternativas para sostener la venta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
              Producto
              <Select value={selectedSku} onChange={(event) => setSelectedSku(event.target.value)}>
                {skuOptions.map((option) => (
                  <option key={option.sku} value={option.sku}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>

            <div className="rounded-lg border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] p-3 text-sm text-[var(--color-ink-700)]">
              <p>
                Sucursal activa: <strong>{branchId}</strong>
              </p>
              <p className="mt-1">
                Estado local:{' '}
                <strong>{localSnapshot ? mapStockStatus(localSnapshot.status) : 'Sin dato'}</strong>
              </p>
              <p className="mt-1">Unidades locales: {localSnapshot?.availableUnits ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-ink-600)]">Cargando stock...</CardContent>
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-danger-700)]">
            Error de stock: {error instanceof Error ? error.message : 'error desconocido'}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Detalle por sucursal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TableContainer>
              <Table>
                <thead>
                  <TableHeadRow>
                    <TableHeaderCell>Sucursal</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell className="text-right">Unidades</TableHeaderCell>
                  </TableHeadRow>
                </thead>
                <tbody>
                  {(data?.snapshot ?? []).map((row) => (
                    <TableRow key={`${row.productSku}-${row.branchId}`}>
                      <TableCell>{row.branchName}</TableCell>
                      <TableCell>{mapStockStatus(row.status)}</TableCell>
                      <TableCell className="text-right">{row.availableUnits}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>

            {alternativeSnapshots.length ? (
              <div className="rounded-lg border border-[var(--color-success-500)] bg-[var(--color-success-100)] p-3 text-sm text-[var(--color-success-800)]">
                Alternativas disponibles:{' '}
                {alternativeSnapshots
                  .map((snapshot) => `${snapshot.branchName} (${snapshot.availableUnits})`)
                  .join(' | ')}
              </div>
            ) : (
              <div className="rounded-lg border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] p-3 text-sm text-[var(--color-ink-700)]">
                No hay alternativa de stock en otras sucursales para este SKU.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}
