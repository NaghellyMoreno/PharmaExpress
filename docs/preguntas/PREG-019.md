# PREG-019. ¿La afiliación se verifica antes de pedir y comparar los documentos, y qué resultado gana si ambos fallan?

Origen: S1
SPEC: SPEC-003 v1.3 — flujo principal pasos 3 a 7, E1, E2, BR-008, AC-014, AC-030
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

Contexto 3.4: «Afiliación activa. Se verifica una vez por solicitud. Si está inactiva, se detiene toda la solicitud y se orienta hacia la EPS.»
SPEC-003, flujo principal: el paso 5 valida la coincidencia con la EPS simulada y solo el paso 7 verifica la afiliación.
SPEC-003/AC-014: «cuando inicia la prevalidación de una solicitud con múltiples fórmulas, entonces el sistema detiene inmediatamente el proceso».

La carga y la coincidencia pueden gastar los dos intentos antes de llegar al paso 7.

## Por qué importa

Con afiliación inactiva y una historia clínica fallida, o con fórmulas que no coinciden, la SPEC da orientaciones distintas: EPS (E2) o atención presencial (E1). No se sabe tampoco si el paso 7 se ejecuta cuando todas las fórmulas ya quedaron no aptas. Si la afiliación se puede saber antes, el paciente carga datos de salud sin necesidad.

## Opciones

1. La afiliación se verifica antes de la carga; si está inactiva, no se piden documentos.
2. Se mantiene el orden actual, pero la afiliación se verifica siempre y su resultado reemplaza a los demás.
3. Se mantiene el orden actual y las fórmulas ya no aptas conservan su motivo.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P33 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: RF-26, A12 pasos 6 y 7, SPEC-03 flujo principal, A1.
