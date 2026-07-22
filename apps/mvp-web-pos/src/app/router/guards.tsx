import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { canAccessAdminArea, canAccessSellerArea } from '@core/auth/permissions'
import { canRoleAccessPath, getHomePathForRole } from '@core/auth/role-routing'
import { useSessionStore } from '@core/stores/session-store'

export function RequireAuth() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const role = useSessionStore((state) => state.role)
  const setLastVisitedPath = useSessionStore((state) => state.setLastVisitedPath)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/login') {
      setLastVisitedPath(location.pathname)
    }
  }, [location.pathname, setLastVisitedPath])

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  if (!canRoleAccessPath(role, location.pathname)) {
    return <Navigate replace to={getHomePathForRole(role)} />
  }

  return <Outlet />
}

export function RequireSellerArea() {
  const role = useSessionStore((state) => state.role)

  if (!canAccessSellerArea(role)) {
    return <Navigate replace to={getHomePathForRole(role)} />
  }

  return <Outlet />
}

export function RequireAdminArea() {
  const role = useSessionStore((state) => state.role)

  if (!canAccessAdminArea(role)) {
    return <Navigate replace to={getHomePathForRole(role)} />
  }

  return <Outlet />
}

export function RoleLandingRedirect() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const role = useSessionStore((state) => state.role)
  const lastVisitedPath = useSessionStore((state) => state.lastVisitedPath)
  const hasReusableLastPath = lastVisitedPath !== '/' && lastVisitedPath !== '/login'

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  if (hasReusableLastPath && canRoleAccessPath(role, lastVisitedPath)) {
    return <Navigate replace to={lastVisitedPath} />
  }

  return <Navigate replace to={getHomePathForRole(role)} />
}
