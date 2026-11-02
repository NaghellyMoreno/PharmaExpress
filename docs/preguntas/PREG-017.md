# PREG-017. ¿Qué entradas inválidas se rechazan y cuáles cuentan como intento de carga?

Origen: S1
SPEC: SPEC-003 v1.3 — sección 3, sección 14, RF-022, BR-009; T-009
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-003, sección 3: «Carga de archivos en formato foto (JPG, PNG) o PDF».
SPEC-003, sección 14: «[Límites de tamaño de archivo y número de páginas en archivos PDF]: tema para arquitectura.»
SPEC-003/RF-022: «el número de prescripción (20 dígitos)».

No se define la conducta ante un archivo de otro formato, un archivo que supere el límite, un número leído con menos o más de 20 dígitos o con letras, ni el máximo de fórmulas por solicitud (preguntado en T-009 y sin respuesta).

## Por qué importa

Arquitectura puede fijar el número del límite, pero la conducta visible es funcional: si gasta o no uno de los dos intentos cambia el resultado de la fórmula. Tampoco hay valores límite para los 20 dígitos.

## Opciones

1. Los archivos inválidos se rechazan sin gastar intento; un número malformado cuenta como lectura fallida.
2. Toda entrada inválida gasta un intento.

## Propuesta del agente (PROPUESTA)

Ninguna.

## Respuesta del equipo

Respondida con DEC-P74 (docs/decisiones.md), 2026-11-02.
