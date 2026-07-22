import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { listCampaignRules, removeCampaignRule, upsertCampaignRule } from '@core/api/fake-api'

export function useCampaignRules(campaignId: string | null) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin', 'campaigns', campaignId, 'rules'],
    queryFn: () => listCampaignRules(campaignId as string),
    enabled: Boolean(campaignId),
  })

  const upsertMutation = useMutation({
    mutationFn: upsertCampaignRule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeCampaignRule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] })
    },
  })

  return {
    ...query,
    upsertRule: upsertMutation.mutateAsync,
    isUpsertingRule: upsertMutation.isPending,
    removeRule: removeMutation.mutateAsync,
    isRemovingRule: removeMutation.isPending,
  }
}
