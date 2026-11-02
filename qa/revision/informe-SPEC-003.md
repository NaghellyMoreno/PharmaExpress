# Informe de revisión — SPEC-003

Fecha: 2026-11-02
Revisor: S1 (prueba estática)
Veredicto: APTA_CON_RESERVAS
Lint previo: `python qa/scripts/lint_spec.py` (PYTHONUTF8=1) sobre v1.14: sin hallazgos mecánicos. Definiciones: RF 12, BR 8, RNF 1, CL 6, AC 50 (entra AC-058). El lint no sustituye esta revisión.
SPEC revisada: agentes-ia/salidas/specification-agent/borradores/SPEC-003/SPEC-003_v1.14.md (versión 1.14, estado Candidata), frente a la aprobada `aprobadas/SPEC-003_v1.13.md`. Novena revisión, corta, limitada a esa diferencia (DEC-P80, DEC-P81, H-090 y H-094); lo demás se conserva de las revisiones anteriores. Coherencia contrastada con SPEC-002_v1.11.md (RF-018, AC-016), DEC-P43, DEC-P51, DEC-P59, DEC-P76, ARQ-005 v1.0 y `docs/mvp.md` (OBS-009, OBS-019).
MVP: Dentro del Debe (REQ-002, REQ-016, REQ-017 y REQ-018 de `docs/mvp.md`; DEC-P01). `docs/mvp.md` sigue en borrador y sin `aprobado_por`.

## Resumen (3 líneas)

La v1.14 aplica DEC-P80 y DEC-P81 sin extender su alcance. RF-032 y AC-054 cumplen DEC-P81 y son compatibles con SPEC-002/RF-018, SPEC-002/AC-016 y DEC-P51. Se resuelve H-091 (DEC-P81, PREG-078); H-094 baja a menor; H-090 y H-022 cambian y siguen medios. No hay cambios de fondo fuera del historial.
No hay bloqueantes ni altos. Entran 3 menores: H-096 (SPEC-003/AC-058 sin caso en el límite ni aviso), H-097 (el número que se conserva frente a la frase de DEC-P76) y H-098 (SPEC-003/AC-054 sin momento ni almacenes que revisar). La definición de «termina» no decide nada abierto, pero deja fuera el error de DEC-P43 (H-090).
Total: 48 (0 bloqueantes, 0 altos, 18 medios, 30 menores). S2 puede diseñar casos de lo confirmado. No se creó ninguna PREG: PREG-077 y PREG-078 quedaron respondidas por DEC-P80 y DEC-P81, y los valores que faltan están en OBS-019 de `docs/mvp.md`. La sección «Verificación» de la SPEC no se usó como evidencia.

Etiquetas en la columna Problema: `[CONFIRMADO]` sale del texto citado o de un registro aprobado; `[INFERIDO]` es una conclusión de S1 que una persona debe confirmar.
Numeración: se conservan los id de la revisión anterior porque las OPEN-Q de SPEC-003 los citan; los hallazgos nuevos empiezan en H-052 (v1.7), H-063 (v1.8), H-065 (v1.9), H-068 (v1.10), H-080 (v1.11), H-088 (v1.12), H-090 (v1.13) y H-096 (v1.14). Los hallazgos cubiertos por una OPEN-Q que cita una PREG no se repiten en la tabla: están en «Estado de los hallazgos anteriores».

## Hallazgos

Total: 48 (0 bloqueantes, 0 altos, 18 medios, 30 menores). En v1.14 sale por resuelto H-091; H-094 baja a menor; H-022 y H-090 cambian; H-096 a H-098 son nuevos. (En v1.13 salieron H-024, H-058, H-067 y H-050, y entraron H-090 a H-095.)

| id | Severidad | Tipo | Cita literal | Problema | Pregunta sugerida | Bloquea |
|----|-----------|------|--------------|----------|-------------------|---------|
| H-016 | media | verificabilidad | SPEC-003/AC-003: «la fórmula queda no apta y se orienta a atención presencial». SPEC-003/AC-030: «todas las fórmulas de la solicitud son marcadas como no aptas y despliega el siguiente paso». | `[CONFIRMADO]` Cambió en v1.13. SPEC-003/AC-003 sigue sin fijar el motivo de la fila «2 rechazos OCR». DEC-P75 ya dice qué motivo corresponde en SPEC-003/AC-030 (el de la causa del segundo intento), pero el AC no lo fija. Tampoco hay AC con motivo para una historia clínica ilegible tras dos intentos. | Añadir el motivo a SPEC-003/AC-003 y, con DEC-P75, a AC-030. | no |
| H-021 | media | completitud | SPEC-003/AC-016: «registra estado "No autorizado" en la EPS simulada». SPEC-003/BR-014: «sin autorización registrada en la EPS». | `[CONFIRMADO]` Cambió en v1.10: SPEC-003/AC-047 cubre «sin estado Autorizado» para el medicamento ausente del catálogo. Para el no PBS del catálogo sin registro de autorización sigue sin AC (solo SPEC-008/AC-048), y no hay lista de estados posibles. | Enumerar los estados y añadir el AC. | no |
| H-022 | media | completitud | SPEC-003/RF-021: «rige el límite técnico que fije Arquitectura, y lo que lo supere se rechaza antes de leerlo, sin gastar intento (DEC-P80).» SPEC-003/BR-009: «el límite de tamaño y páginas lo fija Arquitectura.» | `[CONFIRMADO]` Cambió en v1.14. DEC-P80 responde PREG-077: no hay máximo de fórmulas como regla de negocio, y SPEC-003/AC-058 cubre el rechazo. Quedan sin valor los tres límites técnicos (fórmulas, tamaño y páginas): ARQ-005 no los fija y `docs/mvp.md` los anota en OBS-019. Sin valor, los casos en el límite y por encima no tienen número. | Fijar los valores (Arquitectura, OBS-019). No hace falta PREG. | no |
| H-028 | media | ambigüedad | SPEC-003/RF-026: «permitiendo que las fórmulas aptas continúen en el flujo digital». SPEC-003/BR-014: «Muestra el resultado preliminar de la fórmula como apta.» | `[CONFIRMADO]` Con DEC-P01 no hay paso posterior definido y el siguiente paso de una apta repite el resultado. | ¿Qué ve la persona después de una apta mientras el agendamiento siga en evaluación? | no |
| H-029 | media | ambigüedad | SPEC-003/BR-014: «La fecha habilitada de entrega por la EPS es posterior a la cita más próxima disponible.» | `[INFERIDO]` «Disponible» sugiere que se consultaron cupos, pero la fecha es solo un cálculo (DEC-P13). SPEC-003/AC-041 exige ahora ese texto. | Redactar el motivo sin mencionar disponibilidad. | no |
| H-030 | media | consistencia | SPEC-003/RF-023: «comparando su diagnóstico contra un catálogo configurable de diagnósticos crónicos». SPEC-008/RF-078: «comparando el código de diagnóstico CIE-10 asignado a la fórmula». | `[CONFIRMADO]` SPEC-008 compara códigos y SPEC-003 no dice que el OCR lea un código. Falta el caso de una historia con solo texto. | ¿La historia debe traer el código CIE-10? | no |
| H-031 | media | completitud | SPEC-003, modelo de dominio: «gestionados en una misma sesión». | `[CONFIRMADO]` El glosario dice «gestión». Siguen sin definirse los estados de solicitud y fórmula ni el abandono a mitad de camino. | Añadir estados como en SPEC-001 sección 7.2. | no |
| H-032 | media | trazabilidad | SPEC-003, sección 12: «Catálogo simulado de cobertura PBS.» | `[CONFIRMADO]` Se añadió el catálogo, pero la sección omite SPEC-008 como tal y el contenido por EPS (SPEC-008/RF-080) que necesita BR-014. El modelo de dominio tampoco tiene el catálogo de cobertura. | Completar dependencias. | no |
| H-034 | media | ambigüedad | SPEC-003/BR-013: «Está registrada a nombre del paciente validado». | `[CONFIRMADO]` Con varios pacientes (contexto 3.3) la referencia es el paciente seleccionado. El flujo no incluye esa selección ni la identificación de DEC-P20. | Enlazar con SPEC-002 y usar un solo término. | no |
| H-035 | media | completitud | SPEC-003/AC-021: «Dada cualquier fórmula que complete el proceso de prevalidación (apta o no apta)». | `[CONFIRMADO]` E1, E2 y el resultado global de afiliación pueden no «completar» el proceso. El contexto 3.4 exige la advertencia en todo resultado. | Extender la leyenda a todo resultado. | no |
| H-036 | media | verificabilidad | SPEC-003/AC-001: «carga una fórmula vigente con medicamentos PBS y su historia clínica». | `[CONFIRMADO]` El Dado sigue sin fijar afiliación activa ni tipo de tratamiento. Lo mismo en v1.9: SPEC-003/AC-037, AC-038, AC-043 y AC-044 dan «apta» sin decir que las demás verificaciones cumplen, como sí hace SPEC-003/AC-029. Cambió en v1.11: el resto de H-068 cae aquí. SPEC-003/AC-013, AC-024, AC-025 y AC-030 no fijan afiliación activa en su «Dado»; el caso inactivo ya lo dan BR-008 y AC-052. | Completar las precondiciones. | no |
| H-037 | media | completitud | SPEC-003/BR-012: «La solicitud acepta únicamente una historia clínica.» | `[CONFIRMADO]` Sin AC ni conducta para una segunda historia, una solicitud sin historia o sin fórmulas. | Definir el caso y añadir AC. | no |
| H-038 | media | verificabilidad | SPEC-003/RF-024, paso 4: «Se consulta para todos los medicamentos, pero solo determina el resultado para los medicamentos no cubiertos por el PBS». | `[CONFIRMADO]` Consultar para todos y evaluar afiliación una vez siguen sin observación en ningún AC. SPEC-003/AC-018 sigue a nivel de medicamento. | Definir cómo se observan y reescribir AC-018 a nivel de fórmula. | no |
| H-040 | media | datos-de-salud | SPEC-003/RF-024, paso 5: «se despliega un mensaje de error de sistema y se registra el evento». | `[CONFIRMADO]` No se define el contenido del registro ni se prohíbe incluir medicamentos o diagnósticos; SPEC-003 no tiene RNF de privacidad. Cambió en v1.10: SPEC-008/RF-083 fija qué queda tras una revocación (DEC-P51), pero no qué lleva el evento antes de ella, y SPEC-008/AC-054 ya cubre todo evento almacenado (v1.8; SPEC-008/H-059 resuelto). | Definir los campos del evento, sin datos de salud. | no |
| H-041 | media | verificabilidad | SPEC-008/RF-084: «El catálogo debe tener cargado el año en curso y el año siguiente.» | `[CONFIRMADO]` Sigue sin AC ni conducta si falta el año siguiente y aún no es el necesario. SPEC-003/BR-015 no lo menciona. | ¿Quién lo comprueba y qué pasa antes de necesitarlo? | no |
| H-059 | media | verificabilidad | SPEC-003/AC-042: «establece el miércoles como fecha de la cita posible». SPEC-003/RF-027: «el resultado preliminar por fórmula (apta o no apta)». | `[CONFIRMADO]` Cambió en v1.9: SPEC-003/AC-037, AC-038, AC-043 y AC-044 ya se observan por el resultado apta o no apta. Queda SPEC-003/AC-042: ningún RF ni fila de BR-014 muestra la fecha de la cita posible y el AC no fija la fecha habilitada. | Fijar la fecha habilitada y el resultado esperado en AC-042. | no |
| H-071 | menor | completitud | SPEC-003/BR-009: «Toda fórmula cargada en una solicitud nueva se procesa con intentos nuevos; a una fórmula no apta por documento se le orienta a la atención presencial (DEC-P41, DEC-P76).» SPEC-003/AC-049: «Dada una fórmula no apta por falta de autorización, cuando el usuario la carga en una solicitud nueva». | `[CONFIRMADO]` Cambió en v1.13, de media a menor. DEC-P76 decide que el sistema no bloquea, y BR-009 ya lo dice. Falta un AC del cambio de conducta: una fórmula no apta por documento (o por vigencia) que entra en una solicitud nueva recibe 2 intentos nuevos y se prevalida. AC-049 no cambió, aunque DEC-P76 lo nombra. `[INFERIDO]` «Se le orienta» es el siguiente paso que se muestra con el resultado no apto, no un bloqueo. | Añadir a AC-049 el caso de la fórmula no apta por documento. | no |
| H-073 | media | completitud | SPEC-003/RF-028: «si ninguna de las fórmulas de la solicitud resulta apta tras la prevalidación». SPEC-003, E4: «Si al finalizar la prevalidación todas las fórmulas resultan no aptas». SPEC-003/AC-032: «no emite resultado para esa fórmula». | `[CONFIRMADO]` Nuevo en v1.10. DEC-P43 quita el tercer estado, pero RF-028 y E4 difieren con una fórmula sin resultado y las demás no aptas. AC-032 es de una sola fórmula: no dice qué ven las demás (BR-010) ni si se muestra la leyenda. Son los puntos 1 y 3 de PREG-013, que DEC-P50 no trata. RF-027 sigue diciendo «(apta o no apta)». | Añadir un AC con dos fórmulas y alinear RF-028 con E4. | no |
| H-042 | menor | consistencia | SPEC-003, sección 2, DEC-P13: «El sábado es considerado día hábil.» | `[INFERIDO]` Se deduce de «se saltan domingos y festivos», pero la frase no está en DEC-P13. | Confirmarlo en `docs/decisiones.md`. | no |
| H-043 | menor | trazabilidad | SPEC-003/RF-026: «Origen: necesidad, contexto 3.4, DEC-16.» | `[CONFIRMADO]` DEC-16, DEC-42 y DEC-12 siguen sin definirse en la SPEC ni en `docs/decisiones.md`. | Citar `DEC-Pxx` o el contexto. | no |
| H-045 | menor | ambigüedad | SPEC-003/BR-014: «Afiliación inactiva en la EPS simulada.» | `[INFERIDO]` Un texto para el paciente menciona «simulada». Igual en otras filas de BR-014. | ¿Es el texto final? | no |
| H-047 | menor | trazabilidad | SPEC-003, sección 16: «BR-013: Origen: DEC-P05, DEC-P08, DEC-P12, DEC-P49; verificado por AC-013, AC-024, AC-025, CL-008.» SPEC-003, sección 16: «CL-008: Origen: DEC-16, DEC-P08; verificado por AC-004, AC-013.» | `[CONFIRMADO]` Sigue en v1.10, con la fila de BR-013 ya actualizada a DEC-P49. Siguen con casos límite como verificación BR-012, BR-013 y BR-015. SPEC-003/CL-008 sigue trazado a AC que no cubren su combinación. SPEC-003/AC-046 muestra motivo y siguiente paso, pero no está en la fila BR-014. | Trazar solo a AC; añadir SPEC-003/AC-046 a BR-014. | no |
| H-048 | menor | trazabilidad | SPEC-003, sección 16: «HU-005: RF-021, RF-022». | `[CONFIRMADO]` La SPEC no traza a REQ-002, REQ-016, REQ-017 ni REQ-018. | Añadir la columna REQ. | no |
| H-049 | menor | consistencia | SPEC-008/RF-078: «El sistema debe clasificar el tratamiento de una fórmula como agudo o crónico». | `[CONFIRMADO]` Repite SPEC-003/RF-023; lo mismo con BR-011 y BR-026, BR-015 y BR-027. Hoy coinciden, pero tienen dos dueños. | Dejar un dueño por regla. | no |
| H-051 | menor | trazabilidad | SPEC-003, Verificación: «persiste la ambigüedad en la distinción de motivos ante causas distintas en reintentos (PREG-041/OPEN-Q-020).» SPEC-003, Verificación: «Los criterios de aceptación AC-001 a AC-052». SPEC-003, Verificación: «Cobertura de AC: cumple. Todos los RF y BR tienen asignado al menos un criterio de aceptación en la sección 16.» | `[CONFIRMADO]` Cambió en v1.13. «Completitud» y «No ambigüedad» ya son exactas. Tres líneas que la orden no dejaba tocar quedaron desactualizadas: «Consistencia interna» da OPEN-Q-020 por abierta; «Verificabilidad» dice «AC-001 a AC-052» y que hay OPEN-Q pendientes, y «Trazabilidad» habla de «OPEN-Q de negocio abiertas». Siguen dos «cumple» sin sostén: consistencia con el contexto (H-074) y cobertura de AC, nominal para el segundo intento con datos faltantes (H-088). | Actualizar esas líneas en la próxima versión. | no |
| H-060 | menor | consistencia | SPEC-003, A1, paso 3: «El sistema muestra una pantalla intermedia con consejos para la captura de documentos». SPEC-003, E3, paso 1: «contabilizándolo como intento 1». SPEC-003/AC-053: «muestra el mensaje común de RF-031 y recomendaciones para volver a cargarla». | `[CONFIRMADO]` Cambió en v1.12: AC-022, AC-026, AC-050 y AC-053 exigen el mensaje común y los consejos en el mismo primer intento. A1 da los consejos sin el mensaje y E3 da el mensaje sin los consejos. S2 debe usar los AC; ninguno de los dos flujos sirve solo como oráculo. | Dejar un solo flujo para este caso. | no |
| H-061 | menor | trazabilidad | SPEC-003, sección 2: «DEC-P23 (modificada por DEC-P28). El sistema no distingue las fórmulas manuscritas.» | `[CONFIRMADO]` El registro de DEC-P23 dice otra cosa (mensaje propio) y SPEC-003 le atribuye el texto de DEC-P28. Ni DEC-P23 ni DEC-P28 mencionan OPEN-Q-013 en `docs/decisiones.md`. | Citar DEC-P23 como está y anotar que DEC-P28 la modifica. | no |
| H-062 | menor | consistencia | `docs/mvp.md`, Corte técnico: «Fórmulas manuscritas: **fuera de alcance**.» SPEC-003, sección 3: «Tratamiento de documentos ilegibles (manuscritos o no, por faltar datos obligatorios o con números de prescripción distintos a 20 dígitos numéricos)». | `[CONFIRMADO]` El corte no refleja DEC-P28; manda la decisión más reciente. `[INFERIDO]` Sin distinción, una manuscrita que el OCR lea y coincida sigue el flujo normal. El texto es de Arquitectura, no de SPEC-003. | Actualizar el corte en la negociación del MVP. | no |
| H-063 | menor | consistencia | SPEC-003, sección 2: «La Mini App exige cédula y código para una vinculación nueva; una vinculación vencida se reactiva solo con código nuevo (DEC-P22, DEC-P26).» SPEC-003, flujo principal, paso 1: «desde la web o mediante la Telegram Mini App». | `[CONFIRMADO]` Nuevo en v1.8. La frase solo nombra la Mini App, pero DEC-P26 no se limita a ella y SPEC-002/RF-013 y SPEC-002/RF-015 aplican a todo canal, navegador incluido. El mismo texto quedó dentro del resumen de DEC-P10 en la sección 2, aunque DEC-P10 no lo dice; la cita a DEC-P22 y DEC-P26 evita confusión. Ningún RF ni AC de SPEC-003 depende de la frase y SPEC-002 es la dueña de la regla, por eso no hace falta PREG. | Decir «El canal exige» o remitir a SPEC-002/RF-013 y SPEC-002/RF-015. | no |
| H-066 | menor | completitud | SPEC-003/AC-043: «cuando la fecha habilitada es el miércoles 2026-12-09, entonces el sistema toma ese miércoles como cita posible y marca la fórmula como apta.» | `[CONFIRMADO]` Nuevo en v1.9. Es el único de los AC de fechas nuevos o reescritos con un solo lado: falta la fecha posterior (no apta) para la prevalidación en festivo. | Añadir el caso del jueves 2026-12-10, como en SPEC-003/AC-037. | no |
| H-074 | menor | consistencia | SPEC-003, sección 2: «de los documentos solo se obtienen los medicamentos y el diagnóstico». SPEC-003/RF-022: «extraer de los documentos cargados el número de prescripción (20 dígitos)». | `[CONFIRMADO]` Nuevo en v1.10. La frase viene literal de DEC-P34 y, al pie de la letra, excluye el número que RF-022, DEC-P05 y DEC-P42 sí leen. `[INFERIDO]` DEC-P34 solo habla del indicador PBS. No se reabre la decisión. | Aclarar en la SPEC que la frase se refiere al indicador PBS. | no |
| H-075 | menor | verificabilidad | SPEC-003/AC-032: «registra el evento y la persona debe iniciar una solicitud nueva.» | `[CONFIRMADO]` Nuevo en v1.10. Lo que la persona debe hacer no es observable: no se dice si el sistema lo indica, ni qué texto muestra. El «entonces no emite» tampoco nombra al sistema. SPEC-008/AC-052 repite la forma. | ¿El error indica iniciar una solicitud nueva? Redactar lo que el sistema muestra. | no |
| H-076 | menor | completitud | SPEC-003/BR-009: «Una fórmula no apta por autorización o por fecha habilitada puede prevalidarse en una solicitud nueva». | `[CONFIRMADO]` Nuevo en v1.10. SPEC-003/AC-049 solo cubre la autorización; falta el lado de la fecha habilitada. `[INFERIDO]` DEC-P41 dice «fecha» y la SPEC la lee como fecha habilitada, no vigencia; la opción 2 de PREG-014 lo admite, pero no lo aclara. | Añadir el caso de fecha habilitada a AC-049. Lo de vigencia va en `docs/preguntas/PREG-076.md`. | no |
| H-079 | menor | trazabilidad | SPEC-003/RF-024, paso 3: «Un medicamento sin entrada en el catálogo simulado de cobertura se trata como no PBS.» SPEC-003, E2: «reemplazando los resultados de todas las fórmulas de la solicitud.» | `[CONFIRMADO]` Nuevo en v1.10. Cambios sin pedido y sin registro en el historial: RF-024 paso 3 (la petición decía «No cambies RF-024» en el punto de DEC-P34), flujo paso 9, sección 3, A1, E2, y el borrado de los bloques de las OPEN-Q respondidas, incluida OPEN-Q-013, que el ajuste de v1.9 había restaurado. Todos siguen las decisiones, salvo la sección 3 (H-069). | Registrarlos en el historial. | no |
| H-083 | menor | ambigüedad | SPEC-003, sección 2: «Un documento es ilegible si falta alguno de sus datos obligatorios». SPEC-003/BR-014: «No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención presencial.» SPEC-003/AC-026: «muestra el mensaje común de RF-031 y una pantalla con consejos para tomar una foto legible». | `[CONFIRMADO]` Nuevo en v1.11; cambió en v1.12, porque AC-026 ya exige ese mensaje. DEC-P54 decide que siempre se muestra este mensaje, y no se reabre. `[INFERIDO]` Para una historia clínica nítida sin diagnóstico el texto no describe lo ocurrido: sí se leyó, no hay fórmula manuscrita, y otra foto no aporta el diagnóstico. Tras dos intentos todas las fórmulas, aunque se hayan leído bien, muestran ese motivo. El resultado apta/no apta no cambia; por eso no hay PREG. | Si el equipo quiere otro texto, lo decide con una decisión nueva. S2 usa el texto actual. | no |
| H-084 | menor | trazabilidad | SPEC-003, sección 16: «RF-031: Origen: DEC-P23, DEC-P28, DEC-P54; verificado por AC-022, AC-053.» SPEC-003/AC-050: «Origen: DEC-P42, BR-009.» SPEC-003/AC-052: «Origen: DEC-P15, DEC-P33, BR-008, H-068.» | `[CONFIRMADO]` Cambió en v1.12, resuelto en parte. Ya están AC-050 en la fila BR-014 y DEC-P54 en el origen de RF-031. Quedan: AC-048 y AC-052 fuera de la fila BR-014, aunque usan la fila de afiliación; el origen de AC-050 sin DEC-P54, RF-031 ni BR-014; H-068 como origen de AC-052. Además, resto de H-065: la fila RF-031 no incluye AC-026 ni AC-050, que ya exigen el mensaje común, y el origen de AC-026 no cita RF-031. El historial de v1.12 no nombra H-084. | Añadir esas trazas y quitar H-068 del origen. | no |
| H-085 | menor | trazabilidad | SPEC-003, sección 3: «Tratamiento de documentos ilegibles (manuscritos o no, por faltar datos obligatorios o con números de prescripción distintos a 20 dígitos numéricos)». SPEC-003, sección 2: «Una fórmula no apta por documento se queda en atención presencial. Responde OPEN-Q-012.» | `[CONFIRMADO]` Nuevo en v1.11. Sin pedido y sin registro en el historial: esa línea de la sección 3, DEC-P41 en la sección 2, y las líneas Completitud, Consistencia, No ambigüedad y Verificabilidad de «Verificación», que la petición mandaba tocar solo en la versión. Los dos primeros siguen las decisiones, y DEC-P41 queda más fiel. Lo de «Verificación» es exacto, pero no está registrado. El fondo no registrado es H-081. | Registrarlos en el historial. | no |
| H-086 | menor | ambigüedad | SPEC-003/AC-045: «Dada una fórmula leída por OCR junto con su historia clínica, cuando el sistema presenta la vista previa, entonces muestra el número de prescripción y los medicamentos de la fórmula y los diagnósticos de la historia clínica». SPEC-003, flujo principal, paso 4: «El usuario verifica y presiona "Confirmar datos".» | `[CONFIRMADO]` Nuevo en v1.11, resto de H-033. El final de AC-045 dice «cada documento tiene su propia vista previa», pero el comienzo sigue con una sola vista previa de dos documentos. `[INFERIDO]` Tampoco se dice si rechazar un documento deja en firme lo confirmado en otro. No cambia DEC-P55. | Separar AC-045 por documento. | no |
| H-088 | menor | completitud | SPEC-003/AC-053: «Dada una fórmula de la que se lee el número pero no los medicamentos, cuando el sistema la procesa en el primer intento». SPEC-003/BR-009: «número o medicamentos en la fórmula». SPEC-003, sección 16: «RF-029: Origen: contexto 3.4, DEC-42, DEC-P07, DEC-P08, DEC-P15, DEC-P24, DEC-P28, DEC-P42, DEC-P54; verificado por AC-003, AC-013, AC-024, AC-025, AC-030, AC-039, AC-040, AC-049, AC-050.» | `[CONFIRMADO]` Nuevo en v1.12, resto de H-082. AC-053 no cubre el segundo intento ni el caso contrario: sin número y con medicamentos. AC-053 tampoco está en la fila RF-029. Sin número no hay llave de búsqueda, y el motivo correcto es el de documento ilegible, no el de no coincidente: BR-009 lo define, pero ningún AC lo fija. No hace falta decisión: DEC-P54 ya lo resuelve. | Añadir a AC-053 el segundo intento y el caso sin número, con el motivo de documento ilegible de BR-014. | no |
| H-089 | menor | consistencia | SPEC-003, sección 2: «DEC-P42. Un número de prescripción que no tenga 20 dígitos numéricos cuenta como documento ilegible o incompleto y consume un intento de carga.» SPEC-003, sección 2: «DEC-P53. Solo el manejo de fallas de las fuentes simuladas durante la prevalidación queda fuera de alcance.» | `[CONFIRMADO]` Nuevo en v1.12, resto de H-080 y H-087. BR-009 ya dice solo «ilegible», pero el resumen de DEC-P42 conserva «o incompleto» sin la precisión que sí tiene DEC-P09, aunque DEC-P54 lista DEC-P42 entre lo que afecta. La línea propia de DEC-P53 sigue junto a la nueva línea «DEC-P31 y DEC-P53»; no se contradicen, solo repiten. Ninguna regla viva depende de estas líneas. | Anotar «Precisada por DEC-P54» en DEC-P42 y quitar la línea repetida. | no |
| H-090 | media | completitud | SPEC-003/RF-032: «La prevalidación termina cuando se emite el resultado de todas las fórmulas o cuando la solicitud se detiene (afiliación inactiva o historia clínica con sus dos intentos agotados). El borrado de una solicitud abandonada sin terminar es un parámetro sin valor decidido.» SPEC-003/AC-032: «no emite resultado para esa fórmula». SPEC-003/AC-054: «Dada una solicitud cuya prevalidación terminó». | `[CONFIRMADO]` Cambió en v1.14. La definición sigue a DEC-P33, DEC-P15 y DEC-P59 y no decide lo abierto: el abandono queda sin valor, como en ARQ-005 (ADR-003) y OBS-019. Quedan dos vacíos. (1) Una solicitud con una fórmula crónica sin resultado por año faltante en el catálogo (DEC-P43, AC-032) no emite el resultado de todas sus fórmulas ni está en la lista de detenciones: al pie de la letra no termina, y sus fotos y PDF esperan una purga sin valor. (2) AC-054 no tiene un caso por cada final: afiliación inactiva (E2) e historia clínica agotada (E1). `[INFERIDO]` DEC-P43 cierra esa solicitud («la persona inicia una solicitud nueva»), así que debería contar como terminada; una persona debe confirmarlo al aprobar. | Añadir a RF-032 «o cuando se muestra el error de sistema de DEC-P43» y cubrir en AC-054 los finales de E1, E2 y AC-032. | no |
| H-092 | menor | consistencia | SPEC-003/RF-029: «la lectura de una fórmula o de la historia clínica no es exitosa por», «no coincidir con la EPS simulada». SPEC-003, A1, paso 1: «de un documento (fórmula o historia clínica)», «con número de prescripción distinto de 20 dígitos numéricos o no coincidente». | `[CONFIRMADO]` Nuevo en v1.13. DEC-P73 se aplicó solo en BR-009, como pedía la orden. RF-029 y A1 siguen enumerando «no coincidir» para cualquier documento, historia clínica incluida. No cambia ningún oráculo: E1 paso 1 solo habla de fórmulas, SPEC-003/AC-030 solo de OCR o confirmación, BR-013 solo de fórmulas, y BR-009 manda. | Añadir «(solo fórmulas, DEC-P73)» en RF-029 y A1. | no |
| H-093 | menor | verificabilidad | SPEC-003/AC-056: «entonces el sistema lo rechaza sin leerlo y no contabiliza ningún intento.» | `[CONFIRMADO]` Nuevo en v1.13. «Sin leerlo» no se observa directamente; se observaría como «no muestra vista previa OCR». No se dice qué aviso ve la persona. El lado del tamaño de DEC-P74 no tiene AC (H-022). `[INFERIDO]` No aplica el mensaje común de RF-031, porque no es un documento ilegible. | Escribir «no muestra vista previa» y fijar el aviso. | no |
| H-094 | menor | verificabilidad | SPEC-003/AC-055: «Dada una fórmula crónica con fecha habilitada el miércoles, cuando el sistema la prevalida a las 23:59:59 de un lunes ordinario en hora de Colombia, entonces la cita posible es el martes y la fórmula queda no apta por fecha habilitada posterior; y cuando la prevalida a las 00:00:00 del martes, entonces la cita posible es el miércoles y la fórmula queda apta.» | `[CONFIRMADO]` Cambió en v1.14, de media a menor. Ya se observa en apta o no apta, y los dos lados son correctos frente a BR-015, DEC-P13, DEC-P70 y DEC-P71; el lado apta prueba el «igual». Queda que «lunes ordinario» no dice que el martes y el miércoles tampoco sean festivos: con el martes festivo, el lado del lunes daría cita el miércoles y apta. El «queda apta» supone afiliación activa, vigencia y medicamentos PBS sin decirlo (como H-036). | Usar fechas sintéticas sin festivos en el catálogo, p. ej. lunes 2026-11-23, martes 2026-11-24 y miércoles 2026-11-25, y completar el «Dado». | no |
| H-095 | menor | ambigüedad | SPEC-003/BR-015: «La fecha de prevalidación es la del momento en que el sistema ejecuta las reglas, en hora de Colombia (DEC-P70, DEC-P71).» | `[INFERIDO]` Nuevo en v1.13. «El momento» se lee como un instante único por solicitud. Si cada regla tomara su propia hora, la vigencia (paso 2) y la cita posible (paso 5) de una misma fórmula podrían usar fechas distintas cerca de la medianoche. Es el mismo punto de SPEC-008/H-070. No hace falta decisión si se acepta esa lectura. | Decir que la fecha se toma una sola vez por solicitud. | no |
| H-096 | menor | verificabilidad | SPEC-003/AC-058: «Dada una solicitud que alcanzó el límite técnico de fórmulas, cuando el usuario carga otra fórmula, entonces el sistema la rechaza sin leerla y no contabiliza ningún intento.» | `[CONFIRMADO]` Nuevo en v1.14. Solo cubre el lado de encima. Falta el del límite: la fórmula que llega justo al límite se acepta y se lee. «Sin leerla» no se observa directamente (igual que H-093 en AC-056) y no se dice qué aviso ve la persona. `docs/decisiones.md` dice que DEC-P80 afecta también BR-009, que no la menciona; RF-021 basta como regla, así que no cambia ningún oráculo. | Añadir el caso en el límite, escribir «no muestra vista previa» y fijar el aviso. | no |
| H-097 | menor | consistencia | SPEC-003, sección 2: «DEC-P76. [...] DEC-P41 solo orienta qué se le dice a la persona; no se conservan resultados por número de fórmula.» SPEC-003/RF-032: «Por cada fórmula solo se conservan el resultado (apta o no apta), el motivo, el siguiente paso y el número de fórmula como identificador». | `[CONFIRMADO]` Nuevo en v1.14. Al pie de la letra, DEC-P81 conserva lo que la frase de DEC-P76 dice que no se conserva. Manda DEC-P81, la más reciente. `[INFERIDO]` No chocan en la conducta: DEC-P76 dice que un resultado anterior no bloquea ni condiciona una solicitud nueva, y BR-009 ya lo fija («Toda fórmula cargada en una solicitud nueva se procesa con intentos nuevos»). Además, RF-032 dice «número de fórmula» y el resto de la SPEC dice «número de prescripción». | Anotar en DEC-P76 «Precisada por DEC-P81: el número se conserva solo como identificador y no condiciona una solicitud nueva», y usar «número de prescripción». | no |
| H-098 | menor | verificabilidad | SPEC-003/AC-054: «Dada una solicitud cuya prevalidación terminó, cuando se revisa el almacenamiento, entonces no queda ninguna foto ni PDF de esa solicitud». ARQ-005, flujo 2, paso 10: «encola una tarea en `pg-boss` para el borrado físico inmediato de las fotos/PDFs en MinIO». | `[CONFIRMADO]` Nuevo en v1.14. El borrado de ARQ-005 es asíncrono, y AC-054 no dice cuándo se revisa ni qué almacenes cuentan (archivos, base de datos, cola de tareas, registros). Un caso que revise justo al terminar puede fallar contra una implementación correcta. `[INFERIDO]` S2 puede revisarlo una vez completada la tarea de borrado. | Decir «una vez completado el borrado» (o un plazo) y nombrar los almacenes que se revisan. | no |

## Estado de los hallazgos anteriores

### Bloqueantes y altos

| id | Severidad en v1.3 | Estado en v1.7 | Evidencia |
|---|---|---|---|
| H-001 | bloqueante | Resuelto | SPEC-008 v1.4, flujo principal, pasos 2 a 6: afiliación, vigencia, cobertura PBS, autorización y fecha habilitada, igual que SPEC-003/RF-024. Queda H-026, con PREG-013. |
| H-002 | bloqueante | Resuelto; deja H-055 | DEC-P28 quita la detección. SPEC-003/RF-031 y AC-022 son comprobables en un documento sin datos legibles. El borde con la lectura parcial pasa a H-055. |
| H-003 | bloqueante | Resuelto | DEC-P23 y DEC-P28 dan respaldo: dos intentos, como el contexto 3.4. PREG-008 está respondida. |
| H-004 | bloqueante | Resuelto; deja H-054 | SPEC-003/RF-030 incluye los diagnósticos leídos (DEC-P24) y BR-009 cubre el rechazo. Falta el AC de la vista previa (H-054). |
| H-005 | alta | Resuelto en v1.8; deja H-063 | Las tres frases (sección 2, resumen de DEC-P10 y Análisis de impacto) ya dicen cédula y código en vinculación nueva y solo código nuevo en vinculación vencida, como DEC-P26. Vinculación vigente sin código nuevo sigue en el texto de DEC-P22 de la sección 2. En v1.7 seguía como alta por aplicar mal DEC-P26. |
| H-006 | alta | Sigue (OPEN-Q-006, PREG-019) | Sin cambios en flujo principal paso 7 ni en SPEC-003/AC-014. BR-008 ya no intenta decidirlo. |
| H-007 | alta | Sigue (OPEN-Q-007, PREG-013, PREG-027) | SPEC-003/RF-027 y BR-014 siguen sin el tercer desenlace. |
| H-008 | alta | Sigue (OPEN-Q-008, PREG-012, PREG-022) | Sin excepción ni AC de falla de la EPS simulada. |
| H-009 | alta | Sigue (OPEN-Q-009, PREG-010) | SPEC-003/BR-013 y AC-025 sin criterio de comparación. |
| H-010 | alta | Sigue (OPEN-Q-010, PREG-011) | Sin criterio de coincidencia para la historia clínica. |
| H-011 | alta | Sigue (OPEN-Q-011, PREG-015) | Además, la sección 14 dice «tema para arquitectura» y OPEN-Q-011 dice «Responsable: equipo». |
| H-012 | alta | Sigue (OPEN-Q-012, PREG-014) | SPEC-003 no tiene requisito de nueva prevalidación. |
| H-013 | alta | Resuelto | SPEC-003/AC-034 cubre la fecha habilitada anterior a la cita posible, junto con la igual. |
| H-014 | alta | Resuelto; deja H-053 | CL-009 se traza a AC-036 y CL-010 a AC-037. AC-036 es comprobable; AC-037 no tiene oráculo (H-053). |
| H-015 | alta | Cambió | Se cubren día ordinario, domingo y festivos consecutivos. Faltan festivo y sábado festivo. El cruce de año pasa a H-052 y el festivo entre semana a H-053. |
| H-016 | alta | Cambió | Corregido para fecha habilitada posterior (AC-002, AC-041). Sigue en los AC de documento y de crónica sin fecha. |
| H-017 | alta | Resuelto | SPEC-003/AC-039 cubre fallo y reintento correcto; SPEC-003/AC-040, el tercer intento. Queda la redacción de AC-040 (H-057). |

La cita de cada hallazgo que sigue por OPEN-Q está en la propia OPEN-Q de SPEC-003 v1.9 (OPEN-Q-006 a OPEN-Q-012 no cambian desde v1.7) y en su PREG.

### Medios y menores

| id | Estado en v1.7 | Nota |
|---|---|---|
| H-018 | Cambió | Las SPEC coinciden; PREG-021 sigue abierta. |
| H-019 | Sigue | SPEC-008/AC-051 no cambió. |
| H-020 | Sigue | PREG-016 y PREG-020 abiertas. |
| H-021 | Sigue | Sin AC propio. |
| H-022 | Sigue | PREG-017 abierta. |
| H-023 | Sigue | PREG-017 y PREG-024 abiertas. |
| H-024 | Sigue | PREG-018 y PREG-026 abiertas. |
| H-025 | Resuelto | SPEC-003/BR-008: «ante la primera regla incumplida, esa fórmula queda no apta con su motivo». |
| H-026 | Sigue (OPEN-Q-007, PREG-013) | SPEC-003 flujo paso 10 calcula antes; SPEC-008 paso 6 revisa antes la fecha habilitada. |
| H-027 | Cambió | RF-029 ya cubre la historia; queda la redacción. |
| H-028 a H-031 | Sigue | Sin cambios de fondo. |
| H-032 | Cambió | Añadido el catálogo de cobertura; faltan SPEC-008 y SPEC-008/RF-080. |
| H-033 a H-038 | Sigue | Sin cambios de fondo. |
| H-039 | Sigue (OPEN-Q-011, PREG-015) | SPEC-003 no exige guardar el resultado que consulta SPEC-002. |
| H-040, H-041 | Sigue | Disociación añadida en SPEC-008; contenido del evento sin definir. |
| H-042, H-043 | Sigue | Sin cambios. |
| H-044 | Cambió | Título corregido; «fórmulas médica» pendiente. |
| H-045, H-046 | Sigue | Sin cambios. |
| H-047 | Cambió | RF-026 corregido; quedan otros. |
| H-048 a H-050 | Sigue | Sin cambios. |
| H-051 | Cambió | Alcance actualizado a DEC-P28; quedan «cumple» sin sostén. |

## Revisión de v1.8

La diferencia con v1.7 toca solo: sección 2 (párrafo de contexto y resumen de DEC-P10), Análisis de impacto de DEC-P22 y DEC-P26, historial, línea «Completitud» de la verificación, encabezado y «Siguiente paso». Ningún RF, BR, RNF, CL, AC ni OPEN-Q cambió, así que las citas de los demás hallazgos siguen vigentes en v1.8. Sale H-005; entran H-063 y H-064. Las columnas «en v1.7» de la sección anterior se conservan como historial.

## Revisión de v1.9

La diferencia con v1.8 se revisó línea por línea. El estado actual de cada hallazgo es esta tabla más la tabla de hallazgos.

| id | Severidad en v1.8 | Estado en v1.9 | Evidencia |
|---|---|---|---|
| H-015 | alta | Resuelto; deja H-066 | SPEC-003/AC-043 cubre la prevalidación en festivo y SPEC-003/AC-044 el viernes con sábado festivo. A AC-043 le falta el lado posterior. |
| H-016 | alta | Cambió, a media | Textos exactos en SPEC-003/AC-013, AC-022, AC-024, AC-025 y AC-031, comparados con BR-014. Queda el motivo de AC-003, y el de AC-030 espera a PREG-041. |
| H-019 | media | Resuelto fuera de esta SPEC | SPEC-008/AC-051 da los dos sentidos con resultado. |
| H-044 | menor | Resuelto | SPEC-003/RF-021: «fórmulas médicas». |
| H-047 | menor | Cambió | Corregidas las filas pedidas; quedan BR-012, BR-013, BR-015 y CL-008. |
| H-051 | menor | Cambió | Quedan dos «cumple» sin sostén. |
| H-052 | alta | Resuelto | SPEC-003/AC-038 tiene fechas, años cargados y resultado en los dos lados. |
| H-053 | alta | Resuelto | SPEC-003/AC-037 tiene fechas y resultado en los dos lados. |
| H-054 | alta | Resuelto; agrava H-033 | SPEC-003/AC-045 fija campos, acciones y ausencia de edición, y está trazado a RF-030. |
| H-056 | media | Resuelto; deja H-067 | OPEN-Q-014 a OPEN-Q-020 en «Preguntas de aclaración» y sección 15, pendientes y sin responder. Cada PREG abierta que cita SPEC-003 tiene OPEN-Q; PREG-038 está en SPEC-002/OPEN-Q-038. |
| H-057 | media | Resuelto; deja H-065 | SPEC-003/AC-003 y AC-022 ya son de fórmula y AC-040 separa fórmula e historia. Desaparece «definitivamente». |
| H-059 | media | Cambió | Solo queda SPEC-003/AC-042. |
| H-064 | menor | Resuelto | La línea «Completitud» ya describe toda la SPEC. |

### Fechas comprobadas contra SPEC-003/BR-015

Día de la semana recalculado con el calendario, sin tomar el del AC.

| AC | Prevalidación | Festivos declarados | Cita posible calculada | Habilitada apta | Habilitada no apta | Estado |
|---|---|---|---|---|---|---|
| SPEC-003/AC-037 | lunes 2026-12-07 | martes 2026-12-08 | miércoles 2026-12-09 | miércoles 2026-12-09 | jueves 2026-12-10 | Correcto |
| SPEC-003/AC-038 | jueves 2026-12-31 | viernes 2027-01-01 | sábado 2027-01-02 (sábado hábil) | sábado 2027-01-02 | domingo 2027-01-03 | Correcto |
| SPEC-003/AC-043 | martes 2026-12-08 (festivo) | el mismo martes | miércoles 2026-12-09 | miércoles 2026-12-09 | sin caso (H-066) | Correcto |
| SPEC-003/AC-044 | viernes 2027-04-30 | sábado 2027-05-01 | lunes 2027-05-03 (salta sábado festivo y domingo) | lunes 2027-05-03 | martes 2027-05-04 | Correcto |

### Comprobaciones pedidas

- SPEC-003/AC-030 no fija motivo: solo añade el siguiente paso, que es igual en las dos filas de documento de BR-014. Respeta PREG-041.
- SPEC-003/AC-022 fija el motivo solo cuando el mismo documento vuelve a ser ilegible; no decide PREG-040 ni PREG-041. Su mensaje del primer intento va sin punto final y el del segundo con punto, como RF-031 y BR-014 respectivamente: S2 no debe exigir ese signo.
- SPEC-003/AC-040 dice «en esa solicitud»: no decide PREG-014, que trata de otra solicitud.
- SPEC-003/AC-046 aplica BR-008 y RF-024. No depende de PREG-013, cuyo punto 4 es sin fecha y sin año en el catálogo, ni de PREG-019.
- Ninguna OPEN-Q nueva responde su PREG.

### Ajustes de edición y cambios no listados

- El historial anota OPEN-Q-013, CL-012 en BR-012 y una errata en OPEN-Q-012. Frente a v1.8, los tres textos son idénticos: los ajustes solo deshacen lo que el generador tocó.
- El historial dice «formato de AC-045», pero el texto no es el de la petición («Dados una fórmula y una historia clínica leídas por OCR») y pasó a «junto con su historia clínica». No cambia una regla; sí influye en H-033.
- No hay cambios de fondo fuera del historial. Las únicas diferencias no listadas son cabecera, título y «Siguiente paso».

## Revisión de v1.10

La diferencia con v1.9 se revisó línea por línea. El estado actual de cada hallazgo es esta tabla más la tabla de hallazgos.

### Hallazgos que cierran las decisiones

| id | Severidad anterior | Estado en v1.10 | Evidencia |
|---|---|---|---|
| H-006 | alta | Resuelto por DEC-P33 | SPEC-003/BR-008 y AC-048. Deja H-068. |
| H-007 | alta | Resuelto por DEC-P43 y DEC-P50 | Sin tercer estado: RF-024 paso 5, AC-032 y AC-051. Deja H-073. |
| H-008 | alta | Resuelto por DEC-P31 | Sección 14. Ver SPEC-008/H-057 por el choque con SPEC-001. |
| H-009 | alta | Cambió; sigue en OPEN-Q-021 y PREG-073 | SPEC-003/BR-013 literal c. Falta el valor. Deja H-072. |
| H-012 | alta | Resuelto por DEC-P41 | SPEC-003/BR-009 y AC-049. Deja H-071 y H-076. |
| H-018 | media | Resuelto por DEC-P34 | «Devuelto por la EPS simulada» ya tiene respaldo. PREG-021 respondida. |
| H-020 | media | Resuelto por DEC-P32 | SPEC-003/BR-011, RF-024 paso 3 y AC-047. |
| H-023 | media | Resuelto por DEC-P42 | SPEC-003/AC-050 cubre 19 dígitos, 21 dígitos y caracteres no numéricos. Deja H-070. |
| H-026 | media | Resuelto por DEC-P50 | SPEC-003 flujo paso 10 y SPEC-008 paso 6 revisan primero la fecha habilitada. |
| H-046 | menor | Resuelto | SPEC-003/AC-032 tiene un solo «cuando». Deja H-075. |

H-010 y H-011 siguen en OPEN-Q-010 y OPEN-Q-011.

### Comprobación por decisión

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P31 | Sección 14, OPEN-Q-008 | Bien aplicada. El choque es de la decisión con SPEC-001: SPEC-008/H-057. |
| DEC-P32 | BR-011, RF-024 paso 3, flujo paso 9, AC-047 | Bien aplicada; RF-024 sin registro en el historial (H-079). |
| DEC-P33 | BR-008, E2, AC-048 | Bien en esos puntos; faltan E1 y AC-030 (H-068). El orden del flujo no cambió. |
| DEC-P34 | Sección 2, OPEN-Q-017 | Bien aplicada; RF-024 no cambia por esta decisión. Ver H-074. |
| DEC-P41 | BR-009, AC-049 | Aplicada a medias: H-071 y H-076. |
| DEC-P42 | BR-009, RF-029, A1, AC-050 | Bien en esos puntos; la sección 3 la extiende (H-069). |
| DEC-P43, DEC-P50 | RF-024 paso 5, flujo paso 10, AC-032, AC-051 | Bien aplicadas. Falta el caso con varias fórmulas (H-073). |
| DEC-P46 | Sección 2, RF-021, flujo paso 1 | Bien aplicada y coherente con SPEC-002 flujo paso 7 y SPEC-002/AC-036. |
| DEC-P49 | BR-013, OPEN-Q-021, sección 2 | Bien aplicada; falta AC-025 (H-072). |

### Comprobaciones pedidas

- SPEC-003/AC-047: los dos lados coinciden con BR-011 y con SPEC-008/AC-053. Su motivo es el de la fila «Medicamento no PBS sin autorización» de BR-014.
- SPEC-003/AC-048: cumple DEC-P33 en una fórmula. El caso de historia clínica es H-068.
- SPEC-003/AC-049: cumple DEC-P41 en autorización. `[INFERIDO]` «2 intentos nuevos» es por documento, como BR-009.
- SPEC-003/AC-050: es coherente con PREG-040 abierta porque no fija motivo ni usa el mensaje común. Por eso BR-014 no le da oráculo de motivo (H-070), y el motivo debe esperar esa respuesta.
- SPEC-003/AC-051 y AC-032: se complementan, sin solaparse. El primero no tiene fecha habilitada; el segundo sí.
- SPEC-003/BR-008, BR-009, BR-011 y BR-013: textos iguales a lo pedido.
- SPEC-003/RF-024 paso 5: orden correcto. El texto repite dos veces el caso sin fecha y dos veces el error, sin contradicción.
- Tolerancia (PREG-073): ninguna parte de la SPEC fija un valor. OPEN-Q-021 está como `Crítica: no`, `Estado: Pendiente` y `Responsable: equipo`.

### Decisiones frente al contexto y SPEC-001

- DEC-P31 contradice SPEC-001/RF-010 y SPEC-001/AC-012 en la rama «la EPS no responde»: se cuenta en SPEC-008/H-057, no aquí.
- DEC-P32, DEC-P33, DEC-P41, DEC-P42, DEC-P43, DEC-P46, DEC-P49 y DEC-P50 no contradicen el contexto 3.4 ni SPEC-001. DEC-P46 es compatible con SPEC-001/RF-007 y AC-005: la autorización se sigue exigiendo antes de la primera carga.

### Ajustes de edición, cambios no listados y Análisis de impacto

- Ajuste anotado: «errata en el Objetivo del Análisis» y «nota de ajuste de la versión 1.9». Frente a v1.9, ambos textos son idénticos: el ajuste solo deshace lo que tocó el generador.
- Verificación: la v1.10 nombra las OPEN-Q pendientes y sus líneas son exactas, salvo H-051 y H-078.
- Cambios de fondo no listados: H-069. Los demás cambios sin registro siguen las decisiones (H-079).
- Análisis de impacto: perdió solo «Correcciones v1.9», y DEC-P16 y DEC-P19 cambiaron de redacción sin cambiar su alcance. No importa para S2 ni para aprobar: ninguna regla depende de esa línea y el historial conserva el detalle. No se cuenta como hallazgo aparte.

## Revisión de v1.11

La diferencia con v1.10 se revisó línea por línea. El estado actual de cada hallazgo es esta tabla más la tabla de hallazgos. Las líneas del historial v1.9, v1.10 y similares que aparecen en el diff solo cambian el fin de línea.

### Hallazgos que pretendía resolver

| id | Severidad anterior | Estado en v1.11 | Evidencia |
|---|---|---|---|
| H-055 | alta | Resuelto por DEC-P54 | SPEC-003/BR-009 define ilegible y BR-014 quita «incompleto». Deja H-080 y H-082. |
| H-027 | media | Resuelto | SPEC-003/RF-029: «diagnóstico en la historia clínica». E1 ya no aplica «diagnóstico» a la fórmula. |
| H-033 | media | Resuelto por DEC-P55 | SPEC-003/RF-030, paso 4 y AC-045. Deja H-086. |
| H-068 | media | Resuelto | SPEC-003, E1, paso 2, y AC-052. El resto de los «Dado» va a H-036. |
| H-069 | media | Resuelto por DEC-P54 | La sección 3 ya coincide con AC-050. Deja H-080. |
| H-070 | media | Resuelto | SPEC-003/AC-050 cubre el segundo intento y la sección 16 lo traza a RF-029. Deja la traza de H-084. |
| H-071 | media | Cambió, sigue media | Redacción corregida y OPEN-Q-022 registrada. El vacío sigue hasta responder PREG-076. |
| H-072 | media | Resuelto | SPEC-003/AC-025: «más allá de la tolerancia definida». El caso dentro de la tolerancia no tiene oráculo, por DEC-P56. |
| H-077 | menor | Resuelto | Fila RF-029 con AC-049 y AC-050. `[INFERIDO]` AC-049 apunta a RF-029 por los «2 intentos nuevos»; la regla de solicitud nueva sigue solo en BR-009. |
| H-078 | menor | Resuelto | PREG-071 respondida por DEC-P55 y PREG-076 registrada como OPEN-Q-022. |

### Comprobación por decisión

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P53 | Sección 14, sección 2 | Bien en la sección 14. Ver H-087. |
| DEC-P54 | BR-009, BR-012, BR-014, RF-029, A1, E1, CL-012, AC-026, OPEN-Q-019 | Aplicada a medias: H-080, H-081 y H-082. |
| DEC-P55 | RF-030, paso 4, AC-045 | Bien aplicada. Ver H-086. |
| DEC-P56 | Sección 14, AC-025, OPEN-Q-021 | Bien aplicada. Ningún valor fijado. |

### Comprobaciones pedidas

- «Incompleto»: queda en una regla viva, SPEC-003/BR-009 (H-080). Las demás menciones son DEC-P09 con su precisión, DEC-P42 en la sección 2, líneas de Análisis de impacto de v1.10 y v1.11, historial y cabecera.
- Mensaje de DEC-P28 con historia clínica sin diagnóstico: DEC-P54 lo ordena, pero el texto no describe ese caso (H-083). No se abre PREG porque la decisión ya está tomada. Ningún AC exige hoy ese mensaje en este caso (H-065).
- SPEC-003/BR-014 frente a AC-050: la fila «Documento ilegible (manuscrito o no)» da motivo y siguiente paso, y BR-009 define que el caso entra ahí. Falta la traza (H-084) y limpiar BR-009 (H-080).
- SPEC-003/BR-014 frente a AC-026: AC-026 es del primer intento y no usa motivo de BR-014. El segundo intento de esa historia clínica cae en E1 y en la misma fila, sin AC con motivo (H-016).
- SPEC-003/AC-052: cumple DEC-P15 y DEC-P33, y no cambia el orden del flujo.
- OPEN-Q-022: pregunta igual a PREG-076, `Crítica: no`, `Estado: Pendiente`, `Responsable: equipo`. No responde la PREG.
- OPEN-Q pendientes en sección 15 y en «Preguntas de aclaración»: 010, 011, 015, 016, 020 y 022, las mismas en ambas.

### Ajustes de edición y cambios no listados

- Ajuste anotado: DEC-P09 lleva su precisión y AC-050 quedó sin hallazgo como origen. Comprobado; AC-052 sí lo conserva (H-084).
- Cambio de fondo fuera del historial: H-081. Los demás cambios sin registro siguen las decisiones (H-085).

## Revisión de v1.14

La diferencia con la v1.13 aprobada se revisó línea por línea, sin contar los finales de línea: el borrador v1.14 está guardado con CRLF y la v1.13 aprobada con LF.

### Hallazgos que pretendía resolver

| id | Severidad anterior | Estado en v1.14 | Evidencia |
|---|---|---|---|
| H-090 | media | Cambió, sigue media | SPEC-003/RF-032 ya define el final: «La prevalidación termina cuando se emite el resultado de todas las fórmulas o cuando la solicitud se detiene (afiliación inactiva o historia clínica con sus dos intentos agotados).» Quedan fuera el error de DEC-P43 y los AC de cada final. Ver su fila. |
| H-091 | media | Resuelto por DEC-P81 | SPEC-003/RF-032: «Por cada fórmula solo se conservan el resultado (apta o no apta), el motivo, el siguiente paso y el número de fórmula como identificador; los medicamentos y el diagnóstico leídos se borran con los archivos (DEC-P81).» PREG-078 respondida. Deja H-097 y H-098. |
| H-094 | media | Cambió, a menor | SPEC-003/AC-055 fija la fecha habilitada del miércoles y el resultado de cada lado. Quedan los días sin festivo y el «Dado» completo. |
| H-022 | media | Cambió, sigue media | DEC-P80 responde PREG-077 y SPEC-003/AC-058 cubre el rechazo. Quedan sin valor los límites técnicos (OBS-019). |

### Comprobación por decisión

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P80 | RF-021, AC-058, sección 2, sección 16 | Bien aplicada y sin extender: el texto de RF-021 y de la sección 2 coincide con `docs/decisiones.md`, y AC-058 no fija ningún número. BR-009, que el registro también nombra, no cambió; no hace falta, porque RF-021 basta (H-096). |
| DEC-P81 | RF-032, AC-054, sección 2, sección 16 | Bien aplicada y sin extender. RF-032 y AC-054 conservan justo los cuatro datos de la decisión y borran medicamentos y diagnóstico. La sección 2 omite la frase sobre ARQ-005 (COMP-003, ADR-007), que es de Arquitectura, no de la SPEC. Deja H-097 y H-098. |

### Comprobaciones pedidas

- SPEC-003/RF-032 y AC-054 frente a DEC-P81: cumplen. AC-054 se observa en las dos direcciones: quedan resultado, motivo, siguiente paso y número, y no quedan medicamentos ni diagnóstico leídos. Ahora revisa «el almacenamiento», no solo el de documentos, así que alcanza a la base de datos; falta decir cuándo y cuáles (H-098).
- Frente a SPEC-002/RF-018 y SPEC-002/AC-016 (consulta): compatibles. SPEC-002 pide «el estado preliminar de las fórmulas registradas» por fórmula, y el número da el identificador que faltaba (cierra el `[INFERIDO]` de H-091). Ningún texto de SPEC-002 muestra medicamentos ni diagnóstico en la consulta; SPEC-002/RNF-009 y BR-008 los excluyen de los avisos. SPEC-002 no necesita cambiar, aunque el registro de DEC-P81 la nombre. Los motivos de SPEC-003/BR-014 no nombran el medicamento, así que borrarlo no deja un motivo incompleto. `[INFERIDO]` La persona distingue sus fórmulas solo por un número de 20 dígitos; es de usabilidad, no de la SPEC.
- Frente a DEC-P51: compatibles. RF-032 pone un techo («solo se conservan») a lo que queda al terminar, sin obligar a conservarlo. Tras una revocación manda DEC-P51 (SPEC-001/RF-009, SPEC-008/RF-083), que borra también el resultado y el número. AC-054 mira el momento anterior a la revocación.
- Definición de «termina»: no decide algo abierto. Los dos finales por detención salen de DEC-P33 (E2) y DEC-P15 (E1); el abandono queda explícitamente «sin valor decidido», como en ARQ-005 (ADR-003) y OBS-019. La historia clínica agotada no «detiene» la evaluación (E1 paso 2: «La afiliación se verifica igualmente»), pero acaba con todas las fórmulas no aptas, así que también es un final; no cambia ningún oráculo. Lo que falta es el error de DEC-P43 (H-090).
- SPEC-003/AC-055: observable. Comprobado contra BR-015: lunes 23:59:59 da cita el martes, y una habilitada del miércoles es posterior: no apta. Martes 00:00:00 da cita el miércoles, igual a la habilitada: apta. Mismo corte que DEC-P25 y SPEC-008/AC-055. Resto en H-094.
- SPEC-003/AC-058: observable en lo que dice (no hay vista previa y el contador de intentos no cambia), una vez fijado el límite. Sin valor (H-022) y sin el lado del límite ni aviso (H-096).
- DEC-P81 cambia ARQ-005 (COMP-003, flujo 2 paso 11, ADR-007), que hoy cifra y guarda los textos leídos. ARQ-005 está congelada; no es hallazgo de la SPEC, pero la implementación de RF-032 debe seguir DEC-P81 y no ARQ-005 hasta su próxima versión.

### Cambios fuera del historial

- Cambios de fondo fuera del historial: ninguno. El diff coincide con los seis puntos de la petición, y el historial y el Análisis de impacto los recogen.
- Ajuste de edición anotado («se restauró «estrictamente» en RF-024»): RF-024 es idéntico al de v1.13. El ajuste solo deshace lo que tocó el generador.
- «Verificación»: no se tocó, como pedía la orden. Sigue H-051 (dice «AC-001 a AC-052»).
- El origen de RF-032 no cita la frase de H-090; no hace falta, porque no es una decisión nueva.
- Fin de línea: el borrador está en CRLF. Antes de moverlo a `aprobadas/` hay que pasarlo a LF, por el hash. No es un hallazgo de la SPEC.

## Revisión de v1.13

La diferencia con la v1.12 aprobada se revisó línea por línea, sin contar los finales de línea: el borrador v1.13 está guardado con CRLF y la v1.12 aprobada con LF.

### Hallazgos que cierran las decisiones

| id | Severidad anterior | Estado en v1.13 | Evidencia |
|---|---|---|---|
| H-010 | alta (seguía por OPEN-Q-010) | Resuelto por DEC-P73 | SPEC-003/BR-009: «los datos extraídos de una fórmula no coinciden con la EPS simulada (la historia clínica no se compara, DEC-P73)». El riesgo lo acepta el equipo. Resto de forma en H-092. |
| H-011 | alta (seguía por OPEN-Q-011) | Resuelto por DEC-P59 | SPEC-003/RF-032 y AC-054; sección 14: «[Mecanismo de borrado de los archivos]: tema para arquitectura (ARQ-005/ADR-003).» Deja H-090 y H-091. |
| H-039 | media (seguía por OPEN-Q-011) | Resuelto | SPEC-003/RF-032: «conservar solo el resultado». La consulta de SPEC-002 tiene ya qué leer. Qué contiene el resultado pasa a H-091. |
| H-016 | media | Cambió, sigue media | DEC-P75 ya da el motivo de AC-030, pero el AC no lo fija. Ver su fila. |
| H-022 | media | Cambió, sigue media | Formato resuelto (DEC-P74, AC-056). Quedan el valor del límite (OBS-009) y el máximo de fórmulas (PREG-077). |
| H-024 | media | Resuelto por DEC-P70 y DEC-P71 | SPEC-003/RF-024 paso 2 y BR-015: «La fecha de prevalidación es la del momento en que el sistema ejecuta las reglas, en hora de Colombia (DEC-P70, DEC-P71).» Deja H-094 y H-095. |
| H-050 | menor | Resuelto en SPEC-008 v1.10 | SPEC-008/BR-025 v1.10: «de 8 a 9 meses, con los extremos incluidos». Si SPEC-008 v1.10 no se aprueba, vuelve. |
| H-051 | menor | Cambió, sigue menor | Dos líneas de «Verificación» ya son exactas; otras tres quedaron viejas. |
| H-058 | media | Resuelto por DEC-P75 | SPEC-003/BR-014: «Si un documento falla por causas distintas en sus dos intentos, se muestra el motivo de la causa del segundo intento (DEC-P75).» SPEC-003/AC-057 lo comprueba. |
| H-067 | menor | Resuelto | OPEN-Q-015 queda `Respondida (DEC-P74)`. El máximo de fórmulas que omitía pasa a H-022 y PREG-077. |
| H-071 | media | Cambió, a menor | DEC-P76 decide la conducta y BR-009 la recoge. Falta el AC. |

### Comprobación por decisión

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P59 | RF-032, AC-054, sección 14, sección 2 | Bien aplicada y sin extender: no toca la revocación, que sigue en SPEC-001/RF-009. Deja H-090 y H-091. |
| DEC-P70, DEC-P71 | RF-024 paso 2, BR-015, AC-055, sección 2 | Bien aplicadas, con la misma frase que SPEC-008/BR-025. Deja H-094 y H-095. |
| DEC-P73 | BR-009, sección 2 | Bien aplicada en lo pedido. No se extiende: BR-013 ya era solo de fórmulas. El riesgo aceptado no lleva AC, y es correcto. RF-029 y A1 sin ajustar (H-092). |
| DEC-P74 | BR-009, AC-056, sección 14 | Bien aplicada. DEC-P42 se conserva: «Un número de prescripción que no tenga 20 dígitos numéricos cuenta como documento ilegible y consume un intento.» Deja H-022 y H-093. |
| DEC-P75 | BR-014, AC-057 | Bien aplicada. AC-057 cubre ilegible y luego no coincidente, con el motivo del segundo intento. |
| DEC-P76 | BR-009 | Bien aplicada en la regla. AC-049, que la decisión nombra, no cambió (H-071). |

### Comprobaciones pedidas

- Historia clínica sin comparación (DEC-P73) frente a E1: sin contradicción. E1 paso 1 habla de «una fórmula» y su «coincidencia con la EPS»; E1 paso 2 habla del fallo de la historia en dos intentos, sin decir por qué.
- Frente a SPEC-003/AC-030: sin contradicción. AC-030 dice «falla en sus dos intentos de procesamiento OCR o confirmación», sin comparación.
- Frente a BR-013: sin contradicción. «Una fórmula se considera coincidente» ya era solo de fórmulas. La fila «Documento no coincidente o 2 rechazos OCR» de BR-014 queda para la historia solo por los rechazos.
- Lo único que sigue mencionando «no coincidir» para cualquier documento son RF-029 y A1 (H-092), sin efecto en un oráculo.
- RF-032 y AC-054 frente a DEC-P51: compatibles. RF-032 limita lo que queda al terminar la prevalidación; DEC-P51 limita lo que queda tras revocar (SPEC-001/RF-009, SPEC-008/RF-083). AC-054 mira el momento anterior a la revocación. Ningún texto obliga a conservar el resultado después de revocar.
- Frente a SPEC-002/RF-018 y AC-016 (consulta de resultados): compatibles. El resultado queda, así que se puede consultar. Lo que se muestra depende de qué contiene el resultado (H-091, PREG-078).
- Fechas de SPEC-003/AC-055 frente a BR-015 y DEC-P13: correctas. Lunes a las 23:59:59: el primer día hábil siguiente es el martes. Martes a las 00:00:00: es el miércoles. No usa sábado, domingo ni festivo. No tiene fecha concreta ni fecha habilitada (H-094).
- Frente a DEC-P25: mismo patrón de corte a las 00:00 en hora de Colombia.
- Frente a SPEC-008/AC-055: no se pisan. Uno es de vigencia y el otro de cita posible, con la misma definición de fecha.

### Cambios fuera del historial

- Cambios de fondo fuera del historial: ninguno. El diff coincide con los nueve puntos de la petición.
- Sin pedido literal: la línea de T-009 en la sección 14 ganó «DEC-P74», y el origen de RF-024 ganó DEC-P70 y DEC-P71. Las dos siguen las decisiones, y el historial nombra «sección 14» y «actualización de RF-024».
- «Verificación»: solo cambiaron «Completitud» y «No ambigüedad», como pedía la orden. Por eso quedaron viejas otras tres líneas (H-051).
- Fin de línea: el borrador está en CRLF. `orquestador.py` calcula el hash sobre los bytes sin normalizar, y `.gitattributes` fija LF al confirmar. Antes de aprobar, conviene pasarlo a LF para que el hash no cambie en el siguiente checkout. No es un hallazgo de la SPEC.

## Revisión de v1.12

La diferencia con v1.11 se revisó línea por línea. El estado actual de cada hallazgo es esta tabla más la tabla de hallazgos. Las líneas del historial de versiones anteriores que aparecen en el diff solo cambian el fin de línea.

### Hallazgos que pretendía resolver

| id | Severidad anterior | Estado en v1.12 | Evidencia |
|---|---|---|---|
| H-065 | media | Resuelto; la traza pasa a H-084 | SPEC-003/AC-026: «muestra el mensaje común de RF-031 y una pantalla con consejos para tomar una foto legible». |
| H-080 | media | Resuelto; deja H-089 | SPEC-003/BR-009: «cuenta como documento ilegible y consume un intento». «Incompleto» ya no está en ninguna regla, flujo ni AC. |
| H-081 | media | Resuelto | SPEC-003/BR-009: «(incluyendo documentos ilegibles, manuscritos o no), falta alguno de sus datos obligatorios». A1: «—manuscrito o no, o por faltar datos obligatorios—». E1: «(manuscrita o no, o por faltar datos obligatorios)». Coincide con RF-029, RF-031 y DEC-P28. |
| H-082 | media | Resuelto; deja H-088 | SPEC-003/RF-031: «Un documento es ilegible según BR-009 (DEC-P54).» AC-050 exige el mensaje común en el primer intento. AC-053 cubre número sin medicamentos. E3 y AC-022 no cambian, y con el enlace de RF-031 ya no hace falta. |
| H-084 | menor | Cambió, sigue menor | Solo se aplicaron AC-050 en BR-014 y DEC-P54 en RF-031. Ver su fila. |
| H-087 | menor | Resuelto; deja H-089 | SPEC-003, sección 2: «La verificación de identidad conserva SPEC-001/RF-010.» Mismo texto que SPEC-008, sección 2. |

### Comprobaciones

- Mensaje común en un número de 19 o 21 dígitos: coherente. BR-009 lo cuenta como ilegible, RF-031 remite a BR-009 y DEC-P54 dice «siempre». Antes AC-050 no lo fijaba porque PREG-040 seguía abierta; DEC-P54 la respondió.
- SPEC-003/AC-053: formato correcto, con la cabecera «Dada», y trazado en HU-005, RF-031 y BR-009. Falta la fila RF-029 (H-088).
- SPEC-003/AC-026 y AC-050 no fijan el motivo del segundo intento de una historia clínica sin diagnóstico: sigue en H-016.
- DEC-P53 frente a SPEC-001: la sección 2 ya deja intacta SPEC-001/RF-010, sin tocar SPEC-001.
- Coherencia con SPEC-008 v1.9 y SPEC-002 v1.11: sin choques nuevos. DEC-P09 ya dice lo mismo en las dos SPEC.
- Las OPEN-Q pendientes no cambian: 010, 011, 015, 016, 020 y 022.
- Ningún cambio fija un valor de tolerancia.

### Cambios fuera del historial

- Cambios de fondo fuera del historial: ninguno. El diff coincide con los seis puntos de la petición, y el historial y el Análisis de impacto los recogen. Lo único sin nombrar es H-084, dentro de «actualización de trazabilidad». La versión no anota ajustes de edición.
- «Verificación» no se tocó, como pedía la orden. Por eso quedó sin AC-053 (H-051).

## OPEN-Q pendientes

Ninguna. En v1.13 quedaron respondidas OPEN-Q-010 (DEC-P73), OPEN-Q-011 (DEC-P59), OPEN-Q-015 (DEC-P74), OPEN-Q-016 (DEC-P70, DEC-P71), OPEN-Q-020 (DEC-P75) y OPEN-Q-022 (DEC-P76).

Ninguna en v1.14 tampoco. PREG-077 y PREG-078 quedaron respondidas por DEC-P80 y DEC-P81. Los valores de tolerancia (DEC-P56), de los límites de tamaño, páginas y fórmulas y del plazo de purga de solicitudes abandonadas siguen en OBS-019 de `docs/mvp.md` (antes OBS-009).

## Valores límite revisados

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| 2 intentos por documento | SPEC-003/AC-039 (un fallo y reintento correcto) | SPEC-003/AC-003, AC-013, AC-022, AC-030, CL-001 | SPEC-003/AC-040 (sin tercer intento) | Cumple |
| 20 dígitos del número | SPEC-003/AC-050 (19 dígitos, en los dos intentos) | SPEC-003/AC-013, SPEC-008/AC-044 | SPEC-003/AC-050 (21 dígitos y caracteres no numéricos) | Cumple |
| Vigencia frente a fecha de prevalidación | SPEC-003/AC-015; SPEC-008/AC-045; SPEC-008/AC-055 (00:00:00 del día siguiente) | SPEC-008/AC-046; SPEC-008/AC-055 (23:59:59 del día D); sin AC en SPEC-003 | SPEC-003/AC-001 de forma implícita, sin fecha | Parcial |
| Medianoche en la cita posible (DEC-P70, DEC-P71) | Lunes 23:59:59: cita el martes y no apta con habilitada del miércoles (SPEC-003/AC-055) | Martes 00:00:00: cita el miércoles y apta (SPEC-003/AC-055) | No aplica | Cumple, con reserva: faltan fechas sin festivo (H-094) |
| Fecha habilitada frente a cita posible | SPEC-003/AC-034 | SPEC-003/AC-023, AC-029, AC-035, AC-036 | SPEC-003/AC-002, AC-023, AC-041 | Cumple |
| Día hábil siguiente | Ordinario: AC-035; viernes a sábado: AC-002; domingo: AC-034 | Sábado a lunes: AC-036; sábado con lunes festivo: AC-023; festivos consecutivos: AC-042; festivo entre semana: AC-037; viernes con sábado festivo: AC-044 | Prevalidación en festivo: AC-043, sin lado posterior (H-066) | Parcial |
| Año del catálogo de festivos | Año cargado: implícito | SPEC-003/AC-032, SPEC-008/AC-052 (año faltante con fecha habilitada); SPEC-003/AC-051 (sin fecha habilitada) | Cruce de año: SPEC-003/AC-038 | Cumple |
| Fórmulas por solicitud (límite técnico, DEC-P80) | Una: SPEC-003/AC-001 | Sin AC: la que llega justo al límite (H-096) | SPEC-003/AC-058, sin valor (H-022) | Parcial: valor en OBS-019 |
| Tamaño y páginas de archivo (DEC-P74) | Sin valor: lo fija Arquitectura (OBS-009) | Sin AC | Sin AC; solo el formato tiene AC-056 | No cumple (H-022) |
| 8 a 9 meses de vigencia de prueba | SPEC-008/AC-056 v1.10 | SPEC-008/AC-056 v1.10 (extremos incluidos) | SPEC-008/AC-056 v1.10 | Cumple en SPEC-008 v1.10 |
| Tolerancia de la lectura de medicamentos (DEC-P49) | Sin oráculo, por DEC-P56 | Sin valor: lo propone Arquitectura y lo aprueba el equipo (DEC-P56) | SPEC-003/AC-025 | Parcial, por decisión |

Los valores 30 unidades, 10 minutos, 3 intentos, 48 horas y 90 días no aparecen en SPEC-003 v1.14: pertenecen a otros módulos.

## Preguntas creadas

- `docs/preguntas/PREG-040.md` — ¿Cuándo un documento es «ilegible» y cuándo es «incompleto» si el OCR lee solo una parte? — bloquea: no
- `docs/preguntas/PREG-041.md` — Si un documento falla por causas distintas en sus dos intentos, ¿qué motivo se muestra? — bloquea: no

- `docs/preguntas/PREG-071.md` — ¿La confirmación de la lectura OCR es por documento o conjunta, y a qué documento se le cuenta un rechazo? — bloquea: no (revisión de v1.9, H-033)
- `docs/preguntas/PREG-076.md` — ¿Qué hace el sistema si en una solicitud nueva se carga una fórmula con un resultado que DEC-P41 no nombra? — bloquea: no (revisión de v1.10, H-071)

- `docs/preguntas/PREG-077.md` — ¿Cuántas fórmulas admite como máximo una solicitud? — bloquea: no (revisión de v1.13, H-022)
- `docs/preguntas/PREG-078.md` — ¿Qué datos forman el «resultado» que se conserva cuando se borran las fotos y los PDF? — bloquea: no (revisión de v1.13, H-091)

Las revisiones de v1.8, v1.11, v1.12 y v1.14 no crearon ninguna PREG. En v1.14, PREG-077 y PREG-078 están respondidas por DEC-P80 y DEC-P81; lo que queda de H-090, H-094 y H-096 a H-098 es de redacción o de valores ya registrados en OBS-019. En v1.13, PREG-011, PREG-015, PREG-017, PREG-018, PREG-026, PREG-041 y PREG-076 están respondidas por DEC-P73, DEC-P59, DEC-P74, DEC-P70, DEC-P71, DEC-P75 y DEC-P76. PREG-077 sale de un punto de PREG-017 que DEC-P74 no respondió; no repite una PREG abierta. PREG-040, PREG-071 y PREG-073 quedaron respondidas por DEC-P54, DEC-P55 y DEC-P56. No se repitió ninguna PREG existente. PREG-008 y PREG-009 siguen respondidas por DEC-P23 y DEC-P24; DEC-P28 modifica DEC-P23. PREG-073 la creó la decisión DEC-P49, no esta revisión.

## Criterios

- Verificabilidad: no cumple. En v1.14 se revisaron AC-054, AC-055 y AC-058. AC-055 ya tiene oráculo (H-094 baja a menor); AC-054 no dice cuándo ni dónde mirar (H-098) y AC-058 no tiene el lado del límite ni aviso (H-096). Quedan además H-016, H-059, H-075, H-088 y H-093.
- No ambigüedad: no cumple. H-091 quedó resuelto por DEC-P81. Quedan H-028, H-083, H-086, H-089 y H-095.
- Completitud: no cumple. Quedan H-022 (valores técnicos en OBS-019), H-066, H-071, H-073, H-088 y H-090 (error de DEC-P43 y AC por final).
- Consistencia: no cumple. Se contrastó con DEC-P15, DEC-P33, DEC-P43, DEC-P51, DEC-P59, DEC-P76, DEC-P80, DEC-P81, SPEC-002/RF-018, SPEC-002/AC-016 y ARQ-005. No hay choques de conducta con decisiones. Quedan H-030, H-060, H-063, H-074, H-089, H-092 y H-097 (frase de DEC-P76).
- Trazabilidad: no cumple en contenido. AC-058 está en HU-005 y RF-021, y DEC-P80 y DEC-P81 en los orígenes. Quedan H-047, H-051, H-079, H-084 y H-085.

## Conclusión

`APTA_CON_RESERVAS`: no hay hallazgos bloqueantes ni altos en v1.14. S2 puede diseñar casos de lo confirmado. DEC-P80 y DEC-P81 están bien aplicadas y sin extender; RF-032 y AC-054 son compatibles con SPEC-002 y con DEC-P51. No se creó PREG. Nada impide formalmente aprobarla.

Conviene, sin ser condición: añadir el error de DEC-P43 a los finales de RF-032 (H-090), porque al pie de la letra deja fotos y PDF de salud a la espera de una purga sin valor; y fijar fechas sin festivo en AC-055 (H-094). Cada una es una frase. La implementación de RF-032 debe seguir DEC-P81 y no ARQ-005/COMP-003, que guarda los textos leídos. El borrador debe pasarse a LF antes de moverlo a `aprobadas/`. Ningún agente aprueba esta SPEC; la aprobación es de una persona.
