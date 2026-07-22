---
applyTo: "**"
---

# Estándares de Código

Este documento establece los estándares de código que deben seguirse en este proyecto para asegurar la calidad, mantenibilidad y coherencia del código.

## Estándares generales actuales

- Mantener autorización de UI con una sola fuente de verdad en una matriz centralizada de permisos por rol.
- Definir navegación por áreas con guards explícitos de autenticación y acceso por rol, evitando lógica de permiso dispersa en pantallas.
- Declarar breadcrumbs en metadatos de rutas (`handle.breadcrumb`) para desacoplar navegación de componentes visuales.
- Persistir contexto comercial mínimo de sesión (rol, sucursal, segmento y última ruta) para continuidad operativa del flujo.
