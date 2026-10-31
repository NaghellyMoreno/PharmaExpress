# PREG-004. <Pregunta concreta>

Origen: B1 (backend-servicios-api) — detectado en `apps/api/src/modulos/identidad/pruebas/dominio.spec.ts` (caso «Código anterior al solicitar uno nuevo», TC-013 / AC-003 / BR-003 / CL-001)
SPEC: SPEC-001 (módulo `identidad`)
Estado: abierta
Bloquea: sí
Fecha: 2026-10-31

## Contexto

La prueba unitaria de dominio (`dominio.spec.ts`) invoca el predicado puro:

```ts
expect(esCodigoVigente('741203')).toBe(true);
expect(esCodigoVigente('548920')).toBe(false);
```

La regla de negocio (BR-003 / DEC-01, codificada en SPEC-001 v1.1) es: al solicitar un nuevo código, el anterior queda anulado y solo el último es vigente.

## Por qué importa

El predicado `esCodigoVigente` del dominio requiere el contexto del código vigente (código, emisión, estado) para evaluar si un código está vigente o fue anulado. Con la firma actual de un solo argumento no es posible distinguir «el último emitido» de «el anterior anulado» sin estado o contexto adicional.

## Opciones (si existen)

1. Añadir el contexto del código vigente como parámetro del predicado (requiere ajuste de la prueba o de la firma).
2. Introducir estado en el dominio (rompe la pureza de las reglas).

## Propuesta del agente (PROPUESTA)

Mantener el dominio puro e inyectar el contexto desde los servicios; se requiere la decisión del equipo sobre la firma exacta.

## Respuesta del equipo

(Vacío hasta que una persona responda.)
