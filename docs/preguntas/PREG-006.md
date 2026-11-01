# PREG-006. Sin agendamiento en el MVP, ¿contra qué fecha se verifica la «fecha habilitada» de una fórmula crónica?

Origen: revisión de alcance (decisión de la persona del 2026-10-31)
SPEC: SPEC-003 v1.0 (Candidata) — RF-024 paso 5, AC-002
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003 / RF-024, paso 5: «Fecha habilitada de entrega igual o anterior a la fecha de la cita posible, exclusivamente para fórmulas crónicas».
SPEC-003 / AC-002: «Dada una fórmula crónica, cuando la fecha habilitada de entrega es posterior a la fecha de la cita posible, entonces la fórmula queda no apta».

La «fecha de la cita posible» sale del agendamiento (SPEC-004), y la persona aún no decide si el agendamiento entra al MVP.

## Por qué importa

Sin esa fecha, S2 no puede fijar el resultado esperado de AC-002 y B1 no puede implementar el paso 5. Afecta solo a las fórmulas crónicas.

## Opciones

1. El agendamiento entra al MVP: se usa la primera ventana disponible real (SPEC-004).
2. Sin agendamiento: la «cita posible» es la fecha más temprana que permite la regla de tiempo del tipo de tratamiento (en `docs/mvp.md`, REQ-017: «mismo día vs día siguiente»). Para una fórmula crónica sería el día siguiente a la prevalidación. Basta un cálculo, sin reservar nada.
3. Aplazar el paso 5: cambia una regla de negocio de SPEC-003 y requiere una nueva versión de la SPEC.

## Propuesta (PROPUESTA)

Opción 2 mientras se decide el agendamiento. Si luego entra SPEC-004, la fecha pasa a ser la de la ventana real, sin rehacer la prevalidación.

## Respuesta del equipo

Opción 2, con un ajuste: la fecha es el día calendario siguiente a la prevalidación, **saltando domingos y festivos de Colombia** (catálogo configurable). Registrada como DEC-P13 en `docs/decisiones.md` (2026-10-31).
