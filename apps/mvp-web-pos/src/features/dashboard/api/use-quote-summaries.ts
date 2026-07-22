import { useQuery } from '@tanstack/react-query'

import { listQuoteSummaries } from '@core/api/fake-api'

export function useQuoteSummaries() {
  return useQuery({
    queryKey: ['quotes', 'summaries'],
    queryFn: () => listQuoteSummaries(),
  })
}
