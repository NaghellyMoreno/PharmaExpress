# apps/api — NestJS modular

Este directorio lo construyen **B1** (dominio, servicios, datos y API) y **B2** (entrada Telegram). Las pruebas las escribe **S3** y las ejecuta **B4**.

## Estructura prevista

```text
src/
├─ app/                 AppModule
├─ entradas/
│  ├─ web/
│  ├─ telegram/         grammY (B2)
│  └─ dispensador/
├─ modulos/
│  ├─ identidad/        api/ dominio/ servicios/ datos/ pruebas/
│  ├─ reservas/         api/ dominio/ servicios/ datos/ pruebas/
│  └─ …                 un módulo por SPEC
└─ comunes/             pg-boss, eventos, pino
```

## Reglas

- Un módulo solo accede a datos ajenos por la `api/` del otro módulo.
- Un esquema de PostgreSQL por módulo.
- Reservas: transacción real, `UPDATE` condicional y rollback (skill `transaccion-reserva`).
- Ningún mensaje, log ni error nombra medicamentos, diagnósticos ni cédulas.
- Las migraciones de Prisma viven con su módulo.
- No se modifica `qa/` ni las pruebas desde B1/B2.

## Cómo ejecutar

```bash
cd apps/api
npm install
npm run test:unidad                      # sin Docker
npm test -- src/modulos/identidad        # un módulo (integración requiere Docker)
python3 ../../qa/scripts/guardian.py rojas --modulo identidad   # ¿fallan por la razón correcta?
```

Base de datos local: `docker compose up -d postgres` desde la raíz del repo.

## Estado

- `identidad`: hay un código v0 (commit `b5f0ae2`) que **no sirve como base**; ver
  `qa/incidentes/INC-20261031-001-identidad-v0.md`. B1 lo rehace cuando se respondan
  PREG-003, PREG-004 y PREG-005 y S3 corrija las pruebas sospechosas.
- El guardián (`qa/scripts/guardian.py`) revisa cada paso B: no se pueden tocar pruebas
  ni dejar valores de prueba, `catch` vacíos o ramas «para que pase» en producción.
