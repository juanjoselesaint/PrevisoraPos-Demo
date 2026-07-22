# Paso 5 - Shell de aplicacion y permisos base

Fecha: 2026-07-21

---

## Objetivo cumplido

Se montó el armazon de navegacion del MVP con login mock, selector de rol, guards por acceso, layouts por area y contexto persistente.

---

## Implementacion realizada

## 1) Login mock y selector de rol

Archivo:

- `apps/mvp-web-pos/src/features/auth/pages/login-page.tsx`

Incluye:

- seleccion de usuario mock;
- seleccion de rol activo;
- seleccion de sucursal activa;
- redireccion a la ruta previa permitida por rol (o home por rol).

## 2) Guards y permisos de UI

Archivos:

- `apps/mvp-web-pos/src/app/router/guards.tsx`
- `apps/mvp-web-pos/src/core/auth/permissions.ts`
- `apps/mvp-web-pos/src/core/auth/role-routing.ts`

Capacidades:

- guard de autenticacion (`RequireAuth`);
- guard de area vendedor (`RequireSellerArea`);
- guard de area administracion (`RequireAdminArea`);
- matriz de visibilidad por feature segun rol;
- landing inteligente segun rol y ultima ruta persistida.

## 3) Layout vendedor

Archivo:

- `apps/mvp-web-pos/src/app/layouts/seller-layout.tsx`

Con:

- menu vendedor segun permisos;
- acceso a dashboard, catalogo, ficha/cotizacion y stock.

## 4) Layout administracion

Archivo:

- `apps/mvp-web-pos/src/app/layouts/admin-layout.tsx`

Con:

- menu administracion segun permisos;
- acceso a dashboard admin, campanas, permisos y auditoria.

## 5) Navegacion principal, breadcrumbs y contexto persistente

Archivos:

- `apps/mvp-web-pos/src/app/layouts/shell-layout.tsx`
- `apps/mvp-web-pos/src/app/router/router.tsx`
- `apps/mvp-web-pos/src/core/stores/session-store.ts`

Implementado:

- breadcrumbs basados en `route handle`;
- navegacion con rutas anidadas para vendedor/admin;
- contexto persistente con Zustand persist (`localStorage`):
  - autenticacion mock;
  - usuario, rol y sucursal;
  - segmento comercial;
  - ultima ruta visitada.

---

## Salida esperada del paso

- ingreso por rol funcionando: ✅
- navegacion estable: ✅
- feature visibility resuelta: ✅

---

## Validacion tecnica

- `npm run build` ✅
- `npm run test` ✅

Resultado: Shell de aplicacion operativo y listo para avanzar a componentes visuales y pantallas de negocio.
