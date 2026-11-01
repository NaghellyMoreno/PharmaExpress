# Pharma Express · Stack tecnológico aprobado

Estado: **Aprobado por el equipo**
Origen: `plan-agentes/Pharma_Express_Propuesta_tecnologica.md`
Dueño del documento: Agente de Arquitectura
Uso: restricción de entrada para el Agente de Arquitectura y para los subagentes de construcción (B1–B3). QA lo lee solo para elegir las herramientas de prueba.

> Este documento **no** es una decisión del Agente de Especificaciones. Las SPEC no eligen tecnología.
> El Agente de Arquitectura lo lee como stack ya aprobado y no lo reabre salvo que una persona lo pida.

---

## 1. El criterio — La especificación dicta lo que la tecnología debe cumplir

| Criterio | Qué exige |
|---|---|
| **Transacciones reales** | Apartar medicamento y cupo todo o nada, sin sobre-reservas. |
| **Módulos con fronteras** | Un módulo por SPEC, cada uno dueño de sus datos. |
| **Tareas programadas** | Recordatorios, revisión una hora antes, expiraciones y aviso a las 48 h. |
| **Cuatro medios** | Web, Telegram real; SMS y correo en planes de prueba (sin envíos a producción). |
| **Datos de salud** | Archivos cifrados y registros sin medicamentos ni diagnósticos. |
| **4 personas, 8 semanas** | Herramientas conocidas, gratuitas y fáciles de aprender. |

## 2. El stack aprobado — TypeScript de punta a punta

| Capa | Tecnologías |
|---|---|
| **Interfaz** | **React + Vite** como web instalable (PWA) · Tailwind + shadcn/ui · React Hook Form + Zod |
| **Canales** | **grammY** (Telegram) · **Twilio** (SMS) · **Resend** o Brevo (correo) |
| **Aplicación** | **NestJS**: un módulo por SPEC, en un solo despliegue |
| **Datos** | **PostgreSQL** + **Prisma** · **pg-boss** (tareas) · **MinIO** (archivos cifrados) |
| **Calidad** | **Jest** + Testcontainers · **Playwright** · **Docker Compose** · GitHub Actions |

## 3. Backend y base de datos — NestJS y PostgreSQL, un esquema por módulo

- **NestJS**: módulos que declaran qué exponen, fronteras entre módulos y validación integrada.
- **PostgreSQL**: transacciones ACID y bloqueo de filas; un esquema por módulo (`identidad`, `reservas`, `prevalidacion`…).
- **Prisma**: acceso a datos con tipos generados.
- **pg-boss**: cola de tareas guardada en el mismo PostgreSQL, sin Redis.

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

- Solo descuenta si alcanza: la condición va dentro del `UPDATE`.
- Todo o nada: medicamento y cupo se confirman juntos, o ninguno.
- Se prueba con **AC-36**: 50 confirmaciones en paralelo sobre 10 unidades ⇒ máximo 10 reservas.

## 5. Interfaz, canales e identidad

| Decisión del equipo | Herramienta | Cómo la cumple |
|---|---|---|
| Sin instalar una aplicación | React + Vite (PWA) | Web que funciona como app en el celular |
| Bot de Telegram real | grammY | Vive en el mismo backend |
| SMS y correo reales | Twilio · Resend | Planes de prueba con números del equipo |
| Cédula y código de 6 dígitos | Código propio + argon2 | Guardado cifrado, vence en 10 min, 3 intentos |
| Vinculación por 3 meses | Cookie httpOnly · token de 90 días | Revocar = borrar el token |
| Código QR de un solo uso | qrcode · @zxing/browser | Se genera al confirmar; el dispensador lo escanea |
| **Ningún aviso con datos de salud** | **pino + plantillas fijas** | **Ni mensajes ni registros nombran medicamentos** |

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

Dentro de `reservas/`:

```text
api/        servicio que exporta el módulo
dominio/    reglas BR-17 a BR-24
servicios/  confirmar, cancelar, expirar
datos/      repositorio Prisma
pruebas/    AC-31 a AC-42
```

## 7. El reto más costoso — Leer las fórmulas, con cautela

| Para el prototipo | Siempre | Por ahora no |
|---|---|---|
| **Tesseract.js, en local.** Gratuito y sin enviar datos afuera. Se usa con fórmulas de ejemplo impresas por el equipo. | **La persona confirma.** Una pantalla muestra los medicamentos detectados para que el paciente los revise antes de prevalidar. | **Servicios en la nube.** Enviarían datos de salud fuera del país; la Ley 1581 condiciona esa transferencia. |

Las fórmulas escritas a mano quedan **fuera del alcance del prototipo**.

## 8. Lo que no cambia, sea cual sea el lenguaje

| Propuesta | Alternativa | Alternativa |
|---|---|---|
| **TypeScript** — NestJS · Prisma · pg-boss · grammY | **Java** — Spring Boot + Spring Modulith · JPA · db-scheduler | **Python** — FastAPI · SQLAlchemy · APScheduler · python-telegram-bot |

**PostgreSQL y el monolito modular se mantienen** con cualquiera de las tres. El equipo escogió TypeScript y lo aprobó como decisión.

---

## Enmiendas aprobadas por la persona

- **2026-10-31 · DEC-P10:** la interfaz es una web adaptable al celular **sin instalación** (el contexto 3.10 deja fuera la app instalable). Donde este documento dice «web instalable (PWA)», léase «web adaptable, también usable como Mini App de Telegram». La carga de documentos y la confirmación del OCR de Telegram ocurren en la Mini App, no en el chat.
- **2026-10-31 · DEC-P11:** solo los medicamentos no PBS requieren autorización (ver `docs/investigacion/formulacion-medicamentos-colombia.md`).
- **Pendiente para Arquitectura:** el criterio «AC-36» y las referencias «BR-17 a BR-24» y «AC-31 a AC-42» vienen de una SPEC obsoleta (hallazgo T-015); actualizarlas cuando el agendamiento entre al MVP.

