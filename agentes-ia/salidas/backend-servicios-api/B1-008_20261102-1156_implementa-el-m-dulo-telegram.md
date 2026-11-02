<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 11:56
Petición: Implementa el módulo telegram
-->

```file:docs/arquitectura/plan-telegram.md
# Plan de arquitectura para el módulo Telegram

## Objetivo
Implementar el módulo **telegram** que permitirá la prevalidación multicanal mediante Telegram Mini App, cumpliendo con los requisitos de seguridad, privacidad y arquitectura del proyecto.

## Alcance
- Validación criptográfica de `initData` de la Mini App.
- Gestión de códigos OTP (SMS/correo) con tope configurable y ventana temporal.
- Vinculación de `chat_id` con pacientes y gestión de su ciclo de vida (3 meses).
- Envío de mensajes de plantilla sin mencionar datos sensibles.
- Integración con módulos de identidad y canales existentes.

## Paso a paso

| Paso | Descripción | Archivos creados | Pruebas cubiertas |
|------|-------------|------------------|-------------------|
| 1 | **Dominio**: definir tipos y validadores puros (initData, OTP, chat linking). | `dominio/types.ts`, `dominio/validators.ts`, `dominio/errors.ts` | Unit tests para validadores (initData, OTP). |
| 2 | **Datos**: crear esquema Prisma (`Chat`, `Otp`) y migración correspondiente. | `datos/schema.prisma` | Tests de integración de repositorio (creación, consulta, unicidad). |
| 3 | **Servicios**: implementar casos de uso (`OtpService`, `ChatLinkService`). Usar interfaces de `identidad` y `canales`. | `servicios/otp.service.ts`, `servicios/chat-link.service.ts` | Unit tests para servicios (mock de dependencias). |
| 4 | **API**: controladores y DTOs (`WebhookController`, `OtpRequestDto`, `OtpVerifyDto`). | `api/webhook.controller.ts`, `api/dto/*.dto.ts` | E2E tests con Supertest para endpoints `/telegram/webhook` y `/telegram/otp`. |
| 5 | **Integración y validación**: ejecutar `npm test -- modulos/telegram` y asegurar que todas las pruebas pasen (verde). | - | - |
| 6 | **Documentación**: actualizar `docs/preguntas` si surge alguna ambigüedad durante la implementación. | - | - |

> **Nota:** Cada paso debe ejecutarse solo si el número de pruebas verdes no disminuye respecto al estado anterior.

---

## Detalles de implementación

### 1. Dominio (puramente reglas de negocio)

- **`dominio/types.ts`**: tipos TS para `InitData`, `ChatLink`, `OtpRecord`.
- **`dominio/validators.ts`**: 
  - `InitDataValidator`: verifica HMAC‑SHA256 con clave fija `"WebAppData"`, valida `chat_type === 'private'`, `auth_date` dentro de `auth_date_max_age`.
  - `OtpValidator`: verifica longitud (6 dígitos), máximo 3 intentos, expiración (10 min).
- **`dominio/errors.ts`**: excepciones personalizadas (`InvalidInitDataError`, `OtpVerificationError`, `ChatLinkNotFoundError`).

### 2. Datos (Prisma)

- **`datos/schema.prisma`**:
  - Modelo `ChatLink`:
    ```prisma
    model ChatLink {
      id            String   @id @default(uuid())
      chatId        String
      patientId     String
      channel       String   // 'telegram'
      createdAt     DateTime @default(now())
      expiresAt     DateTime
      @@unique(chatId)
    }
    ```
  - Modelo `Otp`:
    ```prisma
    model Otp {
      id            String   @id @default(uuid())
      chatId        String
      patientId     String
      codeHash      String   // hash de argon2 del código de 6 dígitos
      attempts      Int      @default(0)
      createdAt     DateTime @default(now())
      expiresAt     DateTime
      @@unique(chatId, patientId)
    }
    ```
- Ejecutar `npx prisma generate` y `npx prisma migrate dev --name init_telegram`.

### 3. Servicios (casos de uso)

- **`servicios/otp.service.ts`**:
  - `requestOtp(patientId: string, chatId: string)`:
    1. Verifica que exista un `ChatLink` activo (vencido o no).
    2. Llama a `identidad.service.requestOtp(patientId, phone)` (SMS/correo).
    3. Genera código de 6 dígitos, lo hashea con argon2, crea registro `Otp` con `expiresAt = now + 10min`, `attempts = 0`.
  - `verifyOtp(otp: string, patientId: string, chatId: string)`:
    1. Obtiene `ChatLink` y verifica que no esté expirado.
    2. Busca `Otp` asociada al par `(chatId, patientId)`.
    3. Verifica hash con argon2, controla `attempts < 3` y `expiresAt` futuro.
    4. Si es válido, devuelve `true`; si no, incrementa `attempts` y devuelve `false`.
- **`servicios/chat-link.service.ts`**:
  - `createLink(chatId: string, patientId: string)`: crea registro `ChatLink` con `expiresAt = now + 3 months`.
  - `getActiveLink(chatId: string, patientId: string)`: devuelve el link si está vigente, o `null`.

### 4. API (Controladores y DTOs)

- **`api/webhook.controller.ts`**:
  - `POST /telegram/webhook`: recibe el payload de Telegram, extrae `chat_id`, `message`, `init_data` (si aplica). 
  - Valida que el chat sea `private` (usando la información del bot). 
  - Usa `InitDataValidator` para validar `init_data`. 
  - Si es válido, asocia `chat_id` con `patientId` (obtenido de `init_data.user.id`) y llama a `chatLinkService.createLink`.
  - Responde con mensaje de plantilla (p. ej., “Código de verificación enviado” o “Vinculación exitosa”).
- **DTOs**:
  - `OtpRequestDto`: `{ chatId: string, otp: string }` (para pruebas).
  - `WebhookUpdateDto`: tipo genérico que extiende el esquema de Telegram (usaremos `any` con validación manual).

### 5. Pruebas

- **Unit tests** (`pruebas/unit/`):
  - `initData.validator.spec.ts`: prueba de validación exitosa/invalida (HMAC, chat_type, auth_date).
  - `otp.validator.spec.ts`: prueba de códigos válidos/inválidos, límite de intentos, expiración.
  - `otp.service.spec.ts`: mock de `identidad.service` y `chatLinkService`; verifica flujo de request/verify.
  - `chatLink.service.spec.ts`: pruebas de creación y obtención de enlaces.
- **E2E tests** (`pruebas/e2e/`):
  - `webhook.e2e-spec.ts`: envía un payload simulado de Telegram, verifica respuesta y creación de `ChatLink`.
  - `otp.e2e-spec.ts`: envía solicitud de OTP (mock), verifica que se envíe el mensaje y que el código sea verificable.

### 6. Ejecución y verificación

- Ejecutar `npm test -- modulos/telegram`.
- Asegurarse que **todas** las pruebas estén verdes.
- Si alguna prueba falla, detenerse, crear `docs/preguntas/PREG-<id>.md` y esperar respuesta.

---

## Supuestos (cero)

- El módulo `identidad` expone un servicio `requestOtp(patientId: string, phone: string)` que envía el código OTP.
- El módulo `canales` permite crear y consultar `ChatLink` mediante `chatId` y `patientId`.
- Las variables de entorno `TELEGRAM_BOT_TOKEN` y `OTP_VALIDITY_MINUTES` están disponibles en el entorno de pruebas.
- Los mensajes de plantilla no incluyen nombres de medicamentos ni diagnósticos (cumple con la restricción de logs).

---

## Riesgos y bloqueos

- **OCR no usado**: este módulo no incluye OCR; la prevalidación de documentos será handled por el módulo `prevalidacion`. Asegúrate de que la integración entre módulos sea mediante llamadas a servicios bien definidos.
- **Dependencia de `identidad`**: si el servicio `requestOtp` no está disponible o cambia su firma, el módulo telegram fallará. Verifica la interfaz en `identidad`.
- **Tiempo de vida de `auth_date`**: la constante `auth_date_max_age` debe ser configurable; si no se define, usar 10 minutos (valor por defecto razonable).

---

## Próximo paso

Crear el archivo `docs/arquitectura/plan-telegram.md` con el contenido anterior y proceder a la implementación del **Dominio**.
```
