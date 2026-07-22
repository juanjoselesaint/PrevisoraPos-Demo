import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AuditEvent, AuditEventType, UserRole } from '@core/domain/models'

interface RegisterAuditEventInput {
  eventType: AuditEventType
  actorUserId: string
  actorRole: UserRole
  entityType: AuditEvent['entityType']
  entityId: string
  summary: string
}

interface AuditStoreState {
  runtimeEvents: AuditEvent[]
  registerEvent: (input: RegisterAuditEventInput) => void
  clearRuntimeEvents: () => void
}

function buildAuditEvent(input: RegisterAuditEventInput): AuditEvent {
  return {
    id: `runtime-${crypto.randomUUID()}`,
    eventType: input.eventType,
    occurredAt: new Date().toISOString(),
    actorUserId: input.actorUserId,
    actorRole: input.actorRole,
    entityType: input.entityType,
    entityId: input.entityId,
    summary: input.summary,
  }
}

export const useAuditStore = create<AuditStoreState>()(
  persist(
    (set, get) => ({
      runtimeEvents: [],
      registerEvent: (input) => {
        const nextEvent = buildAuditEvent(input)
        set({ runtimeEvents: [nextEvent, ...get().runtimeEvents].slice(0, 150) })
      },
      clearRuntimeEvents: () => set({ runtimeEvents: [] }),
    }),
    {
      name: 'mvp-pos-audit-events',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ runtimeEvents: state.runtimeEvents }),
    },
  ),
)
