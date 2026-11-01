# Casos de prueba (S2)

Un archivo por caso o por grupo coherente: `TC-xxx.md`.

Cada caso incluye:

- `Origen: SPEC-00x/AC-00y`
- `REQ del MVP`
- Técnica de diseño y justificación.
- Oráculo: `definitivo` o `supuesto`.
- Precondiciones, pasos, datos sintéticos y resultado esperado.
- Casos negativos, de límite y de concurrencia cuando apliquen.

Reglas:

- Un TC sin AC no existe.
- Datos sintéticos; nunca nombres reales de medicamentos, diagnósticos ni cédulas.
- Incluye al menos un caso que verifique que ningún mensaje ni log nombra un medicamento.
- No escribas pruebas ejecutables aquí: eso es S3.

Skills: `tecnicas-de-diseno-de-casos`, `politica-de-oraculos`, `matriz-de-trazabilidad`.
