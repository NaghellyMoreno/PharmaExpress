<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 11:53
Petición: Implementa el módulo identidad
-->

```file:docs/arquitectura/plan-identidad.md
# Plan de implementación del módulo identidad

## Visión general
El módulo **identidad** es responsable de:
1. Registrar la aceptación del aviso de privacidad (titular o tercero).
2. Gestionar la generación, validación y topes de códigos OTP (SMS/correo) con caducidad de 10 min y máximo 3 intentos.
3. Vincular canales (Telegram `chat_id` o cookie de navegador) a pacientes durante 90 días.
4. Garantizar la revocación del consentimiento con eliminación segura de datos y disociación de auditoría.
5. Cifrar la PII (cédula) y otros datos sensibles mediante AES‑256‑GCM a nivel de aplicación.

## Paso a paso

| Paso | Archivo(s) a crear | Qué se implementa | Prueba cubierta |
|------|--------------------|-------------------|-----------------|
| 1 | `src/modulos/identidad/dominio/entities/patient.entity.ts` | Entidad **Patient** (UUID, cédula hash, estado OTP, consent, vinculación). | Test de que la entidad expone los atributos esperados y los métodos de validación de OTP. |
| 2 | `src/modulos/identidad/dominio/value-objects/otp.vo.ts` | Value Object **OTP** (código, creación, expiración, intentos, estado). | Test de que OTP se vuelve inválido tras caducar o exceder intentos. |
| 3 | `src/modulos/identidad/dominio/value-objects/consent.vo.ts` | Value Object **Consent** (aceptado, revocado, tipo titular/tercero, referencia de canal). | Test de que el consentimiento puede ser revocado y que la revocación marca el estado correcto. |
| 4 | `src/modulos/identidad/dominio/interfaces/identidad.repository.ts` | Interfaz **IdentidadRepository** (CRUD de Patient, OTP, Consent). | Test de que la interfaz define los métodos requeridos. |
| 5 | `src/modulos/identidad/dominio/interfaces/crypto.ts` | Interfaz **CryptoService** (encrypt/decrypt) para PII. | Test de que la interfaz declara los métodos y que la implementación usa AES‑256‑GCM. |
| 6 | `src/modulos/identidad/datos/prisma/schema.prisma` | Modelo **Patient**, **Otp**, **Consent** (tablas relacionadas). | Test de que la migración genera las tablas esperadas. |
| 7 | `src/modulos/identidad/datos/prisma/patient-repository.ts` | Implementación **PrismaPatientRepository** (uso de Prisma Client). | Test de que el repositorio persiste y recupera Patient correctamente. |
| 8 | `src/modulos/identidad/servicios/consent.service.ts` | Caso de uso **RegisterConsent** (acepta aviso de privacidad). | Test de que el servicio marca el consentimiento como aceptado y persiste. |
| 9 | `src/modulos/identidad/servicios/otp.service.ts` | Caso de uso **RequestOtp** (genera y guarda OTP, respeta topes y caducidad). | Test de que se crea un OTP válido y que intentos superan el límite. |
| 10 | `src/modulos/identidad/servicios/verify-otp.service.ts` | Caso de uso **VerifyOtp** (valida código, controla intentos y expiración). | Test de que el código correcto pasa y el incorrecto falla después de 3 intentos. |
| 11 | `src/modulos/identidad/servicios/revoke.service.ts` | Caso de uso **RevokeConsent** (marca revocación y programa eliminación). | Test de que la revocación actualiza el estado y dispara la tarea de borrado. |
| 12 | `src/modulos/identidad/api/controllers/identidad.controller.ts` | Controladores HTTP (acceptConsent, requestOtp, verifyOtp, revokeConsent). | Test de endpoints (usando supertest) que cubran flujos felices y errores. |
| 13 | `src/modulos/identidad/api/dto/accept-consent.dto.ts`, `request-otp.dto.ts`, `verify-otp.dto.ts`, `revoke-consent.dto.ts` | DTOs con validación Zod. | Test de que los DTOs rechazan datos inválidos y aceptan los válidos. |
| 14 | `src/modulos/identidad/api/routes/identidad.routes.ts` | Definición de rutas del módulo. | Test de que las rutas están correctamente registradas en NestJS. |
| 15 | `npm test -- modulos/identidad` | Ejecutar pruebas unitarias y de integración del módulo. | Todas las pruebas deben pasar (verdes). |

## Detalles de cada paso

### Paso 1 – Entidad Patient (dominio)
- **Atributos**: `id: uuid`, `cedulaHash: string` (hash argon2), `otp: OTP` (value object), `consent: Consent` (value object), `linkedChannel: string` (chat_id o cookie), `linkedChannelExpires: Date`, `createdAt`, `updatedAt`.
- **Métodos**: `isOtpValid(now?: Date)`, `canRequestOtp(): boolean`, `incrementOtpAttempt()`, `resetOtp()`.
- **Restricciones**: No se permite crear un Patient sin `cedulaHash` válido; la cédula debe estar hashada antes de persistir.

### Paso 2 – Value Object OTP
- **Campos**: `code: string` (6 dígitos), `createdAt: Date`, `expiresAt: Date`, `attempts: number`, `isUsed: boolean`.
- **Lógica**: `isValid(now?: Date)` verifica que `now < expiresAt` y `attempts < 3` y `!isUsed`.

### Paso 3 – Value Object Consent
- **Campos**: `acceptedAt: Date`, `revokedAt: Date`, `type: 'titular' | 'tercero'`, `channelReference: string`, `isRevoked: boolean`.
- **Lógica**: `isActive(): boolean` devuelve true si no está revocado y ha sido aceptado.

### Paso 4 – Interfaz Repository
- Métodos: `findByCedula(cedulaHash: string): Promise<Patient | null>`, `save(patient: Patient): Promise<void>`, `saveOtp(patientId: uuid, otp: OTP): Promise<void>`, `findOtpByCode(code: string): Promise<Otp | null>`, `deletePatient(patientId: uuid): Promise<void>` (para revocación completa).

### Paso 5 – Interfaz CryptoService
- `encrypt(plain: string): Promise<string>` y `decrypt(cipher: string): Promise<string>`.
- Implementación usará `crypto` de Node.js con AES‑256‑GCM y clave derivada de variable de entorno `IDENTITY_CRYPTO_KEY`.

### Paso 6 – Prisma Schema
- **Model Patient**: `@id(uuid)`, `cedulaHash String`, `otpId uuid?`, `consentId uuid?`, `linkedChannel String`, `linkedChannelExpires DateTime`, timestamps.
- **Model Otp**: `@id(uuid)`, `patientId uuid`, `code String`, `attempts Int`, `createdAt DateTime`, `expiresAt DateTime`, `used Boolean`.
- **Model Consent**: `@id(uuid)`, `patientId uuid`, `acceptedAt DateTime`, `revokedAt DateTime`, `type String`, `channelReference String`.

### Paso 7 – Prisma Repository
- Usa Prisma Client para mapear los modelos a los Value Objects y Entities.
- Implementa lógica de topes (max 3 intentos, ventana 10 min) dentro del repositorio o servicio (preferiblemente en servicio).

### Paso 8 – RegisterConsent Service
- Recibe DTO con `type` y `channelReference`.
- Llama al repositorio para marcar `consent.acceptedAt` y `consent.isRevoked = false`.
- Persiste cambios.

### Paso 9 – RequestOtp Service
- Obtiene `Patient` por `cedulaHash`.
- Verifica que no haya OTP activo (expirado o usado) → si hay, falla.
- Genera código 6 dígitos aleatorio.
- Crea registro `Otp` con `expiresAt = now + 10min`, `attempts = 0`, `used = false`.
- Incrementa `patient.otp.attempts` (o crea nuevo OTP si none).
- Invoca **Notifier** (mocked) para enviar OTP (SMS o email). En pruebas se mockea.
- Respeta tope de envíos: consulta `otpAttemptsToday` por canal y fecha; si supera el límite configurado (env var `OTP_SEND_LIMIT`) rechaza con mensaje de “límite alcanzado”.

### Paso 10 – VerifyOtp Service
- Busca `Otp` por `code`.
- Verifica validez (expiration, attempts < 3, not used).
- Si válido: marca `used = true`, incrementa `patient.otp.attempts` (o crea nuevo registro si necesario) y devuelve éxito.
- Si inválido o intentos agotados: devuelve error.

### Paso 11 – RevokeConsent Service
- Busca `Patient`.
- Marca `consent.isRevoked = true`, `consent.revokedAt = now`.
- Programa tarea `pg-boss` (o directamente) para borrar archivos en MinIO y eliminar registros (patient, otp, consent) de forma segura.
- Registra evento de auditoría disociado (solo tipo y fecha).

### Paso 12 – Identidad Controller
- **POST /identidad/consent** → DTO `AcceptConsentDto` → llama `RegisterConsentService`.
- **POST /identidad/request-otp** → DTO `RequestOtpDto` (channel, contact) → llama `RequestOtpService`.
- **POST /identidad/verify-otp** → DTO `VerifyOtpDto` → llama `VerifyOtpService`.
- **POST /identidad/revoke-consent** → DTO `RevokeConsentDto` (requiere autenticación) → llama `RevokeConsentService`.

### Paso 13 – DTOs con Zod
- Validación de campos obligatorios, tipos, patrones (código OTP 6 dígitos, email/phone format, etc.).
- Mensajes de error consistentes y sin mencionar medicamentos, diagnósticos ni cédulas.

### Paso 14 – Rutas
- Registra los controladores en el módulo NestJS `IdentidadModule`.
- Usa `nest-router` o `RouterModule` para definir paths.

### Paso 15 – Tests
- Unit tests para Value Objects y Servicios (sin DB, usando mocks).
- Integration tests para Controller (Supertest) cubriendo flujos completos.
- Ejecutar `npm test -- modulos/identidad` después de cada paso; asegurar que el número de pruebas verdes no disminuya.

## Supuestos (cero)
- Las variables de entorno necesarias (`IDENTITY_CRYPTO_KEY`, `OTP_SEND_LIMIT`, `OTP_WINDOW_MINUTES`) están definidas en el entorno de pruebas.
- Los servicios de notificación (SMS/email) están abstraídos y pueden ser mockeados en pruebas.
- La base de datos PostgreSQL está disponible mediante `DATABASE_URL` y Prisma se configura correctamente.
- Los tests existentes en `apps/api/src/modulos/identidad/pruebas/` son los que deben pasar; no se modificarán.

## Riesgos / Bloqueos
- **Cifrado de PII**: la implementación de `CryptoService` debe ser correcta; cualquier error romperá la confidencialidad y causará fallos en pruebas de seguridad.
- **Topes de OTP**: la lógica de conteo por canal y ventana debe ser robusta; de lo contrario, pruebas de rate‑limiting fallarán.
- **Revocación y borrado**: asegurar que la tarea de purga en `pg-boss` sea idempotente y no falle por conflictos de transacción.

## Próximo paso
Crear el archivo `docs/arquitectura/plan-identidad.md` con este plan y proceder a crear los archivos de dominio.
```
