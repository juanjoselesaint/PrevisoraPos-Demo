import { ChevronDown, ChevronRight, MapPin, Package, Pencil, Plus, Trash2, Users, Wallet } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

import type { CampaignRuleSummary } from '@core/api/contracts'
import { Badge } from '@core/ui/primitives/badge'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Dialog } from '@core/ui/primitives/dialog'
import { Input } from '@core/ui/primitives/input'
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
  none: 'No aplicable',
}

const paymentFamilyOptions = Object.entries(paymentFamilyLabel)

type RuleDraft = {
  sku: string
  customerSegment: 'external' | 'affiliate'
  paymentFamily: string
  offerType: string
  publicationBand: string
  cashDiscountPercent: string
  affiliateExtraDiscountPercent: string
}

const EMPTY_RULE_DRAFT: RuleDraft = {
  sku: '',
  customerSegment: 'external',
  paymentFamily: 'all',
  offerType: '',
  publicationBand: '',
  cashDiscountPercent: '0',
  affiliateExtraDiscountPercent: '0',
}

function ruleToDraft(rule: CampaignRuleSummary): RuleDraft {
  return {
    sku: rule.sku,
    customerSegment: rule.customerSegment,
    paymentFamily: rule.paymentFamily,
    offerType: rule.offerType,
    publicationBand: rule.publicationBand,
    cashDiscountPercent: String(Math.round(rule.cashDiscountPercent * 100)),
    affiliateExtraDiscountPercent: String(Math.round(rule.affiliateExtraDiscountPercent * 100)),
  }
}

function CampaignRulesPanel({ campaignId }: { campaignId: string }) {
  const { data, isLoading, upsertRule, isUpsertingRule, removeRule, isRemovingRule } =
    useCampaignRules(campaignId)
  const { data: catalogData } = useCatalogProducts({})
  const rules = data?.rules ?? []
  const products = catalogData?.items ?? []

  const [ruleModalMode, setRuleModalMode] = useState<'create' | 'edit' | null>(null)
  const [ruleDraft, setRuleDraft] = useState<RuleDraft>(EMPTY_RULE_DRAFT)
  const [ruleFormError, setRuleFormError] = useState<string | null>(null)
  const [removingSku, setRemovingSku] = useState<string | null>(null)

  function updateRuleDraft(patch: Partial<RuleDraft>) {
    setRuleDraft((current) => ({ ...current, ...patch }))
  }

  function openAddProduct() {
    setRuleModalMode('create')
    setRuleFormError(null)
    setRuleDraft(EMPTY_RULE_DRAFT)
  }

  function openEditRule(rule: CampaignRuleSummary) {
    setRuleModalMode('edit')
    setRuleFormError(null)
    setRuleDraft(ruleToDraft(rule))
  }

  function closeRuleModal() {
    if (isUpsertingRule) {
      return
    }
    setRuleModalMode(null)
  }

  async function handleSubmitRule() {
    if (!ruleDraft.sku) {
      setRuleFormError('Selecciona un producto.')
      return
    }

    if (!ruleDraft.offerType.trim()) {
      setRuleFormError('Completa el tipo de oferta.')
      return
    }

    try {
      await upsertRule({
        campaignId,
        sku: ruleDraft.sku,
        offerType: ruleDraft.offerType.trim(),
        publicationBand: ruleDraft.publicationBand.trim() || 'Sin promo',
        customerSegment: ruleDraft.customerSegment,
        paymentFamily: ruleDraft.paymentFamily,
        cashDiscountPercent: Math.max(0, Number(ruleDraft.cashDiscountPercent) || 0) / 100,
        affiliateExtraDiscountPercent:
          Math.max(0, Number(ruleDraft.affiliateExtraDiscountPercent) || 0) / 100,
      })
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
                    <col className="w-[28%]" />
                    <col className="w-[11%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[11%]" />
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
                      <th className="whitespace-nowrap px-3 py-2 align-middle">Tipo de oferta</th>
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
                          <Badge variant={rule.customerSegment === 'affiliate' ? 'promo' : 'neutral'}>
                            {rule.customerSegment === 'affiliate' ? 'Afiliado' : 'Externo'}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 align-middle text-[var(--color-ink-700)]">
                          {paymentFamilyLabel[rule.paymentFamily] ?? rule.paymentFamily}
                        </td>
                        <td className="px-3 py-2 align-middle text-[var(--color-ink-700)]">{rule.offerType}</td>
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
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)] md:col-span-2">
            Producto (SKU)
            <Select
              value={ruleDraft.sku}
              disabled={isEditingExistingSku}
              onChange={(event) => updateRuleDraft({ sku: event.target.value })}
            >
              <option value="">Selecciona un producto...</option>
              {products.map((product) => (
                <option key={product.sku} value={product.sku}>
                  {product.sku} - {product.description}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
            Cliente
            <Select
              value={ruleDraft.customerSegment}
              onChange={(event) =>
                updateRuleDraft({ customerSegment: event.target.value as RuleDraft['customerSegment'] })
              }
            >
              <option value="external">Externo</option>
              <option value="affiliate">Afiliado</option>
            </Select>
          </label>

          <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
            Medio de pago
            <Select
              value={ruleDraft.paymentFamily}
              onChange={(event) => updateRuleDraft({ paymentFamily: event.target.value })}
            >
              {paymentFamilyOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
            Tipo de oferta
            <Input
              placeholder="Sin interes / Flash / Regular..."
              value={ruleDraft.offerType}
              onChange={(event) => updateRuleDraft({ offerType: event.target.value })}
            />
          </label>

          <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-600)]">
            Banda de publicacion
            <Input
              placeholder="Hasta 12 sin interes"
              value={ruleDraft.publicationBand}
              onChange={(event) => updateRuleDraft({ publicationBand: event.target.value })}
            />
          </label>

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
            Descuento adicional afiliados (%)
            <Input
              type="number"
              min={0}
              max={100}
              value={ruleDraft.affiliateExtraDiscountPercent}
              onChange={(event) => updateRuleDraft({ affiliateExtraDiscountPercent: event.target.value })}
            />
          </label>
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
        Contexto de publicacion
        <Input
          placeholder="Marketplace / Sucursal / Web"
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
    return 'Completa nombre y contexto de publicacion.'
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
                placeholder="Nombre o contexto"
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
                      <TableHeaderCell>Contexto</TableHeaderCell>
                      <TableHeaderCell>Estado</TableHeaderCell>
                      <TableHeaderCell>Inicio</TableHeaderCell>
                      <TableHeaderCell>Fin</TableHeaderCell>
                      <TableHeaderCell className="text-right">Prioridad</TableHeaderCell>
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
                            <TableCell className="text-right font-semibold">{campaign.priority}</TableCell>
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