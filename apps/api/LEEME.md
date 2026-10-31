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

Aún no hay código: lo crea la primera iteración de B1 cuando el MVP esté aprobado y las pruebas rojas existan.
