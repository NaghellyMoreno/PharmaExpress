# PREG-071. ¿La confirmación de la lectura OCR es por documento o conjunta, y a qué documento se le cuenta un rechazo?

Origen: S1
SPEC: SPEC-003 v1.9 — RF-030, BR-009, flujo principal paso 4, A1, AC-045 (hallazgo H-033)
Estado: respondida
Bloquea: no
Fecha: 2026-11-01

## Contexto

SPEC-003, flujo principal, paso 4: «El sistema presenta la vista previa de confirmación de lectura tanto para las fórmulas como para la historia clínica. El usuario verifica y presiona "Confirmar datos".»
SPEC-003/AC-045: «Dada una fórmula leída por OCR junto con su historia clínica, cuando el sistema presenta la vista previa, entonces muestra el número de prescripción y los medicamentos de la fórmula y los diagnósticos de la historia clínica, ofrece únicamente confirmar o rechazar».
SPEC-003/RF-030: «El rechazo por parte del usuario contabilizará como un intento fallido de carga del documento.»
DEC-P07: el rechazo «cuenta como un intento de carga» de «ese documento».

AC-045 describe una sola vista previa con los datos de dos documentos y una sola pareja de acciones. La solicitud admite varias fórmulas y una sola historia clínica. Nada dice cuántas vistas previas hay ni cómo se indica cuál documento se rechaza.

## Por qué importa

Dos rechazos de una fórmula dejan no apta esa fórmula; dos rechazos de la historia clínica dejan no aptas todas las fórmulas (DEC-P15). Si la vista previa es conjunta, un rechazo no dice a qué documento se le cuenta, y S2 no puede fijar el oráculo de SPEC-003/AC-045 ni el conteo de intentos.

## Opciones (si existen)

1. Una vista previa por documento, cada una con su confirmar y rechazar — el rechazo se cuenta al documento mostrado.
2. Una vista previa conjunta, en la que la persona indica qué documento rechaza — confirma todo de una vez, y el rechazo se cuenta al documento indicado.

## Propuesta del agente (PROPUESTA)

Ninguna: es una regla de negocio.

## Respuesta del equipo

Respondida con DEC-P55 (docs/decisiones.md), 2026-11-01.
