# PREG-028. ¿Quién configura los catálogos y provoca los cambios de prueba, y qué comprueba que algo es «configurable»?

Origen: S1
SPEC: SPEC-008/RF-078, SPEC-008/RF-080, SPEC-008/RF-082, SPEC-008/RF-084, A1 de SPEC-008
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

SPEC-008 A1: «se provoca una modificación en los datos de la EPS simulada», sin sujeto. SPEC-008/RF-080: «contenido configurable por cada EPS». El contexto 2.3 dice que el dispensador «Es el único actor con usuario y rol en el sistema». DEC-010 deja a arquitectura el mecanismo, no el actor.

## Por qué importa

Sin actor ni observación no hay caso que compruebe que cambiar un valor no exige tocar el código, ni que provocar cambios esté limitado a pruebas. Hallazgos H-016 y H-017.

## Opciones (si existen)

1. El equipo, mediante datos o archivos de configuración del entorno; sin interfaz de producto.
2. Un rol nuevo — exigiría cambiar el contexto 2.3.

## Propuesta del agente (PROPUESTA)

Opción 1, para no añadir un rol. Nunca se trata como decisión.

## Respuesta del equipo

Respondida con DEC-P36 (docs/decisiones.md), 2026-11-01. Fuente: PHARMA_EXPRESS_SPEC-1.md: SPEC-08 sección 4, HU-24, flujo principal, RF-83, AC-66, DEC-05, DEC-30, DEC-41.
