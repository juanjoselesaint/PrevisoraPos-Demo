import { useQuery } from '@tanstack/react-query'

import { getStockSnapshot } from '@core/api/fake-api'

export function useStockSnapshot(sku: string) {
  return useQuery({
    queryKey: ['stock', 'snapshot', sku],
    queryFn: () => getStockSnapshot({ sku }),
    enabled: Boolean(sku),
  })
}
