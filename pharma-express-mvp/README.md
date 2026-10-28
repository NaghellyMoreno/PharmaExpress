# Pharma Express — MVP

Prototipo funcional de pre-dispensación farmacéutica para afiliados de Salud Total y Sanitas en Manizales. El paciente, o quien lo apoya, verifica su identidad con un código, carga sus fórmulas, conoce el resultado preliminar de la prevalidación y recibe una cita **solo cuando sus medicamentos quedan reservados**. En el punto, el dispensador valida el código y cierra cada medicamento.

La EPS, el inventario y la validación oficial son **simulados** (SPEC-08). Los servicios reales son Telegram, SMS (Twilio) y correo (Resend); sin credenciales, esos envíos se escriben en la consola de la API.

## Stack

TypeScript de punta a punta, como en la propuesta tecnológica:

| Capa | Herramienta |
|---|---|
| Web (instalable, sin app móvil) | React 18 + Vite, manifiesto PWA |
| API | NestJS 10, monolito modular con un módulo por SPEC |
| Datos | PostgreSQL 16 + Prisma 5 |
| Tareas programadas | pg-boss (cola guardada en el mismo PostgreSQL) |
| Telegram | grammY sobre la Bot API oficial |
| QR | `qrcode` (generación) y `@zxing/browser` (lectura en el punto) |
| Pruebas | Jest (reglas de negocio) y prueba e2e de concurrencia contra PostgreSQL |

## Estructura

```
apps/
  api/
    prisma/schema.prisma        Modelo de datos (tablas Sim* = fuentes simuladas)
    prisma/seed.ts              Datos de prueba ficticios
    src/domain/reglas.ts        Reglas puras: prevalidación, ventanas, estados, código en el punto
    src/domain/plantillas.ts    Plantillas de notificación sin datos de salud
    src/modules/
      identidad/                SPEC-01 consentimiento, código, salud, revocación
      canales/                  SPEC-02 y SPEC-07 vinculaciones, avisos web, enlace a Telegram
      prevalidacion/            SPEC-03 carga de documentos y prevalidación
      agenda/                   SPEC-04 disponibilidad, reserva atómica, cancelación, expiración
                                SPEC-05 trabajos: recordatorios, nueva prevalidación, avisos
      notificaciones/           SPEC-05 envío por SMS, correo, web y Telegram; cola pg-boss
      dispensacion/             SPEC-06 ingreso del dispensador, validación y cierre
      datos-simulados/, admin/  SPEC-08 catálogos, reloj de pruebas, métricas
      telegram/                 Bot de Telegram
    test/                       Pruebas
  web/                          Aplicación web del paciente y página /dispensador
```

## Cómo ejecutarlo

Con Docker:

```bash
cp .env.example .env              # completa Twilio, Resend y Telegram si los vas a usar
docker compose up --build -d
docker compose exec api npm run db:seed
```

- Paciente: http://localhost:5173
- Dispensador: http://localhost:5173/dispensador (usuarios `disp.nogales`, `disp.guamo`, `disp.ladera`; clave `demo1234`)

Sin Docker (requiere PostgreSQL local):

```bash
cd apps/api && npm install && npx prisma generate
export DATABASE_URL=postgresql://pharma:pharma@localhost:5432/pharma_express TZ=America/Bogota
npm run db:push && npm run db:seed && npm run dev
cd ../web && npm install && npm run dev
```

La zona horaria del proceso debe ser `America/Bogota`: las ventanas y los recordatorios se calculan en hora local.

## Casos de prueba del seed

| Cédula | Paciente | Qué muestra |
|---|---|---|
| 1053800111 | Rosa Elena Marín | F-1001 crónica habilitada mañana y F-1002 aguda: dos citas en dos puntos |
| 1053800222 | Jorge Iván Ocampo | F-2001 sin autorización, F-2002 crónica aún no habilitada, F-2003 apta |
| 1053800333 | Luz Dary Giraldo | Afiliación inactiva: se detiene toda la solicitud |
| 1053800444 | Samuel Restrepo | Menor con celular del tutor; F-4001 sin existencias, F-4002 vencida |
| 1053800555 | Carmen Ospina | Sin celular ni correo: ruta alterna |

En la web, escribe el número impreso en cada fórmula (F-1001, F-1002…) y adjunta cualquier imagen o PDF como documento.

Para demostrar recordatorios, la nueva prevalidación y la expiración sin esperar, abre el panel de pruebas en http://localhost:5173/pruebas (solo fuera de producción). Allí puedes mover el reloj del sistema, activar o inactivar la afiliación de un paciente en la EPS simulada y ver las citas, las métricas y la bitácora.

## Pruebas

```bash
cd apps/api
TZ=America/Bogota npm test          # 18 pruebas de reglas (AC-21 a AC-34, AC-44, AC-53 a AC-56, CL-12, CL-15, CL-19…)
npm run test:e2e                    # AC-36: 50 confirmaciones simultáneas sobre 10 unidades (requiere la base con el seed)
```

La reserva es atómica en una transacción: el cupo de la ventana y las existencias se descuentan con `UPDATE … WHERE usados < capacidad` y `WHERE existencias >= cantidad`; si alguna condición falla, se revierte todo y el usuario ve las opciones actualizadas (DEC-21, DEC-43).

## Qué cubre el MVP

Flujo central de A12 por la web: aviso de privacidad con declaración de titular o tercero, código de 6 dígitos (10 minutos, 3 intentos), ruta alterna, vinculación del navegador por 3 meses con varios pacientes, autorización separada de datos de salud, carga de documentos, prevalidación en el orden de BR-10, resultado preliminar por fórmula, disponibilidad por punto, ventanas de 1 hora (agudo hoy o mañana, crónico solo mañana), confirmación atómica con código QR y numérico, cancelación, expiración con pérdida o liberación (DEC-44), recordatorio nocturno y de una hora antes con nueva prevalidación (DEC-39), recordatorio único a las 48 horas, aviso de próxima entrega crónica, revocación con eliminación de datos, panel del dispensador con cierre por medicamento y catálogo de motivos, bitácora de eventos y métricas de A14.

Telegram: inicio voluntario, aviso de privacidad, verificación con código (nunca con el user_id ni el chat_id), vinculación de varios pacientes, consulta de estado, código de entrega en QR, cancelación, revocación y recepción de todas las notificaciones.

## Pendientes y decisiones abiertas

Estas diferencias frente al SPEC o a la propuesta deben aprobarse o completarse antes de la evaluación:

1. **Carga, prevalidación y agenda desde Telegram.** DEC-03 pide el flujo completo en ambos canales; en este MVP el bot remite a la web para esos pasos.
2. **Lectura de documentos.** El usuario escribe el número de la fórmula y los datos se toman de la EPS simulada. La extracción automática (OCR) es una decisión pendiente de arquitectura.
3. **Almacenamiento de documentos.** Se guardan en disco local. La propuesta indica MinIO con cifrado; falta implementarlo antes de usar documentos de prueba sensibles.
4. **Hash del código.** Se usa scrypt de Node en lugar de argon2 para evitar dependencias nativas; ambos cumplen el propósito.
5. **Interfaz.** CSS propio en lugar de Tailwind y shadcn/ui. Falta la auditoría WCAG 2.1 AA (RNF-11).
6. **Notificaciones web.** Se consultan cada 20 segundos dentro de la app; no hay notificaciones push del navegador.
7. **Sesiones del bot.** En memoria; suficiente para una sola instancia.

## Normas de referencia

Ley 1581 de 2012 y Decreto 1377 de 2013 (datos personales y sensibles), Resolución 1604 de 2013, WCAG 2.1 y Resolución 1519 de 2020 de MinTIC. Ver la sección A13 del SPEC.
