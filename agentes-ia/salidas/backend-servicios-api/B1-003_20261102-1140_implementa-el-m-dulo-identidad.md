<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 11:40
Petición: Implementa el módulo identidad
-->

**Plan de arquitectura para el módulo identidad**  
*Archivo:* `docs/arquitectura/plan-identidad.md`

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
- **Vinculación 90 días**: se almacenará la fecha de vinculación y la fecha de expiración; la lógica de revocación eliminará el registro y marcará el token como revocado.
- **Idempotencia**: las operaciones de OTP (`requestOtp` y `verifyOtp`) deben ser idempotentes; si se llama dos veces con el mismo código, el segundo no debe crear efectos adicionales.
- **Transacciones**: la verificación de OTP y la actualización de intentos se harán dentro de una transacción Prisma para evitar condiciones de carrera.

---

**Próximo paso:** crear el archivo `docs/arquitectura/plan-identidad.md` con este contenido y confirmar que el plan cubre todos los requisitos de la SPEC y la ARQ-005.
```
