# ❓ FAQ - Preguntas Frecuentes

**Consulta esta guía cuando necesites saber cómo realizar una tarea o tengas dudas sobre el proyecto.**

Si necesitas una introducción breve para instalar, ubicar carpetas, elegir el flujo correcto y entender qué aporta este repositorio, empieza por [github-copilot-guide.md](github-copilot-guide.md).

---

## 🔄 Flujos de Trabajo

### Flujo Completo (Tareas Complejas)

`Ticket/Requirement → @dev-planner → @developer → @code-reviewer → @management`

Usa este flujo para features complejos, cambios importantes o tareas que requieren planificación.

### Flujo Rápido (Tareas Simples)

`Descripción → @developer → (opcional) @management`

Usa este flujo para fixes pequeños, mejoras menores o cambios claros y directos.

### Otros Flujos

- **Documentación**: `@management` para documentar features o generar guías
- **Análisis funcional**: `@functional-analyst` para convertir contexto disperso en casos de uso formales
- **Setup**: `@setup` para inicializar el proyecto o configurar entorno
- **Auditoría**: `@audit` para revisión exhaustiva de calidad

---

## 💬 Preguntas Comunes

### Desarrollo

- **¿Cómo empiezo un feature nuevo?** → Usa `@dev-planner` para plan, luego `@developer`
  `@dev-planner` sirve para desglosar todo tipo de tareas y crear un plan detallado.
- **¿Cómo hago un cambio pequeño?** → Usa `@developer` directamente
- **¿Cómo creo tests?** → `@developer` "Crea tests para [feature/componente]"
- **¿Cómo agrego funcionalidad a algo existente?** → `@developer` "Agrega [descripción] al [componente]"

### Gestión

- **¿Cómo creo un Merge Request?** → `@management` "Crea MR para el proyecto [ID]"
- **¿Cómo documento un feature?** → `@management` "Documenta [feature]"
- **¿Cómo actualizo un ticket?** → `@management` "Actualiza ticket [ID]"

### Análisis Funcional

- **¿Cómo genero un caso de uso?** → `@functional-analyst` con transcripción, PDF, descripción o material base
- **¿Quién convierte el caso de uso en ticket?** → `@management` después de validar el resultado generado por `@functional-analyst`

### Setup

- **¿Cómo configuro el proyecto?** → `@setup` "Inicializa el proyecto"
- **¿Cómo configuro herramientas externas?** → Ver `setup.mcp-setup.prompt.md`
- **¿Dónde deben ir `.github/` y `.vscode/`?** → Revisa [github-copilot-guide.md](github-copilot-guide.md)
- **¿Cómo adapto esto a varios repositorios o a un workspace?** → Revisa [github-copilot-guide.md](github-copilot-guide.md)

### Revisión

- **¿Cómo reviso mi código?** → `@code-reviewer` "Revisa los cambios"

### Auditoría

- **¿Cómo audito el proyecto?** → `@audit` para auditoría completa

---

## 🧭 ¿Qué agente usar?

| Situación                      | Agente                        | Cuándo                                |
| ------------------------------ | ----------------------------- | ------------------------------------- |
| No sé por dónde empezar        | `@dev-planner`                | Features complejos, múltiples cambios |
| Sé qué hacer                   | `@dev-planner` + `@developer` | Plan e Implementación                 |
| Quiero hacer un cambio directo | `@developer`                  | Implementación directa                |
| Terminé de desarrollar         | `@code-reviewer`              | Validar antes de commit               |
| Necesito gestionar             | `@management`                 | MR, documentación, tickets            |
| Necesito relevar requisitos    | `@functional-analyst`         | Casos de uso, dudas funcionales       |
| Primer setup                   | `@setup`                      | Inicialización completa               |
| Revisar todo                   | `@audit`                      | Auditoría de calidad                  |

---

## 💡 Tips

- **Sé específico**: "Agrega validación de email al DTO de usuario" > "Mejora validaciones"
- **Carga contexto**: Si el agente necesita contexto, menciónalo o usa prompts de carga
- **Cadena completa**: Para calidad máxima: planner → developer → reviewer → management
- **Revisa antes de commit**: Siempre usa `@code-reviewer`

---

**¿Más dudas?** Pregunta directamente: "¿Cómo hago [tarea]?" y Copilot te guiará.
