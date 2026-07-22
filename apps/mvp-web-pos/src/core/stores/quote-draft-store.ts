import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CustomerSegment } from '@core/domain/models'

export interface QuoteDraftLine {
  sku: string
  description: string
  quantity: number
  unitPrice: number
  appliedDiscountPercent: number
  subtotal: number
}

export interface QuoteDraft {
  id: string
  branchId: string
  customerSegment: CustomerSegment
  paymentEntityId: string
  paymentInstallments: number
  status: 'open' | 'ready_to_send'
  lines: QuoteDraftLine[]
  reason?: string
}

interface QuoteDraftStoreState {
  openQuote: QuoteDraft | null
  saveOpenQuote: (quote: QuoteDraft) => void
  closeOpenQuote: () => void
}

export const useQuoteDraftStore = create<QuoteDraftStoreState>()(
  persist(
    (set) => ({
      openQuote: null,
      saveOpenQuote: (quote) => set({ openQuote: quote }),
      closeOpenQuote: () => set({ openQuote: null }),
    }),
    {
      name: 'mvp-pos-open-quote',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ openQuote: state.openQuote }),
    },
  ),
)
