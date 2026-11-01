---
name: nestjs-modulo-estandar
description: Estructura y reglas para implementar un módulo NestJS de Pharma Express con fronteras, Prisma por esquema y pruebas. Úsalo en B1 al crear un módulo nuevo o completar uno existente.
---
# Módulo NestJS estándar

## Estructura

```text
apps/api/src/modulos/<nombre>/
├─ api/           servicio que exporta el módulo (única puerta de entrada)
├─ dominio/       reglas puras, sin I/O
├─ servicios/     casos de uso
├─ datos/         repositorio Prisma + migración del esquema
├─ pruebas/       Jest unitario, integración y concurrencia
└─ <nombre>.module.ts
```

## Fronteras

- Un módulo solo accede a datos ajenos por la `api/` del otro módulo.
- Nadie importa `datos/` de otro módulo.
- Un esquema PostgreSQL por módulo (`identidad`, `reservas`, `prevalidacion`…).
- El controlador no contiene reglas: delega en `servicios/`.
- El dominio no importa NestJS, Prisma ni HTTP.

## Orden de implementación

1. Plan de 5–8 pasos en `docs/arquitectura/plan-<modulo>.md`.
2. `dominio/` + pruebas unitarias.
3. `datos/` + migración + pruebas de integración con Testcontainers.
4. `servicios/` + pruebas.
5. `api/` y controladores + DTO.
6. Tareas pg-boss en `comunes/` si aplica.

## Validación y errores

- DTO + Zod o class-validator en el borde.
- Errores con plantillas fijas; nunca incluyen medicamentos, diagnósticos ni cédulas.
- Logs con pino y lista blanca de campos.

## Pruebas

```bash
npm test -- modulos/<nombre>
```

No modifiques las pruebas: si una parece incorrecta, `PREG-xxx`.
