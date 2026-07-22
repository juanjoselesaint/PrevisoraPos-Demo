# Demo POS - Previsora del Parana

Repositorio documental para definir un demo de punto de venta orientado a reemplazar el manejo manual de promociones en Excel y preparar una futura demostracion funcional asistida por IA.

## Estado actual

Hoy este repositorio no contiene una aplicacion implementada. Su contenido principal es funcional y de producto:

- investigacion de referentes y patrones de UX para un POS moderno,
- roadmap del producto desde el reemplazo del Excel hasta una evolucion a punto de venta inteligente,
- instrucciones, prompts y agentes para trabajar el proyecto con GitHub Copilot.

## Objetivo del repo

Este workspace busca dejar una base clara para:

- entender el problema de negocio actual del cliente,
- definir el alcance del MVP del demo,
- preparar futuras sesiones de mockups,
- reducir ambiguedad antes de decidir stack tecnico e implementar una demo funcional.

## Documentos disponibles

- [Docs/Investigacion POS.md](Docs/Investigacion%20POS.md): investigacion de mercado, patrones UX y flujos recomendados para mockups POS.
- [Docs/Previsora del Parana - Reemplazo Excel Promociones.docx](Docs/Previsora%20del%20Parana%20-%20Reemplazo%20Excel%20Promociones.docx): insumo funcional de negocio y reemplazo del proceso actual.
- [Docs/Previsora del Parana - Roadmap motor de promociones.html](Docs/Previsora%20del%20Parana%20-%20Roadmap%20motor%20de%20promociones.html): roadmap por fases desde el MVP hasta una evolucion transaccional mas amplia.
- [.github/documentation/demo-pos-overview.md](.github/documentation/demo-pos-overview.md): sintesis operativa del producto para futuras sesiones con IA.

## Estructura actual

- `Docs/`: fuentes funcionales y de producto.
- `.github/instructions/`: contexto persistente del proyecto para agentes.
- `.github/prompts/`: prompts reutilizables de setup, desarrollo y gestion.
- `.github/agents/`: agentes especializados del workspace.
- `.github/documentation/`: guias documentales para trabajar el repo con IA.

## Flujo sugerido con IA

1. Leer [Docs/Investigacion POS.md](Docs/Investigacion%20POS.md), [Docs/Previsora del Parana - Roadmap motor de promociones.html](Docs/Previsora%20del%20Parana%20-%20Roadmap%20motor%20de%20promociones.html) y [.github/documentation/demo-pos-overview.md](.github/documentation/demo-pos-overview.md).
2. Usar GitHub Copilot en modo Agent para profundizar el contexto antes de proponer mockups o arquitectura.
3. Definir el alcance del demo funcional y las pantallas prioritarias.
4. Recien despues decidir stack tecnico y generar un plan de desarrollo.

## Que no debe asumirse

- No hay backend, frontend ni base de datos implementados.
- No hay stack de runtime confirmado.
- La documentacion tecnica heredada debe leerse como marco futuro o como no aplicable todavia, nunca como implementacion existente.

## Proximo paso recomendado

La siguiente sesion deberia enfocarse en una de estas dos lineas:

1. generar mockups del flujo MVP de promociones y venta,
2. convertir el alcance documental en un plan de demo funcional con decisiones tecnologicas explicitas.
