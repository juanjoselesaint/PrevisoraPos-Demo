import { Activity, AlertTriangle, Boxes, Building2, CircleAlert, Sparkles, Warehouse } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useSessionStore } from '@core/stores/session-store'
import { StatTile } from '@core/ui/domain/stat-tile'
import { Badge } from '@core/ui/primitives/badge'
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
import type { StockStatus } from '@core/domain/models'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'
import { useStockSnapshot } from '@features/stock/api/use-stock-snapshot'

function mapStockStatus(status: StockStatus): string {
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

function mapStockVariant(status: StockStatus): 'success' | 'warning' | 'danger' | 'promo' {
  if (status === 'in_stock') {
    return 'success'
  }
  if (status === 'low_stock') {
    return 'warning'
  }
  if (status === 'out_of_stock') {
    return 'danger'
  }

  return 'promo'
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

  useEffect(() => {
    if (!skuOptions.length) {
      return
    }

    const selectedExists = skuOptions.some((option) => option.sku === selectedSku)
    if (!selectedExists) {
      setSelectedSku(skuOptions[0].sku)
    }
  }, [selectedSku, skuOptions])

  const snapshot = data?.snapshot ?? []

  const localSnapshot = snapshot.find((item) => item.branchId === branchId)
  const alternativeSnapshots = snapshot.filter(
    (item) => item.branchId !== branchId && item.availableUnits > 0,
  )
  const totalUnits = snapshot.reduce((acc, item) => acc + item.availableUnits, 0)
  const branchesWithStock = snapshot.filter((item) => item.availableUnits > 0)
  const branchesWithoutStock = snapshot.filter((item) => item.availableUnits === 0)
  const highestUnits = Math.max(...snapshot.map((item) => item.availableUnits), 0)
  const topBranch = [...branchesWithStock].sort((a, b) => b.availableUnits - a.availableUnits)[0]
  const localShare = totalUnits > 0 ? ((localSnapshot?.availableUnits ?? 0) / totalUnits) * 100 : 0

  const selectedProduct = skuOptions.find((option) => option.sku === selectedSku)

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden border-none bg-[linear-gradient(125deg,var(--color-brand-800),var(--color-brand-600))] text-white shadow-md">
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-100)]">
                Control de inventario por sucursal
              </p>
              <h1 className="font-display mt-1 text-2xl font-semibold">Vista operativa de stock</h1>
              <p className="mt-1 max-w-2xl text-sm text-[var(--color-brand-100)]">
                Consulta disponibilidad total, reparto por sucursal y alternativas para sostener el cierre de
                venta en tiempo real.
              </p>
            </div>
            <Badge className="bg-white/20 text-white">SKU: {selectedSku}</Badge>
          </div>

          <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
            <label className="space-y-1 text-sm text-white/90">
              Producto
              <Select
                value={selectedSku}
                onChange={(event) => setSelectedSku(event.target.value)}
                className="border-white/30 bg-white text-[var(--color-ink-800)]"
              >
                {skuOptions.map((option) => (
                  <option key={option.sku} value={option.sku}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>

            <div className="rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white">
              <p className="font-semibold">Sucursal activa: {branchId}</p>
              <p className="mt-1 text-white/90">Estado local: {localSnapshot ? mapStockStatus(localSnapshot.status) : 'Sin dato'}</p>
              <p className="mt-0.5 text-white/90">Unidades locales: {localSnapshot?.availableUnits ?? 0}</p>
            </div>
          </div>

          {selectedProduct ? (
            <p className="text-xs text-[var(--color-brand-100)]">{selectedProduct.label}</p>
          ) : null}
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
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              icon={Boxes}
              tone="brand"
              label="Stock total"
              value={String(totalUnits)}
              hint="Suma de todas las sucursales"
            />
            <StatTile
              icon={Warehouse}
              tone="success"
              label="Sucursales con stock"
              value={String(branchesWithStock.length)}
              hint="Con unidades disponibles"
            />
            <StatTile
              icon={Building2}
              tone="warning"
              label="Sucursales sin stock"
              value={String(branchesWithoutStock.length)}
              hint="Con quiebre de inventario"
            />
            <StatTile
              icon={Activity}
              tone={(localSnapshot?.availableUnits ?? 0) > 0 ? 'accent' : 'danger'}
              label="Participacion local"
              value={`${localShare.toFixed(0)}%`}
              hint={localSnapshot?.branchName ?? branchId}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Distribucion por sucursal</CardTitle>
                <CardDescription>
                  Visual rapido del reparto de unidades para detectar concentracion o quiebres.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {snapshot.length ? (
                  <ul className="space-y-3">
                    {snapshot.map((row) => {
                      const width = highestUnits > 0 ? (row.availableUnits / highestUnits) * 100 : 0

                      return (
                        <li
                          key={`${row.productSku}-${row.branchId}`}
                          className="rounded-xl border border-[var(--color-surface-200)] bg-[var(--color-surface-50)] px-3 py-2.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-[var(--color-ink-900)]">{row.branchName}</p>
                              <p className="text-xs text-[var(--color-ink-600)]">{row.branchId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={mapStockVariant(row.status)}>{mapStockStatus(row.status)}</Badge>
                              <span className="font-display text-lg font-semibold text-[var(--color-ink-900)]">
                                {row.availableUnits}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 h-2 rounded-full bg-[var(--color-surface-200)]">
                            <div
                              className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-brand-500),var(--color-accent-500))] transition-[width] duration-500"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] p-3 text-sm text-[var(--color-ink-600)]">
                    Sin datos de stock para este SKU.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendacion operativa</CardTitle>
                <CardDescription>Señales para evitar perder la venta.</CardDescription>
              </CardHeader>
              <CardContent>
                {(localSnapshot?.availableUnits ?? 0) === 0 ? (
                  <div className="rounded-xl border border-[var(--color-danger-300)] bg-[var(--color-danger-100)] p-3 text-sm text-[var(--color-danger-700)]">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <CircleAlert className="h-4 w-4" />
                      Sin stock local
                    </p>
                    <p className="mt-1">Sugerir retiro desde otra sucursal o reserva de reposicion.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--color-success-300)] bg-[var(--color-success-100)] p-3 text-sm text-[var(--color-success-700)]">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="h-4 w-4" />
                      Stock local disponible
                    </p>
                    <p className="mt-1">Hay unidades para cierre inmediato en sucursal activa.</p>
                  </div>
                )}

                {topBranch ? (
                  <div className="rounded-xl border border-[var(--color-brand-300)] bg-[var(--color-brand-50)] p-3 text-sm text-[var(--color-brand-700)]">
                    Mayor concentracion: <strong>{topBranch.branchName}</strong> ({topBranch.availableUnits}{' '}
                    unidades)
                  </div>
                ) : null}

                {alternativeSnapshots.length ? (
                  <div className="rounded-xl border border-[var(--color-warning-300)] bg-[var(--color-warning-100)] p-3 text-sm text-[var(--color-warning-700)]">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Alternativas para derivar
                    </p>
                    <ul className="mt-2 space-y-1">
                      {[...alternativeSnapshots]
                        .sort((a, b) => b.availableUnits - a.availableUnits)
                        .map((snapshotItem) => (
                          <li key={snapshotItem.branchId}>
                            {snapshotItem.branchName}: {snapshotItem.availableUnits} unidades
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] p-3 text-sm text-[var(--color-ink-700)]">
                    No hay alternativas de stock en otras sucursales para este SKU.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalle por sucursal</CardTitle>
              <CardDescription>Tabla de respaldo para validacion comercial y trazabilidad.</CardDescription>
            </CardHeader>
            <CardContent>
              <TableContainer>
                <Table>
                  <thead>
                    <TableHeadRow>
                      <TableHeaderCell>Sucursal</TableHeaderCell>
                      <TableHeaderCell>Estado</TableHeaderCell>
                      <TableHeaderCell className="text-right">Unidades</TableHeaderCell>
                      <TableHeaderCell className="text-right">Participacion</TableHeaderCell>
                    </TableHeadRow>
                  </thead>
                  <tbody>
                    {snapshot.map((row) => {
                      const participation = totalUnits > 0 ? (row.availableUnits / totalUnits) * 100 : 0

                      return (
                        <TableRow key={`${row.productSku}-${row.branchId}`}>
                          <TableCell>{row.branchName}</TableCell>
                          <TableCell>
                            <Badge variant={mapStockVariant(row.status)}>{mapStockStatus(row.status)}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{row.availableUnits}</TableCell>
                          <TableCell className="text-right">{participation.toFixed(0)}%</TableCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      ) : null}
    </section>
  )
}
