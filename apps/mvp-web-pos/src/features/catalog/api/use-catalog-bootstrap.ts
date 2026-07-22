import { useQuery } from '@tanstack/react-query'

import { getCatalogBootstrap } from '@core/api/fake-api'

export function useCatalogBootstrap() {
  return useQuery({
    queryKey: ['catalog', 'bootstrap'],
    queryFn: getCatalogBootstrap,
  })
}
