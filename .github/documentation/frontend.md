# Frontend

## Estado actual

Implementado. El frontend vive en `apps/mvp-web-pos` (React 19 + Vite + TypeScript), ver
`Docs/feature-nt-002-mvp-web-pos/` para el plan y los pasos ejecutados. Las secciones tecnicas
mas abajo en este archivo (API client Axios, convenciones de barrel exports, etc.) son guia
generica previa a la implementacion y **no reflejan el stack real** — usar en su lugar lo
descripto aca abajo y el codigo fuente como fuente de verdad.

## Stack real (apps/mvp-web-pos)

- **UI**: Tailwind CSS v4 + primitivos propios en `src/core/ui/primitives` (no hay Axios ni
  barrel exports por feature).
- **Estado cliente**: Zustand (`src/core/stores`: sesion, borrador de cotizacion, auditoria).
- **Estado servidor/mock**: TanStack Query, con una capa "fake API" (`src/core/api/fake-api.ts`)
  que responde directo desde `src/mocks/data/domain.ts`, y un mirror opcional via MSW
  (`src/mocks/handlers.ts`) activable con `VITE_ENABLE_MSW=true`.
- **Routing**: React Router v7, con layouts separados por rol en `src/app/layouts`.
- **Path aliases reales** (`vite.config.ts` / `tsconfig.app.json`): `@app`, `@core`, `@features`,
  `@mocks` (no existe alias `@/*` generico).
- **Estructura**: feature-first en `src/features/*` (auth, dashboard, catalog, quote-sheet,
  stock, audit, admin-campaigns, admin-permissions) — ver `src/features/README.md`.

## Contexto de negocio (para mockups/roadmap, no para arquitectura)

- `Docs/Investigacion POS.md`
- `Docs/Previsora del Parana - Roadmap motor de promociones.html`
- `.github/documentation/demo-pos-overview.md`

interface ActionButtonProps {
isLoading?: boolean;
loadingText?: string;
// ... resto de props
}

export const ActionButton = ({ isLoading, children, ...props }) => (
<Button {...props} disabled={isLoading}>
{isLoading ? (
<>
<Spinner size="sm" /> {loadingText}
</>
) : (
children
)}
</Button>
);

````

## 📱 Desarrollo Responsive

Se maneja con **clases de Tailwind** directamente en JSX:

```tsx
<div
  className="
  p-4 md:p-6 lg:p-8                    // Padding progresivo
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3    // Columnas responsive
  text-sm md:text-base lg:text-lg      // Tipografía
  hidden md:block                       // Visibilidad condicional
"
>
  Contenido
</div>
````

**Breakpoints estándar**: `sm:640px` · `md:768px` · `lg:1024px` · `xl:1280px` · `2xl:1536px`

## 🔧 Path Aliases

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@features/*": ["src/features/*"]
    }
  }
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
});
```

**Uso**: `import { Button } from '@/core/components/Button';`

## 📦 Barrel Exports (`index.ts`)

Facilitan imports limpios. Crear en cada feature y carpeta de `core/`:

```typescript
// features/[feature-name]/index.ts
export * from "./models/[entity].model";
export * from "./services/[entity].service";
export * from "./hooks/use[Entities]";
export { [Entity]ListPage } from "./pages/[Entity]ListPage";
```

**Uso**: `import { use[Entities], [Entity], [Entity]ListPage } from '@features/[feature-name]';`

## 🌐 API Client (Axios)

```typescript
// core/services/api/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Interceptors: agregar token, manejar errores 401
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## 🗄️ Gestión de Estado

- **Zustand**: Estado global (auth, theme) en `core/store/`
- **React Query**: Estado del servidor (cache, refetch) en hooks de features
- **useState/useReducer**: Estado local de componentes

## 🧪 Convenciones de Nomenclatura

| Tipo        | Convención           | Ejemplo                |
| ----------- | -------------------- | ---------------------- |
| Componentes | PascalCase           | `[Entity]Card.tsx`     |
| Páginas     | PascalCase + Page    | `[Entity]ListPage.tsx` |
| Hooks       | camelCase + use      | `use[Entities].ts`     |
| Services    | camelCase + .service | `[entity].service.ts`  |
| Models      | camelCase + .model   | `[entity].model.ts`    |
| DTOs        | camelCase + .dto     | `[entity].dto.ts`      |
| Utils       | camelCase            | `formatters.ts`        |
| Types       | camelCase + .types   | `api.types.ts`         |

**Variables**: `camelCase` · **Constantes**: `UPPER_SNAKE_CASE` · **Interfaces/Types**: `PascalCase` · **Enums**: `PascalCase`

## 🚀 Variables de Entorno

```env
# .env.example
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_ANALYTICS=false
VITE_EXTERNAL_SERVICE_API_KEY=your_key_here
```

Acceso: `import.meta.env.VITE_API_URL`

## 📝 Agregar Nueva Feature

```bash
# 1. Crear estructura
mkdir -p src/features/[nombre]/{components,pages,hooks,services,models,utils}

# 2. Crear archivos base
cd src/features/[nombre]
touch index.ts models/[nombre].model.ts services/[nombre].service.ts hooks/use[Nombre].ts

# 3. Implementar en orden: Model → Service → Hook → Components → Pages
# 4. Agregar ruta en app/Router.tsx
# 5. Crear barrel export en index.ts
```

## 🔍 Tips para GitHub Copilot

1. **Nombres descriptivos**: Archivos y funciones con nombres claros
2. **Estructura consistente**: Mantén la organización de carpetas
3. **Comentarios de intención**: Describe qué quieres antes del código
4. **Barrel exports**: Facilitan la comprensión de dependencias
5. **Tipos explícitos**: TypeScript mejora las sugerencias

**Ejemplo de comentario efectivo**:

```typescript
// Hook para paginación de [entidad] con: page, pageSize, goToPage, nextPage, prevPage
export const use[Entity]Pagination = () => { ... }
```

---

**Última actualización**: Septiembre 2025 · **Versión**: 1.0.0
