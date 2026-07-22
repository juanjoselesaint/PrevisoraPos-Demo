import type { CatalogBootstrapResponse } from '@core/api/contracts'

export const bootstrapData: CatalogBootstrapResponse = {
  appName: 'MVP Web POS',
  branchName: 'Casa Central',
  role: 'seller',
  timestamp: new Date('2026-07-21T08:00:00.000Z').toISOString(),
}
