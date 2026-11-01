# PREG-075. ¿Cuál es la confirmación previa a revocar que cita DEC-P38, si SPEC-001 no la define?

Origen: S1
SPEC: SPEC-002/AC-033, RF-011 · SPEC-001/RF-008, RF-009, flujo principal pasos 12 y 13 · DEC-P38
Estado: respondida
Bloquea: no
Fecha: 2026-11-01

## Contexto

DEC-P38: «Con vinculación vigente se puede revocar sin código nuevo, con la confirmación de SPEC-001».
SPEC-002/AC-033: «cuando la persona solicita revocar el consentimiento y lo confirma, entonces el sistema aplica la revocación sin pedir un código nuevo.»
SPEC-001/RF-009 solo tiene una confirmación posterior: «confirmar la revocación al titular». SPEC-001/AC-007 y el flujo principal pasan de solicitar a eliminar, sin paso intermedio.
SPEC-002/RF-019 sí define una «confirmación simple» para desvincular, pero no aplica a la revocación.

## Por qué importa

La revocación elimina todos los datos del paciente y no se puede deshacer. Con DEC-P37 y DEC-P38, esa confirmación es la única barrera que queda en un chat vinculado. S2 no tiene oráculo de qué se muestra, qué pasa si la persona no confirma, ni si es la misma en web y Mini App. SPEC-001 está aprobada y no se cambia sin una persona. Hallazgo SPEC-002/H-074.

## Opciones

1. Es una confirmación simple previa, igual a la de SPEC-002/RF-019, y SPEC-002 la define como requisito; SPEC-001 no cambia.
2. Es la confirmación posterior de SPEC-001/RF-009 y no hay paso previo; SPEC-002/AC-033 pierde «y lo confirma».

## Propuesta del agente (PROPUESTA)

Ninguna: DEC-P38 ya está decidida y no se reabre. Solo falta saber a qué confirmación se refiere.

## Respuesta del equipo

Respondida con DEC-P57 (docs/decisiones.md), 2026-11-01.
