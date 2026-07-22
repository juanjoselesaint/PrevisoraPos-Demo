# Migrations - Entity Framework Core

## Introducción

Guía para gestionar **migraciones de base de datos** con Entity Framework Core. Las migraciones versionan los cambios del esquema de la base de datos.

**Uso recomendado**: Este documento funciona como **template base** para proyectos .NET de Diveria que utilicen EF Core. Sustituye nombres de entidades, migraciones y autores por los del proyecto real.

**Ver también**: `backend.md` (DbContext) · `database.md` (PostgreSQL) · `create-migration.prompt.md` (Prompt práctico)

---

## 🎯 Concepto

Las **migraciones** son archivos de código C# que representan cambios en el esquema de la base de datos:

1. Modificas entidades o configuraciones en el código
2. Creas una migración (EF Core detecta cambios)
3. Revisas el código generado
4. Aplicas la migración a la base de datos

**Ventaja**: Historial completo de cambios versionado en Git.

---

## 📝 Convención de Nombres

### Formato Automático de Entity Framework Core

Entity Framework Core **genera automáticamente** un timestamp al crear migraciones:

```
{Timestamp_AutoGenerado}_{DescripciónBreve}
```

**Ejemplo**: `20251023144454_AddEntityTable`

**Timestamp**: Generado por EF Core en formato `yyyyMMddHHmmss` (garantiza orden cronológico)

**Descripción**: Verbo en inglés + entidad/cambio en PascalCase (`Add`, `Update`, `Remove`, `Create`)

### Ejemplos

- `20251023144454_AddEntityTable` ← EF genera el timestamp
- `20251023150130_AddEmailIndexToEntity`
- `20251023161245_UpdateUserAddRoleColumn`
- `20251023173020_RemoveObsoleteFields`

---

## 🔧 Comandos Esenciales

### Crear Migración

```bash
# Entity Framework Core genera el timestamp automáticamente
dotnet ef migrations add NombreDescriptivo --output-dir Core/Database/Migrations

# Ejemplos
dotnet ef migrations add AddEntityTable --output-dir Core/Database/Migrations
dotnet ef migrations add AddEmailIndexToEntity --output-dir Core/Database/Migrations
```

**Resultado**: EF Core genera `20251023144454_AddEntityTable.cs` con el timestamp actual

# Migrations

## Estado actual

No aplica todavia. No existe una base de datos implementada ni un framework de migraciones elegido.

## Alcance de este documento

Este archivo queda como recordatorio de que las migraciones solo deben documentarse cuando exista una estrategia de persistencia definida.

## Antes de volverlo relevante

Primero deben resolverse estas decisiones:

- si la demo necesitara persistencia real o un dataset controlado,
- que tecnologia gestionara los cambios de esquema,
- que politicas de auditoria se exigen para promociones y operaciones,
- como se versionaran los datos de prueba del MVP.

Hasta entonces, cualquier referencia a migraciones debe tratarse como plan futuro y no como practica operativa vigente. 2. Pull de cambios del equipo 3. Aplicar migraciones del equipo: `dotnet ef database update` 4. Crear tu migración nuevamente 5. Push de tu migración

---

## 📊 Tipos de Cambios Comunes

### Agregar Tabla

Crear nueva entidad → crear migración → aplicar

### Agregar Columna

Modificar entidad existente → crear migración → aplicar

**Consideración**: Si columna es `NOT NULL`, definir valor por defecto o hacer nullable

### Modificar Columna

Cambiar tipo, longitud o restricciones → crear migración → aplicar

**Cuidado**: Puede causar pérdida de datos si se reduce tamaño

### Eliminar Columna

Comentar propiedad en entidad → crear migración → aplicar

**Cuidado**: Pérdida de datos irreversible

### Crear Índice

Agregar configuración de índice en `IEntityTypeConfiguration` → crear migración

### Modificar Relación

Cambiar navegación o claves foráneas → crear migración

**Cuidado**: Puede requerir datos de semilla o corrección manual

---

## 🛡️ Seguridad en Producción

### Pre-Migración

- ✅ **Backup completo** de la base de datos
- ✅ **Revisar script SQL** generado
- ✅ **Probar en staging** primero
- ✅ **Plan de rollback** documentado
- ✅ **Ventana de mantenimiento** si hay downtime

### Post-Migración

- ✅ **Verificar integridad** de datos
- ✅ **Ejecutar smoke tests** de la aplicación
- ✅ **Monitorear logs** de errores
- ✅ **Rollback rápido** si hay problemas críticos

### Cambios Destructivos

Cambios que pueden causar pérdida de datos:

- Eliminar columnas
- Reducir tamaño de campos
- Cambiar tipos incompatibles
- Eliminar tablas

**Estrategia**: Dividir en dos migraciones (deprecar → eliminar) con tiempo entre medio.

---

## 🔍 Troubleshooting

### "No DbContext was found"

**Causa**: EF Core CLI no encuentra el DbContext

**Solución**: Ejecutar desde la carpeta del proyecto o especificar proyecto:

```bash
dotnet ef migrations add ... --project Backend
```

### "Build failed"

**Causa**: Errores de compilación

**Solución**: Compilar primero: `dotnet build`

### "The migration has already been applied"

**Causa**: Intentando aplicar migración ya aplicada

**Solución**: Verificar con `dotnet ef migrations list`

### "Pending model changes"

**Causa**: Hay cambios en el modelo no reflejados en migraciones

**Solución**: Crear nueva migración con los cambios pendientes

---

## 📚 Comandos de Referencia Rápida

```bash
# Crear migración (EF Core genera timestamp automáticamente)
dotnet ef migrations add NombreDescriptivo --output-dir Core/Database/Migrations

# Listar migraciones
dotnet ef migrations list

# Aplicar migraciones
dotnet ef database update

# Rollback
dotnet ef database update {MigraciónAnterior}

# Remover última (no aplicada)
dotnet ef migrations remove

# Generar script SQL
dotnet ef migrations script > migration.sql

# Ver ayuda
dotnet ef migrations --help
```

---

**Última actualización**: Octubre 2025 · **Versión**: 1.0.0
