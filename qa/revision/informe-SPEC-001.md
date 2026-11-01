# Informe de revisión — SPEC-001

Fecha: 2026-10-31
Revisor: S1 (prueba estática)
Veredicto: APTA
Lint previo: Sin hallazgos bloqueantes. 1 aviso mecánico (tipo `limite`): el límite «9 minutos» de CL-003 no tiene un AC que lo mencione literalmente; el AC-009 lo cubre con «10:09:59» y «10:10:00». Definiciones revisadas: RF 11, BR 5, RNF 2, CL 4, AC 13.
SPEC revisada: agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.1.md (versión 1.1, estado Aprobada y congelada; EPIC-001; módulo `identidad`).
MVP: Dentro del Debe

## Resumen (3 líneas)

La SPEC-001 versión 1.1 («Consentimiento, identidad y derechos del titular»), en estado Aprobada y congelada, revisada en esta ronda para el módulo `identidad`, corrigió los hallazgos H-001 a H-005 del informe previo (v1.0, veredicto NO_APTA) incorporando el caso de éxito de la verificación con código válido (SPEC-001/AC-004), la semántica del límite de los 10 minutos (CL-003 / SPEC-001/AC-009), la semántica de los 3 intentos (BR-005 / CL-004), las excepciones de consulta en la EPS simulada y de envío de SMS/correo (RF-010 / RF-011, E4 / E5, SPEC-001/AC-012 / SPEC-001/AC-013) y la sección de estados y transiciones (7.2), con la trazabilidad corregida en la sección 16.

El lint previo no reportó hallazgos bloqueantes: las RF-001 a RF-011 tienen AC asociado, las AC-001 a AC-013 siguen el formato Dado/Cuando/Entonces y no hay AC huérfanos.

La revisión de juicio de esta ronda no detectó hallazgos bloqueantes; el único hallazgo registrado es el aviso menor del lint sobre el límite «9 minutos» (H-001), dado que CL-003 y SPEC-001/AC-009 cubren el caso de debajo, en el límite y por encima.

## Hallazgos

| id | Severidad | Tipo | Cita literal | Problema | Pregunta sugerida | Bloquea |
|----|-----------|------|--------------|----------|-------------------|---------|
| H-001 | menor | completitud | «CL-003. Ingreso de código en el límite de tiempo de 10 minutos: un código correcto ingresado a las 9 minutos y 59 segundos es validado exitosamente; si se ingresa a las 10 minutos exactos (10m 00s) o después, el sistema lo rechaza por expiración y despliega la ruta alternativa.» | El lint reportó el límite «9 minutos» sin un AC que lo mencione literalmente; el caso de debajo, en el límite y por encima quedó cubierto por CL-003 y SPEC-001/AC-009 («10:09:59» / «10:10:00»), por lo que el aviso es de cobertura mecánica de la herramienta, no del criterio de la SPEC. | — | no |

## Valores límite revisados

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| 10 minutos (vigencia del código) | 9:59:59 → el código correcto se valida (CL-003; SPEC-001/AC-009) | 10:00:00 → se rechaza, se inactiva y se despliega la ruta alternativa (CL-003; SPEC-001/AC-009) | 10:10:00 o posterior → se rechaza por expirado (SPEC-001/AC-009) | Cumple |
| 3 intentos (ingreso del código) | Intento 1 o 2 fallido → reintento con intentos restantes (BR-005; SPEC-001/AC-010) | 3er intento fallido → inactivar código y ruta alternativa (BR-005; CL-004; SPEC-001/AC-011) | Intento posterior sobre código inactivo → rechazado (CL-004) | Cumple |

Nota: los valores 30 unidades, 48 horas y 90 días corresponden a otros módulos (prevalidación, reservas, notificaciones) y quedan fuera del alcance de esta revisión.

## Preguntas creadas

- Ninguna en esta ronda. La ambigüedad sobre el instante de vencimiento del código quedó respondida por el equipo (DEC-01 → OPEN-Q-001) y codificada en la SPEC-001 v1.1 (CL-003 / SPEC-001/AC-009); queda registrada en `docs/preguntas/PREG-001.md`.

## Criterios

- Verificabilidad: cumple. Las AC-001 a AC-013 se revisaron: formato Dado/Cuando/Entonces ✓ y observación concreta pasa/no. El caso de éxito de la verificación quedó cubierto por SPEC-001/AC-004 (RF-004 / BR-002).
- No ambigüedad: cumple. Sin términos vagos en RF/BR/RNF/CL/AC; límites y semántica explícitos (BR-005, CL-003, CL-004, SPEC-001/AC-009).
- Completitud: cumple. Estados y transiciones (7.2), flujos alternativos (A1, E1-E5), casos límite (CL-001 a CL-004) y excepciones de dependencia (RF-010 / RF-011).
- Consistencia: cumple. DEC-01 a DEC-03, OPEN-Q respondidas y mapeo RF/BR/AC de la sección 16 alineado.
- Trazabilidad: cumple. Cada RF/RF-00x tiene ≥1 AC; cada AC apunta a un RF/BR; estados y límites con sus verificadores.

## Veredicto

- `APTA`: no hay hallazgos bloqueantes; S2 puede empezar.
- Con el hallazgo H-001 (menor, no bloqueante) y el aviso del lint, el veredicto de esta ronda para la SPEC-001 (módulo `identidad`) es **APTA**.

Al terminar, devuelve a la conversación: veredicto, número de hallazgos por severidad, PREG creadas y ruta del informe.

- Veredicto: APTA
- Hallazgos: 1 (H-001, severidad menor; bloqueante: no).
- PREG creadas: ninguna.
- Ruta del informe: `/home/camila-giraldo/SW3/pharma_express/PharmaExpress/qa/revision/informe-SPEC-001.md`
