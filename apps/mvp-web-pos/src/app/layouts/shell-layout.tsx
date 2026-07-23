import type { ComponentType, ReactNode } from 'react'
import { Building2, ChevronRight, LogOut } from 'lucide-react'
import { NavLink, Outlet, useMatches } from 'react-router-dom'

import { roleLabels } from '@core/auth/role-routing'
import { useSessionStore } from '@core/stores/session-store'
import { Button } from '@core/ui/primitives/button'

interface NavItem {
  to: string
  label: string
  icon?: ComponentType<{ className?: string }>
}

interface HeaderAction {
  to: string
  label: string
  icon?: ComponentType<{ className?: string }>
  badgeCount?: number
}

interface ShellLayoutProps {
  title: string
  navItems: NavItem[]
  headerBadge: string
  headerActions?: HeaderAction[]
  children?: ReactNode
}

type MatchHandle = {
  breadcrumb?: string
}

function BreadcrumbTrail() {
  const matches = useMatches()

  const crumbs = matches
    .map((match) => (match.handle as MatchHandle | undefined)?.breadcrumb)
    .filter((crumb): crumb is string => Boolean(crumb))

  if (crumbs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-ink-600)]">
      {crumbs.join(' / ')}
    </nav>
  )
}

export function ShellLayout({ title, navItems, headerBadge, headerActions = [], children }: ShellLayoutProps) {
  const role = useSessionStore((state) => state.role)
  const logout = useSessionStore((state) => state.logout)

  const initials = roleLabels[role]
    .split(/[\s/]+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--color-surface-200)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-700)] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-brand-600)]">
                Previsora del Parana &middot; {headerBadge}
              </p>
              <h1 className="font-display text-lg font-semibold leading-tight text-[var(--color-ink-900)]">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {headerActions.map((action) => {
              const Icon = action.icon
              const badgeCount = action.badgeCount ?? 0

              return (
                <NavLink
                  key={action.to}
                  to={action.to}
                  className={({ isActive }) =>
                    [
                      'relative inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition',
                      isActive
                        ? 'border-[var(--color-brand-300)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]'
                        : 'border-[var(--color-surface-300)] bg-white text-[var(--color-ink-700)] hover:bg-[var(--color-surface-100)]',
                    ].join(' ')
                  }
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  <span className="hidden sm:inline">{action.label}</span>
                  {badgeCount > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-brand-700)] px-1 text-[10px] font-semibold text-white">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}

            <div className="hidden items-center gap-2 rounded-full bg-[var(--color-surface-100)] py-1 pl-1 pr-3 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-xs font-semibold text-[var(--color-brand-700)]">
                {initials}
              </span>
              <span className="text-xs font-medium text-[var(--color-ink-700)]">{roleLabels[role]}</span>
            </div>
            <Button variant="secondary" onClick={logout}>
              <LogOut className="mr-1.5 h-4 w-4" />
              Cerrar sesion
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-[var(--color-surface-300)] bg-white p-4 shadow-sm lg:sticky lg:top-20">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-[var(--color-brand-700)] text-white shadow-sm'
                          : 'text-[var(--color-ink-700)] hover:bg-[var(--color-surface-100)]',
                      ].join(' ')
                    }
                    to={item.to}
                  >
                    {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </aside>

        <main className="space-y-4">
          <BreadcrumbTrail />
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
