import { useQuery } from '@tanstack/react-query'

import type { CatalogListRequest } from '@core/api/contracts'
import { listCatalogProducts } from '@core/api/fake-api'

export function useCatalogProducts(request: CatalogListRequest) {
  return useQuery({
    queryKey: ['catalog', 'products', request],
    queryFn: () => listCatalogProducts(request),
    placeholderData: (previous) => previous,
  })
}
