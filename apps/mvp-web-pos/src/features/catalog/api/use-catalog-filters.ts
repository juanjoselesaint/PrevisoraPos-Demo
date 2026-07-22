import { useQuery } from '@tanstack/react-query'

import { getProductTaxonomy, listBranches } from '@core/api/fake-api'

export function useCatalogFilters() {
  const branchesQuery = useQuery({
    queryKey: ['catalog', 'filters', 'branches'],
    queryFn: listBranches,
  })

  const taxonomyQuery = useQuery({
    queryKey: ['catalog', 'filters', 'taxonomy'],
    queryFn: getProductTaxonomy,
  })

  return {
    branchesQuery,
    taxonomyQuery,
  }
}
