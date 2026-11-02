<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 11:58
Petición: Implementa el módulo web
-->

```file:docs/arquitectura/plan-prevalidacion.md
# Plan de implementación del módulo de Prevalidación Multicanal (Web y Telegram Mini App)

## Objetivo
Implementar el módulo de prevalidación que cubre los flujos descritos en la ARQ-005 v1.1, garantizando:
- Paridad funcional entre la Web y la Telegram Mini App.
- Cumplimiento estricto de las reglas de negocio (afiliación, vigencia, cobertura, autorización, fecha habilitada, etc.).
- Procesamiento seguro de documentos (fotos/PDF) con OCR local, límites técnicos configurables y purga física inmediata.
- Cifrado de PII a nivel de aplicación y disociación de auditoría.

## Paso a paso

| Paso | Acción | Archivos creados / modificados | Pruebas cubiertas (red) |
|------|--------|-------------------------------|--------------------------|
| **1** | **Crear estructura de carpetas** y archivos base (`dominio/`, `datos/`, `servicios/`, `api/`). | - `docs/arquitectura/plan-prevalidacion.md` (este archivo) <br> - `dominio/prevalidacion/` (subcarpeta) <br> - `datos/prevalidacion/` (subcarpeta) <br> - `servicios/prevalidacion/` (subcarpeta) <br> - `api/prevalidacion/` (subcarpeta) | Ninguna (solo verifica que la estructura exista). |
| **2** | **Definir reglas de dominio** (tipos, enums, validaciones) sin I/O. | - `dominio/prevalidacion/TipoTratamiento.ts` <br> - `dominio/prevalidacion/EstadoSolicitud.ts` <br> - `dominio/prevalidacion/ReglaPrevalidacion.ts` <br> - `dominio/prevalidacion/ValidarLimites.ts` | `npm test -- modulos/prevalidacion/pruebas/domain.test.ts` (pruebas de dominios, enums y validaciones básicas). |
| **3** | **Diseñar esquema Prisma** para el módulo (tablas: Solicitud, Formulario, Documento, Cita, Reserva, EventoAuditoria). | - `datos/prevalidacion/schema.prisma` <br> - `prisma/.env` (variables de conexión) | `npm test -- modulos/prevalidacion/pruebas/schema.test.ts` (validación de modelo y migraciones). |
| **4** | **Implementar repositorios Prisma** (interfaces y concretos). | - `datos/prevalidacion/Repository/Base.ts` <br> - `datos/prevalidacion/Repository/PrismaSolicitud.ts` <br> - `datos/prevalidacion/Repository/PrismaDocumento.ts` <br> - `datos/prevalidacion/Repository/PrismaCita.ts` | `npm test -- modulos/prevalidacion/pruebas/repository.test.ts` (CRUD y consultas sin lógica de negocio). |
| **5** | **Implementar casos de uso (service layer)**. Cada caso de uso será una clase en `servicios/prevalidacion/`. | - `servicios/prevalidacion/CargarDocumento.ts` <br> - `servicios/prevalidacion/ProcesarOCR.ts` <br> - `servicios/prevalidacion/ValidarReglas.ts` <br> - `servicios/prevalidacion/GenerarCita.ts` <br> - `servicios/prevalidacion/CrearReserva.ts` <br> - `servicios/prevalidacion/RevokeConsentimiento.ts` | `npm test -- modulos/prevalidacion/pruebas/service.test.ts` (cobertura de cada caso de uso). |
| **6** | **Implementar OCR worker** (Node worker con Tesseract.js) y conversor PDF→imagen. | - `servicios/prevalidacion/OCRWorker.ts` <br> - `servicios/prevalidacion/PdfConverter.ts` <br> - `comunes/worker/tsconfig.json` (si no existe) | `npm test -- modulos/prevalidacion/pruebas/ocr.worker.test.ts` (pruebas unitarias del worker). |
| **7** | **Implementar API (Controladores y DTOs)**. | - `api/prevalidacion/DTOs/CreateSolicitud.dto.ts` <br> - `api/prevalidacion/DTOs/UpsertDocumento.dto.ts` <br> - `api/prevalidacion/Controllers/SolicitudController.ts` <br> - `api/prevalidacion/Controllers/DocumentoController.ts` <br> - `api/prevalidacion/validation.ts` (Zod schemas) | `npm test -- modulos/prevalidacion/pruebas/controller.test.ts` (endpoints HTTP y validación de DTO). |
| **8** | **Integrar MinIO y pg‑boss** para almacenamiento y purga. | - `comunes/pg-boss/prevalidacionPurgeTask.ts` <br> - `comunes/pg-boss/prevalidacionPurgeTask.ts` (scheduler) <br> - `api/prevalidacion/MinioService.ts` (wrapper) | `npm test -- modulos/prevalidacion/pruebas/purge.task.test.ts` (ejecución de la tarea de purga). |
| **9** | **Ejecutar pruebas de integración** y asegurar que el número de pruebas verdes no disminuya. | - `apps/api/src/modulos/prevalidacion/pruebas/integration.test.ts` (flujo completo) | Verificar que todas las pruebas pasen. |
| **10** | **Documentar y revisar** (README, diagramas, trazabilidad). | - `docs/prevalidacion/README.md` <br> - `docs/prevalidacion/arquitectura.md` | No afecta pruebas, solo documentación. |

### Detalle de cada paso

#### Paso 1 – Estructura
- Crear carpetas `dominio/prevalidacion`, `datos/prevalidacion`, `servicios/prevalidacion`, `api/prevalidacion`.
- Añadir archivo `package.json` en la raíz del módulo (si no existe) con scripts `"test": "jest"` y `"test:watch": "jest --watch"`.
- Verificar que `npm test` falle inicialmente (0 pruebas verdes) para el módulo.

#### Paso 2 – Dominio
- Definir enums y tipos que reflejen las reglas de la SPEC (p. ej., `TipoTratamiento`, `EstadoSolicitud`, `ResultadoPrevalidacion`).
- Implementar funciones puras de validación de límites (tamaño archivo, páginas PDF, número de fórmulas) sin acceso a base de datos ni a MinIO.
- Cada función será testeada con casos positivos y negativos.

#### Paso 3 – Esquema Prisma
- Modelos:
  - `Solicitud`: id, idPaciente, idCanal, estado, fechaCreacion, fechaExpiracion.
  - `Formulario`: id, idSolicitud, tipoTratamiento, fechaHabilitada, listaMedicamentos (JSON), fechaCitaPosible.
  - `Documento`: id, idSolicitud, tipo (foto/PDF), rutaMinIO, hashCifrado, estado (pendiente/procesado/borrado).
  - `Cita`: id, idFormulario, fechaHora, ventanaId, codigoEntrega, estado.
  - `EventoAuditoria`: id, tipoEvento, fecha, idSolicitud (opcional), datosDisociados (JSON sin PII).
- Añadir índices necesarios y relaciones `prisma` con `prisma-client-js`.

#### Paso 4 – Repositorios
- Interfaces `ISolicitudRepository`, `IDocumentoRepository`, etc.
- Implementaciones usando `@prisma/client` que encapsulen queries y transacciones.
- Incluir método `ejecutarTransaccion` para operaciones atómicas (reserva, generación de cita).

#### Paso 5 – Service Layer
- **CargarDocumento**: validar límites (tamaño, páginas, fórmulas), guardar en MinIO, iniciar proceso de OCR (enqueue worker), marcar documento como `pendiente`.
- **ProcesarOCR**: recibir resultados del worker, validar que los textos OCR no se persistan (solo se usan para validación y luego se borran), crear registros de `Formulario` y `Cita` si corresponde.
- **ValidarReglas**: ejecutar en orden la secuencia de validación (afiliación → vigencia → cobertura → autorización → fecha habilitada). Si alguna falla, devolver `ResultadoPrevalidacion.NoApta` con motivo.
- **GenerarCita**: calcular ventana disponible según tipo de tratamiento y disponibilidad de cupo; crear registro `Cita` y código de entrega (UUID).
- **CrearReserva**: transacción que verifica cupo y existencias, actualiza `Formulario` y `Cita` en una sola sentencia `UPDATE ... WHERE` para evitar sobre‑reserva.
- **RevokeConsentimiento**: eliminar datos personales y resultados, marcar documentos como `borrado`, encolar tarea de purga en MinIO.

#### Paso 6 – OCR Worker
- Utilizar `tesseract.js` en un `worker_thread` de Node.
- `PdfConverter`: convertir cada página del PDF a bitmap (usando `pdf-lib` o `node-pdf-to-image`) y pasarla al worker de Tesseract.
- Configurar límites (tamaño archivo, páginas, fórmulas) a partir de variables de entorno (`MAX_FILE_SIZE`, `MAX_PAGES_PDF`, `MAX_FORMULAS`).

#### Paso 7 – API
- Endpoints:
  - `POST /prevalidacion/solicitud`: recibe multipart con fotos/PDF, crea `Solicitud`, devuelve id.
  - `POST /prevalidacion/solicitud/:id/documentos`: sube documentos adicionales.
  - `GET /prevalidacion/solicitud/:id/resultado`: devuelve resultado preliminar (apta/no apta, motivo, siguiente paso).
  - `POST /prevalidacion/solicitud/:id/reservar`: inicia reserva atómica (llama a `CrearReserva`).
- DTOs con validación Zod para:
  - Creación de solicitud (solo idPaciente y canal).
  - Subida de documentos (tamaño, tipo, número máximo de formularios).
  - Petición de resultado (idSolicitud).
- Validación de `initData` en la Mini App se hace en el controlador de la Mini App (paso 8 del flujo, pero el endpoint está en `api/prevalidacion/Controllers/MiniAppController.ts`).

#### Paso 8 – Tareas programadas (pg‑boss)
- `prevalidacionPurgeTask`: schedule diaria (o al terminar solicitud) que:
  1. Busca documentos marcados como `estado = 'procesado'` y `fechaExpiracion < ahora`.
  2. Elimina físicamente los archivos en MinIO (uso de SDK).
  3. Elimina los registros de textos OCR (solo resultados, motivo, siguiente paso, número de fórmula) de la base de datos.
  4. Registra evento de auditoría disociado.
- Asegurar idempotencia: la tarea verifica que el archivo exista antes de intentar borrarlo.

#### Paso 9 – Pruebas de integración
- Crear pruebas que simulen:
  - Carga de documentos dentro y fuera de límites.
  - Validación de reglas de negocio (afiliación inactiva, fórmula vencida, cobertura no cubierta, autorización faltante).
  - Transacción de reserva (sobre‑reserva rechazada).
  - Purga de archivos y eliminación de textos OCR.
- Cada prueba debe cubrir al menos un caso de uso del servicio y validar que la base de datos y MinIO quedan en el estado esperado.

#### Paso 10 – Documentación y trazabilidad
- Generar README con flujo de trabajo, comandos de test, variables de entorno.
- Actualizar matriz de trazabilidad (SPEC ↔ ADR ↔ COMP ↔ TEST) en `docs/trazabilidad.md`.

## Supuestos (cero)
- No se necesita crear una base de datos externa; PostgreSQL con Prisma es suficiente.
- MinIO está disponible en el entorno Docker Compose y sus credenciales se proveen vía `.env`.
- Los workers de OCR y PDF se ejecutan en el mismo contenedor Node.js, sin necesidad de servicios externos.
- Los valores por defecto de límites (10 MB, 3 páginas, 5 fórmulas) son aceptables y pueden ajustarse tras la medición del OCR.

## Riesgos / Bloqueos
- **Precisión del OCR**: si Tesseract.js no reconoce correctamente medicamentos o diagnósticos, la validación de coincidencia Levenshtein fallará. Mitigación: fase de medición con documentos sintéticos antes de producción.
- **Sobrecarga del worker**: la conversión de PDF y OCR pueden saturar el CPU. Mitigación: usar `worker_threads` y limitar la concurrencia (máx. 2 workers simultáneos).
- **Purga de MinIO**: si la tarea de `pg-boss` falla, pueden quedar archivos huérfanos. Mitigación: registrar errores y re‑intentar con back‑off; mantener logs sin PII.
- **Cifrado de PII**: mantener la clave AES‑256‑GCM en variables de entorno del contenedor; en producción se deberá usar un secret manager, pero para el prototipo está aceptado.

## Ruta del plan
`docs/arquitectura/plan-prevalidacion.md`

--- 

**Resumen breve**  
- **Pruebas verdes/rojas**: antes del plan 0 pruebas verdes; después de cada paso se ejecuta `npm test -- modulos/prevalidacion` y se asegura que el conteo de pruebas verdes no disminuya.  
- **Archivos tocados**: `docs/arquitectura/plan-prevalidacion.md` (creado).  
- **Supuestos**: todos son explícitos y verificables; no se ha introducido ningún supuesto no declarado.  
- **Riesgos**: precisión OCR, carga de workers, purga de MinIO, gestión de claves de cifrado.  
- **Ruta del plan**: `docs/arquitectura/plan-prevalidacion.md`.
