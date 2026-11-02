# Plan de implementación del módulo `datos_simulados`

## Visión general
El módulo `datos_simulados` provee los datos simulados que representan la EPS (Entidad Promotora de Salud) para el proceso de prevalidación. Incluye:
- Esquema de base de datos Prisma con tablas para pacientes, fórmulas, medicamentos, diagnósticos, autorizaciones y vigencias.
- Servicio que expone métodos para consultar estos datos (usado por el módulo `prevalidacion`).
- Controlador HTTP opcional (solo en entornos de desarrollo) para pruebas de integración.
- Tests unitarios que validan la lógica del servicio y del controlador.

## Paso a paso

| Paso | Archivos a crear | Qué cubre | Prueba asociada |
|------|------------------|-----------|-----------------|
| 1 | `docs/arquitectura/plan-datos_simulados.md` | Plan de trabajo | - |
| 2 | `apps/api/src/modulos/datos_simulados/` (estructura de carpetas) | Esqueleto del módulo | - |
| 3 | `apps/api/src/modulos/datos_simulados/dominio/`<br>• `entities.ts`<br>• `value-objects.ts` | Definición de tipos dominio puros (sin I/O) | Test de que las clases no dependen de Prisma ni de HTTP |
| 4 | `apps/api/src/modulos/datos_simulados/datos/`<br>• `prisma/schema.prisma`<br>• `prisma/migration.sql` (generado) | Modelo Prisma y migración del esquema | Test de que la migración se ejecuta sin errores |
| 5 | `apps/api/src/modulos/datos_simulados/servicios/`<br>• `eps-simulada.service.ts` | Servicio que encapsula el acceso a datos (consulta, seed) | Test de que el servicio devuelve datos correctos y maneja seed solo en dev |
| 6 | `apps/api/src/modulos/datos_simulados/api/`<br>• `eps-simulada.controller.ts` | Controlador HTTP (solo dev) | Test de que el endpoint devuelve datos mock y está deshabilitado en prod |
| 7 | `apps/api/src/modulos/datos_simulados/pruebas/`<br>• `eps-simulada.service.spec.ts`<br>• `eps-simulada.controller.spec.ts` | Tests unitarios (red → green) | `npm test -- modulos/datos_simulados` debe mostrar pruebas verdes después de cada paso |
| 8 | `package.json` (añadir script de test) | Configuración de pruebas | - |

## Detalles de cada paso

### Paso 1 – Plan
Crear este archivo de plan en `docs/arquitectura/plan-datos_simulados.md`. No se escribe código todavía.

### Paso 2 – Esqueleto del módulo
Crear la carpeta `apps/api/src/modulos/datos_simulados/` con subcarpetas `dominio/`, `datos/`, `servicios/`, `api/`, `pruebas/`. Cada carpeta debe contener un `index.ts` vacío para evitar errores de importación.

### Paso 3 – Dominio (reglas puras)
En `dominio/` crear los siguientes archivos TypeScript:

- `entities.ts`: Interfaces o clases que representen los conceptos del dominio simulado (Paciente, Formula, Medicamento, Diagnostico, Autorizacion, Vigencia). Estas clases deben ser **puras** (sin métodos que accedan a la base de datos ni a HTTP).

- `value-objects.ts`: Si se necesita, clases de valor (ej. `Cedula`, `NumeroPrescripcion`) que encapsulen validaciones simples.

**Criterio de completitud**: Las clases deben poder ser instanciadas sin dependencias externas y deben reflejar los campos requeridos por la SPEC (p.ej., número de prescripción de 20 dígitos, fechas, etc.).

### Paso 4 – Datos (Prisma)
En `datos/` crear:

- `prisma/schema.prisma`: Definir los modelos Prisma que correspondan a las entidades del dominio. Cada modelo debe mapear a una tabla PostgreSQL y debe incluir campos necesarios (claves, fechas, booleanos, etc.). Ejemplo:
