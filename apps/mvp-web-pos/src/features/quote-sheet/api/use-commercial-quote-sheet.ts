import { useQuery } from '@tanstack/react-query'

import { getCommercialQuoteSheet } from '@core/api/fake-api'

interface UseCommercialQuoteSheetParams {
  sku: string
  branchId: string
  customerSegment: 'affiliate' | 'external'
  paymentEntityId?: string
  negotiationDiscountPercent?: number
}

export function useCommercialQuoteSheet({
  sku,
  branchId,
  customerSegment,
  paymentEntityId,
  negotiationDiscountPercent,
}: UseCommercialQuoteSheetParams) {
  return useQuery({
    queryKey: [
      'commercial-quote-sheet',
      sku,
      branchId,
      customerSegment,
      paymentEntityId ?? 'all',
      negotiationDiscountPercent ?? 'none',
    ],
    queryFn: () =>
      getCommercialQuoteSheet({
        sku,
        branchId,
        customerSegment,
        paymentEntityId,
        negotiationDiscountPercent,
      }),
    enabled: Boolean(sku && branchId && customerSegment),
  })
}
