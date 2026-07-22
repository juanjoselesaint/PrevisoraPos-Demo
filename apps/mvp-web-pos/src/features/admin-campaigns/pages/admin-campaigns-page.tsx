import { ChevronDown, ChevronRight, CircleHelp, MapPin, Package, Pencil, Plus, Search, Trash2, Users, Wallet, X } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

import type { CampaignRuleSummary } from '@core/api/contracts'
import { buildPublicationBandWithCards, parseCardInstallmentCaps, stripPublicationBandMetadata } from '@core/domain/publication-band'
import { Badge } from '@core/ui/primitives/badge'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Dialog } from '@core/ui/primitives/dialog'
import { Input } from '@core/ui/primitives/input'
import { MultiSelect } from '@core/ui/primitives/multi-select'
import { Select } from '@core/ui/primitives/select'
import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableHeadRow,
  TableRow,
} from '@core/ui/primitives/table'
import { useCampaignRules } from '@features/admin-campaigns/api/use-campaign-rules'
import { useCampaigns } from '@features/admin-campaigns/api/use-campaigns'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'

const paymentFamilyLabel: Record<string, string> = {
  all: 'Cualquier medio',
  credit_card: 'Tarjeta de credito',
  debit_card: 'Tarjeta de debito',
  bank_transfer: 'Transferencia',
  cash: 'Efectivo',
  'naranja-x': 'Naranja X',
  sidecreer: 'Sidecreer',
  bbva: 'BBVA',
  macro: 'Macro',
  none: 'No aplicable',
}

const paymentFamilyOptions = [
  { value: 'all', label: paymentFamilyLabel.all },
  { value: 'credit_card', label: paymentFamilyLabel.credit_card },
  { value: 'debit_card', label: paymentFamilyLabel.debit_card },
  { value: 'bank_transfer', label: paymentFamilyLabel.bank_transfer },
  { value: 'cash', label: paymentFamilyLabel.cash },
]

const cardOptions = [
  { value: 'naranja-x', label: paymentFamilyLabel['naranja-x'] },
  { value: 'sidecreer', label: paymentFamilyLabel.sidecreer },
  { value: 'bbva', label: paymentFamilyLabel.bbva },
  { value: 'macro', label: paymentFamilyLabel.macro },
]

const customerSegmentOptions = [
  { value: 'external', label: 'Externo' },
  { value: 'affiliate', label: 'Afiliado' },
]

type CustomerSegment = 'external' | 'affiliate'

type RuleDraft = {
  skus: string[]
  customerSegments: CustomerSegment[]
  paymentFamilies: string[]
  selectedCards: string[]
  cardInstallmentCaps: Record<string, string>
  cashDiscountPercent: string
  affiliateExtraDiscountPercent: string
}

const EMPTY_RULE_DRAFT: RuleDraft = {
  skus: [],
  customerSegments: ['external'],
  paymentFamilies: ['all'],
  selectedCards: [],
  cardInstallmentCaps: {
    'naranja-x': '6',
    sidecreer: '6',
    bbva: '6',
    macro: '6',
  },
  cashDiscountPercent: '0',
  affiliateExtraDiscountPercent: '0',
}

function ruleToDraft(rule: CampaignRuleSummary): RuleDraft {
  const rawPaymentFamilies = rule.paymentFamily
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  const selectedCards = rawPaymentFamilies.filter((value) => cardOptions.some((card) => card.value === value))
  const normalizedPaymentFamilies = rawPaymentFamilies
    .filter((value) => !cardOptions.some((card) => card.value === value))

  if (selectedCards.length > 0 && !normalizedPaymentFamilies.includes('credit_card')) {
    normalizedPaymentFamilies.push('credit_card')
  }

  if (normalizedPaymentFamilies.length === 0) {
    normalizedPaymentFamilies.push('all')
  }

  const cardInstallmentCaps = parseCardInstallmentCaps(rule.publicationBand)

  return {
    skus: [rule.sku],
    customerSegments:
      rule.customerSegment === 'all'
        ? ['external', 'affiliate']
        : [rule.customerSegment],
    paymentFamilies: normalizedPaymentFamilies,
    selectedCards,
    cardInstallmentCaps: {
      'naranja-x': String(cardInstallmentCaps['naranja-x'] ?? 6),
      sidecreer: String(cardInstallmentCaps.sidecreer ?? 6),
      bbva: String(cardInstallmentCaps.bbva ?? 6),
      macro: String(cardInstallmentCaps.macro ?? 6),
    },
    cashDiscountPercent: String(Math.round(rule.cashDiscountPercent * 100)),
    affiliateExtraDiscountPercent: String(Math.round(rule.affiliateExtraDiscountPercent * 100)),
  }
}

function logoDataUri(short: string, bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="40" viewBox="0 0 64 40"><rect width="64" height="40" rx="8" fill="${bg}"/><text x="32" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${fg}">${short}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const cardVisualMeta: Record<string, { short: string; bg: string; fg: string }> = {
  'naranja-x': { short: 'NX', bg: '#f97316', fg: '#ffffff' },
  sidecreer: { short: 'SC', bg: '#2563eb', fg: '#ffffff' },
  bbva: { short: 'BB', bg: '#1d4ed8', fg: '#ffffff' },
  macro: { short: 'MA', bg: '#dc2626', fg: '#ffffff' },
}

function computePublicationBand(draft: RuleDraft): string {
  if (draft.paymentFamilies.includes('credit_card') && draft.selectedCards.length > 0) {
    const maxCap = Math.max(
      ...draft.selectedCards.map((cardId) => Number.parseInt(draft.cardInstallmentCaps[cardId] ?? '1', 10) || 1),
    )
    return `Hasta ${maxCap} cuotas sin interes`
  }

  if (draft.paymentFamilies.includes('all')) {
    return 'Condiciones generales'
  }

  if (draft.paymentFamilies.length > 0) {
    return 'Condiciones por medio de pago'
  }

  return 'Sin promo'
}

function toggleSelection(currentValues: string[], value: string): string[] {
  return currentValues.includes(value)
    ? currentValues.filter((currentValue) => currentValue !== value)
    : [...currentValues, value]
}

function formatRuleCustomerSegment(segment: CampaignRuleSummary['customerSegment']): string {
  if (segment === 'all') {
    return 'Externo + Afiliado'
  }

  return segment === 'affiliate' ? 'Afiliado' : 'Externo'
}

function formatRulePaymentFamily(rule: CampaignRuleSummary): string {
  const families = rule.paymentFamily
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (families.length === 0 || families.includes('all')) {
    return paymentFamilyLabel.all
  }

  return families.map((family) => paymentFamilyLabel[family] ?? family).join(', ')
}

function CampaignRulesPanel({ campaignId }: { campaignId: string }) {
  const { data, isLoading, upsertRule, isUpsertingRule, removeRule, isRemovingRule } =
    useCampaignRules(campaignId)
  const { data: catalogData } = useCatalogProducts({})
  const rules = data?.rules ?? []
  const products = useMemo(() => catalogData?.items ?? [], [catalogData?.items])

  const [ruleModalMode, setRuleModalMode] = useState<'create' | 'edit' | null>(null)
  const [ruleDraft, setRuleDraft] = useState<RuleDraft>(EMPTY_RULE_DRAFT)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [ruleFormError, setRuleFormError] = useState<string | null>(null)
  const [removingSku, setRemovingSku] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    const query = productSearchTerm.trim().toLowerCase()
    if (!query) {
      return products.slice(0, 24)
    }

    return products
      .filter((product) =>
        product.sku.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
      )
      .slice(0, 24)
  }, [productSearchTerm, products])

  function updateRuleDraft(patch: Partial<RuleDraft>) {
    setRuleDraft((current) => ({ ...current, ...patch }))
  }

  function toggleProductSku(sku: string) {
    if (ruleModalMode === 'edit') {
      return
    }

    updateRuleDraft({ skus: toggleSelection(ruleDraft.skus, sku) })
  }

  function handleCustomerSegmentsChange(values: string[]) {
    const selected = values.filter((value) => value === 'external' || value === 'affiliate') as CustomerSegment[]
    updateRuleDraft({ customerSegments: selected })
  }

  function handlePaymentFamiliesChange(values: string[]) {
    if (values.includes('all')) {
      updateRuleDraft({
        paymentFamilies: ['all'],
        selectedCards: [],
      })
      return
    }

    const withoutAll = values.filter((value) => value !== 'all')
    updateRuleDraft({
      paymentFamilies: withoutAll,
      selectedCards: withoutAll.includes('credit_card') ? ruleDraft.selectedCards : [],
    })
  }

  function toggleCard(cardId: string) {
    updateRuleDraft({ selectedCards: toggleSelection(ruleDraft.selectedCards, cardId) })
  }

  function openAddProduct() {
    setRuleModalMode('create')
    setRuleFormError(null)
    setRuleDraft(EMPTY_RULE_DRAFT)
    setProductSearchTerm('')
  }

  function openEditRule(rule: CampaignRuleSummary) {
    setRuleModalMode('edit')
    setRuleFormError(null)
    setRuleDraft(ruleToDraft(rule))
    setProductSearchTerm('')
  }

  function closeRuleModal() {
    if (isUpsertingRule) {
      return
    }
    setRuleModalMode(null)
    setProductSearchTerm('')
  }

  async function handleSubmitRule() {
    if (ruleDraft.skus.length === 0) {
      setRuleFormError('Selecciona al menos un producto.')
      return
    }

    if (ruleDraft.customerSegments.length === 0) {
      setRuleFormError('Selecciona al menos un tipo de cliente.')
      return
    }

    if (ruleDraft.paymentFamilies.length === 0) {
      setRuleFormError('Selecciona al menos un medio de pago o "Cualquier medio".')
      return
    }

    if (ruleDraft.paymentFamilies.includes('credit_card') && ruleDraft.selectedCards.length === 0) {
      setRuleFormError('Si eliges tarjeta de credito, selecciona al menos una tarjeta.')
      return
    }

    try {
      const selectedPaymentFamilies = ruleDraft.paymentFamilies.includes('all')
        ? ['all']
        : ruleDraft.paymentFamilies

      const nonCardFamilies = selectedPaymentFamilies.filter((family) => family !== 'credit_card')
      const effectivePaymentFamilies = selectedPaymentFamilies.includes('credit_card')
        ? [...nonCardFamilies, ...ruleDraft.selectedCards]
        : nonCardFamilies

      const normalizedPaymentFamilies = Array.from(new Set(effectivePaymentFamilies))

      const cardInstallmentCaps = ruleDraft.selectedCards.reduce<Record<string, number>>((acc, cardId) => {
        const parsedCap = Number.parseInt(ruleDraft.cardInstallmentCaps[cardId] ?? '0', 10)
        if (Number.isFinite(parsedCap) && parsedCap > 0) {
          acc[cardId] = parsedCap
        }
        return acc
      }, {})

      const publicationBand = buildPublicationBandWithCards(
        computePublicationBand(ruleDraft),
        cardInstallmentCaps,
      )

      const customerSegment =
        ruleDraft.customerSegments.length === 2 ? 'all' : ruleDraft.customerSegments[0]

      for (const sku of ruleDraft.skus) {
        await upsertRule({
          campaignId,
          sku,
          offerType: 'Regla comercial',
          publicationBand,
          customerSegment,
          paymentFamily: normalizedPaymentFamilies.join(','),
          cashDiscountPercent: Math.max(0, Number(ruleDraft.cashDiscountPercent) || 0) / 100,
          affiliateExtraDiscountPercent:
            Math.max(0, Number(ruleDraft.affiliateExtraDiscountPercent) || 0) / 100,
        })
      }

      setRuleModalMode(null)
    } catch (mutationError) {
      setRuleFormError(
        mutationError instanceof Error ? mutationError.message : 'No se pudo guardar el producto.',
      )
    }
  }

  async function handleRemoveRule(sku: string) {
    try {
      setRemovingSku(sku)
      await removeRule({ sku })
    } finally {
      setRemovingSku(null)
    }
  }

  const isEditingExistingSku = ruleModalMode === 'edit'
  const isCreditCardSelected =
    !ruleDraft.paymentFamilies.includes('all') &&
    (ruleDraft.paymentFamilies.includes('credit_card') || ruleDraft.selectedCards.length > 0)

  return (
    <>
      <TableRow className="bg-[var(--color-surface-50)] hover:bg-[var(--color-surface-50)]">
        <TableCell colSpan={8}>
          <div className="space-y-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)]">
                <Package className="h-3.5 w-3.5 shrink-0" />
                Motor de promociones: cruce Producto x Medio de pago x Cliente
              </p>
              <Button size="sm" variant="secondary" onClick={openAddProduct}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Agregar producto
              </Button>
            </div>

            {isLoading ? (
              <p className="text-sm text-[var(--color-ink-600)]">Cargando reglas...</p>
            ) : rules.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-600)]">
                Esta campaña todavia no tiene productos asociados. Usa "Agregar producto" para sumar el
                primero.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[var(--color-surface-200)] bg-white">
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col className="w-[31%]" />
                    <col className="w-[14%]" />
                    <col className="w-[19%]" />
                    <col className="w-[13%]" />
                    <col className="w-[11%]" />
                    <col className="w-[11%]" />
                    <col className="w-[12%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[var(--color-surface-200)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-600)]">
                      <th className="whitespace-nowrap px-3 py-2 align-middle">Producto</th>
                      <th className="whitespace-nowrap px-3 py-2 align-middle">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-3 w-3 shrink-0" />
                          Cliente
                        </span>
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 align-middle">
                        <span className="inline-flex items-center gap-1.5">
                          <Wallet className="h-3 w-3 shrink-0" />
                          Medio de pago
                        </span>
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 align-middle">Banda</th>
                      <th className="whitespace-nowrap px-3 py-2 text-right align-middle">Contado</th>
                      <th className="whitespace-nowrap px-3 py-2 text-right align-middle">Afiliado</th>
                      <th className="whitespace-nowrap px-3 py-2 text-right align-middle">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule) => (
                      <tr key={rule.ruleId} className="border-b border-[var(--color-surface-100)] last:border-0">
                        <td className="px-3 py-2 align-middle">
                          <p className="truncate font-medium text-[var(--color-ink-900)]">
                            {rule.productDescription}
                          </p>
                          <p className="text-xs text-[var(--color-ink-600)]">SKU {rule.sku}</p>
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <Badge variant={rule.customerSegment === 'all' ? 'warning' : 'neutral'}>
                            {formatRuleCustomerSegment(rule.customerSegment)}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 align-middle text-[var(--color-ink-700)]">
                          {formatRulePaymentFamily(rule)}
                        </td>
                        <td className="px-3 py-2 align-middle text-[var(--color-ink-700)]">
                          {stripPublicationBandMetadata(rule.publicationBand)}
                        </td>
                        <td className="px-3 py-2 text-right align-middle text-[var(--color-ink-700)]">
                          {rule.cashDiscountPercent > 0 ? `${Math.round(rule.cashDiscountPercent * 100)}%` : '—'}
                        </td>
                        <td className="px-3 py-2 text-right align-middle text-[var(--color-ink-700)]">
                          {rule.affiliateExtraDiscountPercent > 0
                            ? `${Math.round(rule.affiliateExtraDiscountPercent * 100)}%`
                            : '—'}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              title="Editar"
                              aria-label={`Editar regla de ${rule.productDescription}`}
                              onClick={() => openEditRule(rule)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[var(--color-ink-600)] hover:bg-[var(--color-surface-100)]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Quitar de la campaña"
                              aria-label={`Quitar ${rule.productDescription} de la campaña`}
                              disabled={isRemovingRule && removingSku === rule.sku}
                              onClick={() => {
                                void handleRemoveRule(rule.sku)
                              }}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[var(--color-danger-600)] hover:bg-[var(--color-danger-50)] disabled:opacity-40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="flex items-start gap-1.5 text-xs text-[var(--color-ink-500)]">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Alcance de sucursal: esta campaña aplica en todas las sucursales; la disponibilidad real se
              valida aparte contra el stock por sucursal (no limita todavia la elegibilidad de la
              promocion).
            </p>
          </div>
        </TableCell>
      </TableRow>

      <Dialog
        open={ruleModalMode !== null}
        title={ruleModalMode === 'create' ? 'Agregar producto a la campaña' : 'Editar regla de producto'}
        description="Define el cruce Producto x Medio de pago x Cliente para esta campaña."
        onClose={closeRuleModal}
        contentClassName="max-w-5xl"
        bodyClassName="max-h-[72vh] overflow-y-auto pr-1"
        footer={
          <Button
            variant="primary"
            onClick={() => {
              void handleSubmitRule()
            }}
            disabled={isUpsertingRule}
          >
            {isUpsertingRule ? 'Guardando...' : 'Guardar producto'}
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <section className="space-y-3 rounded-xl border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-700)]">
                Productos de la promocion
              </p>

              <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
                  Buscar por SKU o descripcion
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-ink-500)]" />
                  <Input
                    value={productSearchTerm}
                    onChange={(event) => setProductSearchTerm(event.target.value)}
                    placeholder="Ej: 1004 o Smart TV"
                    disabled={isEditingExistingSku}
                    className="pl-8"
                  />
                </div>
              </label>

              <div className="max-h-60 space-y-1 overflow-auto rounded-lg border border-[var(--color-surface-300)] bg-white p-2">
                {filteredProducts.map((product) => {
                  const isSelected = ruleDraft.skus.includes(product.sku)

                  return (
                    <div
                      key={product.sku}
                      className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 ${
                        isSelected ? 'bg-[var(--color-brand-50)]' : 'hover:bg-[var(--color-surface-100)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{product.description}</p>
                        <p className="text-xs text-[var(--color-ink-600)]">SKU {product.sku}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? 'ghost' : 'secondary'}
                        disabled={isEditingExistingSku}
                        onClick={() => toggleProductSku(product.sku)}
                      >
                        {isSelected ? 'Quitar' : 'Agregar'}
                      </Button>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {ruleDraft.skus.length === 0 ? (
                  <span className="text-xs text-[var(--color-ink-600)]">Sin productos seleccionados.</span>
                ) : null}
                {ruleDraft.skus.map((sku) => {
                  const product = products.find((item) => item.sku === sku)
                  if (!product) {
                    return null
                  }

                  return (
                    <span
                      key={sku}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-2.5 py-1 text-xs text-[var(--color-brand-700)]"
                    >
                      {sku}
                      {!isEditingExistingSku ? (
                        <button
                          type="button"
                          aria-label={`Quitar SKU ${sku}`}
                          onClick={() => toggleProductSku(sku)}
                          className="rounded p-0.5 hover:bg-[var(--color-brand-100)]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      ) : null}
                    </span>
                  )
                })}
              </div>
            </section>

            <section className="space-y-3 rounded-xl border border-[var(--color-surface-300)] bg-white p-3">
              <label className="space-y-1.5 text-sm text-[var(--color-ink-700)]">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
                  Cliente
                </span>
                <MultiSelect
                  options={customerSegmentOptions}
                  value={ruleDraft.customerSegments}
                  onChange={handleCustomerSegmentsChange}
                  placeholder="Seleccionar clientes"
                />
              </label>

              <label className="space-y-1.5 text-sm text-[var(--color-ink-700)]">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
                  Medios de pago
                </span>
                <MultiSelect
                  options={paymentFamilyOptions}
                  value={ruleDraft.paymentFamilies}
                  onChange={handlePaymentFamiliesChange}
                  placeholder="Seleccionar medios"
                />
              </label>

              <div className="rounded-lg border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
                  Banda de publicacion generada
                </p>
                <p className="mt-1 text-sm text-[var(--color-ink-800)]">{computePublicationBand(ruleDraft)}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
                  Descuento contado (%)
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={ruleDraft.cashDiscountPercent}
                    onChange={(event) => updateRuleDraft({ cashDiscountPercent: event.target.value })}
                  />
                </label>

                <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
                  Descuento afiliados (%)
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={ruleDraft.affiliateExtraDiscountPercent}
                    onChange={(event) => updateRuleDraft({ affiliateExtraDiscountPercent: event.target.value })}
                  />
                </label>
              </div>
            </section>
          </div>

          {isCreditCardSelected ? (
            <section className="space-y-2 rounded-xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
                Tarjetas y cuotas por tarjeta
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {cardOptions.map((card) => {
                  const isSelected = ruleDraft.selectedCards.includes(card.value)
                  const visual = cardVisualMeta[card.value]

                  return (
                    <article
                      key={card.value}
                      className={`rounded-lg border p-2 ${
                        isSelected
                          ? 'border-[var(--color-brand-300)] bg-white shadow-sm'
                          : 'border-[var(--color-surface-300)] bg-[var(--color-surface-50)]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCard(card.value)}
                        className="flex w-full items-center gap-2 rounded-md text-left"
                      >
                        <img
                          src={logoDataUri(visual.short, visual.bg, visual.fg)}
                          alt={`Tarjeta ${card.label}`}
                          className="h-6 w-10 rounded object-cover"
                        />
                        <span className="flex-1 text-sm font-medium text-[var(--color-ink-900)]">{card.label}</span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isSelected
                              ? 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]'
                              : 'bg-[var(--color-surface-200)] text-[var(--color-ink-600)]'
                          }`}
                        >
                          {isSelected ? 'Activa' : 'Inactiva'}
                        </span>
                      </button>

                      <label className="mt-2 block space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
                        Cuotas maximas
                        <Select
                          value={ruleDraft.cardInstallmentCaps[card.value] ?? '6'}
                          disabled={!isSelected}
                          onChange={(event) =>
                            updateRuleDraft({
                              cardInstallmentCaps: {
                                ...ruleDraft.cardInstallmentCaps,
                                [card.value]: event.target.value,
                              },
                            })
                          }
                        >
                          {Array.from({ length: 18 }, (_, index) => index + 1).map((installments) => (
                            <option key={installments} value={installments}>
                              Hasta {installments}
                            </option>
                          ))}
                        </Select>
                      </label>
                    </article>
                  )
                })}
              </div>
            </section>
          ) : null}
        </div>

        {ruleFormError ? (
          <p className="mt-3 rounded-lg border border-[var(--color-danger-300)] bg-[var(--color-danger-50)] px-3 py-2 text-sm text-[var(--color-danger-700)]">
            {ruleFormError}
          </p>
        ) : null}
      </Dialog>
    </>
  )
}

type EditableCampaign = {
  id: string
  name: string
  publicationContext: string
  status: 'draft' | 'active' | 'expired'
  startsAt: string
  endsAt: string
  priority: number
}

type CampaignDraft = {
  name: string
  publicationContext: string
  status: EditableCampaign['status']
  startsAt: string
  endsAt: string
  priority: number
}

const INITIAL_DRAFT: CampaignDraft = {
  name: '',
  publicationContext: '',
  status: 'draft',
  startsAt: '',
  endsAt: '',
  priority: 1,
}

function asEditableCampaigns(
  campaigns: Array<{
    id: string
    name: string
    publicationContext: string
    status: 'draft' | 'active' | 'expired'
    startsAt: string
    endsAt: string
    priority: number
  }>,
): EditableCampaign[] {
  return campaigns.map((campaign) => ({
    ...campaign,
  }))
}

function mapStatusLabel(status: EditableCampaign['status']) {
  if (status === 'active') {
    return 'Activa'
  }

  if (status === 'expired') {
    return 'Vencida'
  }

  return 'Borrador'
}

function mapStatusClassName(status: EditableCampaign['status']) {
  if (status === 'active') {
    return 'border-[var(--color-success-300)] bg-[var(--color-success-50)] text-[var(--color-success-700)]'
  }

  if (status === 'expired') {
    return 'border-[var(--color-danger-300)] bg-[var(--color-danger-50)] text-[var(--color-danger-700)]'
  }

  return 'border-[var(--color-surface-300)] bg-[var(--color-surface-100)] text-[var(--color-ink-700)]'
}

function toDraft(campaign: EditableCampaign | null): CampaignDraft {
  if (!campaign) {
    return INITIAL_DRAFT
  }

  return {
    name: campaign.name,
    publicationContext: campaign.publicationContext,
    status: campaign.status,
    startsAt: campaign.startsAt,
    endsAt: campaign.endsAt,
    priority: campaign.priority,
  }
}

function normalizePriority(value: number) {
  if (!Number.isFinite(value)) {
    return 1
  }

  return Math.min(10, Math.max(1, Math.round(value)))
}

interface CampaignFormProps {
  draft: CampaignDraft
  onChange: (patch: Partial<CampaignDraft>) => void
}

function CampaignForm({ draft, onChange }: CampaignFormProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
        Nombre
        <Input
          placeholder="Nombre de campaña"
          value={draft.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </label>

      <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
        Descripcion
        <Input
          placeholder="Describe alcance y objetivo comercial"
          value={draft.publicationContext}
          onChange={(event) => onChange({ publicationContext: event.target.value })}
        />
      </label>

      <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
        Estado
        <Select
          value={draft.status}
          onChange={(event) =>
            onChange({
              status: event.target.value as EditableCampaign['status'],
            })
          }
        >
          <option value="draft">Borrador</option>
          <option value="active">Activa</option>
          <option value="expired">Vencida</option>
        </Select>
      </label>

      <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
        Prioridad
        <Input
          type="number"
          min={1}
          max={10}
          value={draft.priority}
          onChange={(event) => onChange({ priority: normalizePriority(Number(event.target.value)) })}
        />
      </label>

      <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
        Inicio
        <Input
          type="date"
          value={draft.startsAt}
          onChange={(event) => onChange({ startsAt: event.target.value })}
        />
      </label>

      <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
        Fin
        <Input
          type="date"
          value={draft.endsAt}
          onChange={(event) => onChange({ endsAt: event.target.value })}
        />
      </label>
    </div>
  )
}

function validateDraft(draft: CampaignDraft) {
  if (!draft.name.trim() || !draft.publicationContext.trim()) {
    return 'Completa nombre y descripcion.'
  }

  if (!draft.startsAt || !draft.endsAt) {
    return 'Completa fechas de inicio y fin.'
  }

  if (draft.startsAt > draft.endsAt) {
    return 'La fecha de inicio no puede ser mayor que la fecha de fin.'
  }

  return null
}

export function AdminCampaignsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    createCampaign,
    isCreatingCampaign,
    updateCampaign: persistCampaign,
    isUpdatingCampaign,
    deleteCampaign,
    isDeletingCampaign,
  } = useCampaigns()

  const [search, setSearch] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<'success' | 'error'>('success')
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null)
  const [draft, setDraft] = useState<CampaignDraft>(INITIAL_DRAFT)
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null)
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null)

  const campaigns = useMemo(
    () => asEditableCampaigns(data?.campaigns ?? []),
    [data?.campaigns],
  )

  const filteredItems = campaigns.filter((item) => {
    const normalizedSearch = search.toLowerCase().trim()

    if (!normalizedSearch) {
      return true
    }

    return (
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.publicationContext.toLowerCase().includes(normalizedSearch)
    )
  })

  const isModalOpen = modalMode !== null
  const isSubmittingModal = modalMode === 'create' ? isCreatingCampaign : isUpdatingCampaign

  function updateDraft(patch: Partial<CampaignDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function openCreateModal() {
    setModalMode('create')
    setEditingCampaignId(null)
    setDraft(INITIAL_DRAFT)
  }

  function openEditModal(campaign: EditableCampaign) {
    setModalMode('edit')
    setEditingCampaignId(campaign.id)
    setDraft(toDraft(campaign))
  }

  function closeModal() {
    if (isSubmittingModal) {
      return
    }

    setModalMode(null)
    setEditingCampaignId(null)
    setDraft(INITIAL_DRAFT)
  }

  async function handleSubmitModal() {
    const validationError = validateDraft(draft)

    if (validationError) {
      setStatusTone('error')
      setStatusMessage(validationError)
      return
    }

    try {
      if (modalMode === 'create') {
        await createCampaign({
          name: draft.name.trim(),
          publicationContext: draft.publicationContext.trim(),
          status: draft.status,
          startsAt: draft.startsAt,
          endsAt: draft.endsAt,
          priority: normalizePriority(draft.priority),
        })

        setStatusTone('success')
        setStatusMessage('Campaña creada correctamente.')
      }

      if (modalMode === 'edit' && editingCampaignId) {
        await persistCampaign({
          id: editingCampaignId,
          name: draft.name.trim(),
          publicationContext: draft.publicationContext.trim(),
          status: draft.status,
          startsAt: draft.startsAt,
          endsAt: draft.endsAt,
          priority: normalizePriority(draft.priority),
        })

        setStatusTone('success')
        setStatusMessage(`Campaña "${draft.name.trim()}" actualizada.`)
      }

      closeModal()
    } catch (mutationError) {
      setStatusTone('error')
      setStatusMessage(
        mutationError instanceof Error
          ? mutationError.message
          : 'No se pudo guardar la campaña (error desconocido).',
      )
    }
  }

  async function handleDeleteCampaign(id: string) {
    try {
      setDeletingCampaignId(id)
      await deleteCampaign({ id })
      setStatusTone('success')
      setStatusMessage('Campaña eliminada.')
    } catch (mutationError) {
      setStatusTone('error')
      setStatusMessage(
        mutationError instanceof Error
          ? mutationError.message
          : 'No se pudo eliminar la campaña (error desconocido).',
      )
    } finally {
      setDeletingCampaignId(null)
    }
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Campañas</CardTitle>
          <CardDescription>
            Gestion visual de alta, modificacion y baja de campañas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <label className="w-full max-w-md space-y-1 text-sm text-[var(--color-ink-700)]">
              Buscar campaña
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o descripcion"
              />
            </label>

            <div className="flex items-center gap-3">
              <p className="text-xs text-[var(--color-ink-600)]">{filteredItems.length} campañas visibles</p>
              <Button variant="secondary" onClick={openCreateModal}>
                Nueva campaña
              </Button>
            </div>
          </div>

          {statusMessage ? (
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                statusTone === 'error'
                  ? 'border-[var(--color-danger-300)] bg-[var(--color-danger-50)] text-[var(--color-danger-700)]'
                  : 'border-[var(--color-success-300)] bg-[var(--color-success-50)] text-[var(--color-success-700)]'
              }`}
            >
              {statusMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-ink-600)]">Cargando campañas...</CardContent>
        </Card>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="py-8 text-sm text-[var(--color-danger-700)]">
            Error al cargar campañas: {error instanceof Error ? error.message : 'error desconocido'}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Configuracion comercial ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-surface-400)] p-6 text-center text-sm text-[var(--color-ink-600)]">
                No hay campañas para mostrar con ese criterio de busqueda.
              </div>
            ) : (
              <TableContainer>
                <Table>
                  <thead>
                    <TableHeadRow>
                      <TableHeaderCell className="w-8" />
                      <TableHeaderCell>Campaña</TableHeaderCell>
                      <TableHeaderCell>Descripcion</TableHeaderCell>
                      <TableHeaderCell>Estado</TableHeaderCell>
                      <TableHeaderCell>Inicio</TableHeaderCell>
                      <TableHeaderCell>Fin</TableHeaderCell>
                      <TableHeaderCell className="text-right">
                        <span
                          className="inline-flex items-center gap-1"
                          title="Prioridad define desempate de promociones no acumulables en carrito. Menor numero = mayor prioridad."
                        >
                          Prioridad
                          <CircleHelp className="h-3.5 w-3.5" />
                        </span>
                      </TableHeaderCell>
                      <TableHeaderCell className="text-right">Acciones</TableHeaderCell>
                    </TableHeadRow>
                  </thead>
                  <tbody>
                    {filteredItems.map((campaign) => {
                      const isExpanded = expandedCampaignId === campaign.id

                      return (
                        <Fragment key={campaign.id}>
                          <TableRow>
                            <TableCell>
                              <button
                                type="button"
                                aria-label={
                                  isExpanded ? 'Ocultar reglas' : 'Ver reglas del motor de promociones'
                                }
                                onClick={() => setExpandedCampaignId(isExpanded ? null : campaign.id)}
                                className="flex h-6 w-6 items-center justify-center rounded text-[var(--color-ink-500)] hover:bg-[var(--color-surface-100)]"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell className="font-medium text-[var(--color-ink-900)]">
                              {campaign.name}
                            </TableCell>
                            <TableCell>{campaign.publicationContext}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${mapStatusClassName(campaign.status)}`}
                              >
                                {mapStatusLabel(campaign.status)}
                              </span>
                            </TableCell>
                            <TableCell>{campaign.startsAt}</TableCell>
                            <TableCell>{campaign.endsAt}</TableCell>
                            <TableCell className="text-right">
                              <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand-700)]">
                                P{campaign.priority}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openEditModal(campaign)}
                                  disabled={isUpdatingCampaign || isDeletingCampaign}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    void handleDeleteCampaign(campaign.id)
                                  }}
                                  disabled={isDeletingCampaign || isUpdatingCampaign}
                                >
                                  {deletingCampaignId === campaign.id ? 'Eliminando...' : 'Baja'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {isExpanded ? <CampaignRulesPanel campaignId={campaign.id} /> : null}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </Table>
              </TableContainer>
            )}

            {filteredItems.length > 0 ? (
              <p className="mt-3 text-xs text-[var(--color-ink-600)]">
                Si un carrito contiene productos con promociones no acumulables, se aplica primero la campaña de
                mayor prioridad operativa (P1 antes que P2, P2 antes que P3, etc.).
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={isModalOpen}
        title={modalMode === 'create' ? 'Nueva campaña' : 'Editar campaña'}
        description="Completa los datos comerciales para guardar la campaña."
        onClose={closeModal}
        footer={
          <Button
            variant="primary"
            onClick={() => {
              void handleSubmitModal()
            }}
            disabled={isSubmittingModal}
          >
            {isSubmittingModal
              ? 'Guardando...'
              : modalMode === 'create'
                ? 'Crear campaña'
                : 'Guardar cambios'}
          </Button>
        }
      >
        <CampaignForm draft={draft} onChange={updateDraft} />
      </Dialog>
    </section>
  )
}