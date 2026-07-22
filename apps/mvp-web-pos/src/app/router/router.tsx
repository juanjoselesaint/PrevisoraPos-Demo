import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AdminLayout } from '@app/layouts/admin-layout'
import { SellerLayout } from '@app/layouts/seller-layout'
import {
  RequireAdminArea,
  RequireAuth,
  RequireSellerArea,
  RoleLandingRedirect,
} from '@app/router/guards'
import { AdminCampaignsPage } from '@features/admin-campaigns/pages/admin-campaigns-page'
import { AdminPermissionsPage } from '@features/admin-permissions/pages/admin-permissions-page'
import { AuditPage } from '@features/audit/pages/audit-page'
import { LoginPage } from '@features/auth/pages/login-page'
import { CatalogPage } from '@features/catalog/pages/catalog-page'
import { AdminDashboardPage } from '@features/dashboard/pages/admin-dashboard-page'
import { SellerDashboardPage } from '@features/dashboard/pages/seller-dashboard-page'
import { QuoteSheetPage } from '@features/quote-sheet/pages/quote-sheet-page'
import { StockPage } from '@features/stock/pages/stock-page'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    handle: {
      breadcrumb: 'Login',
    },
  },
  {
    path: '/',
    element: <RoleLandingRedirect />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/seller',
        element: <RequireSellerArea />,
        children: [
          {
            element: <SellerLayout />,
            handle: {
              breadcrumb: 'Vendedor',
            },
            children: [
              {
                path: 'dashboard',
                element: <SellerDashboardPage />,
                handle: {
                  breadcrumb: 'Dashboard',
                },
              },
              {
                path: 'catalog',
                element: <CatalogPage />,
                handle: {
                  breadcrumb: 'Catalogo',
                },
              },
              {
                path: 'quote-sheet',
                element: <QuoteSheetPage />,
                handle: {
                  breadcrumb: 'Ficha y cotizacion',
                },
              },
              {
                path: 'stock',
                element: <StockPage />,
                handle: {
                  breadcrumb: 'Stock',
                },
              },
              {
                index: true,
                element: <Navigate replace to="/seller/dashboard" />,
              },
            ],
          },
        ],
      },
      {
        path: '/admin',
        element: <RequireAdminArea />,
        children: [
          {
            element: <AdminLayout />,
            handle: {
              breadcrumb: 'Administracion',
            },
            children: [
              {
                path: 'dashboard',
                element: <AdminDashboardPage />,
                handle: {
                  breadcrumb: 'Dashboard',
                },
              },
              {
                path: 'campaigns',
                element: <AdminCampaignsPage />,
                handle: {
                  breadcrumb: 'Campañas',
                },
              },
              {
                path: 'permissions',
                element: <AdminPermissionsPage />,
                handle: {
                  breadcrumb: 'Permisos',
                },
              },
              {
                path: 'audit',
                element: <AuditPage />,
                handle: {
                  breadcrumb: 'Auditoria',
                },
              },
              {
                index: true,
                element: <Navigate replace to="/admin/dashboard" />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/" />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
