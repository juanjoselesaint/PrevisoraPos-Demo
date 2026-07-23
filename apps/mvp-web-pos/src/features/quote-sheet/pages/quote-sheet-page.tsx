import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { sendQuoteToSoftland } from '@core/api/fake-api'
import type { UserRole } from '@core/domain/models'
import { roleVisibilityPolicy } from '@core/domain/visibility'
import { useAuditStore } from '@core/stores/audit-store'
import { useQuoteDraftStore } from '@core/stores/quote-draft-store'
import { CashDiscountBlock } from '@core/ui/domain/cash-discount-block'
import { useSessionStore } from '@core/stores/session-store'
import { FinancialCardOptionsBlock } from '@core/ui/domain/financial-card-options-block'
import { formatCurrency } from '@core/ui/domain/format'
import { PriceBlock } from '@core/ui/domain/price-block'
import { ProductCard } from '@core/ui/domain/product-card'
import { QuoteSheetComplexStates } from '@core/ui/domain/quote-sheet-complex-states'
import {
  QuoteSheetEmptyState,
  QuoteSheetErrorState,
  QuoteSheetLoadingState,
} from '@core/ui/domain/quote-sheet-states'
import { ValidityBlock } from '@core/ui/domain/validity-block'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Input } from '@core/ui/primitives/input'
import { Select } from '@core/ui/primitives/select'
import { useCatalogProducts } from '@features/catalog/api/use-catalog-products'
import { useCommercialQuoteSheet } from '@features/quote-sheet/api/use-commercial-quote-sheet'
import {
  buildQuoteDraftFromSheet,
  buildQuoteDraftLineFromSheet,
  buildSoftlandQuotePayload,
  mergeQuoteLineBySku,
  normalizeNegotiationPercent,
} from '@features/quote-sheet/lib/quote-builder'

const CONTADO_ENTITY_ID = 'contado'

function isFieldVisible(role: UserRole, field: string): boolean {
  const policy = roleVisibilityPolicy[role]

  if (policy.visible.includes('*')) {
    return true
  }

  const isExplicitlyHidden = policy.hidden.some(
    (hiddenField) => field === hiddenField || field.startsWith(`${hiddenField}.`),
  )

  if (isExplicitlyHidden) {
    return false
  }

  return policy.visible.some(
    (visibleField) => field === visibleField || field.startsWith(`${visibleField}.`),
  )
}

export function QuoteSheetPage() {
  const [searchParams] = useSearchParams()
  const role = useSessionStore((state) => state.role)
  const branchId = useSessionStore((state) => state.branchId)
  const customerSegment = useSessionStore((state) => state.customerSegment)
  const userId = useSessionStore((state) => state.userId) ?? 'anonymous-user'

  const registerAuditEvent = useAuditStore((state) => state.registerEvent)
  const openQuote = useQuoteDraftStore((state) => state.openQuote)
  const saveOpenQuote = useQuoteDraftStore((state) => state.saveOpenQuote)
  const closeOpenQuote = useQuoteDraftStore((state) => state.closeOpenQuote)

  const { data: catalogData } = useCatalogProducts({ branchId })

  const skuOptions = useMemo(
    () =>
      (catalogData?.items ?? []).map((item) => ({
        value: item.sku,
        label: `${item.sku} - ${item.description}`,
      })),
    [catalogData?.items],
  )

  const skuFromCatalog = searchParams.get('sku')?.trim()
  const selectedSkuFromCatalog =
    skuFromCatalog && skuOptions.some((option) => option.value === skuFromCatalog)
      ? skuFromCatalog
      : ''

  const [selectedSku, setSelectedSku] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPaymentEntityId, setSelectedPaymentEntityId] = useState<string>('')
  const [negotiationPercentInput, setNegotiationPercentInput] = useState('10')
  const [negotiationReason, setNegotiationReason] = useState('')
  const [appliedNegotiationPercent, setAppliedNegotiationPercent] = useState<number | undefined>()
  const [quoteQuantity, setQuoteQuantity] = useState(1)
  const [selectedInstallments, setSelectedInstallments] = useState(1)
  const [isSendingToSoftland, setIsSendingToSoftland] = useState(false)
  const [sendResultMessage, setSendResultMessage] = useState<string | null>(null)

  const lastTrackedSkuRef = useRef<string>('')
  const lastOpenedSheetRef = useRef<string>('')

  const intent = searchParams.get('intent')

  const selectedProductImageUrl = useMemo(
    () => catalogData?.items.find((item) => item.sku === selectedSku)?.imageUrl,
    [catalogData?.items, selectedSku],
  )

  const canApplyNegotiationByRole =
    role === 'seller' ||
    role === 'supervisor' ||
    role === 'commercial_admin' ||
    role === 'it_admin'

  useEffect(() => {
    if (selectedSkuFromCatalog && selectedSku !== selectedSkuFromCatalog) {
      setSelectedSku(selectedSkuFromCatalog)
    }
  }, [selectedSku, selectedSkuFromCatalog])

  useEffect(() => {
    const hasCatalogOrigin = Boolean(selectedSkuFromCatalog)
    if (!hasCatalogOrigin && !searchTerm.trim() && selectedSku) {
      setSelectedSku('')
    }
  }, [searchTerm, selectedSku, selectedSkuFromCatalog])

  const filteredSkuOptions = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()

    if (!query) {
      return skuOptions.slice(0, 20)
    }

    return skuOptions
      .filter((option) => option.value.includes(query) || option.label.toLowerCase().includes(query))
      .slice(0, 20)
  }, [searchTerm, skuOptions])

  function resolveSkuFromInput(rawValue: string): string | null {
    const normalizedValue = rawValue.trim().toLowerCase()
    if (!normalizedValue) {
      return null
    }

    const matched = skuOptions.find(
      (option) =>
        option.value.toLowerCase() === normalizedValue || option.label.toLowerCase() === normalizedValue,
    )

    return matched?.value ?? null
  }

  function handleSearchInputChange(nextValue: string) {
    setSearchTerm(nextValue)

    const resolvedSku = resolveSkuFromInput(nextValue)
    if (resolvedSku) {
      setSelectedSku(resolvedSku)
      return
    }

    const hasCatalogOrigin = Boolean(selectedSkuFromCatalog)
    if (!hasCatalogOrigin) {
      setSelectedSku('')
    }
  }

  useEffect(() => {
    if (!selectedSku || lastTrackedSkuRef.current === selectedSku) {
      return
    }

    lastTrackedSkuRef.current = selectedSku
    registerAuditEvent({
      eventType: 'search',
      actorUserId: userId,
      actorRole: role,
      entityType: 'product',
      entityId: selectedSku,
      summary: `Busqueda y seleccion de SKU ${selectedSku} en ficha comercial`,
    })
  }, [selectedSku, registerAuditEvent, role, userId])

  const { data, isLoading, isError, error } = useCommercialQuoteSheet({
    sku: selectedSku,
    branchId,
    customerSegment,
    negotiationDiscountPercent: appliedNegotiationPercent,
  })

  useEffect(() => {
    const sheet = data?.sheet
    const hasCreditCardOptions =
      sheet?.financialRows.some(
        (row) => row.paymentFamily === 'credit_card' && row.maxInstallments > 0,
      ) ?? false

    if (sheet && !hasCreditCardOptions) {
      setSelectedPaymentEntityId(CONTADO_ENTITY_ID)
      setSelectedInstallments(1)
      return
    }

    const firstApplicableEntity = sheet?.financialRows.find((row) => row.maxInstallments > 0)
    const fallbackEntity = sheet?.financialRows[0]
    const defaultEntityId = firstApplicableEntity?.entityId ?? fallbackEntity?.entityId

    if (!defaultEntityId) {
      setSelectedPaymentEntityId('')
      setSelectedInstallments(1)
      return
    }

    setSelectedPaymentEntityId((current) => {
      if (!current) {
        return defaultEntityId
      }

      const isCurrentEntityAvailable = sheet?.financialRows.some((row) => row.entityId === current)
      return isCurrentEntityAvailable ? current : defaultEntityId
    })
  }, [data?.sheet])

  useEffect(() => {
    if (!data?.sheet || !selectedPaymentEntityId) {
      return
    }

    const selectedEntityRow = data.sheet.financialRows.find(
      (row) => row.entityId === selectedPaymentEntityId,
    )

    const nextInstallments = selectedEntityRow?.maxInstallments && selectedEntityRow.maxInstallments > 0
      ? selectedEntityRow.maxInstallments
      : 1

    setSelectedInstallments(nextInstallments)
  }, [data?.sheet, selectedPaymentEntityId])

  useEffect(() => {
    if (!data?.sheet || lastOpenedSheetRef.current === data.sheet.sku) {
      return
    }

    lastOpenedSheetRef.current = data.sheet.sku
    registerAuditEvent({
      eventType: 'open_quote_sheet',
      actorUserId: userId,
      actorRole: role,
      entityType: 'quote_sheet',
      entityId: data.sheet.sku,
      summary: `Apertura de ficha comercial para SKU ${data.sheet.sku}`,
    })
  }, [data?.sheet, registerAuditEvent, role, userId])

  function handleApplyNegotiation() {
    if (!canApplyNegotiationByRole) {
      return
    }

    const parsedPercent = Number.parseFloat(negotiationPercentInput)
    const normalizedPercent = normalizeNegotiationPercent((Number.isFinite(parsedPercent) ? parsedPercent : 10) / 100)
    setAppliedNegotiationPercent(normalizedPercent)

    const blockedByPolicy = data?.sheet.operationalNotes.some((note) =>
      note.toLowerCase().includes('bloqueado'),
    )

    registerAuditEvent({
      eventType: 'apply_negotiation_discount',
      actorUserId: userId,
      actorRole: role,
      entityType: 'discount',
      entityId: selectedSku,
      summary: blockedByPolicy
        ? `Intento de descuento negociado ${Math.round(normalizedPercent * 100)}% bloqueado por politica`
        : `Descuento negociado aplicado ${Math.round(normalizedPercent * 100)}%`,
    })
  }

  function handleBuildQuote() {
    if (!data?.sheet || !selectedPaymentEntityId) {
      return
    }

    const line = buildQuoteDraftLineFromSheet({
      sheet: data.sheet,
      quantity: quoteQuantity,
      negotiationPercent: appliedNegotiationPercent,
      negotiationEnabled: canApplyNegotiationByRole,
    })

    const quoteId = openQuote?.id ?? `quote-runtime-${Date.now()}`
    const baseDraft = buildQuoteDraftFromSheet({
      quoteId,
      sheet: data.sheet,
      quantity: 1,
      paymentEntityId: selectedPaymentEntityId,
      paymentInstallments: selectedInstallments,
      negotiationPercent: appliedNegotiationPercent,
      negotiationReason,
      negotiationEnabled: canApplyNegotiationByRole,
    })

    const isCompatibleWithOpenQuote =
      openQuote &&
      openQuote.branchId === baseDraft.branchId &&
      openQuote.customerSegment === baseDraft.customerSegment

    const draftBase = isCompatibleWithOpenQuote && openQuote
      ? {
        ...openQuote,
        paymentEntityId: selectedPaymentEntityId,
        paymentInstallments: selectedInstallments,
        reason: negotiationReason || openQuote.reason,
      }
      : {
        ...baseDraft,
        lines: [],
      }

    const nextDraft = mergeQuoteLineBySku(draftBase, line)

    saveOpenQuote(nextDraft)
    setSendResultMessage(null)

    registerAuditEvent({
      eventType: 'create_quote',
      actorUserId: userId,
      actorRole: role,
      entityType: 'quote',
      entityId: nextDraft.id,
      summary: `Cotizacion actualizada con SKU ${line.sku} (${line.quantity} u.)`,
    })
  }

  function handleCloseQuote() {
    if (!openQuote) {
      return
    }

    registerAuditEvent({
      eventType: 'close_quote',
      actorUserId: userId,
      actorRole: role,
      entityType: 'quote',
      entityId: openQuote.id,
      summary: `Cotizacion ${openQuote.id} cerrada`,
    })

    closeOpenQuote()
    setSendResultMessage(null)
  }

  async function handleSendCurrentSheet() {
    if (!data?.sheet || !selectedPaymentEntityId) {
      return
    }

    const transientQuote = buildQuoteDraftFromSheet({
      quoteId: `quote-single-${Date.now()}`,
      sheet: data.sheet,
      quantity: quoteQuantity,
      paymentEntityId: selectedPaymentEntityId,
      paymentInstallments: selectedInstallments,
      negotiationPercent: appliedNegotiationPercent,
      negotiationReason,
      negotiationEnabled: canApplyNegotiationByRole,
    })

    if (isSendingToSoftland) {
      return
    }

    setIsSendingToSoftland(true)
    setSendResultMessage(null)

    try {
      const response = await sendQuoteToSoftland({
        payload: buildSoftlandQuotePayload(transientQuote),
      })
      setSendResultMessage(`Enviado a Softland. Referencia: ${response.referenceId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido de envio'
      setSendResultMessage(`No se pudo enviar a Softland: ${message}`)
    } finally {
      setIsSendingToSoftland(false)
    }
  }

  const selectedEntityRow = data?.sheet.financialRows.find(
    (row) => row.entityId === selectedPaymentEntityId,
  )
  const hasPromotion = (data?.sheet.offerPrice ?? 0) < (data?.sheet.basePrice ?? 0)
  const computedSavingsPercent = hasPromotion && data?.sheet.basePrice
    ? ((data.sheet.basePrice - data.sheet.offerPrice) / data.sheet.basePrice) * 100
    : 0
  const hasCreditCardOptions =
    data?.sheet.financialRows.some(
      (row) => row.paymentFamily === 'credit_card' && row.maxInstallments > 0,
    ) ?? false
  const maxInstallmentsForSelected = selectedEntityRow?.maxInstallments ?? 1
  const cuotaOptions = Array.from({ length: maxInstallmentsForSelected }, (_, index) => index + 1)

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Ficha comercial central</CardTitle>
            <CardDescription>
              Base de UI para la fase vendedora con lectura directa del motor comercial.
            </CardDescription>
            {intent ? (
              <p className="mt-2 text-xs font-medium text-[var(--color-brand-700)]">
                Flujo iniciado desde catalogo ({intent})
              </p>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          <label className="block space-y-1 text-sm text-[var(--color-ink-700)]">
            Buscar SKU
            <Input
              value={searchTerm}
              list="quote-sheet-sku-options"
              placeholder="Escribe SKU o descripcion"
              onChange={(event) => handleSearchInputChange(event.target.value)}
            />
            <datalist id="quote-sheet-sku-options">
              {filteredSkuOptions.map((option) => (
                <option key={option.value} value={option.label} />
              ))}
            </datalist>
          </label>
        </CardContent>
      </Card>

      {isLoading ? <QuoteSheetLoadingState /> : null}
      {isError ? <QuoteSheetErrorState message={error instanceof Error ? error.message : undefined} /> : null}
      {!isLoading && !isError && !data?.sheet ? <QuoteSheetEmptyState /> : null}

      {!isLoading && !isError && data?.sheet ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-4">
              <ProductCard
                sku={data.sheet.sku}
                description={data.sheet.description}
                brand={data.sheet.brand}
                campaignLabel={data.sheet.campaignLabel}
                offerType={data.sheet.offerType}
                publicationBand={data.sheet.publicationBand}
                hasPromotion={hasPromotion}
                savingsPercent={computedSavingsPercent}
                imageUrl={selectedProductImageUrl}
              />

              <QuoteSheetComplexStates
                validTo={data.sheet.validTo}
                financialRows={data.sheet.financialRows}
                notes={data.sheet.operationalNotes}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PriceBlock
                  basePrice={data.sheet.basePrice}
                  offerPrice={data.sheet.offerPrice}
                  affiliatePrice={data.sheet.affiliatePrice}
                  hasPromotion={hasPromotion}
                />
              </div>

              <ValidityBlock validFrom={data.sheet.validFrom} validTo={data.sheet.validTo} />

              {isFieldVisible(role, 'cashDiscountPercent') && data.sheet.cashDiscountPercent > 0 ? (
                <CashDiscountBlock
                  cashDiscountPercent={data.sheet.cashDiscountPercent}
                  cashPriceExternal={data.sheet.cashPriceExternal}
                  cashPriceAffiliate={data.sheet.cashPriceAffiliate}
                />
              ) : null}

              {isFieldVisible(role, 'financialRows.maxInstallments') && hasCreditCardOptions ? (
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Tarjetas y topes de cuotas</CardTitle>
                      <CardDescription>
                        Cuota estimada por tarjeta para cliente externo y afiliado.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FinancialCardOptionsBlock
                      rows={data.sheet.financialRows}
                      externalPrice={data.sheet.offerPrice}
                      affiliatePrice={data.sheet.affiliatePrice}
                    />
                  </CardContent>
                </Card>
              ) : null}

              {isFieldVisible(role, 'hiddenTrace.sourceRuleId') ||
              isFieldVisible(role, 'hiddenTrace.sourceCampaignId') ||
              isFieldVisible(role, 'hiddenTrace.stExpression') ? (
                <Card className="no-print">
                  <CardHeader>
                    <div>
                      <CardTitle>Trazabilidad interna de la ficha</CardTitle>
                      <CardDescription>Visible solo para roles internos habilitados.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-[var(--color-ink-700)]">
                    {isFieldVisible(role, 'hiddenTrace.sourceRuleId') ? (
                      <p>Regla fuente: {data.sheet.hiddenTrace.sourceRuleId}</p>
                    ) : null}
                    {isFieldVisible(role, 'hiddenTrace.sourceCampaignId') ? (
                      <p>Campaña fuente: {data.sheet.hiddenTrace.sourceCampaignId}</p>
                    ) : null}
                    {isFieldVisible(role, 'hiddenTrace.stExpression') ? (
                      <p>Expresion ST: {data.sheet.hiddenTrace.stExpression}</p>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-4 xl:sticky xl:top-20 xl:h-fit">
              {canApplyNegotiationByRole ? (
                <Card className="no-print">
                  <CardHeader>
                    <div>
                      <CardTitle>Descuento de negociacion</CardTitle>
                      <CardDescription>
                        Rango operativo 5% a 15%, sin mezclar con promocion o contado.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3">
                      <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
                        Descuento (%)
                        <Input
                          type="number"
                          min={5}
                          max={15}
                          value={negotiationPercentInput}
                          onChange={(event) => setNegotiationPercentInput(event.target.value)}
                        />
                      </label>

                      <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
                        Motivo comercial
                        <Input
                          value={negotiationReason}
                          placeholder="Motivo de negociacion"
                          onChange={(event) => setNegotiationReason(event.target.value)}
                        />
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="secondary" onClick={handleApplyNegotiation}>
                        Aplicar descuento
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setAppliedNegotiationPercent(undefined)}
                        disabled={appliedNegotiationPercent === undefined}
                      >
                        Quitar
                      </Button>
                    </div>
                    {appliedNegotiationPercent !== undefined ? (
                      <p className="text-xs text-[var(--color-ink-600)]">
                        Aplicado: {Math.round(appliedNegotiationPercent * 100)}%
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              <Card className="no-print">
                <CardHeader>
                  <div>
                    <CardTitle>Resumen de cotizacion</CardTitle>
                    <CardDescription>
                      Define condiciones del producto actual y sumalo al carrito operativo.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
                      Medio de pago
                      <Select
                        value={selectedPaymentEntityId}
                        onChange={(event) => setSelectedPaymentEntityId(event.target.value)}
                      >
                        <option value={CONTADO_ENTITY_ID}>Contado (efectivo / transferencia)</option>
                        {(data.sheet.financialRows ?? [])
                          .filter((row) => row.maxInstallments > 0)
                          .map((row) => (
                            <option key={row.entityId} value={row.entityId}>
                              {row.entityName} (hasta {row.maxInstallments} cuotas)
                            </option>
                          ))}
                      </Select>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {selectedPaymentEntityId !== CONTADO_ENTITY_ID && maxInstallmentsForSelected > 1 ? (
                        <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
                          Cuotas
                          <Select
                            value={selectedInstallments}
                            onChange={(event) => setSelectedInstallments(Number(event.target.value))}
                          >
                            {cuotaOptions.map((count) => (
                              <option key={count} value={count}>
                                {count} {count === 1 ? 'pago' : 'cuotas'}
                              </option>
                            ))}
                          </Select>
                        </label>
                      ) : null}

                      <label className="space-y-1 text-sm text-[var(--color-ink-700)]">
                        Cantidad
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={quoteQuantity}
                          onChange={(event) => setQuoteQuantity(Number(event.target.value))}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="flex-1" onClick={handleBuildQuote}>
                      {openQuote ? 'Agregar al carrito' : 'Crear carrito y agregar'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={handleSendCurrentSheet}
                      disabled={!data?.sheet || isSendingToSoftland}
                    >
                      {isSendingToSoftland ? 'Enviando...' : 'Enviar solo esta ficha'}
                    </Button>
                  </div>

                  {sendResultMessage ? (
                    <p className="text-sm text-[var(--color-ink-700)]">{sendResultMessage}</p>
                  ) : null}

                  {openQuote ? (
                    <div className="space-y-3 rounded-lg border border-[var(--color-brand-100)] bg-[var(--color-brand-50)] p-3 text-sm text-[var(--color-ink-700)]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
                          Carrito activo
                        </span>
                        <span className="font-mono text-xs text-[var(--color-ink-600)]">{openQuote.id}</span>
                      </div>
                      <p>
                        {openQuote.lines.length} productos | Total estimado {formatCurrency(openQuote.lines.reduce((acc, line) => acc + line.subtotal, 0))}
                      </p>
                      <p className="text-xs text-[var(--color-ink-600)]">
                        Medio: {openQuote.paymentEntityId} | Cuotas: {openQuote.paymentInstallments}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to="/seller/quote-cart" className="flex-1">
                          <Button variant="secondary" className="w-full">
                            Ver carrito
                          </Button>
                        </Link>
                        <Button variant="ghost" className="flex-1" onClick={handleCloseQuote}>
                          Vaciar carrito
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
        </div>
      ) : null}

    </section>
  )
}
