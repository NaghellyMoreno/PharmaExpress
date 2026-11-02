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
    
