import { ChevronDown, ChevronRight, HandCoins, ShieldCheck, UserCog, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import { roleLabels } from '@core/auth/role-routing'
import type { UserRole } from '@core/domain/models'
import { Badge } from '@core/ui/primitives/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@core/ui/primitives/card'
import { Switch } from '@core/ui/primitives/switch'
import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableHeadRow,
  TableRow,
} from '@core/ui/primitives/table'
import { useAdminRoles, useAdminUsers } from '@features/admin-permissions/api/use-admin-meta'

interface PermissionRow {
  roleCode: string
  canNegotiate: boolean
  canApprove: boolean
  canSeeHiddenTrace: boolean
}

const permissionColumns: Array<{
  field: keyof Omit<PermissionRow, 'roleCode'>
  label: string
  icon: typeof HandCoins
}> = [
  { field: 'canNegotiate', label: 'Solicita negociacion', icon: HandCoins },
  { field: 'canApprove', label: 'Aprueba negociacion', icon: ShieldCheck },
  { field: 'canSeeHiddenTrace', label: 'Ve trazabilidad interna', icon: UserCog },
]

export function AdminPermissionsPage() {
  const { data: rolesData } = useAdminRoles()
  const { data: usersData } = useAdminUsers()

  const [permissionRows, setPermissionRows] = useState<PermissionRow[]>([])
  const [collapsedRoles, setCollapsedRoles] = useState<Set<string>>(new Set())

  function toggleRoleCollapse(role: string) {
    setCollapsedRoles((current) => {
      const next = new Set(current)
      if (next.has(role)) {
        next.delete(role)
      } else {
        next.add(role)
      }
      return next
    })
  }

  useEffect(() => {
    const source = rolesData?.roles ?? []
    if (!source.length || permissionRows.length) {
      return
    }

    const generated: PermissionRow[] = source.map((role) => ({
      roleCode: role.code,
      canNegotiate: role.code !== 'seller',
      canApprove: role.code === 'supervisor' || role.code === 'commercial_admin' || role.code === 'it_admin',
      canSeeHiddenTrace: role.code === 'it_admin' || role.code === 'commercial_admin',
    }))

    setPermissionRows(generated)
  }, [rolesData?.roles, permissionRows])

  const roleRows = permissionRows

  function togglePermission(roleCode: string, field: keyof Omit<PermissionRow, 'roleCode'>) {
    setPermissionRows((current) =>
      current.map((row) =>
        row.roleCode === roleCode
          ? {
              ...row,
              [field]: !row[field],
            }
          : row,
      ),
    )
  }

  const users = usersData?.users ?? []
  const usersByRole = users.reduce<Record<string, typeof users>>((acc, user) => {
    acc[user.role] = acc[user.role] ? [...acc[user.role], user] : [user]
    return acc
  }, {})

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Permisos comerciales</CardTitle>
          <CardDescription>
            Gestiona que roles pueden solicitar o aprobar negociacion y acceder a trazabilidad interna.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de permisos por rol</CardTitle>
          <CardDescription>Cambios se aplican de inmediato a la simulacion del panel del vendedor.</CardDescription>
        </CardHeader>
        <CardContent>
          <TableContainer>
            <Table>
              <thead>
                <TableHeadRow>
                  <TableHeaderCell>Rol</TableHeaderCell>
                  {permissionColumns.map((column) => (
                    <TableHeaderCell key={column.field} className="text-center">
                      <span className="inline-flex items-center gap-1.5">
                        <column.icon className="h-3.5 w-3.5" />
                        {column.label}
                      </span>
                    </TableHeaderCell>
                  ))}
                </TableHeadRow>
              </thead>
              <tbody>
                {roleRows.map((row) => (
                  <TableRow key={row.roleCode}>
                    <TableCell className="font-medium text-[var(--color-ink-900)]">
                      {roleLabels[row.roleCode as UserRole] ?? row.roleCode}
                    </TableCell>
                    {permissionColumns.map((column) => (
                      <TableCell key={column.field} className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={row[column.field]}
                            onChange={() => togglePermission(row.roleCode, column.field)}
                            label={`${column.label} - ${row.roleCode}`}
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios impactados</CardTitle>
          <CardDescription>{users.length} usuarios agrupados por rol.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(usersByRole).map(([role, roleUsers]) => {
            const isCollapsed = collapsedRoles.has(role)

            return (
              <div key={role} className="rounded-lg border border-[var(--color-surface-200)]">
                <button
                  type="button"
                  onClick={() => toggleRoleCollapse(role)}
                  aria-expanded={!isCollapsed}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[var(--color-surface-50)]"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-ink-500)]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-ink-500)]" />
                  )}
                  <Users className="h-4 w-4 shrink-0 text-[var(--color-ink-500)]" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-600)]">
                    {roleLabels[role as UserRole] ?? role}
                  </p>
                  <Badge variant="neutral">{roleUsers.length}</Badge>
                </button>

                {isCollapsed ? null : (
                  <ul className="grid gap-2 border-t border-[var(--color-surface-200)] p-3 sm:grid-cols-2">
                    {roleUsers.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-200)] px-3 py-2"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-xs font-semibold text-[var(--color-brand-700)]">
                          {user.displayName
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                            {user.displayName}
                          </p>
                          <p className="truncate text-xs text-[var(--color-ink-600)]">{user.branchId}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}
