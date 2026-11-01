# Ejecuciones (RUN)

Un archivo JSON por ejecución: `RUN-<fecha>.json`.

- Lo escribe B4 (suite de módulo) y R1 (humo, con su propio formato).
- No se sobrescribe: si el nombre existe, agrega `_2`, `_3`.
- Contiene id de prueba, estado, duración, mensaje y clasificación.
- No inventes duraciones ni mensajes.
- Enmascara datos personales o de salud.

Skill: `registro-de-ejecucion`.
