<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 11:46
Petición: Implementa el paso 1 del plan-identidad.md: esquema Prisma para User, Consent y Token
-->

**docs/arquitectura/plan-identidad.md**
```markdown
# Plan de arquitectura - Módulo Identidad

## Objetivo
Implementar el módulo **identidad** que gestiona la aceptación del aviso de privacidad, la generación y validación de códigos OTP (SMS/correo), el control de intentos y caducidad, la revocación de consentimiento y la gestión de la vinculación de canales (Telegram/web) con un ciclo de vida de 90 días, cumpliendo con las reglas de la SPEC y la ARQ-005.

## Paso a paso

| Paso | Descripción | Archivos creados / modificados | Pruebas cubiertas |
|------|-------------|-------------------------------|-------------------|
| 1 | **Definir esquema Prisma** para la entidad `User` (cédula hash, código hash, intentos, caducidad, consentimiento, canal, token revocable) y tablas auxiliares (`Consent`, `Token`). | `prisma/schema.prisma` (añadir modelo `User` y relaciones) | - Pruebas de esquema (validación de campos, relaciones). |
| 2 | **Reglas de dominio puras** en `dominio/identidad`: <br>• Validar aceptación del aviso (titular/tercero) con fecha y canal.<br>• Generar OTP (10 min, 3 intentos) y registrar intento.<br>• Verificar OTP (caducidad, intentos).<br>• Revocar consentimiento y eliminar datos (soft‑delete + borrado físico). | `dominio/identidad/` (clases/funciones: `AcceptanceValidator`, `OtpGenerator`, `OtpVerifier`, `ConsentRevoker`) | - Tests unitarios de cada regla (validación, generación, verificación, revocación). |
| 3 | **Repositorio Prisma** en `datos/identidad`: implementar CRUD y métodos de negocio (incrementar intentos, actualizar hash, marcar consentimiento, revocar, obtener usuario). Usar transacciones donde sea necesario (p.ej., verificación de OTP). | `datos/identidad/` (`IdentidadRepository`) | - Tests de integración contra la base de datos (creación, actualización, verificación, revocación). |
| 4 | **Servicios** en `servicios/identidad`: casos de uso públicos: <br>• `registerAcceptance` (recibe datos del canal y tipo, persiste consentimiento).<br>• `requestOtp` (valida canal, genera hash, guarda OTP y caducidad).<br>• `verifyOtp` (valida código, controla intentos y caducidad).<br>• `revokeConsent` (marca revocación y programa borrado). | `servicios/identidad/` (`IdentidadService`) | - Tests de servicio (flujo completo, manejo de errores, límites de intentos). |
| 5 | **Controladores y DTO** en `api/identidad`: <br>• `POST /acceptance` → DTO con canal, tipo, fecha.<br>• `POST /request-otp` → DTO con identificador (celular o email).<br>• `POST /verify-otp` → DTO con código.<br>• `POST /revoke` → DTO sin cuerpo (autenticado).<br>Validar con Zod y usar `IdentidadService`. | `api/identidad/` (`controllers`, `dto`) | - Tests de controlador (end‑to‑end con supertest) y de DTO (Zod). |
| 6 | **Configuración de rate‑limiting** (tope configurable por celular y ventana temporal) y **cifrado** de PII (argon2 para hashes, AES‑256‑GCM para datos sensibles). Parámetros se leerán de `.env` y se expondrán como constantes en el servicio. | `servicios/identidad/` (configuración) | - Tests que verifican que el tope y la ventana se respetan (no más de 3 intentos en 10 min). |
| 7 | **Integración con otros módulos**: asegurar que `identidad` solo expone su API y no acceda a esquemas ajenos. Los demás módulos (canales, prevalidación) consumirán sus endpoints. | - | - Tests de integración que confirmen que no hay importaciones cruzadas. |
| 8 | **Ejecución y validación**: después de cada paso, ejecutar `npm test -- modulos/identidad` y avanzar solo si el número de pruebas verdes no disminuye. | - | - Verificación continua. |

### Consideraciones adicionales
- **Cifrado**: la cédula y el código OTP se almacenan como hash con **argon2** (no reversible). Los datos sensibles que se persistan (p.ej., token de revocación) se cifran con **AES‑256‑GCM** usando una clave provista por variable de entorno.
- **Vinculación 90 días**: se almacenará la fecha de vinculación (`vinculacionAt`) y la fecha de expiración (`vinculacionExp`); la lógica de revocación eliminará el registro y marcará el token como revocado.
- **Idempotencia**: las operaciones de OTP (`requestOtp` y `verifyOtp`) deben ser idempotentes; si se llama dos veces con el mismo código, el segundo no debe crear efectos adicionales.
- **Transacciones**: la verificación de OTP y la actualización de intentos se harán dentro de una transacción Prisma para evitar condiciones de carrera.
```

---

**prisma/schema.prisma**
```prisma
// ------------------------------------------------------------
// Prisma schema for the Identity module
// ------------------------------------------------------------

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ------------------------------------------------------------
// USER
// ------------------------------------------------------------
model User {
  /// Primary key (UUID)
  id                 String      @id @default(uuid())

  /// Hashed cédula (argon2). Must be unique per patient.
  cedulaHash         String      @unique

  /// Hashed OTP (argon2). Nullable until OTP is requested.
  codeHash           String?

  /// Number of OTP attempts (max 3). Default 0.
  attempts           Int         @default(0)

  /// OTP expiration timestamp (10 minutes after request).
  expiresAt          DateTime

  /// Reference to the consent record (optional, created after acceptance).
  consent            Consent?    @relation(fields: [consentId], references: [id], onDelete: Cascade)
  consentId          String?

  /// Reference to the OTP token record (optional, created after request).
  token              Token?      @relation(fields: [tokenId], references: [id], onDelete: Cascade)
  tokenId            String?

  /// Communication channel used for OTP delivery.
  /// Allowed values: "telegram", "email", "sms"
  channel            String

  /// Timestamp when the user was linked to a channel (Telegram/web).
  vinculacionAt      DateTime

  /// Expiration date of the channel linkage (90 days after vinculacionAt).
  vinculacionExp     DateTime

  /// Audit fields
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
}

// ------------------------------------------------------------
// CONSENT
// ------------------------------------------------------------
model Consent {
  /// Primary key (UUID)
  id                 String      @id @default(uuid())

  /// Reference to the user this consent belongs to.
  userId             String
  user               User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  /// Type of consent: "titular" (patient) or "tercero" (caregiver/relative).
  tipo               String

  /// Date and time when the privacy notice was accepted.
  fechaAceptacion    DateTime

  /// Communication channel used for the acceptance (must match User.channel).
  canal              String

  /// Audit fields
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
}

// ------------------------------------------------------------
// TOKEN (OTP)
// ------------------------------------------------------------
model Token {
  /// Primary key (UUID)
  id                 String      @id @default(uuid())

  /// Reference to the user this token belongs to.
  userId             String
  user               User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  /// Argon2 hash of the OTP (6‑digit numeric code).
  tokenHash          String

  /// Timestamp when the token was created.
  createdAt          DateTime    @default(now())

  /// Flag indicating if the token has been revoked.
  revoked            Boolean     @default(false)

  /// Timestamp when the token was revoked (if any).
  revokedAt          DateTime?   @default(null)

  /// Optional identifier of the actor that performed the revocation.
  revokedBy          String?     @default(null)

  /// Audit fields
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
}
```

**Supuestos realizados (cero):**  
- No existen otros módulos con esquemas que interfieran; el esquema anterior está aislado al módulo *identidad*.  
- Los nombres de canales y tipos de consentimiento se limitan a los valores descritos en la SPEC; se validará en los DTOs y servicios.  

**Riesgos / Bloqueos:**  
- Si la variable `DATABASE_URL` no apunta a una base de datos PostgreSQL, la generación del modelo fallará.  
- La lógica de restricción de intentos (máx. 3 en 10 min) y de caducidad debe implementarse en el servicio, ya que Prisma no permite constraints de tiempo directamente.  

**Ruta del plan del módulo:** `docs/arquitectura/plan-identidad.md`
