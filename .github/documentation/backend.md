# Backend

## Estado actual

No aplica todavia. Este repositorio no contiene backend implementado.

## Como debe interpretarse este documento

Este archivo existe solo para dejar explicito que la capa backend aun no fue definida. No debe leerse como evidencia de una API, framework o arquitectura ya elegidos.

## Lo que si se sabe hoy

- El demo gira alrededor de promociones, catalogo, cotizacion asistida y evolucion hacia un punto de venta.
- El roadmap funcional parte del reemplazo del Excel y luego avanza hacia capacidades transaccionales mas amplias.
- La definicion del backend depende de decisiones posteriores sobre alcance del demo funcional e integraciones.

## Cuando actualizar esta guia

Actualizar este archivo solo cuando exista una decision concreta sobre:

- stack backend,
- modelo de integracion con sistemas externos,
- limites del dominio del MVP,
- contrato entre experiencia de venta, promociones y persistencia.

Hasta ese momento, cualquier propuesta tecnica debe documentarse como alternativa futura y no como estado real.

### Entity Configuration

Cada entidad tiene su configuración en `Core/Database/Configurations/`:

- Implementa `IEntityTypeConfiguration<T>`
- Define tabla, claves, propiedades, índices, relaciones
- Uso de Fluent API

### BaseEntity

Entidad base con propiedades comunes:

- `Id` (int, PK)
- `CreatedAt` (DateTime, default UTC)
- `UpdatedAt` (DateTime?, nullable)

## ✅ Validación con FluentValidation

### Registro

Registro automático en `ProgramSetup`:

```csharp
services.AddValidatorsFromAssemblyContaining<Program>();
```

### Validadores

Un validator por cada DTO de entrada (CreateDto, UpdateDto):

- Hereda de `AbstractValidator<TDto>`
- Define reglas con `RuleFor`
- Mensajes de error personalizados con `WithMessage`

**Reglas comunes**: `NotEmpty`, `MaximumLength`, `EmailAddress`, `When` (condicional)

## 🧪 Testing con xUnit

### Stack de Testing

- **xUnit**: Framework de testing
- **Moq**: Mocking de dependencias
- **FluentAssertions**: Assertions expresivas

### Estructura de Tests

```
backend/Backend.Tests/
├── Features/
│   └── [FeatureName]/
│       ├── Services/           # Tests de lógica de negocio
│       ├── Repositories/       # Tests de acceso a datos (opcional)
│       └── Validators/         # Tests de validación
└── Core/
    └── Middleware/             # Tests de middleware
```

### Convención de Nombres

Métodos de test: `{Método}_{Escenario}_{ResultadoEsperado}`

**Ejemplo**: `GetByIdAsync_NonExistingId_ThrowsNotFoundException`

### Patrón AAA

- **Arrange**: Preparar mocks y datos
- **Act**: Ejecutar método bajo test
- **Assert**: Verificar resultado con FluentAssertions

## 📝 Swagger y Documentación de API

### Configuración

- Habilitar XML Documentation en `.csproj`
- Swagger solo en Development
- XML Comments en controllers y métodos públicos
- `ProducesResponseType` para documentar códigos de respuesta

### URL Swagger

- Development: `https://localhost:{port}/swagger`
- Production: Deshabilitado

## 🔐 Variables de Entorno y Configuración

### Archivos de Configuración

- **appsettings.json**: Configuración base y producción
- **appsettings.Development.json**: Configuración de desarrollo
- **.env.example**: Template de variables de entorno para Docker

### Gestión de Secrets

**Desarrollo Local**: User Secrets (.NET)

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;..."
```

**Docker**: Variables de entorno en `docker-compose.yml`

**Producción (futuro)**: Azure Key Vault o similar

### Variables Clave

**Database**:

- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`

**Application**:

- `ASPNETCORE_ENVIRONMENT`
- `ASPNETCORE_URLS`
- `CORS_ORIGINS`

**JWT (preparado para futuro)**:

- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`
- `JWT_EXPIRATION_MINUTES`

## 🧩 Convenciones de Nomenclatura

| Tipo             | Convención                 | Ejemplo                                                    |
| ---------------- | -------------------------- | ---------------------------------------------------------- |
| **Controllers**  | Plural + Controller        | `[Entidades]Controller`                                    |
| **Services**     | Singular + Service + I     | `I[Entidad]Service`, `[Entidad]Service`                    |
| **Repositories** | Singular + Repository + I  | `I[Entidad]Repository`, `[Entidad]Repository`              |
| **Entities**     | Singular, PascalCase       | `[Entidad]`, `[OtraEntidad]`, `[TerceraEntidad]`           |
| **DTOs**         | Singular + Dto + Propósito | `Create[Entidad]Dto`, `Update[Entidad]Dto`, `[Entidad]Dto` |
| **Validators**   | Dto + Validator            | `Create[Entidad]DtoValidator`                              |
| **Mappers**      | Entity + Mappers           | `[Entidad]Mappers`                                         |
| **Interfaces**   | I + Nombre                 | `I[Entidad]Service`, `IRepository<T>`                      |
| **Métodos**      | Verbos claros en inglés    | `GetById`, `Create`, `Update`, `Delete`, `GetAllAsync`     |
| **Variables**    | camelCase                  | `entityService`, `connectionString`, `isActive`            |
| **Constantes**   | UPPER_SNAKE_CASE           | `MAX_PAGE_SIZE`, `DEFAULT_TIMEOUT`                         |
| **Namespaces**   | Backend.{Capa}.{Feature}   | `Backend.Features.[Feature].Services`                      |

## 🚀 Comandos Útiles

### Entity Framework Core

```bash
# Crear migración con timestamp
dotnet ef migrations add $(Get-Date -Format "yyyyMMddHHmmss")_NombreDescriptivo

# Aplicar migraciones
dotnet ef database update

# Rollback a migración específica
dotnet ef database update NombreMigracion

# Listar migraciones
dotnet ef migrations list

# Remover última migración (no aplicada)
dotnet ef migrations remove
```

Ver guía completa en `migrations.md`

### Docker (PostgreSQL)

```bash
# Levantar PostgreSQL
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

Ver guía completa en `database.md`

### Desarrollo

```bash
# Restaurar paquetes
dotnet restore

# Compilar
dotnet build

# Ejecutar en modo desarrollo
dotnet run

# Watch mode (recarga automática)
dotnet watch run

# Ejecutar tests
dotnet test
```

## 📝 Agregar Nueva Feature

### Flujo de Desarrollo

1. **Crear estructura de carpetas** en `Features/[NombreFeature]/`
2. **Model**: Entidad de dominio (hereda de `BaseEntity`)
3. **DTOs**: Create, Update, Response, List
4. **Validators**: FluentValidation para DTOs de entrada
5. **Repository**: Interface + implementación con EF Core
6. **Service**: Interface + implementación con lógica de negocio
7. **Controller**: Endpoints REST con XML comments
8. **Mappers**: AutoMapper Profile
9. **Entity Configuration**: Fluent API en `Core/Database/Configurations/`
10. **DbSet**: Agregar al `ApplicationDbContext`
11. **Registro**: Agregar services en `ProgramSetup`
12. **Migración**: Crear y aplicar migración con timestamp
13. **Tests**: Crear tests unitarios para service

**Guía detallada**: Ver prompt `create-backend-feature.prompt.md`

## 🔍 Tips para GitHub Copilot

1. **Estructura consistente**: Mantén siempre la estructura de carpetas por feature
2. **Nombres descriptivos**: Clases, métodos y variables con nombres claros
3. **XML Comments**: Documenta controllers y métodos públicos para Swagger
4. **Interfaces explícitas**: Siempre define interfaces para services y repositories
5. **DTOs por operación**: Separa CreateDto, UpdateDto, Dto y ListDto
6. **Validators independientes**: Un validator por cada DTO de entrada
7. **Comentarios de intención**: Describe qué hace el código antes de escribirlo
8. **Async/Await**: Usa métodos asíncronos para operaciones de BD
9. **Exception handling**: Lanza excepciones personalizadas, el middleware las captura
10. **Mapping automático**: Confía en AutoMapper, configura solo casos especiales

**Ejemplo de comentario efectivo**:

```csharp
// Service para gestión de [entidad] con: GetAll, GetById, Create, Update, Delete
// Validar reglas de unicidad o negocio en Create y Update
// Lanzar NotFoundException si la entidad no existe
```

## 🔮 Funcionalidades Futuras (Preparadas)

### Autenticación JWT

Carpeta `Features/Auth/` reservada, variables de entorno definidas

### Paginación

DTO `PagedResult<T>` en `Core/Common/DTOs/` listo para usar

### Health Checks

Endpoint `/health` preparado para Docker/Kubernetes

### Logging Avanzado

Estructura para Serilog y logging a servicios externos

### Unit of Work

Interface `IUnitOfWork` para transacciones complejas multi-repositorio

---

**Última actualización**: Octubre 2025 · **Versión**: 1.0.0
