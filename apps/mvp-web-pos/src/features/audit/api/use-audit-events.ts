import { useQuery } from '@tanstack/react-query'

import { listAuditEvents } from '@core/api/fake-api'

export function useAuditEvents(entityId?: string) {
  return useQuery({
    queryKey: ['audit', 'events', entityId ?? 'all'],
    queryFn: () => listAuditEvents({ entityId }),
  })
}
