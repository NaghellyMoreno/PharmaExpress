# PREG-011. ¿Cómo se comprueba que la historia clínica corresponde al paciente y a la EPS simulada?

Origen: S1
SPEC: SPEC-003 v1.3 — BR-009, BR-013, RF-023
Estado: abierta
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003/BR-009 cuenta como intento fallido que «los datos extraídos no coinciden con la EPS simulada», para cualquier documento.
SPEC-003/BR-013 solo define la coincidencia de una fórmula: «Una fórmula se considera coincidente».
Contexto 3.4: el problema «sin coincidencia con la EPS simulada» se refiere a «un documento».

No hay criterio para la historia clínica. Con un solo diagnóstico, DEC-P09 lo aplica a todas las fórmulas, aunque la EPS simulada tenga otro diagnóstico asociado a ese número.

## Por qué importa

Una historia clínica de otra persona, o con otro diagnóstico, cambiaría la clasificación aguda o crónica y podría saltarse el paso 5 de SPEC-003/RF-024. No hay oráculo para ese caso.

## Opciones

1. Se comprueba que la historia pertenece al paciente verificado (¿con qué dato leído?).
2. Se compara además con el diagnóstico que la EPS simulada asocia a cada fórmula.
3. No se compara: BR-009 debe limitar la «no coincidencia» a las fórmulas.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

