# Plan de implementación del módulo de Prevalidación

## Visión general
El módulo **prevalidación** será responsable de:
- Recepción de fotos/PDFs de fórmulas e historias clínicas.
- Validación de límites técnicos (tamaño, páginas, fórmulas).
- Conversión local de PDF a imágenes y ejecución de OCR con Tesseract.js.
- Extracción de datos (MIPRES, medicamentos, diagnóstico) y comparación con la EPS simulada (distancia Levenshtein).
- Aplicación estricta del orden de reglas de prevalidación (afiliación, vigencia, cobertura, autorización, fecha habilitada).
- Generación de resultado preliminar (Apta / No Apta) y datos para vista previa de confirmación humana.
- Registro de auditoría disociada y borrado físico inmediato de los archivos en MinIO.
- Coherencia con los módulos **identidad**, **canales**, **eps_simulada** y **tareas_notificaciones**.

## Paso a paso

| Paso | Archivos / carpetas creadas | Qué cubre | Pruebas verdes esperadas |
|------|----------------------------|-----------|--------------------------|
| **1** | `docs/arquitectura/plan-prevalidacion.md` (este archivo) | Definir el plan y la estructura de archivos. | - |
| **2** | `dominio/prevalidacion/` <br> - `models.ts` (interfaces: `Solicitud`, `Formula`, `Documento`, `ResultadoPrevalidacion`, `EventoAuditoria`) <br> - `strategies.ts` (estrategia de cobertura y autorización) | Reglas de negocio puras, sin I/O. Define el modelo de dominio y los algoritmos de comparación (Levenshtein) y clasificación (agudo/crónico). | Todas las pruebas de dominio (si existen) deben pasar. |
| **3** | `data/prevalidacion/` <br> - `schema.prisma` (tablas: `Solicitud`, `Formula`, `Documento`, `Resultado`, `EventoAuditoria`, `Configuracion`) <br> - `repository.ts` (clase `PrevalidacionRepository` implementando interfaces del dominio) | Persistencia con Prisma. Se crean las tablas y el repositorio que encapsula el acceso a la BD. | `npm test -- modulos/prevalidacion` → 0 rojas (solo pruebas de dominio, que aún no existen). |
| **4** | `servicios/prevalidacion/` <br> - `ocr.service.ts` (servicio que orquesta conversión PDF → imagen → Tesseract.js) <br> - `prevalidacion.service.ts` (casos de uso: `CrearSolicitud`, `ProcesarDocumentos`, `ValidarPrevalidacion`, `GenerarResultado`) <br> - `rateLimiter.service.ts` (control de frecuencia OTP, reutilizable) | Lógica de negocio en servicios. Incluye: <br> • Validación de límites técnicos (tamaño, páginas, fórmulas). <br> • Llamada al worker OCR (mock o real). <br> • Aplicación de reglas de prevalidación en orden. <br> • Generación de resultado y datos para vista previa. | Cada paso de servicio debe ejecutar sin disminuir pruebas verdes. |
| **5** | `api/prevalidacion/` <br> - `controllers.ts` (Controlador HTTP: `createSolicitud`, `getResultado`, `cancelar`, etc.) <br> - `dto.ts` (DTOs con validación Zod: `CreateSolicitudDto`, `UploadFileDto`, `ParametrosDto`) <br> - `routes.ts` (definición de rutas en NestJS) | Exposición del módulo mediante API REST. Validación de entrada con Zod, manejo de archivos multipart, delegación a servicios. | `npm test -- modulos/prevalidacion` → 0 rojas (solo pruebas de integración que se crearán después). |
| **6** | `comunes/pg-boss/` <br> - `tasks/prevalidacionPurge.task.ts` (tarea programada que elimina archivos en MinIO y registros de OCR) <br> - Configuración del cron en `pg-boss` (ej. ejecutar 5 min después de completar la solicitud) | Garantizar purga física inmediata de archivos y eliminación de datos OCR (DEC‑P81). | Todas las pruebas de módulo deben pasar; la tarea debe estar inactiva hasta que se invoque. |
| **7** | `integration/` (opcional) <br> - Tests de extremo a extremo que usan `supertest` contra los endpoints creados, verificando flujo completo (carga → OCR → prevalidación → resultado). | Validar integración con otros módulos (identidad, eps_simulada, canales). | Todas las pruebas de integración deben estar verdes. |
| **8** | `docs/preguntas/PREG-prevalidacion.md` (si surge alguna duda durante la implementación) | Documentar preguntas que requieran aclaración antes de continuar. | - |

### Detalles de cada paso

#### Paso 2 – Dominio
- **Archivo**: `dominio/prevalidacion/models.ts`
- Definir tipos TypeScript que representen los conceptos del dominio.
- Incluir:
  - `Solicitud` (id, pacienteId, canalId, estado, fechas).
  - `Formula` (id, solicitudId, mipres, medicamentos: string[], diagnostico: string, tipo: 'agudo' | 'cronico', fechaHabilitada, estado).
  - `Documento` (id, solicitudId, tipo: 'foto' | 'pdf', rutaMinio (cifrada), leido, resultado, motivo, siguientePaso, numeroFormula).
  - `ResultadoPrevalidacion` (id, solicitudId, formulaId, apta, motivo, siguientePaso, numeroFormula).
  - `EventoAuditoria` (id, solicitudId, tipoEvento, fecha, datosDisociados).
  - `Configuracion` (tamañoMaxFile, maxPaginasPDF, maxFormulasPorSolicitud, umbralLevenshtein).
- **Estrategias** (`strategies.ts`):
  - `CoberturaStrategy`: decide si un medicamento está cubierto (PBS) o necesita autorización.
  - `AutorizacionStrategy`: verifica estado de autorización en EPS simulada.
  - `ClasificadorEstrategia`: clasifica fórmula como aguda o crónica según diagnóstico.

#### Paso 3 – Persistencia
- **Archivo**: `data/prevalidacion/schema.prisma`
- Crear tablas con relaciones:
  - `Solicitud` 1‑* `Formula`, 1‑* `Documento`, 1‑* `Resultado`.
  - `Formula` pertenece a una `Solicitud`.
  - `Documento` pertenece a una `Solicitud`.
  - `Resultado` pertenece a una `Formula` (una fórmula puede tener varios resultados si se procesan documentos diferentes).
- **Repository**: `data/prevalidacion/repository.ts`
  - Implementa métodos CRUD y de consulta (por ejemplo: `crearSolicitud`, `obtenerResultado`, `listarDocumentos`, `actualizarEstadoDocumento`, `eliminarArchivoFísico`).
  - Usa Prisma Client; la encriptación de campos sensibles (p.ej., `rutaMinio`) se hará en la capa de servicio, no en la BD.

#### Paso 4 – Servicios
- **OCR Service** (`servicios/prevalidacion/ocr.service.ts`):
  - Recibe buffer de imagen (o PDF convertido) y devuelve datos extraídos (MIPRES, medicamentos, diagnóstico).
  - En entorno de pruebas se puede inyectar un mock para evitar dependencia de Tesseract.
- **Prevalidación Service** (`servicios/prevalidacion/prevalidacion.service.ts`):
  - `crearSolicitud`: recibe DTO, valida límites técnicos, guarda archivos en MinIO (cifrados), crea registro en DB.
  - `procesarDocumentos`: para cada documento, llama a OCR, valida resultados, presenta vista previa (se delega a API de front, pero en backend se guarda la información para que el front la muestre).
  - `validarPrevalidacion`: ejecuta reglas en orden (afiliación → vigencia → cobertura → autorización → fecha habilitada). Usa estrategias definidas en dominio.
  - `generarResultado`: construye el objeto `ResultadoPrevalidacion` y registra evento de auditoría.
- **RateLimiter Service** (`servicios/prevalidacion/rateLimiter.service.ts`):
  - Controla el número de códigos OTP enviados por celular y ventana temporal (configurable). Utiliza una tabla de contadores en la BD o en memoria con TTL.

#### Paso 5 – API
- **Controladores** (`api/prevalidacion/controllers.ts`):
  - `POST /prevalidacion/solicitud`: recibe multipart, usa `CreateSolicitudDto`, llama a `prevalidacionService.crearSolicitud`.
  - `GET /prevalidacion/:id/resultado`: devuelve resultado preliminar (solo datos no sensibles).
  - `POST /prevalidacion/:id/cancelar`: cancela la solicitud, marca como cancelada, encola purga.
  - `POST /prevalidacion/:id/preview`: (opcional) devuelve datos para vista previa de confirmación humana.
- **DTOs** (`api/prevalidacion/dto.ts`):
  - Validación con Zod: tamaño máximo de archivo (10 MB), tipo de archivo (image/jpeg, image/png, application/pdf), máximo de páginas (3), máximo de fórmulas (5).
  - DTOs para parámetros de configuración (tamaño, páginas, fórmulas, umbral Levenshtein) que pueden ser actualizados vía admin.
- **Rutas** (`api/prevalidacion/routes.ts`):
  - Registra los controladores en el módulo NestJS `PrevalidacionModule`.

#### Paso 6 – Purga con pg‑boss
- **Tarea** (`comunes/pg-boss/tasks/prevalidacionPurge.task.ts`):
  - Se dispara después de que una solicitud alcance el estado `COMPLETED` o `CANCELLED`.
  - Elimina físicamente los archivos en MinIO (usando SDK de MinIO) y marca/elimina los registros de `Documento` y `Resultado` que correspondan.
  - Registra en `EventoAuditoria` que se ejecutó la purga (solo tipoEvento y fecha, sin PII).
- **Configuración**: definir cron (p.ej., cada 5 min) y lógica de identificación de solicitudes a purgar.

#### Paso 7 – Integración y pruebas
- **Integración con Identidad**: el servicio de prevalidación llama a `identidadService.verificarAfiliacionActiva(pacienteId)` antes de iniciar la prevalidación.
- **Integración con EPS Simulada**: usa `epsSimuladaService.consultarCobertura`, `epsSimuladaService.consultarAutorizacion`, `epsSimuladaService.consultarFechaHabilitada`.
- **Integración con Canales**: si la solicitud proviene de Telegram Mini App, el `canalId` se obtiene del `chat_id` asociado al paciente; el servicio de canales permite obtener el `chat_id` a partir del `patientId`.
- **Pruebas**: crear tests unitarios para cada caso de uso, tests de integración con `supertest` y tests de e2e que cubran todo el flujo.

#### Paso 8 – Preguntas pendientes
- Si durante la implementación surge alguna ambigüedad (por ejemplo, valores exactos de los límites técnicos, umbral de Levenshtein, ventana de OTP), crear un archivo `docs/preguntas/PREG-prevalidacion.md` y detener el proceso hasta recibir confirmación del equipo.

---

### Próximos pasos inmediatos
1. **Crear el plan** (archivo `docs/arquitectura/plan-prevalidacion.md`) – **ya completado**.
2. **Crear la estructura de carpetas y archivos del dominio** (`dominio/prevalidacion/`) y escribir los modelos y estrategias.
3. Ejecutar `npm test -- modulos/prevalidacion` (esperamos 0 rojas, ya que aún no existen pruebas).

Una vez validado el plan, procederemos a crear los archivos del dominio.
