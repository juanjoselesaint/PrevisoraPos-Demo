---
name: documentation-update
description: Ejecuta la actualización iterativa de documentación para dejar el repositorio listo para trabajo con IA sobre un demo POS documental
argument-hint: Usa este prompt después de validar el plan documental para actualizar instrucciones, README y guías base del repositorio
---

# Documentación Update - Demo POS Documental

Este prompt ejecuta la actualización documental del repositorio para dejarlo listo para trabajo con IA. El proyecto actual no tiene aplicación implementada todavía: hoy contiene investigación, requerimientos y roadmap para un producto demo POS.

## Objetivo

Actualizar la documentación base para que GitHub Copilot y los agentes entiendan:

- qué problema de negocio resuelve el demo,
- qué artefactos existen hoy,
- qué alcance tiene el MVP,
- qué piezas faltan para pasar luego a mockups y demo funcional,
- cómo debe trabajar la IA sobre este repositorio sin asumir que ya existe código de aplicación.

## Contexto Confirmado

- El repositorio debe tratarse como un proyecto existente orientado a documentación.
- No hay backend, frontend ni base de datos implementados todavía.
- La prioridad es dejar una base IA First para futuras sesiones de diseño de mockups y construcción de un demo funcional.
- El material fuente actual vive en la carpeta Docs.

## Checklist de Ejecución

### 1. Actualizar documentación raíz

- Actualizar README.md para reflejar que este repositorio es un demo POS en etapa de definición.
- Explicar claramente el objetivo del repo, el problema de negocio, los documentos disponibles y el flujo sugerido de trabajo con IA.

### 2. Completar instrucciones base del proyecto

- Actualizar .github/instructions/about.instructions.md con una descripción concreta del demo POS.
- Actualizar .github/instructions/architecture.instructions.md para describir la arquitectura actual real del repositorio:
  - carpeta Docs como fuente funcional,
  - carpeta .github como capa operativa para IA,
  - ausencia actual de código de aplicación,
  - evolución esperada hacia mockups y demo funcional.
- Actualizar .github/instructions/tech-stack.instructions.md para dejar explícito el stack actual real:
  - documentación Markdown,
  - archivo DOCX de requerimientos,
  - HTML de roadmap,
  - VS Code + GitHub Copilot como entorno principal,
  - sin stack de runtime implementado todavía.

### 3. Adaptar guía principal de uso con Copilot

- Actualizar .github/copilot-instructions.md para que el índice documental y las recomendaciones apunten a este repo específico.
- Asegurar que el agente priorice el contexto en Docs antes de planificar mockups, UX o implementación futura.

### 4. Agregar documentación funcional base para IA

- Crear o actualizar una guía documental que sintetice:
  - visión del producto demo,
  - problema actual del cliente,
  - propuesta de solución,
  - alcance del MVP,
  - siguientes fases.
- La guía debe servir como puente entre los documentos fuente y futuros prompts/agentes.

### 5. Revisar documentación técnica genérica heredada

- Revisar .github/documentation/backend.md, frontend.md, database.md y migrations.md.
- Si hoy están genéricos y no representan el estado real del repositorio, adaptarlos o dejarlos explícitamente marcados como no aplicables todavía.
- No inventar arquitectura técnica inexistente.

### 6. Preparar el siguiente paso operativo

- Dejar recomendaciones claras para la próxima sesión:
  - generación de mockups,
  - definición de alcance del demo funcional,
  - eventual plan de desarrollo cuando exista una decisión tecnológica.

## Criterios de Calidad

- No asumir tecnologías no definidas.
- No describir componentes inexistentes como si ya estuvieran implementados.
- Mantener el foco en negocio, alcance y preparación para IA.
- Usar lenguaje concreto y reutilizable por futuros agentes.
- Mantener consistencia entre README, instrucciones y documentación contextual.

## Resultado Esperado

Al finalizar, el repositorio debe quedar listo para que una sesión futura pueda:

1. leer contexto confiable del demo POS,
2. diseñar mockups sin reconstruir la problemática desde cero,
3. planificar un demo funcional con menos ambigüedad,
4. reutilizar prompts y agentes sobre una base documental consistente.
