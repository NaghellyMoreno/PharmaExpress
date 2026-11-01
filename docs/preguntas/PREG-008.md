# PREG-008. ¿Qué se considera fórmula manuscrita, cómo se comprueba y tiene o no un reintento?

Origen: S1
SPEC: SPEC-003 v1.3 — RF-031, E3, AC-022, BR-014
Estado: respondida
Bloquea: sí
Fecha: 2026-10-31

## Contexto

SPEC-003/RF-031: «El sistema debe identificar si una fórmula cargada es manuscrita. De detectarse prescripción manuscrita, el sistema debe marcar la fórmula como no apta».
SPEC-003/AC-022: «cuando el sistema detecta la condición de manuscrita, entonces marca la fórmula como no apta».
Contexto 3.4: «Si de un documento no se obtienen los datos (ilegible, incompleto, sin diagnóstico o sin coincidencia con la EPS simulada), se pide cargarlo de nuevo».
`docs/mvp.md`, Corte técnico: «Fórmulas manuscritas: **fuera de alcance**».

La SPEC da como origen «T-009, propuesta tecnológica». T-009 es una pregunta sin respuesta (si manuscrita equivale a ilegible con mensaje propio) y `docs/arquitectura/propuesta-tecnologica.md` no menciona las fórmulas manuscritas. Ninguna decisión de `docs/decisiones.md` fija la no aptitud inmediata sin reintento.

## Por qué importa

AC-022 parte de la propia detección, así que no prueba nada: S2 no tiene oráculo para decir qué documento debe detectarse como manuscrito. Tampoco se sabe qué pasa con un impreso con partes a mano, con una firma, o con una historia clínica manuscrita.

## Opciones

1. Manuscrita es un caso de «ilegible»: dos intentos y mensaje propio. Sigue el contexto 3.4 y no exige detector.
2. Detección explícita sin reintento (lo que dice hoy la SPEC): exige definir el criterio de detección y registrar la decisión, porque se aparta del contexto 3.4.
3. Sin detección: una manuscrita se comporta como cualquier documento ilegible y solo la orientación menciona las manuscritas.

## Propuesta del agente (PROPUESTA)

Ninguna. Es una regla de negocio y la decide una persona.

## Respuesta del equipo

Respondida con DEC-P23 (docs/decisiones.md), 2026-10-31.
