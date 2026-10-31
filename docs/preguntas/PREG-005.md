# PREG-005. <Pregunta concreta>

Origen: B1 (backend-servicios-api) — detectado en `apps/api/src/modulos/identidad/pruebas/servicios.spec.ts` (TC-005 / AC-005 / RF-007 / BR-007)
SPEC: SPEC-001 (módulo `identidad`)
Estado: abierta
Bloquea: sí
Fecha: 2026-10-31

## Contexto

La prueba de servicios (`servicios.spec.ts`) construye el servicio sin dependencias y ejecuta:

```ts
const autorizacion = new AutorizacionDatosSaludService();
await expect(autorizacion.puedeCargar('solicitud-1')).resolves.toBe(false); // antes de autorización: no se cargan datos de salud
await expect(autorizacion.puedeCargar('solicitud-1')).resolves.toBe(true);  // con autorización aceptada: se continúa
```

El segundo caso espera que, con una autorización separada aceptada, la carga de datos de salud proceda, sin que la prueba registre dicha autorización.

## Por qué importa

Bloquea la puesta en verde del caso «autorización separada de datos de salud» (BR-007 / RF-007 / AC-005 / TC-005). Sin la semántica exacta de cómo se registra la autorización aceptada, el caso no puede verificarse sin tocar la prueba.

## Opciones (si existen)

1. Servicio con estado interno + método de registro de autorización (implementación propuesta en `AutorizacionDatosSaludService`).
2. Inyección de dependencia del estado de autorización al servicio.

## Propuesta del agente (PROPUESTA)

Mantener estado interno con registro explícito (`registrarAutorizacion`) y consulta vía `puedeCargar`; se requiere confirmación del equipo sobre la forma esperada.

## Respuesta del equipo

(Vacío hasta que una persona responda.)
