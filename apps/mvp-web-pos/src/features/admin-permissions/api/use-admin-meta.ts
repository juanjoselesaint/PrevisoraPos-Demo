import { useQuery } from '@tanstack/react-query'

import { listRoles, listUsers } from '@core/api/fake-api'

export function useAdminRoles() {
  return useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => listRoles(),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => listUsers(),
  })
}
