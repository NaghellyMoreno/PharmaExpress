# Oráculos pendientes de aprobación humana

S2 agrega aquí cada oráculo marcado `supuesto`. Una persona lo aprueba o lo corrige antes de que S3 escriba la prueba.

| TC | AC | Resultado esperado | Origen del dato | Propuesta de S2 | Decisión humana | Estado |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | pendiente |

## Módulo identidad — diseño S2 (2026-10-31)

Con la revisión `APTA` de la SPEC-001 v1.1 y el diseño de los casos `TC-001` a `TC-014` (módulo `identidad`):

- Oráculos usados: todos `definitivo`. Origen del dato: `CONFIRMADO` (contexto de la SPEC) o `APROBADO` (DEC-01, DEC-02, DEC-03).
- Oráculos `supuesto`: ninguno en esta ronda; los TCs diseñados no requieren dato por inferir.
- `REQ-009` (Aislamiento de identidad de los canales): `Debe` sin AC verificable (`PROPUESTA`, pendiente de SPEC EPIC-002). No se diseñó caso: se generó la `PREG-002`.

La tabla anterior se mantiene para los oráculos que S2 marque `supuesto` en futuras rondas.

## Reglas

- Un oráculo `supuesto` no se convierte en prueba hasta que esté aprobado o declarado como límite conocido.
- Si se aprueba, cambia a `definitivo` y S3 puede escribir la aserción normal.
- Si se corrige, actualiza el TC antes de generar la prueba.
- Si se rechaza, crea o actualiza la `PREG` correspondiente.
- No calcules el valor esperado a partir del código bajo prueba.
