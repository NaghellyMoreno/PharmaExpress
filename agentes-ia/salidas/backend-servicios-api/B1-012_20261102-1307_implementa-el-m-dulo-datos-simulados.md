<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 13:07
Petición: Implementa el módulo datos_simulados
-->

```file:docs/arquitectura/plan-datos_simulados.md
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

```prisma
model Paciente {
  id            String   @id @default(uuid())
  cedula        String   @unique
  nombre        String
  epsId         String
  telefono      String?
  email         String?
  fechaCreacion DateTime @default(now())
}

model Formula {
  id                String   @id @default(uuid())
  numeroPrescripcion String   @unique
  pacienteId        String
  tipoTratamiento   TipoTratamiento @enum(AGUDO CRONICO)
  fechaPosibleCita  DateTime?
  fechaCreacion     DateTime @default(now())
  @relation(field: "pacienteId", references: [Paciente.id])
}

model Medicamento {
  codigo            String   @id @unique // 20 dígitos
  nombre            String
  coberturaPbs      Boolean  @default(false)
  requiereAutorizacion Boolean @default(false)
}

model Diagnostico {
  codigo       String   @id
  descripcion  String
  esCronico    Boolean  @default(false)
}

model Autorizacion {
  codigoMedicamento String   @id
  estado          AutorizacionEstado @enum(PENDIENTE AUTORIZADO RECHAZADO)
  fecha           DateTime @default(now())
}

enum TipoTratamiento { AGUDO CRONICO }
enum AutorizacionEstado { PENDIENTE AUTORIZADO RECHAZADO }
```

- Ejecutar `npx prisma generate` y crear la migración con `npx prisma migrate dev --name init-datos_simulados`. El archivo de migración se generará automáticamente; lo incluimos en el control de versiones.

### Paso 5 – Servicio
En `servicios/eps-simulada.service.ts` crear una clase que:

- Inyecta el cliente Prisma (`PrismaService`).
- Proporciona métodos async para consultar datos simulados, por ejemplo:
  - `obtenerPaciente(cedula: string): Promise<Paciente | null>`
  - `obtenerFormula(numeroPrescripcion: string): Promise<Formula | null>`
  - `obtenerMedicamento(codigo: string): Promise<Medicamento | null>`
  - `obtenerDiagnostico(codigo: string): Promise<Diagnostico | null>`
  - `obtenerAutorizacion(codigoMedicamento: string): Promise<Autorizacion | null>`
  - `obtenerCatalogoPbs(): Promise<Medicamento[]>`

- Incluye un método `seedData()` que inserta registros de ejemplo **solo** cuando `process.env.NODE_ENV !== 'production'`. Este método debe ser llamado al iniciar la aplicación (por ejemplo, en `main.ts` o en un `OnModuleInit`).

**Criterio de completitud**: Los métodos deben validar entradas (p.ej., formato de cedula) y lanzar errores apropiados si la data no existe.

### Paso 6 – Controlador (solo dev)
En `api/eps-simulada.controller.ts` crear un `Controller` con los siguientes endpoints (solo se habilitan en desarrollo):

- `GET /simulado/paciente/:cedula` → llama a `obtenerPaciente` y devuelve el paciente.
- `GET /simulado/formula/:numero` → llama a `obtenerFormula` y devuelve la fórmula.
- `POST /simulado/seed` → ejecuta `seedData()` (solo dev).

Usar un `Guard` que verifique `process.env.NODE_ENV === 'development'` y devuelva 403 en producción. Ejemplo:

```ts
@Get('paciente/:cedula')
async getPaciente(@Param('cedula') cedula: string): Promise<PacienteDto> {
  if (process.env.NODE_ENV === 'production') {
    throw new NotFoundException('Endpoint deshabilitado en producción');
  }
  const paciente = await this.epsSimuladaService.obtenerPaciente(cedula);
  if (!paciente) {
    throw new NotFoundException('Paciente no encontrado');
  }
  return this.toDto(paciente);
}
```

### Paso 7 – Tests
En `pruebas/` crear:

- `eps-simulada.service.spec.ts`: Tests unitarios para el servicio. Incluir:
  - Que `obtenerPaciente` devuelva el paciente correcto cuando existe.
  - Que lance `NotFoundException` cuando no existe.
  - Que `seedData` inserte registros solo en dev y no en prod.

- `eps-simulada.controller.spec.ts`: Tests de integración del controlador (usando `supertest` o `jest`). Verificar:
  - Que los endpoints devuelvan 200 en dev y 403 en prod.
  - Que el cuerpo sea el DTO esperado.

**Regla de avance**: Ejecutar `npm test -- modulos/datos_simulados` después de cada paso. El número de pruebas verdes no debe disminuir; si alguna prueba falla, detenerse y crear `docs/preguntas/PREG-<id>.md`.

### Paso 8 – Configuración de pruebas
Asegurarse de que `package.json` tenga un script `"test": "jest"` (o el equivalente) y que la configuración de Jest incluya el directorio `src/**/*.spec.ts`.

## Riesgos y consideraciones
- **Dependencia de Prisma**: Asegurarse de que la versión de Prisma sea la misma que el resto del proyecto.
- **Entorno de desarrollo vs producción**: El seed y los endpoints deben estar claramente separados para evitar exposición de datos de prueba en producción.
- **Validación de datos**: Las clases de dominio deben validar campos críticos (p.ej., número de prescripción de 20 dígitos) antes de ser persistidas.

## Resumen de archivos a crear
- `docs/arquitectura/plan-datos_simulados.md`
- `apps/api/src/modulos/datos_simulados/dominio/entities.ts`
- `apps/api/src/modulos/datos_simulados/dominio/value-objects.ts`
- `apps/api/src/modulos/datos_simulados/datos/prisma/schema.prisma`
- `apps/api/src/modulos/datos_simulados/servicios/eps-simulada.service.ts`
- `apps/api/src/modulos/datos_simulados/api/eps-simulada.controller.ts`
- `apps/api/src/modulos/datos_simulados/pruebas/eps-simulada.service.spec.ts`
- `apps/api/src/modulos/datos_simulados/pruebas/eps-simulada.controller.spec.ts`

---

Procederé a crear el plan y luego implementar cada paso en el orden especificado.
```
