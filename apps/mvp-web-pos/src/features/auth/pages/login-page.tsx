import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Button } from '@core/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Select } from '@core/ui/primitives/select'
import { getCatalogBootstrap, listBranches, listRoles, listUsers } from '@core/api/fake-api'
import { useSessionStore } from '@core/stores/session-store'
import { canRoleAccessPath, getHomePathForRole, roleLabels } from '@core/auth/role-routing'

const EMPTY_USERS: Awaited<ReturnType<typeof listUsers>>['users'] = []
const EMPTY_ROLES: Awaited<ReturnType<typeof listRoles>>['roles'] = []
const EMPTY_BRANCHES: Awaited<ReturnType<typeof listBranches>>['branches'] = []

export function LoginPage() {
  const navigate = useNavigate()
  const loginAs = useSessionStore((state) => state.loginAs)
  const lastVisitedPath = useSessionStore((state) => state.lastVisitedPath)

  const bootstrapQuery = useQuery({
    queryKey: ['bootstrap'],
    queryFn: getCatalogBootstrap,
  })

  const usersQuery = useQuery({
    queryKey: ['meta', 'users'],
    queryFn: listUsers,
  })

  const rolesQuery = useQuery({
    queryKey: ['meta', 'roles'],
    queryFn: listRoles,
  })

  const branchesQuery = useQuery({
    queryKey: ['meta', 'branches'],
    queryFn: listBranches,
  })

  const users = usersQuery.data?.users ?? EMPTY_USERS
  const roles = rolesQuery.data?.roles ?? EMPTY_ROLES
  const branches = branchesQuery.data?.branches ?? EMPTY_BRANCHES

  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<'seller' | 'supervisor' | 'commercial_admin' | 'it_admin'>(
    'seller',
  )
  const [selectedBranchId, setSelectedBranchId] = useState('casa-central')

  const selectedUser = useMemo(
    () => users.find((item) => item.id === selectedUserId) ?? users[0],
    [users, selectedUserId],
  )

  const isLoading =
    bootstrapQuery.isLoading || usersQuery.isLoading || rolesQuery.isLoading || branchesQuery.isLoading

  const isError =
    bootstrapQuery.isError || usersQuery.isError || rolesQuery.isError || branchesQuery.isError

  function handleLogin() {
    const user = selectedUser ?? users[0]
    if (!user) {
      return
    }

    const role = selectedRole || user.role
    const branchId = selectedBranchId || user.branchId

    loginAs({
      userId: user.id,
      role,
      branchId,
    })

    const hasReusableLastPath = lastVisitedPath !== '/' && lastVisitedPath !== '/login'
    const targetPath = hasReusableLastPath && canRoleAccessPath(role, lastVisitedPath)
      ? lastVisitedPath
      : getHomePathForRole(role)

    navigate(targetPath, { replace: true })
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f3f7ff_0%,#eef3fb_45%,#e6edf7_100%)] p-6">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center text-sm text-[var(--color-ink-700)]" aria-live="polite">
            Cargando acceso...
          </CardContent>
        </Card>
      </main>
    )
  }

  if (isError || !bootstrapQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f3f7ff_0%,#eef3fb_45%,#e6edf7_100%)] p-6">
        <Card className="w-full max-w-md border-[var(--color-danger-300)]">
          <CardContent className="py-10 text-center text-sm text-[var(--color-danger-700)]" aria-live="assertive">
            Error al cargar configuracion de ingreso. Revisa MSW y fake API.
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f3f7ff_0%,#eef3fb_45%,#e6edf7_100%)] p-6">
      <section className="grid w-full max-w-5xl gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Acceso comercial</CardTitle>
            <CardDescription>
              Selecciona un perfil y define el contexto inicial de trabajo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[var(--color-ink-700)]">
            <div className="rounded-xl border border-[var(--color-surface-300)] bg-[var(--color-surface-50)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)]">
                Aplicacion
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">
                {bootstrapQuery.data.appName}
              </p>
              <p className="mt-2 text-sm text-[var(--color-ink-600)]">
                El perfil elegido define navegación, permisos y visibilidad de información comercial.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-surface-300)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)]">
                Perfil seleccionado
              </p>
              <p className="mt-1 font-medium text-[var(--color-ink-900)]">
                {selectedUser?.displayName ?? 'Sin usuario'}
              </p>
              <p className="text-xs text-[var(--color-ink-600)]">{selectedUser?.email ?? 'Sin email'}</p>
              <p className="mt-2 text-xs text-[var(--color-ink-600)]">
                Rol: {roleLabels[selectedRole]} | Sucursal: {selectedBranchId}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ingresar</CardTitle>
            <CardDescription>Configura usuario, rol y sucursal antes de continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                handleLogin()
              }}
            >
              <label className="block text-sm text-[var(--color-ink-700)]" htmlFor="userSelect">
                Usuario
                <Select
                  id="userSelect"
                  className="mt-2"
                  value={selectedUserId || selectedUser?.id || ''}
                  onChange={(event) => {
                    const value = event.target.value
                    const matched = users.find((item) => item.id === value)
                    setSelectedUserId(value)
                    if (matched) {
                      setSelectedRole(matched.role)
                      setSelectedBranchId(matched.branchId)
                    }
                  }}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
                </Select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-[var(--color-ink-700)]" htmlFor="roleSelect">
                  Rol activo
                  <Select
                    id="roleSelect"
                    className="mt-2"
                    value={selectedRole}
                    onChange={(event) => {
                      setSelectedRole(
                        event.target.value as
                          | 'seller'
                          | 'supervisor'
                          | 'commercial_admin'
                          | 'it_admin',
                      )
                    }}
                  >
                    {roles.map((role) => (
                      <option key={role.code} value={role.code}>
                        {roleLabels[role.code]}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="block text-sm text-[var(--color-ink-700)]" htmlFor="branchSelect">
                  Sucursal activa
                  <Select
                    id="branchSelect"
                    className="mt-2"
                    value={selectedBranchId}
                    onChange={(event) => {
                      setSelectedBranchId(event.target.value)
                    }}
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>

              <div className="flex items-center justify-end pt-1">
                <Button type="submit" className="w-full sm:w-48">
                  Ingresar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
