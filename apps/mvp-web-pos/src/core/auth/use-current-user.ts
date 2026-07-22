import { useQuery } from '@tanstack/react-query'

import { listUsers } from '@core/api/fake-api'
import { useSessionStore } from '@core/stores/session-store'

export function useCurrentUser() {
  const userId = useSessionStore((state) => state.userId)

  const query = useQuery({
    queryKey: ['meta', 'users'],
    queryFn: () => listUsers(),
  })

  const currentUser = query.data?.users.find((user) => user.id === userId)

  return { ...query, currentUser }
}
