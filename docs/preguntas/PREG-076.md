# PREG-076. ¿Qué hace el sistema si en una solicitud nueva se carga una fórmula con un resultado que DEC-P41 no nombra?

Origen: S1
SPEC: SPEC-003/BR-009, AC-049, AC-040, E2 · SPEC-008/A1, AC-041 · DEC-P41
Estado: respondida
Bloquea: no
Fecha: 2026-11-01

## Contexto

DEC-P41: «Una fórmula no apta por reglas de la EPS (autorización o fecha) puede prevalidarse en una solicitud nueva, con intentos nuevos. Una no apta por documento se queda en atención presencial.»
SPEC-003/BR-009: «Una fórmula no apta por documento se orienta a la atención presencial.»
SPEC-008/A1 provoca «afiliación inactiva o fórmula vencida» y luego ejecuta «la nueva prevalidación».

Ningún RF, flujo ni AC dice qué pasa si la persona carga en una solicitud nueva:

1. Una fórmula no apta por documento. Si nunca se leyó su número, el sistema no puede reconocerla.
2. Una fórmula no apta por vigencia, o de una solicitud detenida por afiliación inactiva ya reactivada.
3. Una fórmula crónica no apta por no tener fecha habilitada (DEC-P16).

## Por qué importa

Si el sistema debe impedir la solicitud nueva, necesita conservar el resultado por número de fórmula, y S2 necesita un oráculo. Si no la impide, «se queda en atención presencial» es solo una orientación y el límite de dos intentos se reinicia con cada solicitud. Hallazgos SPEC-003/H-071 y SPEC-008/H-063.

## Opciones

1. El sistema no bloquea: toda carga en una solicitud nueva se procesa con intentos nuevos, y DEC-P41 solo orienta qué se le dice a la persona.
2. El sistema reconoce por número las fórmulas no aptas por documento y las rechaza; las ilegibles sin número no se pueden reconocer.
3. Otra regla que defina el equipo para vigencia y afiliación.

## Propuesta del agente (PROPUESTA)

Ninguna: es una regla de negocio.

## Respuesta del equipo

Respondida con DEC-P76 (docs/decisiones.md), 2026-11-02.
