# Database

## Estado actual

No aplica todavia. El repositorio no tiene una base de datos definida ni implementada.

## Consideraciones reales del proyecto

La necesidad de persistencia futura dependera de decisiones que aun no estan cerradas, por ejemplo:

- como se representaran promociones y vigencias,
- si el stock del MVP sera una foto diaria o una fuente integrada,
- que grado de operacion transaccional tendra la demo,
- que integraciones externas condicionaran el modelo de datos.

## Regla de documentacion

No describir motores, esquemas, ORM ni estrategias de almacenamiento como si ya existieran.

Cuando el proyecto pase de definicion documental a plan tecnico, este archivo debera reescribirse con:

- decision de persistencia,
- entidades principales,
- restricciones de auditoria y trazabilidad,
- estrategia de ambientes y datos de prueba.
