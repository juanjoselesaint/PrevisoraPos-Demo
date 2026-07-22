import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { UserRole } from '@core/api/contracts'

export type SessionCustomerSegment = 'external' | 'affiliate'

interface SessionState {
  isAuthenticated: boolean
  userId: string | null
  role: UserRole
  branchId: string
  customerSegment: SessionCustomerSegment
  lastVisitedPath: string
  loginAs: (payload: {
    userId: string
    role: UserRole
    branchId: string
    customerSegment?: SessionCustomerSegment
  }) => void
  logout: () => void
  setRole: (role: UserRole) => void
  setBranchId: (branchId: string) => void
  setCustomerSegment: (customerSegment: SessionCustomerSegment) => void
  setLastVisitedPath: (lastVisitedPath: string) => void
}

const initialState = {
  isAuthenticated: false,
  userId: null,
  role: 'seller' as UserRole,
  branchId: 'casa-central',
  customerSegment: 'external' as SessionCustomerSegment,
  lastVisitedPath: '/',
}

function isValidRole(value: unknown): value is UserRole {
  return (
    value === 'seller' ||
    value === 'supervisor' ||
    value === 'commercial_admin' ||
    value === 'it_admin'
  )
}

function isValidCustomerSegment(value: unknown): value is SessionCustomerSegment {
  return value === 'external' || value === 'affiliate'
}

function isValidLastVisitedPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/')
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      loginAs: ({ userId, role, branchId, customerSegment = 'external' }) =>
        set({
          isAuthenticated: true,
          userId,
          role,
          branchId,
          customerSegment,
        }),
      logout: () =>
        set({
          ...initialState,
        }),
      setRole: (role) => set({ role }),
      setBranchId: (branchId) => set({ branchId }),
      setCustomerSegment: (customerSegment) => set({ customerSegment }),
      setLastVisitedPath: (lastVisitedPath) => set({ lastVisitedPath }),
    }),
    {
      name: 'mvp-pos-session',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const persisted = (persistedState ?? {}) as Partial<SessionState>

        return {
          ...initialState,
          ...persisted,
          role: isValidRole(persisted.role) ? persisted.role : initialState.role,
          customerSegment: isValidCustomerSegment(persisted.customerSegment)
            ? persisted.customerSegment
            : initialState.customerSegment,
          lastVisitedPath: isValidLastVisitedPath(persisted.lastVisitedPath)
            ? persisted.lastVisitedPath
            : initialState.lastVisitedPath,
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        role: state.role,
        branchId: state.branchId,
        customerSegment: state.customerSegment,
        lastVisitedPath: state.lastVisitedPath,
      }),
    },
  ),
)
