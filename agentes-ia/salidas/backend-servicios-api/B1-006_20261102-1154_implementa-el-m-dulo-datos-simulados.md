<!--
Agente: B1 Servicios y API
Proveedor: openrouter
Modelo: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
Fecha: 2026-11-02 11:54
Petición: Implementa el módulo datos_simulados
-->

```file:docs/arquitectura/plan-datos_simulados.md
# Plan de arquitectura para el módulo datos_simulados

## Objetivo
Implementar el módulo `datos_simulados` que provee datos simulados para puntos de dispensación, inventario, horarios y catálogos de medicamentos, cumpliendo con la SPEC y la ARQ-005.

## Paso 1: Definir el dominio
- Crear archivos de entidades en `dominio/`:
  - `punto.entity.ts`
  - `ventana.entity.ts`
  - `inventario.entity.ts`
  - `medicamento.entity.ts`
  - `horario.entity.ts` (opcional)
  - Enum files: `dia.enum.ts`
- Cada entidad será una clase TypeScript con validaciones básicas (p.ej., using class-validator) pero sin dependencias de infraestructura.
- Test: Compilación y pruebas unitarias simples que verifiquen que los tipos y validaciones funcionan (ej. `npm test -- modulos/datos_simulados` después de crear los archivos, se esperan 0 rojas).

## Paso 2: Modelar la base de datos con Prisma
- Crear/actualizar `datos/schema.prisma` con tablas:
  - `Punto` (id, name, createdAt, updatedAt)
  - `Ventana` (id, puntoId, dia (enum), startTime, endTime, capacity, createdAt, updatedAt)
  - `Inventario` (id, puntoId, medicamentoId, quantity, createdAt, updatedAt)
  - `Medicamento` (id, name, dosage, pbsCoverage, createdAt, updatedAt)
- Definir relaciones (Punto 1--∗ Ventana, Ventana ∗--1 Punto, Inventario ∗--1 Punto, ∗--1 Medicamento).
- Añadir índices y constraints necesarios (p.ej., `unique` en `Ventana` por `puntoId` y `dia` + `startTime`).
- Test: Ejecutar `npx prisma generate` y verificar que el modelo compila; también correr pruebas de integración que verifiquen que Prisma puede generar la client sin errores.

## Paso 3: Implementar el servicio Prisma (singleton)
- Archivo `prisma.service.ts` en `datos/` que crea y exporta una instancia única de `PrismaClient`. Proveer métodos auxiliares si se necesita (p.ej., `getPrisma()`).
- Test: Asegurarse de que la inyección del cliente no rompa la compilación y que los tests unitarios de servicios puedan importarlo sin efectos colaterales.

## Paso 4: Implementar casos de uso (servicios)
- Crear archivos en `servicios/`:
  - `obtener-puntos.service.ts`
  - `obtener-ventanas.service.ts`
  - `obtener-inventario.service.ts`
  - `obtener-medicamentos.service.ts`
- Cada servicio inyecta `PrismaService` y expone un método que devuelve un array de DTOs o entidades.
- Validaciones de negocio simples (p.ej., solo devolver puntos activos, ventanas con capacidad > 0, etc.).
- Test: Cada servicio debe pasar sus pruebas unitarias (mocking Prisma o usando la base de datos real en tests de integración). Se espera que el número de pruebas verdes no disminuya.

## Paso 5: Crear DTOs y controladores API
- En `api/` crear carpetas `dto/` y `controller/`.
  - DTOs: `GetPuntosDto`, `GetVentanasDto`, `GetInventarioDto`, `GetMedicamentosDto`.
  - Controladores: `PuntosController`, `VentanasController`, `InventarioController`, `MedicamentosController`.
- Cada controlador inyecta el servicio correspondiente y expone endpoints RESTful (GET /puntos, GET /puntos/:id/ventanas, etc.).
- DTOs usar Zod para validación de parámetros (aunque la mayoría son GET sin body).
- Test: Ejecutar pruebas de integración (e2e) que verifiquen que los endpoints devuelven 200 y la estructura correcta. Se espera que el número de pruebas verdes aumente o se mantenga.

## Paso 6: Tests finales y validación
- Ejecutar `npm test -- modulos/datos_simulados` después de cada paso.
- Asegurarse de que el número de pruebas verdes no disminuya respecto al estado inicial (idealmente 0 rojas).
- Si alguna prueba falla, detener el proceso y abrir `docs/preguntas/PREG-<numero>.md` para aclarar la ambigüedad.

## Consideraciones
- Los datos son simulados; no se persisten cambios reales en pruebas, pero se usarán fixtures en tests de integración.
- Los límites técnicos (tamaño de archivo, páginas, fórmulas) no aplican aquí, pero se respetará la configuración de la base de datos.
- El módulo debe ser independiente; no debe importar otros módulos (excepto Prisma).
- Todas las clases y funciones deben estar tipadas y seguir los patrones de código del proyecto (Decorators, interfaces, etc.).
```
