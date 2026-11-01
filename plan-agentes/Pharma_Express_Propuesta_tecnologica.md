# Pharma Express · Arquitectura — Propuesta tecnológica

> Un solo lenguaje, una base de datos con transacciones reales y un framework que ya piensa en módulos.

**TypeScript · NestJS · PostgreSQL · React**

*Propuesta para aprobar en la etapa de arquitectura · No es todavía una decisión del equipo*

> **Nota:** el PDF original conserva esta línea por un descuido; el stack **ya fue aprobado** por el equipo.

---

## 1. El criterio — La especificación dicta lo que la tecnología debe cumplir

| Criterio | Qué exige |
|---|---|
| **Transacciones reales** | Apartar medicamento y cupo todo o nada, sin sobre-reservas. |
| **Módulos con fronteras** | Un módulo por SPEC, cada uno dueño de sus datos. |
| **Tareas programadas** | Recordatorios, revisión una hora antes, expiraciones y aviso a las 48 h. |
| **Cuatro medios** | Web, Telegram, SMS y correo; los tres últimos, reales. |
| **Datos de salud** | Archivos cifrados y registros sin medicamentos ni diagnósticos. |
| **4 personas, 8 semanas** | Herramientas conocidas, gratuitas y fáciles de aprender. |

---

## 2. El stack propuesto — TypeScript de punta a punta

| Capa | Tecnologías |
|---|---|
| **Interfaz** | **React + Vite** como web instalable (PWA) · Tailwind + shadcn/ui · React Hook Form + Zod |
| **Canales** | **grammY** (Telegram) · **Twilio** (SMS) · **Resend** o Brevo (correo) |
| **Aplicación** | **NestJS**: un módulo por SPEC, en un solo despliegue |
| **Datos** | **PostgreSQL** + **Prisma** · **pg-boss** (tareas) · **MinIO** (archivos cifrados) |
| **Calidad** | **Jest** + Testcontainers · **Playwright** · **Docker Compose** · GitHub Actions |

---

## 3. Backend y base de datos — NestJS y PostgreSQL, un esquema por módulo

### NestJS
- Organiza la app en módulos que declaran qué exponen.
- Refuerza "se hablan por la puerta" y "nadie entra a lo ajeno".
- Trae pruebas con Jest y validación integradas.

### PostgreSQL
- Transacciones ACID y bloqueo de filas: todo o nada.
- Un esquema por módulo: identidad, reservas, prevalidación…
- Gratuito, maduro y con soporte en todo hosting.

### Prisma y pg-boss
- Prisma: acceso a datos con tipos generados.
- pg-boss: cola de tareas guardada en el mismo PostgreSQL.
- Sin Redis: un servidor menos que mantener.

---

## 4. La pieza crítica — Reservar sin choques, en una transacción

```sql
BEGIN;
UPDATE reservas.inventario
SET disponible = disponible - 30
WHERE ... AND disponible >= 30;
UPDATE reservas.ventana
SET ocupados = ocupados + 1
WHERE ... AND ocupados < capacidad;
-- si una no cambió nada: ROLLBACK
COMMIT;
```

- **Solo descuenta si alcanza.** La condición va dentro del UPDATE; PostgreSQL bloquea la fila mientras cambia.
- **Todo o nada.** Medicamento y cupo se confirman juntos, o ninguno.
- **Se prueba con AC-36:** 50 confirmaciones en paralelo sobre 10 unidades: máximo 10 reservas.

---

## 5. Interfaz, canales e identidad — Cada decisión del equipo, con su herramienta

| Decisión del equipo | Herramienta | Cómo la cumple |
|---|---|---|
| Sin instalar una aplicación | React + Vite (PWA) | Web que funciona como app en el celular |
| Bot de Telegram real | grammY | Vive en el mismo backend |
| SMS y correo reales | Twilio · Resend | Planes de prueba con números del equipo |
| Cédula y código de 6 dígitos | Código propio + argon2 | Guardado cifrado, vence en 10 min, 3 intentos |
| Vinculación por 3 meses | Cookie httpOnly · token de 90 días | Revocar = borrar el token |
| Código QR de un solo uso | qrcode · @zxing/browser | Se genera al confirmar; el dispensador lo escanea |
| **Ningún aviso con datos de salud** | **pino + plantillas fijas** | **Ni mensajes ni registros nombran medicamentos** |

---

## 6. Cómo encaja — Las carpetas ya diseñadas, en NestJS

```text
app/            AppModule
entradas/       web · grammY · dispensador
modulos/
  identidad/    esquema "identidad"
  reservas/     esquema "reservas"
  …             uno por SPEC
comunes/        pg-boss · eventos
```

**Dentro de `reservas/`:**

```text
api/        servicio que exporta el módulo
dominio/    reglas BR-17 a BR-24
servicios/  confirmar, cancelar, expirar
datos/      repositorio Prisma
pruebas/    AC-31 a AC-42
```

---

## 7. El reto más costoso — Leer las fórmulas, con cautela

| Para el prototipo | Siempre | Por ahora no |
|---|---|---|
| **Tesseract.js, en local.** Gratuito y sin enviar datos afuera. Se usa con fórmulas de ejemplo impresas por el equipo. | **La persona confirma.** Una pantalla muestra los medicamentos detectados para que el paciente los revise antes de prevalidar. | **Servicios en la nube.** Enviarían datos de salud fuera del país; la Ley 1581 condiciona esa transferencia. |

Las fórmulas escritas a mano quedan **fuera del alcance del prototipo**.

---

## 8. Para decidir — Lo que no cambia, sea cual sea el lenguaje

| Propuesta | Alternativa | Alternativa |
|---|---|---|
| **TypeScript** — NestJS · Prisma · pg-boss · grammY | **Java** — Spring Boot + Spring Modulith · JPA · db-scheduler | **Python** — FastAPI · SQLAlchemy · APScheduler · python-telegram-bot |

**PostgreSQL y el monolito modular se mantienen** con cualquiera de las tres. El equipo escoge el lenguaje que más domina y lo aprueba como una decisión más.
