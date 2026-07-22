# Instrucciones Generales - Copilot

Este workspace esta preparado para trabajar con IA sobre un demo POS de Previsora del Parana que hoy se encuentra en etapa documental.

# IMPORTANTE

- Antes de proponer mockups, arquitectura o implementacion, leer primero los artefactos en `Docs/` y la sintesis en `.github/documentation/demo-pos-overview.md`.
- No asumir que existe aplicacion implementada. Si una respuesta habla de backend, frontend o base de datos, debe marcarse como propuesta futura salvo que el repositorio cambie.
- Si el usuario quiere profundizar el proyecto, recomienda usar modo Agent para poder inspeccionar mejor el contexto.
- Cuando haya dudas operativas o de flujo de trabajo, revisar primero `.github/documentation/faq.md`.

## Orden recomendado de lectura

1. `Docs/Investigacion POS.md`
2. `Docs/Previsora del Parana - Roadmap motor de promociones.html`
3. `.github/documentation/demo-pos-overview.md`
4. `.github/instructions/about.instructions.md`
5. `.github/instructions/architecture.instructions.md`
6. `.github/instructions/tech-stack.instructions.md`

## Como debe trabajar la IA en este repo

- Priorizar problema de negocio, alcance del MVP y roadmap del producto.
- Diferenciar claramente entre contexto actual, decision propuesta y futura implementacion.
- Reutilizar la carpeta `.github/` como capa operativa para prompts, agentes e instrucciones.
- Mantener README e instrucciones alineados con el estado real del proyecto.

## Instrucciones base indexadas

- `about.instructions.md`: descripcion del producto y del objetivo del repositorio.
- `architecture.instructions.md`: arquitectura real actual del workspace y su evolucion esperada.
- `tech-stack.instructions.md`: stack documental actual y restricciones sobre tecnologias aun no definidas.
- `tools.instructions.md`: configuracion de MCPs y claves de proyecto cuando aplique.
- `code-standards.instructions.md`: criterios generales de calidad y consistencia.

## Documentacion clave del proyecto

- `demo-pos-overview.md`: puente entre las fuentes funcionales y futuras sesiones de IA.
- `backend.md`, `frontend.md`, `database.md`, `migrations.md`: referencias marcadas como no aplicables todavia o futuras, nunca como implementacion real.
- `github-copilot-guide.md`: onboarding general del entorno.
- `setup/how-to-setup-project.md`: fuente de verdad del flujo de setup.

## Siguientes usos recomendados

- Generar mockups del MVP documental.
- Refinar alcance del demo funcional.
- Crear un plan de desarrollo solo despues de tomar decisiones tecnologicas explicitas.
