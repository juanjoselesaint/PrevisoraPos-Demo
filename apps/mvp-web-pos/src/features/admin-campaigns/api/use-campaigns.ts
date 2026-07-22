import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createCampaign,
  deleteCampaign,
  listCampaigns,
  updateCampaign,
} from '@core/api/fake-api'

export const campaignsQueryKey = ['admin', 'campaigns'] as const

export function useCampaigns() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: campaignsQueryKey,
    queryFn: () => listCampaigns(),
  })

  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignsQueryKey })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCampaign,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignsQueryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignsQueryKey })
    },
  })

  return {
    ...query,
    createCampaign: createMutation.mutateAsync,
    isCreatingCampaign: createMutation.isPending,
    updateCampaign: updateMutation.mutateAsync,
    isUpdatingCampaign: updateMutation.isPending,
    deleteCampaign: deleteMutation.mutateAsync,
    isDeletingCampaign: deleteMutation.isPending,
  }
}
