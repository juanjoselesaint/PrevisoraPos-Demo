# Features

Estructura feature-first del MVP Web POS.

- `auth` — login mock y guards por rol
- `dashboard` — cockpit vendedor y panel de administracion
- `catalog` — busqueda marketplace sobre el catalogo completo
- `quote-sheet` — ficha comercial, descuento de negociacion (5%-15%) y constructor de cotizacion/payload Softland
- `stock` — disponibilidad por sucursal
- `audit` — trazabilidad de busquedas, fichas y cotizaciones + evidencia imprimible
- `admin-campaigns` — motor de promociones: CRUD de campanas y vista de reglas por cluster (producto / medio de pago / cliente)
- `admin-permissions` — matriz de permisos por rol

No existen features separadas de "promotions" ni "negotiation-discounts": esa logica es parte
del motor comercial (`core/domain/commercial-engine.ts`) y se expone en `quote-sheet`
(descuento de negociacion) y `admin-campaigns` (reglas de promocion), no como pantallas propias.
