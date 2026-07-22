import { ImageOff, MapPin, PackageSearch, Search, SlidersHorizontal, Sparkles, Tag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSessionStore } from '@core/stores/session-store'
import { Badge } from '@core/ui/primitives/badge'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Input } from '@core/ui/primitives/input'
import { Select } from '@core/ui/primitives/select'
import { useCatalogFilters } from '@features/catalog/api/use-catalog-filters'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'

type AvailabilityFilter = 'all' | 'available' | 'unavailable'

export function CatalogPage() {
  const navigate = useNavigate()

  const role = useSessionStore((state) => state.role)
  const sessionBranchId = useSessionStore((state) => state.branchId)
  const customerSegment = useSessionStore((state) => state.customerSegment)

  const [query, setQuery] = useState('')
  const [family, setFamily] = useState('all')
  const [branchId, setBranchId] = useState(sessionBranchId)
  const [availability, setAvailability] = useState<AvailabilityFilter>('all')
  const [onlyWithPromotion, setOnlyWithPromotion] = useState(false)

  const { branchesQuery, taxonomyQuery } = useCatalogFilters()

  const catalogRequest = useMemo(
    () => ({
      query,
      family: family === 'all' ? undefined : family,
      branchId,
      customerSegment,
      onlyWithPromotion,
      availability,
    }),
    [availability, branchId, customerSegment, family, onlyWithPromotion, query],
  )

  const { data, isLoading, isError, error } = useCatalogProducts(catalogRequest)

  const families = taxonomyQuery.data?.families ?? []
  const branches = branchesQuery.data?.branches ?? []

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-100)] text-[var(--color-brand-700)]">
              <PackageSearch className="h-4.5 w-4.5" />
            </span>
            <div>
              <CardTitle>Catalogo comercial</CardTitle>
              <CardDescription>
                Busqueda tipo marketplace sobre todo el catalogo, no solo lo promocionado.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-1 text-sm text-[var(--color-ink-700)] md:col-span-2">
              <span className="inline-flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" /> Buscar producto
              </span>
              <Input
                value={query}
                placeholder="SKU, descripcion o marca"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
              <span className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Familia
              </span>
              <Select value={family} onChange={(event) => setFamily(event.target.value)}>
                <option value="all">Todas</option>
                {families.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </label>

            <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Sucursal
              </span>
              <Select value={branchId} onChange={(event) => setBranchId(event.target.value)}>
                {branches.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </label>

            <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
              <span className="inline-flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Disponibilidad
              </span>
              <Select
                value={availability}
                onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              >
                <option value="all">Todo</option>
                <option value="available">Disponible</option>
                <option value="unavailable">Sin stock</option>
              </Select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-ink-700)]">
            <label className="inline-flex items-center gap-2 rounded-full border border-[var(--color-surface-300)] px-3 py-1.5">
              <input
                type="checkbox"
                checked={onlyWithPromotion}
                onChange={(event) => setOnlyWithPromotion(event.target.checked)}
              />
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-600)]" />
              Solo promociones activas
            </label>
            <span className="rounded-full bg-[var(--color-surface-100)] px-3 py-1 text-xs font-medium text-[var(--color-ink-700)]">
              Rol: {role} | Segmento: {customerSegment}
            </span>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-ink-600)]">
            Cargando catalogo...
          </CardContent>
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-danger-700)]">
            Error al cargar catalogo: {error instanceof Error ? error.message : 'error desconocido'}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-ink-600)]">
            Resultados: <span className="font-semibold text-[var(--color-ink-900)]">{data?.total ?? 0}</span>
          </p>

          {data?.items.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((item) => {
                const hasPromotion = item.offerPrice < item.basePrice

                return (
                  <Card key={item.sku} className="flex h-full flex-col overflow-hidden p-0">
                    <div className="relative h-40 w-full shrink-0 bg-[var(--color-surface-100)]">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.description}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-ink-400)]">
                          <ImageOff className="h-8 w-8" />
                        </div>
                      )}
                      {hasPromotion ? (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-500)] px-2.5 py-1 text-xs font-semibold text-white shadow">
                          <Sparkles className="h-3 w-3" />
                          -{item.savingsPercent.toFixed(0)}%
                        </span>
                      ) : null}
                    </div>

                    <CardHeader className="px-4 pt-4">
                      <CardTitle className="text-base leading-snug">{item.description}</CardTitle>
                      <CardDescription>SKU {item.sku}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col space-y-3 px-4 pb-4">
                      <div className="flex items-baseline gap-2">
                        {hasPromotion ? (
                          <span className="text-sm text-[var(--color-ink-500)] line-through">
                            ${item.basePrice.toLocaleString('es-AR')}
                          </span>
                        ) : null}
                        <span
                          className={`text-xl font-semibold ${hasPromotion ? 'text-[var(--color-success-700)]' : 'text-[var(--color-ink-900)]'}`}
                        >
                          ${item.offerPrice.toLocaleString('es-AR')}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--color-ink-600)]">
                        Vigencia: {item.validFrom} al {item.validTo}
                      </p>

                      {hasPromotion ? (
                        <Badge variant="success" className="w-fit">
                          Promocion activa - Ahorro {item.savingsPercent.toFixed(2)}%
                        </Badge>
                      ) : (
                        <Badge variant="neutral" className="w-fit">
                          Sin promocion activa
                        </Badge>
                      )}

                      <div className="mt-auto pt-3">
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/seller/quote-sheet?sku=${item.sku}&intent=cotizar`)}
                        >
                          Cotizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-[var(--color-ink-600)]">
                No hay resultados para los filtros seleccionados.
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </section>
  )
}
