import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { sendQuoteToSoftland } from '@core/api/fake-api'
import { useAuditStore } from '@core/stores/audit-store'
import { useQuoteDraftStore } from '@core/stores/quote-draft-store'
import { useSessionStore } from '@core/stores/session-store'
import { formatCurrency } from '@core/ui/domain/format'
import { Alert } from '@core/ui/primitives/alert'
import { Badge } from '@core/ui/primitives/badge'
import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { buildSoftlandQuotePayload } from '@features/quote-sheet/lib/quote-builder'

export function QuoteCartPage() {
  const openQuote = useQuoteDraftStore((state) => state.openQuote)
  const saveOpenQuote = useQuoteDraftStore((state) => state.saveOpenQuote)
  const closeOpenQuote = useQuoteDraftStore((state) => state.closeOpenQuote)

  const registerAuditEvent = useAuditStore((state) => state.registerEvent)
  const role = useSessionStore((state) => state.role)
  const userId = useSessionStore((state) => state.userId) ?? 'anonymous-user'

  const [isSendingToSoftland, setIsSendingToSoftland] = useState(false)
  const [sendResultMessage, setSendResultMessage] = useState<string | null>(null)

  const subtotal = useMemo(
    () => (openQuote?.lines ?? []).reduce((acc, line) => acc + line.subtotal, 0),
    [openQuote?.lines],
  )

  const payload = useMemo(
    () => (openQuote ? buildSoftlandQuotePayload(openQuote) : null),
    [openQuote],
  )

  const isCashPayment = openQuote?.paymentEntityId === 'contado'

  function calculatePriceBeforeDiscount(unitPrice: number, discountPercent: number): number {
    if (discountPercent <= 0 || discountPercent >= 1) {
      return unitPrice
    }

    return unitPrice / (1 - discountPercent)
  }

  function handleRemoveLine(sku: string) {
    if (!openQuote) {
      return
    }

    const nextLines = openQuote.lines.filter((line) => line.sku !== sku)

    if (nextLines.length === 0) {
      handleClearCart()
      return
    }

    saveOpenQuote({
      ...openQuote,
      lines: nextLines,
    })
    setSendResultMessage(null)
  }

  function handleClearCart() {
    if (!openQuote) {
      return
    }

    registerAuditEvent({
      eventType: 'close_quote',
      actorUserId: userId,
      actorRole: role,
      entityType: 'quote',
      entityId: openQuote.id,
      summary: `Cotizacion ${openQuote.id} cerrada desde carrito`,
    })

    closeOpenQuote()
    setSendResultMessage(null)
  }

  async function handleSendCart() {
    if (!payload || isSendingToSoftland) {
      return
    }

    setIsSendingToSoftland(true)
    setSendResultMessage(null)

    try {
      const response = await sendQuoteToSoftland({ payload })
      setSendResultMessage(`Enviado a Softland. Referencia: ${response.referenceId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido de envio'
      setSendResultMessage(`No se pudo enviar a Softland: ${message}`)
    } finally {
      setIsSendingToSoftland(false)
    }
  }

  if (!openQuote) {
    return (
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Carrito de cotizacion</CardTitle>
              <CardDescription>Aun no hay productos agregados.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--color-ink-700)]">
              Agrega productos desde la ficha comercial para armar un payload consolidado.
            </p>
            <Link to="/seller/catalog">
              <Button>Ir al catalogo</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Carrito de cotizacion</CardTitle>
            <CardDescription>Revision final de productos antes de enviar a Softland.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="promo">{openQuote.lines.length} productos</Badge>
            <Badge variant="neutral">{formatCurrency(subtotal)}</Badge>
            <Badge variant="neutral">
              {isCashPayment
                ? 'Condicion: Contado'
                : `Condicion: ${openQuote.paymentInstallments} cuotas de ${formatCurrency(subtotal / openQuote.paymentInstallments)}`}
            </Badge>
          </div>

          <div className="space-y-2">
            {openQuote.lines.map((line) => (
              <div key={line.sku} className="rounded-md border border-[var(--color-surface-300)] bg-white px-3 py-2">
                <p className="text-sm font-semibold text-[var(--color-ink-900)]">{line.description}</p>
                <p className="text-xs text-[var(--color-ink-600)]">SKU {line.sku}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[var(--color-ink-700)]">
                  <span>
                    {line.quantity} u. x {formatCurrency(line.unitPrice)}
                  </span>
                  <span className="font-semibold text-[var(--color-ink-900)]">{formatCurrency(line.subtotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 text-xs text-[var(--color-ink-600)]">
                    <p>
                      {line.appliedDiscountPercent > 0
                        ? `Con descuento ${Math.round(line.appliedDiscountPercent * 100)}%: ${formatCurrency(line.unitPrice)} c/u (antes ${formatCurrency(calculatePriceBeforeDiscount(line.unitPrice, line.appliedDiscountPercent))})`
                        : `Sin descuento negociado: ${formatCurrency(line.unitPrice)} c/u`}
                    </p>
                    <p>
                      {isCashPayment
                        ? 'Pago: Contado'
                        : `Pago: ${openQuote.paymentInstallments} cuotas de ${formatCurrency(line.subtotal / openQuote.paymentInstallments)}`}
                    </p>
                    <p>
                      Promo activa: {line.hasPromotion ? 'Si' : 'No'}
                      {line.hasPromotion && line.campaignLabel ? ` (${line.campaignLabel})` : ''}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveLine(line.sku)}>
                    Quitar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button className="flex-1" onClick={handleSendCart} disabled={isSendingToSoftland || !payload}>
              {isSendingToSoftland ? 'Enviando...' : 'Enviar carrito a Softland'}
            </Button>
            <Button variant="ghost" className="flex-1" onClick={handleClearCart}>
              Vaciar carrito
            </Button>
            <Link to="/seller/catalog" className="flex-1">
              <Button variant="secondary" className="w-full">
                Seguir agregando desde catalogo
              </Button>
            </Link>
          </div>

          {sendResultMessage ? (
            <Alert variant={sendResultMessage.startsWith('No se pudo') ? 'danger' : 'success'}>
              {sendResultMessage}
            </Alert>
          ) : null}

          {payload ? (
            <details className="group rounded-lg border border-[var(--color-surface-300)]">
              <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)] group-open:border-b group-open:border-[var(--color-surface-300)]">
                Ver payload tecnico Softland
              </summary>
              <pre className="max-h-72 overflow-auto rounded-b-lg bg-[var(--color-surface-50)] p-3 font-mono text-xs leading-6 text-[var(--color-ink-900)]">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </details>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}
