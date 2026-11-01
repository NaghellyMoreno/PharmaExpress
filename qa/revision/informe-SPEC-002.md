# Informe de revisión — SPEC-002

Fecha: 2026-11-01
Revisor: S1 (prueba estática, revisión corta de los cambios de v1.11)
Veredicto: APTA_CON_RESERVAS
Lint previo: `python qa/scripts/lint_spec.py` (PYTHONUTF8=1) sobre v1.11: RF 13, BR 5, RNF 2, CL 4, AC 32. Sin hallazgos mecánicos. El lint no detecta contradicciones entre AC ni entre SPEC.
SPEC revisada: agentes-ia/salidas/specification-agent/borradores/SPEC-002/SPEC-002_v1.11.md (versión 1.11, estado Candidata). Revisión corta: solo el diff frente a v1.10; los demás hallazgos se conservan de las revisiones anteriores. Coherencia contrastada con SPEC-003_v1.12.md, SPEC-008_v1.9.md y SPEC-001_v1.1.md (aprobada).
MVP: parcial. Dentro del Debe: vinculación, reglas de canal y consulta de prevalidación (REQ-009, REQ-013, REQ-026 y DEC-P01). Fuera: citas y código de entrega (SPEC-004 en evaluación), con severidad máxima `menor`. Las notificaciones salen del MVP por DEC-P45, pero REQ-024 sigue como `Debe` (H-070, PREG-074). `docs/mvp.md` sigue en `borrador`, sin `aprobado_por`.

## Resumen (3 líneas)

La v1.11 resuelve H-082 y H-083: RF-087 aclara la lectura de SPEC-001/AC-007, es coherente con DEC-P57 y no modifica SPEC-001. H-085 se resuelve solo en parte y sigue como menor.
No hay bloqueantes ni altos. Entra 1 nuevo, menor (H-086): la aclaración nombra solo AC-007, y SPEC-001 usa el mismo verbo en sus estados y en el flujo. No hay cambios de fondo fuera del historial.
Total: 54 (0 bloqueantes, 0 altos, 27 medios, 27 menores). S2 puede diseñar lo confirmado. Solo sigue pendiente OPEN-Q-034. No se crearon PREG. La sección «Verificación» de la SPEC no se usó como evidencia.

## Revisión corta de v1.11

La diferencia con v1.10 se revisó línea por línea. Las líneas del historial sin cambio visible en el diff solo cambian el fin de línea.

| id | Severidad en v1.10 | Estado en v1.11 | Evidencia |
|---|---|---|---|
| H-082 | media | resuelto; deja H-086 | SPEC-002/RF-087: «SPEC-001 no cambia: en SPEC-001/AC-007, «solicita» se entiende como la solicitud ya confirmada.» |
| H-083 | menor | resuelto | SPEC-002 §2, DEC-P38: «con la confirmación simple previa de RF-087 (DEC-P57)». SPEC-002/RF-087: «igual a la de desvincular y en la web y la Mini App», como DEC-P57. |
| H-085 | menor | cambió, sigue menor | RF-087 y AC-040 ya están en HU-005, HU-006 y HU-007. Ver su fila. |

### Comprobación de la aclaración sobre SPEC-001/AC-007

- SPEC-001 no se modificó: `SPEC-001_v1.1.md` no tiene cambios en git y su fecha es del 2026-10-31.
- La aclaración es coherente con DEC-P57 («SPEC-002 la define y SPEC-001 no cambia») y con los tres textos: SPEC-002/AC-033 (confirma y se aplica), SPEC-002/AC-040 (no confirma y no se aplica) y SPEC-001/AC-007 (la solicitud ya confirmada elimina los datos).
- No añade ni quita conducta a SPEC-001: su «entonces» no cambia, y solo se fija qué acto de SPEC-002 cuenta como su «cuando». `[INFERIDO]` Es una lectura, no un cambio: si una persona entendiera que altera una SPEC congelada, el texto de SPEC-001 sigue igual y S2 puede probar AC-007 desde la solicitud confirmada.
- SPEC-001/RF-009, RF-010 y AC-012 siguen sin tocar.
- `docs/decisiones.md`, fila DEC-P38, sigue diciendo «con la confirmación de SPEC-001»; DEC-P57 la precisa y §2 ya lleva el texto precisado. Es un dato para quien lleva el registro, no un hallazgo.

### Cambios fuera del historial

- Cambios de fondo fuera del historial: ninguno. El diff coincide con los tres puntos de la petición, y el historial y el Análisis de impacto los recogen.
- «Verificación» no cambió.

### Coherencia entre SPEC-002 v1.11, SPEC-003 v1.12 y SPEC-008 v1.9

- Revocación: SPEC-002/RF-087 y AC-033, SPEC-001/RF-009 y SPEC-008/AC-054 encajan de punta a punta.
- Sin choques nuevos: los cambios de SPEC-003 y SPEC-008 ocurren dentro de la Mini App o en sus datos y no tocan reglas de SPEC-002. H-025 sigue.

## Revisión corta de v1.10

La diferencia con v1.9 se revisó línea por línea. Las líneas del historial sin cambio visible en el diff solo cambian el fin de línea.

| id | Severidad en v1.9 | Estado en v1.10 | Evidencia |
|---|---|---|---|
| H-068 | alta | resuelto | SPEC-002 §3: «AC-023 y AC-021 en lo que toca a notificaciones». SPEC-002/AC-039 cubre la plantilla, trazado a RF-085 y BR-008. Deja H-084. |
| H-071 | media | resuelto | SPEC-002/BR-007: «La máscara de BR-009 no se considera información (DEC-P48).» La frase no está en DEC-P48 de §2 ni en «Contradicciones detectadas»; lo segundo sigue en H-045. |
| H-072 | media | resuelto | SPEC-002/RNF-009: «Con vinculación vigente aplica DEC-P22.» Su método y §16 citan AC-022 y AC-032. La excepción vigente la prueba AC-024, que no se cita; no cambia el resultado. |
| H-074 | media | resuelto por DEC-P57 | SPEC-002/RF-087, AC-033 y AC-040. PREG-075 respondida. Deja H-082 y H-083. |
| H-038 | menor | resuelto | SPEC-002/A1: «por SMS y, si existe, correo». «SMS/correo» ya solo aparece en la cabecera y en el historial e impacto. |

### Comprobaciones pedidas

- DEC-P57: aplicada en §2, RF-087, AC-040 y §16. AC-033 ya tiene un RF que define «lo confirma».
- RF-087 y SPEC-001: SPEC-001 no se modifica y DEC-P57 lo autoriza. Pero SPEC-001/AC-007 dice «cuando solicita la revocación [...] entonces el sistema elimina», y su estado cambia «al solicitar». AC-040 dice «solicita revocar y no confirma [...] no aplica». Encajan solo si la solicitud de SPEC-001 es la ya confirmada (H-082). No hay contradicción de regla y no hace falta PREG.
- SPEC-001/RF-009, RF-010 y AC-012 no se tocan.
- §3: AC-012 y AC-023 no cambian de estado; AC-021 pasa a aplazado solo en parte.

### Ajustes de edición y cambios no listados

- Ajuste anotado: DEC-P48, una línea de impacto y una palabra en inglés. Frente a v1.9, esos textos son idénticos: el ajuste solo deshace lo que tocó el generador.
- Cambios de fondo fuera del historial: ninguno. H-085 recoge los de forma.

### Coherencia entre SPEC-002 v1.10, SPEC-003 v1.11 y SPEC-008 v1.8

- Revocación: SPEC-002/RF-087 y AC-033, SPEC-001/RF-009 y SPEC-008/AC-054 encajan, y AC-054 ya cubre todo evento. Falta la lectura de H-082.
- Fallas de fuentes: DEC-P53 deja intacta SPEC-001/RF-010 y SPEC-002 no la toca.
- Mensajes del chat: SPEC-003 no añade plantillas de chat; AC-039 es la única prueba activa de la del archivo.
- DEC-P54, DEC-P55 y DEC-P56 ocurren dentro de la Mini App y no cambian reglas de SPEC-002.
- H-025 sigue: «paciente seleccionado» frente a «paciente validado».

## Revisión corta de v1.9

| id | Severidad en v1.8 | Estado en v1.9 | Evidencia |
|---|---|---|---|
| H-006 | alta (no contada) | resuelto por DEC-P37 y DEC-P52 | SPEC-002/RF-013, AC-031 y AC-032. |
| H-008 | alta (no contada) | resuelto por DEC-P44 | SPEC-002/RF-085 y AC-035. |
| H-011 | alta (no contada) | resuelto por DEC-P38 | SPEC-002/AC-033. Deja H-074 y H-075. |
| H-012 | alta (no contada) | resuelto por DEC-P45 | SPEC-002 §3. Deja H-068, H-069 y H-070. |
| H-014 | media | resuelto por DEC-P46 | SPEC-002, flujo paso 7, y AC-036. |
| H-017 | alta | resuelto por DEC-P48 | SPEC-002/RF-016 y AC-038. Deja H-071. |
| H-051 | alta | resuelto por DEC-P47 | SPEC-002/RF-086 y AC-037. SPEC-001 no cambia. |
| H-054 | media | resuelto por DEC-P40 | SPEC-002/RF-012 y AC-034. |
| H-064 | alta | resuelto por DEC-P39 | SPEC-002/RF-013, paso 3 y AC-022. «Nunca estuvo vinculado» solo queda en el historial y en citas. |
| H-066, H-067 | menor | cambiaron | Ver sus filas. |

PREG-002 está respondida por DEC-P29. H-009 sigue en OPEN-Q-034 y PREG-034.

### Comprobación por decisión

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P29 | RNF-009 | Texto aplicado; sin oráculo propio (H-072). |
| DEC-P37, DEC-P52 | RF-013, AC-031, AC-032 | Bien aplicadas. Ver H-080. |
| DEC-P38 | AC-033 | Aplicada, pero RF-011 no la recoge y la confirmación no existe en SPEC-001 (H-074, H-075, H-077). |
| DEC-P39 | RF-013, paso 3, AC-022 | Bien aplicada. Ver H-079. |
| DEC-P40 | RF-012, AC-034 | Bien aplicada. Ver H-073 y H-078. |
| DEC-P44 | RF-085, AC-035 | Bien aplicada; BR-008 y A2 no la recogen (H-077). |
| DEC-P45 | §3 | Aplicada en exceso en AC-021 (H-068) y solo en §3 (H-069). |
| DEC-P46 | Paso 7, AC-036 | Bien aplicada. Ver H-073 y H-077. |
| DEC-P47 | RF-086, AC-037 | Bien aplicada. |
| DEC-P48 | RF-016, AC-038 | Bien aplicada; falta la frase de la máscara (H-071). |

### Comprobaciones pedidas

- SPEC-002/RF-013 y paso 3: «no existe vinculación activa ni vencida» reemplaza a «nunca estuvo vinculado», como pide DEC-P39, y ya no hace falta conservar rastro. Sigue H-018: el sistema no conoce al paciente antes de la cédula. Ver H-079.
- SPEC-002/AC-022: conserva el resto del texto y cubre desvinculación y revocación.
- Vinculación desvinculada o revocada frente a DEC-P26: coherente. DEC-P26 reserva el solo código a la vinculación vencida, y RF-015, BR-007, A1 y AC-010 no cambiaron. Tras desvincular o revocar no hay vinculación, así que aplica «vinculación nueva». Una vencida que se desvincula pasa a nueva; si eso se permite sin código sigue en H-047.
- SPEC-002/AC-031 y AC-032: no chocan con AC-010, porque un chat con vinculación vencida sí tiene vinculación. AC-032 y AC-022 casi se repiten; no hace falta cambiarlo.
- SPEC-002/AC-033: su oráculo funciona, salvo el sentido de «lo confirma» (H-074).
- SPEC-002/AC-034, AC-035, AC-036 y AC-037: textos iguales a lo pedido. AC-037 no dice si la aceptación sin ligar sirve para reintentar la cédula; es una duda menor y no se cuenta aparte.
- SPEC-002/AC-038: coincide con DEC-P26 y DEC-P48.
- SPEC-002/RF-086: cumple DEC-P47 y deja intacta SPEC-001/RF-002. La fila DEC-P27 de `docs/decisiones.md` todavía cita SPEC-001/RF-001 y RF-002, aunque DEC-P47 la retira. Es un dato para quien lleva el registro.

### Aplazamiento por DEC-P45

| AC | ¿Depende de notificaciones? | Estado |
|---|---|---|
| SPEC-002/AC-023 | Sí, por completo | Bien aplazado. |
| SPEC-002/AC-012 | Solo en «cesan las notificaciones» | Bien aplazado en parte: lo demás se sigue probando. |
| SPEC-002/AC-021 | Solo en parte: el MVP conserva la respuesta de RF-085, que DEC-P45 dice que no es notificación | Mal aplazado (H-068). La revisión de v1.8 ya advertía que «RF-085 sí genera un aviso». |

Efecto en REQ-024: sí lo afecta. Su AC propuesto empieza en un «evento de agendamiento o cancelación» y DEC-P45 dice que el MVP no tiene notificaciones, pero REQ-024 sigue como `Debe` (H-070, PREG-074).

### Decisiones frente al contexto y SPEC-001

Se señalan sin reabrirlas:

- DEC-P48 frente al contexto 3.3 («no muestra información»): H-071.
- DEC-P38 frente a SPEC-001/RF-008 («el titular con identidad verificada»): H-075.
- DEC-P38 cita una confirmación que SPEC-001 no define: H-074.
- DEC-P45 frente a SPEC-001, flujo principal, paso 13: H-076.
- DEC-P46 no choca con SPEC-001/RF-007 ni AC-005: la autorización se sigue exigiendo antes de la primera carga.
- DEC-P47 no choca con SPEC-001/RF-002: ambas registran la aceptación, y SPEC-002 solo añade el vínculo.

### Coherencia entre SPEC-002 v1.9, SPEC-003 v1.10 y SPEC-008 v1.7

- Autorización de datos de salud: SPEC-003/RF-021, flujo paso 1 y sección 2 dicen lo mismo que SPEC-002, flujo paso 7 y AC-036 (DEC-P46).
- Revocación: SPEC-002/AC-033, SPEC-001/RF-009 y SPEC-008/AC-054 encajan, salvo la confirmación (H-074) y los eventos distintos de los de prevalidación (SPEC-008/H-059).
- Vinculación: SPEC-003, sección 2, sigue coherente con DEC-P26 y no contradice DEC-P39; solo nombra la Mini App (SPEC-003/H-063).
- Motivo sin resultado: SPEC-002/AC-016 sigue sin decir qué se consulta de una fórmula sin resultado (H-022). DEC-P43 lo hace más simple: no hay estado que consultar.
- Paciente seleccionado frente a paciente validado: sigue H-025.
- DEC-P45 no toca reglas de SPEC-003 ni de SPEC-008 activas.
- Ningún id nuevo choca en la misma SPEC. RF-086 y SPEC-008/AC-053 y AC-054 no se repiten en otras SPEC. Los AC siguen repitiéndose entre SPEC, así que deben citarse con calificador.

### Ajustes de edición, cambios no listados y Análisis de impacto

- Ajuste anotado: DEC-11, DEC-12 y la nota de v1.8. Frente a v1.8, los textos son idénticos: el ajuste solo deshace lo que tocó el generador.
- Verificación: quedó en «parcial» donde corresponde y ya no nombra PREG-002. Quedan los dos «cumple» de H-066.
- Cambios de fondo no listados: ninguno. H-077 y H-081 recogen los de forma.
- Análisis de impacto: desde v1.7 esta sección solo lista los cambios de cada versión, así que perder las líneas de v1.8 no importa. Ninguna regla depende de ellas y el historial las conserva. Se menciona en H-081.


## Revisión corta de v1.8

| id | Severidad en v1.7 | Estado en v1.8 | Evidencia |
|---|---|---|---|
| H-056 | media | resuelto | «Preguntas de aclaración» usa OPEN-Q-030 a OPEN-Q-032 con el texto anterior. §15 añade «OPEN-Q-030: Respondida (DEC-P25)», «OPEN-Q-031: Respondida (DEC-P26)» y «OPEN-Q-032: Respondida (DEC-P27)» y conserva OPEN-Q-001 a OPEN-Q-003 con DEC-10 a DEC-12, que es lo que citan §2 y el historial de v1.0. |
| H-065 | menor | resuelto | §16, fila RF-013: «verificado por AC-010, AC-014, AC-022, AC-024, AC-025, AC-029, AC-030.» |
| H-058 | menor | resuelto | SPEC-002/AC-026: «cuando el usuario interactúa a las 23:59:59 hora de Colombia». Es la única mención de esa hora en un AC. |
| H-038 | menor | cambió | §2 y paso 3: «SMS y, si existe, correo», igual que SPEC-001/RF-004. A1 sigue con «SMS/correo». |
| H-014, H-017, H-051, H-054 y H-064 | media y alta | siguen, con OPEN-Q | OPEN-Q-038, 060, 061, 062 y 070 están en «Preguntas de aclaración» y en §15, con `Crítica: no`, `Estado: Pendiente` y `Responsable: equipo`, y con la pregunta de cada PREG. Registrarlas no resuelve el hallazgo. |

Comprobaciones pedidas:

- RF-013 no aparece en el diff de requisitos; solo cambia su fila de traza (H-065). El paso 3 solo cambia la redacción del envío del código y conserva «nunca estuvo vinculado», que depende de PREG-070.
- Ninguna corrección decide una PREG abierta: OPEN-Q-038, 060, 061, 062 y 070 siguen pendientes, y los hallazgos H-017, H-051, H-054 y H-064 conservan su texto.
- Ajuste de edición anotado: «se restauró el origen de DEC-P01». Frente a v1.7 la línea es idéntica, así que el ajuste solo deshace lo que tocó el generador.
- Cambios no listados: los de H-067, y además cabecera, título y la línea de impacto de la versión. Ninguno es de fondo.
- Convención: H-017, H-051 y H-064 siguen contados en la tabla, aunque ya tengan OPEN-Q, para no cambiar el conteo por una razón de forma.

## Revisión corta de v1.7

| id | Severidad en v1.6 | Estado en v1.7 | Evidencia |
|---|---|---|---|
| H-002 | bloqueante | resuelto | SPEC-002/AC-022: «Dado un chat de Telegram que nunca estuvo vinculado con el paciente». SPEC-002/RF-013: «exige únicamente un código nuevo si la vinculación está vencida». El paso 3, el Objetivo y el Alcance dicen lo mismo. Ya no chocan con SPEC-002/AC-010, RF-015, BR-007 ni A1, y cumplen DEC-P26. DEC-P22 sigue cumpliéndose con vinculación vigente (SPEC-002/AC-024). La acotación «nunca estuvo vinculado» abre H-064. |
| H-049 | alta | resuelto fuera de esta SPEC | SPEC-003 v1.8, §2 y DEC-P10: «La Mini App exige cédula y código para una vinculación nueva; una vinculación vencida se reactiva solo con código nuevo (DEC-P22, DEC-P26)». El Análisis de impacto dice lo mismo y ya no aparece la frase citada de v1.7. Coincide con SPEC-002/AC-010. |
| H-050 | alta | resuelto | SPEC-002/AC-029 y AC-030: «autorizar el tratamiento de datos de salud (SPEC-001/RF-007), cargar los documentos». El orden cumple SPEC-001/RF-007 y SPEC-001/AC-005, y una construcción sin la autorización ya no pasa esos AC. SPEC-002/flujo paso 7 sigue sin mencionarla (H-014), y PREG-038 sigue abierta. |

Resultado del cambio: dos hallazgos nuevos, H-064 y H-065. DEC-P27 no cambia: SPEC-002/AC-028 sigue coherente con la reactivación descrita en v1.7.

Los hallazgos de la tabla se conservan como estaban. H-018 y H-024 citaban texto del paso 3 de v1.6; en la revisión de v1.9 sus citas se actualizaron al texto vigente.

## Estado de los bloqueantes y altos anteriores (de v1.4 a v1.6)

| id | Severidad en v1.4 | Estado | Severidad en v1.6 | Evidencia en v1.6 |
|---|---|---|---|---|
| H-001 | bloqueante | resuelto | — | SPEC-002/RF-014, BR-005, A1, CL-008, AC-009, AC-020 y AC-026 aplican DEC-P25. Residuo menor en H-058 y H-059. |
| H-002 | bloqueante | sigue | bloqueante | DEC-P26 está en SPEC-002/RF-015, BR-007, CL-007, A1 y AC-010. No está en SPEC-002/AC-022, RF-013, flujo paso 3, Objetivo ni Alcance. |
| H-003 | bloqueante | resuelto | — | SPEC-002/RF-012, flujo paso 2, AC-019, AC-027 y AC-028 aplican DEC-P27. Abre H-051, H-053 y H-054. |
| H-004 | alta | cambió | media | A1 ya no dice «enviando», pero «solicitando» no aclara si el envío es automático. |
| H-005 | alta | cambió | media | SPEC-002/AC-029 y AC-030 cubren del aviso al resultado por canal. Falta paridad explícita de desvinculación y revocación. |
| H-006 | alta | sigue | alta (no contada) | Pendiente en OPEN-Q-033, PREG-033. |
| H-007 | alta | resuelto | — | SPEC-002/RF-012, BR-008 y AC-021 prohíben medicamentos y diagnósticos. |
| H-008 | alta | sigue | alta (no contada) | Pendiente en OPEN-Q-035, PREG-035. |
| H-009 | alta | sigue | alta (no contada) | Pendiente en OPEN-Q-034, PREG-034. |
| H-010 | alta | cambió | media | SPEC-002/RF-013 y AC-025 cubren la vinculación nueva. Falta la reactivación fallida. |
| H-011 | alta | sigue | alta (no contada) | Pendiente en OPEN-Q-036, PREG-036. |
| H-012 | alta | sigue | alta (no contada) | Pendiente en OPEN-Q-037, PREG-037. |

Los ids anteriores se conservan; los hallazgos nuevos empiezan en H-049. Las cinco filas «no contadas» citan una PREG existente y no aparecen de nuevo en la tabla de hallazgos.

## Hallazgos

Salvo indicación, los identificadores sin prefijo de la columna Problema son de SPEC-002. «INFERIDO» marca una conclusión del revisor; lo demás se apoya en la cita.

| id | Severidad | Tipo | Cita literal | Problema | Pregunta sugerida | Bloquea |
|----|-----------|------|--------------|----------|-------------------|---------|
| H-004 | media | ambigüedad | SPEC-002/A1: «solicitando únicamente un nuevo código de verificación por SMS y, si existe, correo sin exigir cédula» | No se sabe si el SMS sale solo al detectar el intento o si la persona debe pedirlo. Si sale solo, abrir un canal vencido dispara un SMS al paciente (T-023). RF-015, DEC-12 y AC-010 no lo aclaran. | Alinear A1, RF-015 y AC-010 con DEC-12 y decir qué acción dispara el envío | no |
| H-005 | media | trazabilidad | «RF-011: Origen: contexto 3.1, necesidad, DEC-P01, DEC-P10, DEC-P38, DEC-P46; verificado por AC-017, AC-029, AC-030, AC-033, AC-036.» | Cambió en v1.9: AC-033 cubre la revocación con vinculación vigente. Sigue sin paridad explícita: AC-012 y AC-033 dicen «canal» sin nombrar web y Mini App, AC-029 y AC-030 terminan en el resultado preliminar, y SPEC-001/AC-007 no está trazado a RF-011. | Exigir desvinculación y revocación en web y Mini App | no |
| H-010 | media | completitud | SPEC-002/AC-025: «en el flujo de vinculación, cuando el sistema valida la entrada, entonces rechaza la autenticación y no crea ni registra ninguna vinculación en el canal» | Queda sin cubrir la reactivación: con código errado, vencido o agotado, la vinculación debe seguir vencida y debe ofrecerse la ruta de SPEC-001/RF-006. | Añadir AC negativo de reactivación | no |
| H-013 | media | consistencia | SPEC-002/AC-022: «aunque Telegram envíe los datos del usuario» | Telegram entrega nombre e identificador antes de aceptar el aviso. SPEC-001/BR-001 prohíbe registrar datos personales sin aceptación. Falta decir que no se conservan antes de aceptar ni tras el rechazo. | ¿Qué se puede retener antes de la aceptación? | no |
| H-015 | media | trazabilidad | SPEC-002/RF-012: «El bot de Telegram solo debe interactuar después de que la persona lo inicie de manera voluntaria» | Ninguno de los AC trazados (AC-019, AC-021, AC-027 y AC-028) comprueba esa condición (contexto 3.1). | Añadir AC del caso | no |
| H-016 | media | completitud | SPEC-002/AC-010: «entonces el sistema muestra el aviso de vencimiento e inicia de inmediato el flujo de código nuevo» | Ya cubre gestiones, pero no afirma que no se muestra información. AC-026 solo dice que «bloquea la gestión». | Agregar el resultado negativo a AC-010 | no |
| H-018 | media | completitud | Flujo principal, paso 3: «si se trata de una vinculación nueva porque no existe vinculación activa ni vencida con ese paciente, incluida la desvinculación y la revocación (DEC-P39), la persona ingresa su número de cédula» | El sistema no conoce al paciente hasta recibir la cédula. Falta la acción de agregar otro paciente, qué pasa si la cédula ya tiene vinculación vigente y si se puede renovar antes de vencer. | ¿Se puede renovar antes del vencimiento? | no |
| H-019 | media | completitud | SPEC-002/RF-015: «Cuando un canal intente realizar una gestión o consulta utilizando una vinculación vencida» | Falta la gestión en curso cuando la vinculación vence, se desvincula o se revoca desde otro canal. DEC-P25 lo vuelve concreto: una carga iniciada a las 23:59 cruza las 00:00. | ¿Qué ocurre con la gestión en curso? | no |
| H-020 | media | ambigüedad | SPEC-002/RF-016: «durante toda la gestión»; SPEC-002/AC-011: «durante toda la sesión»; SPEC-003, Modelo de dominio: «gestionados en una misma sesión» | «Gestión» y «sesión» no están definidas y se usan como si fueran lo mismo. No se sabe si consultar y luego cargar exige seleccionar dos veces. | Definir «gestión» | no |
| H-021 | media | completitud | SPEC-002/RF-016: «Si un canal tiene más de un paciente vinculado» | Con un solo paciente, ningún RF ni AC exige mostrar la máscara, aunque DEC-P20 y BR-009 son generales. | ¿La máscara se muestra también con un paciente? | no |
| H-022 | media | completitud | SPEC-002/AC-016: «entonces el sistema muestra el estado preliminar de las fórmulas registradas con paridad en ambos canales» | No exige la leyenda del contexto 3.4 ni motivo y siguiente paso (SPEC-003/RF-027). «Registradas» no está definido. Faltan el caso sin resultados y el de SPEC-003/AC-032. | ¿Qué estados muestra la consulta y por cuánto tiempo? | no |
| H-023 | media | completitud | SPEC-002/AC-012: «cesan las notificaciones por esa vía y las prevalidaciones o registros del paciente permanecen intactos» | AC-012 no comprueba que SMS y correo sigan (RF-020) ni el efecto limitado a ese paciente y canal (BR-006). Tampoco hay caso de rechazar la confirmación. | Ampliar AC-012 | no |
| H-024 | media | completitud | Flujo principal, paso 3: «si ya cuenta con vinculación vigente, la Mini App no exige un código nuevo.» | La web con o sin vinculación vigente no tiene el AC equivalente a AC-022 y AC-024, aunque REQ-009 cubre ambos canales. Tampoco hay regla para cookies borradas o navegador compartido. | Añadir AC equivalentes para web | no |
| H-025 | media | consistencia | SPEC-003/BR-013: «Está registrada a nombre del paciente validado»; SPEC-002/RF-016: «la selección explícita del paciente a gestionar» | En un canal múltiple debe ser el paciente seleccionado (INFERIDO). Falta el caso de una fórmula de otro paciente del mismo canal. | Unificar el término en SPEC-002 y SPEC-003 | no |
| H-027 | media | completitud | SPEC-002/RF-085: «fotos ni documentos enviados como mensajes de archivo o imagen» | No cubre texto libre, voz, video ni comandos. Alguien podría escribir su cédula o un diagnóstico en el chat. | ¿Qué responde el bot a cualquier otro mensaje? | no |
| H-028 | media | completitud | §12: «Funcionalidad de agendamiento (SPEC-004), actualmente en evaluación para el MVP (DEC-P01).» | §12 omite Telegram, del que depende la SPEC. No hay flujo si Telegram falla, si la Mini App no abre o si el dispositivo no da acceso a cámara o archivos. | ¿Qué se orienta si falla? | no |
| H-029 | media | verificabilidad | SPEC-002/AC-017: «la aplicación se adapta responsivamente» | No hay tamaños, navegadores ni condición de uso, mientras SPEC-003/RNF-010 sí nombra navegadores y sistemas. | Fijar tamaños y navegadores, alineados con SPEC-003/RNF-010 | no |
| H-030 | media | trazabilidad | SPEC-002/RF-019: «exigiendo una confirmación simple antes de proceder. Origen: DEC-11.» | T-014 sigue parcialmente abierto: DEC-10 a DEC-12 no están en `docs/decisiones.md`, que los deja «solo como historial», y DEC-12 significa otra cosa en SPEC-003. RF-019 y RF-020 solo se apoyan en esos ids. | Registrarlas como `DEC-Pxx` | no |
| H-031 | media | consistencia | SPEC-007/AC-033: «cuando transcurren más de tres meses desde la vinculación» | T-016 sigue abierto: SPEC-007 v1.0 duplica la vinculación sin DEC-P21, DEC-P22, DEC-P25 ni DEC-P26. SPEC-002 no se declara dueña única. | ¿Quién es dueña de la vinculación? | no |
| H-032 | media | consistencia | SPEC-002/RF-014: «a los 3 meses calendario»; `propuesta-tecnologica.md`: «Cookie httpOnly · token de 90 días» | La propuesta tecnológica y el plan siguen con 90 días. Una construcción fiel a ellos falla AC-020 y AC-026. No es defecto de la SPEC. | Actualizar propuesta y plan | no |
| H-052 | media | verificabilidad | SPEC-002/AC-030: «cuando realiza el recorrido completo, entonces el sistema le permite de forma observable» | AC-029 y AC-030 no fijan la precondición (canal sin vinculación, paciente apto) ni qué se observa en cada paso. «De forma observable» no es un oráculo y «le permite» no comprueba el resultado final. | Fijar precondición y resultado por paso | no |
| H-053 | media | completitud | SPEC-002/AC-027: «entonces el sistema exige presentar y aceptar el aviso de privacidad antes de solicitar la cédula del segundo paciente» | Falta el rechazo: según SPEC-001/RF-003 no se registra nada, pero no se dice si sigue operando la vinculación del primer paciente (INFERIDO: debería seguir, por BR-006). | Añadir AC de rechazo | no |
| H-055 | media | completitud | SPEC-002/RF-014: «a los 3 meses calendario de haber sido establecida o renovada» | Ningún AC comprueba que reactivar reinicie el plazo desde esa fecha. AC-028 solo cubre el aviso. | Añadir AC del nuevo plazo | no |
| H-069 | media | completitud | SPEC-002/RF-020: «deteniendo las notificaciones por dicho canal». SPEC-002/BR-007: «la recepción de notificaciones en ese canal». SPEC-002 §16: «BR-007: Origen: contexto 3.3, DEC-12, DEC-P26, DEC-P48; verificado por AC-010, AC-023, AC-026, AC-028, AC-038.» | Nuevo en v1.9. DEC-P45 nombra RF-012, RF-020 y BR-007, pero solo cambió §3. Los RF y BR, RF-011, BR-006, E1 y CL-007 siguen hablando de notificaciones en presente. Los AC aplazados no tienen marca en §11 ni en §16, así que S2 no los distingue sin leer §3. CL-007 queda verificado en parte por un AC aplazado. | Marcar lo aplazado en §11, §16 y los RF y BR afectados | no |
| H-070 | media | consistencia | `docs/mvp.md`: «`REQ-024` (Entrega multicanal transaccional): `Debe`.» SPEC-002 §3: «Sin agendamiento, el MVP no tiene notificaciones». SPEC-002 §12: «Funcionalidad de agendamiento (SPEC-004), actualmente en evaluación para el MVP (DEC-P01).» | Nuevo en v1.9. DEC-P45 sí afecta a REQ-024: su AC propuesto se dispara con un evento de agendamiento o cancelación, que no existe en este alcance, y DEC-P01 no lo lista en evaluación. Lo mismo alcanza a REQ-004, a parte de REQ-008 y al módulo `notificaciones` del corte técnico. SPEC-002 §12 no lista SPEC-005 aunque aplaza AC hasta ella. | Ver `docs/preguntas/PREG-074.md` | no |
| H-073 | media | completitud | SPEC-002/RF-012: «Tras una desvinculación, volver a vincular exige aceptar otra vez el aviso (DEC-P40).» SPEC-002/AC-036: «Dado un paciente que ya autorizó el tratamiento de datos de salud sin revocarlo». | Nuevo en v1.9. Tras una revocación, AC-022 exige cédula y código, pero ningún AC comprueba que se pida otra vez el aviso y la autorización de datos de salud. INFERIDO: se piden, por DEC-P39, DEC-P40 y DEC-P46, y porque SPEC-001/RF-009 elimina esos datos. | Añadir un AC de volver a vincular tras revocar | no |
| H-075 | media | consistencia | SPEC-002/AC-033: «Dado un canal con vinculación vigente». SPEC-001/RF-008: «permitir que el titular con identidad verificada revoque el consentimiento». | Nuevo en v1.9. Con DEC-P37 y DEC-P38 puede revocar sin código quien use el chat, mientras SPEC-001 dice «el titular» y «con identidad verificada», y su estado «Identidad Verificada» no menciona la vinculación. El contexto 3.3 apoya la decisión, y PREG-036 ya dejó el riesgo a la vista. Se señala y no se reabre. | Anotar en SPEC-002 que la vinculación vigente cuenta como identidad verificada para SPEC-001/RF-008 | no |
| H-034 | menor | completitud | SPEC-002/CL-008: «Vinculación realizada en un día inexistente en el mes de vencimiento» | El año bisiesto quedó cubierto. Falta otro mes de ajuste, como 31 de agosto a noviembre. | Añadir un ejemplo | no |
| H-039 | menor | trazabilidad | SPEC-002/DEC-P10: «Una foto enviada al chat no se procesa. Origen: docs/decisiones.md» | Esa frase no está en la fila DEC-P10 de `docs/decisiones.md`. | Registrarla o citar el origen real | no |
| H-040 | menor | completitud | SPEC-002/BR-009: «(tipo de documento y últimos 4 dígitos de la cédula)» | Fija `CC` pero dice «tipo de documento». No se indica si los menores (contexto 3.3) cambian la máscara. | ¿Solo cédula o también otros documentos? | no |
| H-041 | menor | consistencia | SPEC-002/CL-007: «Intento de consulta o gestión en un canal con vinculación vencida: se suspenden las notificaciones por ese canal» | Parece que la suspensión la causa el intento; según BR-007 la causa el vencimiento. | Corregir redacción | no |
| H-042 | menor | ambigüedad | SPEC-002/RF-020: «Las acciones de no cancelar citas, no anular códigos de entrega y no liberar reservas están condicionadas a la activación» | Fuera del Debe. «Activación» y «aprobación» (§14) no son iguales, y condicionar una negación es confuso. | Unificar | no |
| H-044 | menor | ambigüedad | SPEC-002/RF-017: «ni ningún otro dato sensible en la URL» | Lista abierta. Además, el contexto 3.1 presenta los enlaces como «apoyo opcional» y RF-017 los hace obligatorios. | Lista cerrada y prioridad | no |
| H-045 | menor | consistencia | Sección «Contradicciones detectadas»: «Ninguna.» | Cambió en v1.9. DEC-P10 acota el contexto 3.1 y 3.4, DEC-P26 precisa DEC-P22, y ahora DEC-P48 relee el contexto 3.3 (H-071) y DEC-P45 acota el contexto 3.1 y 3.6. Deberían declararse, como hizo SPEC-003 con DEC-P13. | Registrar | no |
| H-046 | menor | trazabilidad | SPEC-002: «HU-005. Como cuidador»; SPEC-003: «HU-005. Como usuario» | T-019 sigue vigente: mismo id, distinto contenido. AC-009 a AC-013 también se cruzan con SPEC-001 y SPEC-003. | Citar con calificador | no |
| H-047 | menor | completitud | SPEC-002/BR-007: «Una vinculación vencida bloquea la consulta de información, la ejecución de gestiones» | Cambió en v1.9. No se dice si se puede desvincular una vinculación vencida sin código. Tampoco si se puede revocar con ella: SPEC-002/AC-033 solo cubre la vigente. | ¿Se permite? | no |
| H-048 | menor | trazabilidad | «RNF-019: Origen: contexto 3.10, DEC-P10, T-012; verificado con prueba de acceso en navegador móvil sin aviso ni dependencia de instalación local.» | AC-017 verifica RNF-019 pero queda trazado solo a RF-011. AC-023 no apunta a ningún RF, solo a BR-007 y CL-007. | Ajustar sección 16 | no |
| H-057 | menor | trazabilidad | §12: «Servicio simulado de la EPS para consulta de afiliación y fórmulas (SPEC-008).» | §12 no lista SPEC-003, aunque RF-018, AC-016, AC-029 y AC-030 dependen de ella. | Añadir la dependencia | no |
| H-059 | menor | ambigüedad | SPEC-002/BR-005: «es de exactamente 3 meses calendario desde el momento de su verificación» | «Exactamente» y «momento» ya no reflejan DEC-P25, que vence por día. No se dice que la fecha de origen también se tome en hora de Colombia (INFERIDO). | Reescribir por fecha en hora de Colombia | no |
| H-060 | menor | trazabilidad | SPEC-002/AC-013: «no procesa el archivo en el chat y responde con un mensaje que incluye el botón para abrir la Mini App» | Con la redacción de v1.6 duplica casi por completo a AC-018. | Fundir o diferenciar | no |
| H-061 | menor | trazabilidad | SPEC-002/AC-021: «Origen: DEC-P20, DEC-P27, T-027, H-007.» | La prohibición de medicamentos y diagnósticos viene del contexto 3.6, que no se cita. DEC-P27 trata de la aceptación del aviso y un hallazgo no es origen. Lo mismo en RF-012. AC-016 y AC-025 también citan hallazgos como origen. | Corregir origen | no |
| H-062 | menor | trazabilidad | «HU-007: RF-011, RF-012, RF-013, RF-016, RF-085, RF-086, RF-087; BR-008, BR-009; AC-011, AC-013, AC-014, AC-018, AC-021, AC-022, AC-025, AC-027, AC-031, AC-032, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040.» | Sigue, con la cita actualizada a v1.11. La fila del facilitador tiene RF-011 sin AC-029, AC-030 ni AC-033, y omite RF-018 y AC-016. HU-005 a HU-007 no incluyen la reactivación. | Completar sección 16 | no |
| H-063 | menor | consistencia | SPEC-002 §3: «Selección obligatoria del paciente a gestionar previa a cada trámite» | §3 no tiene la condición «más de un paciente» de RF-016 y del contexto 3.3. | Alinear | no |
| H-066 | menor | trazabilidad | SPEC-002, Verificación: «Consistencia con el contexto: cumple.» SPEC-002, Verificación: «Cobertura de AC: cumple. Todos los RF (RF-011 a RF-087) y BR (BR-005 a BR-009) cuentan con criterios de aceptación asociados en la sección 16.» | Cambió en v1.11. Los dos «cumple» siguen sin sostén: el primero no cubre H-075 ni H-086, y el segundo no refleja H-005, H-015 ni H-069. | Pasar ambas a «parcial» | no |
| H-067 | menor | trazabilidad | SPEC-002, Siguiente paso: «Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance.» | Cambió en v1.9. Sigue el cambio de v1.8 sin registro: el «Siguiente paso» perdió la lista de decisiones a confirmar. El orden de OPEN-Q-034 y OPEN-Q-035 ya no aplica. No cambia una regla. | Registrarlo o revertirlo | no |
| H-076 | menor | consistencia | SPEC-002 §3: «Sin agendamiento, el MVP no tiene notificaciones». SPEC-001, flujo principal, paso 13: «enviando confirmación al titular». | Nuevo en v1.9. DEC-P45 solo exceptúa la respuesta a un archivo. INFERIDO: si la confirmación de la revocación se muestra en pantalla no hay choque; si sale por SMS, correo o chat, sí. | ¿La confirmación se muestra solo en pantalla? | no |
| H-077 | menor | trazabilidad | SPEC-002 §16: «BR-008: Origen: DEC-P10, DEC-P44, DEC-P45; verificado por AC-013, AC-018, AC-021, AC-030, AC-035, AC-039.» SPEC-002, Análisis de impacto: «DEC-P38: afecta RF-011.» | Nuevo en v1.9. Los orígenes de §16 no coinciden con los de §5 y §7 en RF-011, RF-085, BR-008 y BR-009; en BR-007 ya coinciden. El texto de RF-011 no cambió: revocar sin código solo está en AC-033, y DEC-P46 solo en el paso 7 y AC-036. BR-008 y A2 no recogen DEC-P44. | Llevar las reglas a un RF o BR y alinear los orígenes | no |
| H-078 | menor | consistencia | SPEC-002, Objetivo: «la aceptación previa única del aviso de privacidad». SPEC-002/AC-019: «(aplicando una sola vez por paciente y canal)». | Nuevo en v1.9. Tras DEC-P40 la aceptación ya no es «única»: se repite al volver a vincular. RF-012 lo aclara; Objetivo, §3, paso 2 y AC-019 no. | Alinear el texto | no |
| H-079 | menor | ambigüedad | SPEC-002/RF-013: «no existe vinculación activa ni vencida con ese paciente, incluida la desvinculación y la revocación (DEC-P39)». | Nuevo en v1.9, con el texto que dio la petición. «Activa» no se usa en el resto de la SPEC, que dice «vigente», e «incluida» se lee como si desvincular fuera un tipo de vinculación. AC-022 lo deja claro con «incluso tras». | Usar «vigente» y «también tras» | no |
| H-080 | menor | completitud | SPEC-002/AC-018: «el bot responde de inmediato con una plantilla fija». SPEC-002/RF-013: «en un grupo no vincula ni muestra información». | Nuevo en v1.9. RF-085, AC-013 y AC-018 no dicen si el bot responde a un archivo enviado en un grupo. Responder no chocaría con DEC-P52, pero «solo opera en chats privados» sugiere que no. AC-031 tampoco dice qué ve la persona. | ¿En un grupo el bot calla o responde con plantilla? | no |
| H-081 | menor | trazabilidad | SPEC-002, Análisis de impacto: «Actualización de la sección 16 (Trazabilidad) con RF-086 y AC-031 a AC-038 en RF e HUs.» | Nuevo en v1.9. Cambios sin pedido ni registro en el historial: RF-012 entró en HU-005 a HU-007, se borraron los bloques de las OPEN-Q respondidas, y las líneas de v1.8 salieron del Análisis de impacto. §2 resume DEC-P29, DEC-P37 y DEC-P39 sin su condición, con «Origen: docs/decisiones.md». Ninguno cambia una regla. | Registrarlos en el historial | no |
| H-084 | menor | completitud | SPEC-002/AC-039: «entonces el mensaje no contiene medicamentos, diagnósticos ni cédula». SPEC-002/BR-008: «exentos de nombres, medicamentos, diagnósticos y datos de identificación». | Nuevo en v1.10, resto de H-068. AC-039 es más estrecho que BR-008 y que la parte aplazada de AC-021: no prueba nombres ni otros datos de identificación. El texto es el que dio la petición. | Usar la lista de BR-008. | no |
| H-085 | menor | trazabilidad | SPEC-002 §16: «HU-005: RF-011, RF-012, RF-013, RF-016, RF-018, RF-085, RF-086, RF-087; BR-008, BR-009; AC-011, AC-013, AC-014, AC-016, AC-018, AC-021, AC-022, AC-024, AC-025, AC-029, AC-030, AC-031, AC-032, AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040.» SPEC-002 §16: «RF-087: Origen: DEC-P38, DEC-P57; verificado por AC-033, AC-040.» SPEC-002, Verificación: «Consistencia interna: parcial. Siguen hallazgos del informe S1.» | Cambió en v1.11, resuelto en parte. RF-087 y AC-040 ya están en las tres HU, pero RF-087 se verifica también con AC-033, y AC-033 no está en HU-005, HU-006 ni HU-007: entró el caso negativo sin el positivo. Sigue sin haber flujo alternativo de revocación que muestre la confirmación. Siguen sin registro las tres líneas de «Verificación» y DEC-P45 en la fila RF-085 de la v1.10. Ninguno cambia una regla. | Añadir AC-033 a las tres HU, un flujo de revocación y el registro. | no |
| H-086 | menor | consistencia | SPEC-002/RF-087: «en SPEC-001/AC-007, «solicita» se entiende como la solicitud ya confirmada». SPEC-001, estados: «provocada por Titular al solicitar la revocación de consentimiento». SPEC-001, flujo principal, paso 12: «el titular puede solicitar la revocación del consentimiento». | Nuevo en v1.11, resto de H-082. La aclaración nombra solo AC-007. La transición a «Revocado» y el paso 12 usan el mismo verbo y no quedan cubiertos al pie de la letra. INFERIDO: se leen igual, porque RF-087 dice «antes de aplicar una revocación» y el paso 13 es el que procesa. No hace falta PREG. | Decir «en SPEC-001, «solicitar la revocación» se entiende como la solicitud ya confirmada», sin nombrar solo AC-007. | no |

## Valores límite revisados

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| 3 meses calendario (DEC-P21, DEC-P25) | AC-026, 23:59:59 del día de vencimiento | AC-009 y AC-026: vigente todo el día | AC-010 y AC-026, 00:00 del día siguiente | Cumple |
| Último día del mes (DEC-P21, DEC-P25) | AC-020, todo el último día de febrero | AC-020, año común y bisiesto | AC-020, 00:00 del 1 de marzo | Cumple para febrero; otro mes en H-034 |
| Plazo tras reactivar | Sin AC | Sin AC | Sin AC | No cumple (H-055) |
| Más de un paciente en el canal, sin límite | 1 paciente: sin AC de máscara (H-021) | 2 pacientes: AC-009, AC-011, AC-014, AC-027; vigente y vencida: AC-038 | Misma terminación: pendiente en PREG-034 | Parcial |
| 4 últimos dígitos (`CC ***1234`) | No aplica | AC-011 | Colisión: pendiente en PREG-034 | Parcial |
| 10 minutos del código | Vinculación nueva heredada de SPEC-001/AC-009 | Heredado | Vinculación nueva: AC-025; reactivación sin AC (H-010) | Parcial |
| 3 intentos del código | Vinculación nueva heredada de SPEC-001/AC-010 | Heredado de SPEC-001/AC-011 | Vinculación nueva: AC-025; reactivación sin AC (H-010) | Parcial |
| 48 horas y 30 unidades | No aplica | No aplica | No aplica | Fuera de esta SPEC |

## OPEN-Q pendientes

| OPEN-Q | PREG | Hallazgo | ¿Impide el veredicto? | Efecto |
|---|---|---|---|---|
| OPEN-Q-034 | PREG-034 | H-009 | No | SPEC-002/AC-011 y AC-038 no cubren la colisión de máscara. DEC-P48 suma las vencidas a la lista, así que el caso se vuelve más probable. |

Está marcada `Crítica: no` y su PREG `Bloquea: no`. S2 puede diseñar lo confirmado y dejar este caso en espera. No causa `NO_APTA` ni impide formalmente la aprobación.

`docs/preguntas/PREG-002.md` quedó respondida por DEC-P29. `docs/preguntas/PREG-015.md` sigue abierta y cita SPEC-002 sin OPEN-Q; se sigue tratando en SPEC-003/OPEN-Q-011. `docs/preguntas/PREG-074.md` sigue abierta y sin OPEN-Q en esta SPEC; es de `docs/mvp.md`. `docs/preguntas/PREG-075.md` quedó respondida por DEC-P57.

## Preguntas creadas

- `docs/preguntas/PREG-060.md` — ¿Dónde y cuándo se registra la aceptación por paciente y canal? — bloquea: no
- `docs/preguntas/PREG-061.md` — ¿Se acepta otra vez el aviso al volver a vincular tras desvincular? — bloquea: no
- `docs/preguntas/PREG-062.md` — ¿Una vinculación vencida aparece en la lista y cuenta para la selección? — bloquea: no
- `docs/preguntas/PREG-070.md` — ¿Volver a vincular tras una desvinculación o una revocación es una vinculación nueva? — bloquea: no
- `docs/preguntas/PREG-074.md` — ¿Qué prioridad tienen en docs/mvp.md los REQ que quedan sin evento tras DEC-P45 y DEC-P35? — bloquea: no
- `docs/preguntas/PREG-075.md` — ¿Cuál es la confirmación previa a revocar que cita DEC-P38, si SPEC-001 no la define? — bloquea: no

PREG-060, PREG-061, PREG-062, PREG-070 y PREG-075 quedaron respondidas. Las revisiones de v1.8, v1.10 y v1.11 no crearon ninguna PREG; la de v1.9 creó PREG-074 y PREG-075.

## Estado de los hallazgos anteriores de severidad media y menor

- Resueltos: H-033, H-035, H-036, H-037 y H-043; en v1.8, H-056, H-058 y H-065; en v1.9, H-014 y H-054; en v1.10, H-038, H-071, H-072 y H-074; en v1.11, H-082 y H-083.
- Reemplazado: H-026, por H-049, que también quedó resuelto (SPEC-003 v1.8).
- Los demás siguen en la tabla de hallazgos con su id. H-016, H-027, H-034 y H-048 se redujeron y H-038 queda reducido a A1. H-017 subió a alta en v1.7 y quedó resuelto en v1.9.

## Estado de hallazgos transversales

- Resueltos en la SPEC: T-026, T-027, T-028 y T-012 en lo que toca a esta SPEC.
- Resueltos en la SPEC, con residuo fuera de ella: T-017 (H-032).
- Siguen abiertos: T-014 (H-030), T-016 (H-031), T-019 (H-046) y T-023 (H-004). T-025 se cierra con H-014 en lo que toca a esta SPEC.
- `docs/mvp.md`: DEC-P01 aún dice «PWA móvil»; DEC-P10 lo reemplaza. REV-001 y REV-002 siguen sin aplicar.

## Criterios

- Verificabilidad: no cumple. Lint sobre los 32 AC y revisión de RF-087 con AC-033 y AC-040, que tienen oráculo. Quedan AC-017, AC-029 y AC-030 (H-029, H-052).
- No ambigüedad: no cumple. Quedan «solicitando», «gestión» frente a «sesión», «registradas» y «activa» (H-004, H-020, H-022, H-079).
- Completitud: no cumple. Faltan la reactivación fallida, el nuevo plazo, el rechazo del segundo aviso, la gestión en curso y volver a vincular tras revocar (H-010, H-019, H-053, H-055, H-073), y la marca de lo aplazado (H-069).
- Consistencia: no cumple. Contrasté el diff con DEC-P38, DEC-P57, SPEC-001, SPEC-003 v1.12 y SPEC-008 v1.9. H-082 y H-083 quedaron resueltos; quedan H-070, H-075 y H-086.
- Trazabilidad: no cumple. Cada RF y BR tiene AC en la sección 16 y RF-087 ya está en las HU, pero siguen trazas parciales, orígenes distintos y cambios sin registrar (H-005, H-015, H-030, H-066, H-067, H-077, H-081, H-085).

## Conclusión

El veredicto es APTA_CON_RESERVAS: no hay hallazgos bloqueantes ni altos en v1.11. S2 puede diseñar casos de lo confirmado y dejar en espera lo que dependa de OPEN-Q-034 y PREG-074. Formalmente nada impide aprobar, y lo que se pedía antes de congelar (H-082) ya está. H-085 y H-086 no lo desaconsejan: son menores y no cambian ninguna regla. `aprobado_por` queda vacío: la decisión es de una persona.
