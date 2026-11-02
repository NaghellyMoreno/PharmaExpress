# Informe de revisión — SPEC-008

Fecha: 2026-11-02
Revisor: S1 (prueba estática)
Veredicto: APTA_CON_RESERVAS
Lint previo: `python qa/scripts/lint_spec.py` (PYTHONUTF8=1) sobre la v1.10 terminó sin hallazgos bloqueantes. Definiciones: RF 10, BR 3, RNF 2, CL 2, AC 23. 1 aviso de tipo `limite`: «48 horas» (línea 199, §13; H-032). El aviso «9 meses» de la v1.9 ya no sale: H-014 queda resuelto con AC-056.
SPEC revisada: agentes-ia/salidas/specification-agent/borradores/SPEC-008/SPEC-008_v1.10.md (versión 1.10, estado Candidata), frente a la aprobada `aprobadas/SPEC-008_v1.9.md`. Octava revisión, corta: solo cubre el cambio frente a la v1.9 (DEC-P70, DEC-P71 y DEC-P72); los demás hallazgos se conservan de las revisiones anteriores. Coherencia contrastada con SPEC-003_v1.13.md (Candidata), SPEC-002_v1.11.md y SPEC-001_v1.1.md (aprobadas).
MVP: parcial. `docs/mvp.md` sigue en `borrador`. Dentro del Debe: REQ-007 (EPS simulada y catálogos) como soporte de la prevalidación de DEC-P01. REQ-023 figura como Debe y la SPEC lo deja «en evaluación» por DEC-P35: se decide en PREG-074. Las métricas de SPEC-008/RF-083 no tienen REQ en `docs/mvp.md`; por eso sus hallazgos propios van con severidad máxima `menor`, salvo los de datos de salud que afectan SPEC-001/RF-009 (Debe), como H-059.

## Resumen (3 líneas)

La v1.10 aplica bien DEC-P70, DEC-P71 y DEC-P72, sin extender su alcance: resuelve H-014, H-015 y H-020 (los tres medios), cierra OPEN-Q-009 y OPEN-Q-010 y deja SPEC-008/AC-055 coherente con BR-025 y con el patrón de DEC-P25.
No hay bloqueantes ni altos. Entran 3 nuevos, todos menores: H-068 (dos líneas cambiadas fuera de la petición y del historial, fieles a DEC-P72), H-069 (aritmética de meses en AC-056) y H-070 (la definición de fecha de prevalidación solo está en BR-025, aunque DEC-P71 nombra RF-084, AC-046 y AC-052). No hay cambios de fondo fuera del historial.
Total: 41 (0 bloqueantes, 0 altos, 9 medios, 32 menores). S2 puede diseñar casos de lo confirmado. No se crearon PREG.

## Revisión de la v1.10

La diferencia con la v1.9 aprobada se revisó línea por línea, sin contar los finales de línea: el borrador v1.10 está guardado con CRLF y la v1.9 aprobada con LF.

| id | Severidad en v1.9 | Estado en v1.10 | Evidencia | Queda |
|---|---|---|---|---|
| H-014 | media | resuelto | SPEC-008/AC-056: «entonces su fecha límite está entre 8 y 9 meses después de su fecha de prescripción, ambos extremos incluidos.» Trazado en BR-025 y HU-010. | H-069, solo la aritmética de meses. |
| H-015 | media | resuelto por DEC-P72 | SPEC-008/BR-025: «de 8 a 9 meses, con los extremos incluidos, contados desde la fecha de prescripción (DEC-P72)». «Estrictamente» ya no está. El modelo de dominio guarda «fecha de prescripción». | Nada. |
| H-020 | media | resuelto por DEC-P70 y DEC-P71 | SPEC-008/BR-025: «La fecha de prevalidación es la del momento en que el sistema ejecuta las reglas, en hora de Colombia (DEC-P70, DEC-P71).» SPEC-008/AC-055 fija 23:59:59 del día D (vigente) y 00:00:00 del día siguiente (vencida). | H-070. |
| H-035 | menor | sigue | SPEC-008/AC-055 da el límite a los dos lados de la medianoche, pero el lado «por encima» (fecha límite posterior a la fecha de prevalidación) sigue sin AC con fecha. | Ver su fila. |
| H-056 | menor | cambió, sigue menor | SPEC-008, Verificación: «Completitud: parcial. No quedan preguntas pendientes; sigue sin AC la obligación de cargar el año siguiente en el catálogo (RF-084).» Es exacta. | Los dos «cumple»; ver su fila. |

### Comprobaciones

- Aviso del lint: solo queda «48 horas» (H-032). «9 meses» desapareció porque ya no está en la cabecera.
- DEC-P70 y DEC-P71: bien aplicadas en BR-025, en §2 y en el Análisis de impacto. No se extienden: no tocan RF-084 ni otro RF. La palabra «fija» de DEC-P71 no se copió; Colombia no tiene horario de verano, así que no cambia nada.
- DEC-P72: bien aplicada en BR-025 y en AC-056. También cambió el glosario del Análisis y la restricción de §13 (H-068), con el mismo sentido que la decisión.
- SPEC-008/AC-055 frente a BR-025: coherente. Con fecha límite D, a las 23:59:59 de D la fecha de prevalidación es D, y D ≥ D da vigente. A las 00:00:00 de D+1, D < D+1 da vencida. Igual que DEC-P25 para la vinculación («vigente todo el día de vencimiento ... vencida a las 00:00 del día siguiente»).
- SPEC-008/AC-055 frente a SPEC-003/BR-015 y DEC-P13: no se tocan. AC-055 es de vigencia, no de cita posible. Usan la misma fecha de prevalidación (SPEC-003/RF-024 paso 2 y BR-015 llevan la misma frase), así que una crónica prevalidada a las 00:00:00 de D+1 es vencida por SPEC-008/AC-055 y se detiene antes del cálculo de SPEC-003/AC-055.
- El AC usa una fecha simbólica (día D), no una fecha del catálogo, así que no puede chocar con un festivo.
- OPEN-Q-009 y OPEN-Q-010 quedan `Respondida` en «Preguntas de aclaración» y en §15. PREG-018, PREG-025 y PREG-026 ya figuran como respondidas.
- Cambios de fondo fuera del historial: ninguno. Las dos líneas de H-068 son de forma y siguen DEC-P72. El Análisis de impacto conserva sus líneas y añade una.
- «Verificación»: solo cambió «Completitud», como pedía la orden.
- Fin de línea: el borrador está en CRLF. `orquestador.py` calcula el hash sobre los bytes tal cual (`hash_archivo`), sin normalizar, y `.gitattributes` fija LF al confirmar. Si una persona aprueba y fija el hash con el archivo en CRLF, el hash cambiará en el siguiente checkout con LF e invalidará el módulo sin motivo. Antes de mover el archivo a `aprobadas/`, conviene pasarlo a LF. No es un hallazgo de la SPEC.

## Revisión de la v1.9

La diferencia con la v1.8 se revisó línea por línea. Las líneas del historial que aparecen en el diff sin cambio visible solo cambian el fin de línea.

| id | Severidad en v1.8 | Estado en v1.9 | Evidencia | Queda |
|---|---|---|---|---|
| H-056 | menor | cambió, sigue menor | SPEC-008, Verificación: «Completitud: parcial. Siguen pendientes OPEN-Q-009 y OPEN-Q-010». La línea ya coincide con §15. | Los dos «cumple». Ver la fila de H-056. |
| H-065 | menor | resuelto | SPEC-008 §2: «Precisada por DEC-P54: se trata como ilegible.» Igual que SPEC-003 §2. | Nada. |
| H-066 | menor | resuelto; deja H-067 | SPEC-008/RF-084, BR-027 y sus filas de §16: «DEC-P13, DEC-P19, DEC-P43 y DEC-P50». Las dos filas incluyen AC-050. | H-067. |

### Comprobaciones

- Aviso del lint: los mismos dos de la v1.8. Ninguno es nuevo.
- OPEN-Q-009 y OPEN-Q-010: siguen `Pendiente`; ninguna se responde.
- Ajuste anotado: «una palabra en inglés en Verificación». Frente a la v1.8, la única línea cambiada de esa sección es «Completitud», con el texto pedido: el ajuste solo deshace lo que tocó el generador.
- Cambios de fondo fuera del historial: ninguno. El diff coincide con los tres puntos de la petición, y el Análisis de impacto solo añade tres líneas.

## Revisión de la v1.8

La diferencia con la v1.7 se revisó línea por línea. Las líneas del historial que aparecen en el diff sin cambio visible solo cambian el fin de línea.

| id | Severidad en v1.7 | Estado en v1.8 | Evidencia | Queda |
|---|---|---|---|---|
| H-056 | menor | cambió, sigue menor | SPEC-008, «Preguntas de aclaración» y §15: OPEN-Q-009 y OPEN-Q-010, con `Crítica: no`, `Estado: Pendiente` y `Responsable: equipo`. | Ver la fila de H-056. |
| H-057 | media | resuelto por DEC-P53 | SPEC-008 §2: «La verificación de identidad conserva SPEC-001/RF-010.» §14: «durante la prevalidación». SPEC-001 no cambia. | Nada en esta SPEC. Ver SPEC-003/H-087. |
| H-058 | media | resuelto | SPEC-008/RF-084 y BR-027: «Una fórmula crónica sin fecha habilitada queda no apta antes de consultar el catálogo (DEC-P50).» | H-066, solo orígenes y traza. |
| H-059 | media | resuelto | SPEC-008/AC-054: «Dado un evento almacenado». | Nada. Ya cubre los eventos de error y el intento de SPEC-002/AC-035. |

### Comprobaciones

- DEC-P53: bien aplicada en §2 y §14. La línea de DEC-P31 del Análisis de impacto es historia de la v1.7 y no se cuenta.
- OPEN-Q-009 y OPEN-Q-010: preguntas iguales a PREG-018, PREG-026 y PREG-025, sin responderlas.
- Ajuste anotado: «una palabra en inglés en RF-081». Frente a la v1.7, RF-081 es idéntico: el ajuste solo deshace lo que tocó el generador.
- Cambios de fondo fuera del historial: ninguno. El Análisis de impacto se conservó y añadió las líneas nuevas.
- «Verificación» no se tocó, como pedía la orden. Por eso quedó desactualizada (H-056).

## Revisión de la v1.7

La diferencia con la v1.6 se revisó línea por línea.

| id | Severidad en v1.6 | Estado en v1.7 | Evidencia | Queda |
|---|---|---|---|---|
| H-006 | alta | resuelto por DEC-P51 | SPEC-008/RF-083 y AC-054: «del evento solo quedan el tipo y la fecha, sin resultado, novedades ni dato que identifique al paciente.» | H-059 y H-060. PREG-050 respondida. |
| H-007 | media | resuelto por DEC-P35 | SPEC-008 §2: «quedan en evaluación (DEC-P35).» | REQ-023 en `docs/mvp.md` (PREG-074) y H-061. |
| H-010 | media | resuelto por DEC-P42 | SPEC-008 §2 remite a SPEC-003/BR-009, y SPEC-003/AC-050 cubre 19 y 21 dígitos y caracteres no numéricos. | La sección 16 no traza SPEC-003/AC-050; sin efecto en S2. |
| H-011 | media | resuelto por DEC-P43 | SPEC-008/AC-052: sin estado propio y solicitud nueva. | H-058. |
| H-016 | media | resuelto por DEC-P36 | SPEC-008 A1: «el equipo provoca una modificación». RF-082: «sin interfaz de producto ni rol nuevo». | Nada. |
| H-017 | media | cambió, sigue media | SPEC-008/RF-080 ya tiene observación. | Ver la fila de H-017. |
| H-048 | media | resuelto | SPEC-008/AC-042 queda solo como almacenamiento y AC-054 cubre la revocación. | Nada. |
| H-049 | media | resuelto por DEC-P50 | SPEC-008 paso 6 y SPEC-003 paso 10 revisan primero la fecha habilitada. | H-062. |
| H-050 | menor | resuelto | La línea de T-036 ya no está en el Análisis de impacto. | Nada. |

### Comprobación por decisión

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P31 | §14, OPEN-Q-008 | Bien aplicada. La decisión choca con SPEC-001 (H-057). |
| DEC-P32 | BR-026, RF-077, paso 4, AC-053 | Bien aplicada. AC-053 solo cubre el lado sin autorización; el otro está en SPEC-003/AC-047. |
| DEC-P34 | §2, RF-076 | Bien aplicada. SPEC-008/AC-051 dice «indicador en la fórmula»; con DEC-P34 se lee como el dato de la EPS simulada. |
| DEC-P35 | §2, §3, §14, modelo de dominio, HU-011, RF-079, RF-081, RF-082, RF-083, A1, AC-038, AC-040 | Bien aplicada. Ver H-061. |
| DEC-P36 | RF-080, RF-082, A1 | Bien aplicada en lo pedido; faltan RF-078 y RF-084 (H-017). |
| DEC-P42 | §2 | Bien aplicada, sin copiar la regla. |
| DEC-P43, DEC-P50 | Paso 6, AC-052 | Bien aplicadas en lo pedido; faltan RF-084 y BR-027 (H-058). |
| DEC-P51 | Modelo de dominio, RF-083, RNF-018, paso 7, AC-042, AC-054 | Bien aplicada. Ver H-059 y H-060. |

### Comprobaciones pedidas

- SPEC-008/AC-042 y AC-054 frente a SPEC-001/RF-009: no chocan. AC-042 guarda resultado y novedades antes de una revocación. AC-054 deja menos de lo que RF-009 permite conservar, y cumple «eliminar los datos personales y de salud tratados» y «registros de auditoría disociados de la identidad». El orden de los dos AC es correcto: uno es al finalizar y el otro tras revocar.
- «En evaluación»: en los lugares cambiados por DEC-P35 solo cambian esas palabras. Lo único distinto en esas líneas es lo pedido por DEC-P36 y DEC-P51. Ningún RF, AC ni regla se borró.
- Ajuste anotado: la sección Verificación volvió a «parcial». Sus líneas son exactas, salvo las de H-056.
- Cambios de fondo no listados: ninguno. Los cambios sin registro siguen las decisiones (H-064).
- Análisis de impacto: la pérdida no afecta a S2 ni a aprobar, porque ninguna regla depende de esa sección. Se cuenta como menor por ser un cambio sin pedido (H-064).


## Revisión de la v1.6

| id | Severidad en v1.5 | Estado en v1.6 | Evidencia | Queda |
|---|---|---|---|---|
| H-008 | media | resuelto | SPEC-008/AC-051: «entonces el medicamento es apto; y dado un medicamento que el catálogo registra como no PBS y cuyo indicador en la fórmula dice PBS, cuando no tiene estado Autorizado, entonces la fórmula es no apta.» | Nada. Catálogo PBS sin autorización da apto (DEC-P11) y catálogo no PBS sin autorizar da no apta (DEC-P11); en ambos manda el catálogo sobre el indicador (DEC-P17). El caso no PBS autorizado ya está en SPEC-008/AC-047. El AC dice «indicador en la fórmula» y no toma partido en PREG-021. |
| H-025 | media | resuelto | SPEC-008 §12: «SPEC-001 (RF-009)» y «SPEC-003 (diagnóstico asignado y reglas de prevalidación).» | SPEC-003 §12 sigue sin nombrar a SPEC-008: es H-032 del informe de SPEC-003. |
| H-043 | media | resuelto | SPEC-008/AC-050: «que superó las verificaciones anteriores». | Nada. |
| H-044 | media | resuelto | «Preguntas de aclaración» solo tiene SPEC-008/OPEN-Q-007 y OPEN-Q-008, con el mismo texto de §15. §15 conserva «OPEN-Q-003: Respondida (DEC-P16)» y «OPEN-Q-004: Respondida (DEC-P17)». | Nada. Las referencias siguen: §2 y el Análisis de impacto dicen «Responde a OPEN-Q-003» y «Responde a OPEN-Q-004», y `docs/decisiones.md` cita esos ids. La entrada quitada no tenía el texto de esas preguntas sino el de PREG-020 y PREG-022, así que no se pierde nada; §15 las deja como a OPEN-Q-001, 002, 005 y 006. |
| H-045 | media | resuelto | SPEC-008 §8, paso 6: «si tiene fecha habilitada, se compara con la cita posible según SPEC-003/RF-024 paso 5 y SPEC-003/BR-015». | El caso posterior se resuelve por la remisión. El texto refuerza H-049. |
| H-047 | media | resuelto | La frase ya no aparece en el modelo de dominio, RF-083, AC-042 ni la línea de impacto; solo se nombra en la petición y al describir la corrección. | Nada. |
| H-053 | media | cambió, a menor | SPEC-008 §16, fila RF-076. SPEC-003/AC-033 y AC-046 existen en SPEC-003 v1.9. | Falta el caso del año de festivos. |

Ajustes de edición: el historial de la v1.6 no anota ninguno. Cambios no listados: solo cabecera, título, «Siguiente paso» y quitar «original» de las dos preguntas pasadas a OPEN-Q-007 y OPEN-Q-008; ninguno es de fondo.

## Estado de H-042 en la v1.5

| id | Severidad en v1.4 | Estado en v1.5 | Evidencia | Queda |
|---|---|---|---|---|
| H-042 | alta | resuelto | SPEC-008 §8, paso 6: «La evaluación de cada fórmula se detiene en la primera regla incumplida, como SPEC-003/BR-008.» SPEC-003/BR-008: «cada fórmula se evalúa en orden y, ante la primera regla incumplida, esa fórmula queda no apta con su motivo.» | La frase va en el paso 6, pero habla de «cada fórmula» y alcanza los pasos 3 a 6. El caso de H-042 (crónica no autorizada y con el año de festivos faltante) ahora se detiene en el paso 5, no apta por autorización, igual que en SPEC-003. Falta un AC de ese caso: H-053. |

Alcance del cambio: frente a la v1.4, la única conducta nueva es esa frase. El resto son cabecera, título, una línea de impacto, historial, «Verificación» y «Siguiente paso». SPEC-003 v1.8 cambia frente a la v1.7 solo el texto de cédula y código; SPEC-003/BR-008 y los AC citados en este informe siguen iguales.

Efecto en hallazgos conservados, sin cambiar su fila: H-043 sigue, porque SPEC-008/AC-050 no adquirió la precondición. H-049 sigue, y la frase refuerza la lectura de la opción 1 de PREG-013: una crónica sin fecha se detiene antes de consultar el catálogo. Esa prioridad sigue sin decisión del equipo. H-025 pesa algo más, porque SPEC-008 §8 ya cita SPEC-003/BR-008 y SPEC-008 §12 no lista a SPEC-003.

## Estado de los bloqueantes y altos de la v1.3 (revisión de la v1.4)

| id anterior | Severidad en v1.3 | Estado en v1.4 | Evidencia | Queda |
|---|---|---|---|---|
| H-001 | bloqueante | cambió | SPEC-008 §8, pasos 2 a 6: «El sistema verifica la afiliación activa», «evalúa la vigencia», «verifica la cobertura PBS», «verifica el estado de autorización», «evalúa la fecha habilitada de entrega exclusivamente para fórmulas crónicas». | El orden quedó corregido y el bloqueante se cierra. La detención en la primera regla incumplida no se copió: pasa a H-042 (alta) y H-043 (media). |
| H-002 | alta | resuelto | SPEC-008 §8, paso 2: «si el estado de afiliación es inactivo, se detiene toda la solicitud y se orienta hacia la EPS.» Paso 3: «(si no está vigente, se indica que requiere nueva valoración médica)». | Nada. El paso 3 ya conduce a SPEC-008/AC-045. |
| H-003 | alta | sigue, como OPEN-Q | SPEC-008 §15: «OPEN-Q-007. Pregunta H-003/PREG-020». | Pendiente del equipo. No se reporta como hallazgo nuevo; ver «OPEN-Q pendientes». |
| H-004 | alta | resuelto | SPEC-003/RF-024 paso 3: «el indicador de cobertura de la fórmula devuelto por la EPS simulada». SPEC-008/RF-077: «el indicador individual de la fórmula devuelto por la EPS simulada». | Las dos SPEC ya dan el mismo origen. PREG-021 sigue abierta y sin respuesta en `docs/preguntas/`; una persona debe cerrarla. Esta revisión no la trata como decisión. |
| H-005 | alta | sigue, como OPEN-Q | SPEC-008 §15: «OPEN-Q-008. Pregunta H-005/PREG-022». | Pendiente del equipo. No se reporta como hallazgo nuevo; ver «OPEN-Q pendientes». |
| H-006 | alta | cambió | SPEC-008/RF-083: «Los registros de eventos conservados tras una revocación de consentimiento deben quedar disociados de la identidad, según SPEC-001/RF-009». | La obligación ya existe y cierra el choque con SPEC-001/RF-009. Falta una observación verificable: sigue como H-006 (alta), con H-047 y H-048. |

## Hallazgos

Los hallazgos que vienen de la v1.3 conservan su id. Los nuevos de la v1.4 empiezan en H-042, los de la v1.5 en H-053, los de la v1.6 en H-056, los de la v1.7 en H-057, los de la v1.8 en H-065, los de la v1.9 en H-067 y los de la v1.10 en H-068. H-014, H-015 y H-020 no aparecen porque quedaron resueltos en la v1.10. H-001 a H-005 y H-034 no aparecen porque cerraron o pasaron a OPEN-Q; H-042 no aparece porque quedó resuelto en la v1.5, ni H-008, H-025, H-043, H-044, H-045 y H-047, resueltos en la v1.6, ni H-006, H-007, H-010, H-011, H-016, H-048, H-049 y H-050, resueltos en la v1.7, ni H-057, H-058 y H-059, resueltos en la v1.8, ni H-065 y H-066, resueltos en la v1.9. Las menciones a H-042 en filas conservadas son históricas.

| id | Severidad | Tipo | Cita literal | Problema | Pregunta sugerida | Bloquea |
|----|-----------|------|--------------|----------|-------------------|---------|
| H-009 | media | verificabilidad | SPEC-008/AC-041: «entonces detecta el nuevo estado y actualiza el resultado de prevalidación en consecuencia.» | Sigue. «En consecuencia» no fija el resultado, y falta el cambio de autorización de SPEC-008/RF-082. | ¿Un AC por cambio (afiliación, vigencia, autorización) con resultado concreto? | no |
| H-012 | media | verificabilidad | SPEC-008/RF-084: «El catálogo debe tener cargado el año en curso y el año siguiente.» | Sigue. Ningún AC comprueba esta obligación ni dice quién la comprueba o cuándo. | ¿Qué observación demuestra que el catálogo cumple, y quién la hace? | no |
| H-017 | media | verificabilidad | SPEC-008/RF-080: «Un valor es configurable si, al cambiarlo el equipo, el efecto se observa sin cambiar el comportamiento del sistema (DEC-P36).» SPEC-008/AC-039: «entonces el sistema provee los enlaces, puntos de atención presencial y guía de trámites configurados para esa EPS.» | Cambió en v1.7: RF-080 ya tiene observación y responsable. Ningún AC cambia un valor, así que la frase queda sin oráculo. SPEC-008/RF-078 y RF-084 están en DEC-P36 y no recibieron la frase. INFERIDO: «sin cambiar el comportamiento» quiere decir sin cambiar el código; leída al pie de la letra, el efecto de un valor nuevo ya es un cambio de comportamiento. | ¿Se añade un AC que cambie un valor y observe el efecto, y la misma frase en SPEC-008/RF-078 y RF-084? | no |
| H-018 | media | consistencia | SPEC-008 E1: «se intenta ejecutar una verificación o envío utilizando un número de celular o correo»; SPEC-008/AC-049: «cuando se intenta realizar un envío» | Sigue. E1 cubre verificación y envío; el AC solo envío. | ¿«Verificación» es un caso aparte o el envío del código de esa verificación? | no |
| H-019 | media | verificabilidad | SPEC-008/AC-049: «cuando se intenta realizar un envío a un número de celular o correo no incluido en la lista autorizada, entonces el entorno de pruebas rechaza la operación y no se realiza el envío.» | Sigue. Si el rechazo falla, sale un mensaje real a un tercero. No se fija el destino ni se exige ejecutar sin proveedor real. | ¿Con qué destino se ejecuta el caso para no enviar nada a un tercero? | no |
| H-021 | media | consistencia | SPEC-008/RF-078: «comparando el código de diagnóstico CIE-10 asignado a la fórmula»; SPEC-003/RF-022: «el diagnóstico o diagnósticos de la historia clínica». | Sigue. SPEC-003 no exige extraer un código; si la historia trae solo la descripción, la comparación no está definida. | ¿La historia de prueba siempre trae el código CIE-10, o qué pasa si no? | no |
| H-022 | media | consistencia | SPEC-008/RF-078: «El sistema debe clasificar el tratamiento de una fórmula como agudo o crónico»; SPEC-003/RF-023: «El sistema debe clasificar cada fórmula como agudo o crónico» | Sigue. La misma regla tiene dos dueños, también en SPEC-008/RF-077 con SPEC-003/BR-011, y SPEC-008/BR-027 con SPEC-003/BR-015. H-042, H-045 y H-049 salen de este patrón. | ¿SPEC-003 es dueña de las reglas y SPEC-008 solo de los datos? | no |
| H-023 | media | trazabilidad | SPEC-008/RNF-017: «estando estrictamente prohibido el uso de datos de pacientes reales» | Sigue. SPEC-008/AC-049 solo cubre el rechazo de envíos, no la ausencia de datos reales ni el consentimiento. | ¿Qué comprobación demuestra que no hay datos reales y que hay consentimiento? | no |
| H-024 | media | completitud | SPEC-008/RF-076: «El sistema obtiene la fecha habilitada sin depender de la clasificación de agudo/crónico, y solo la utiliza en la prevalidación si la fórmula es clasificada como crónica.» | Sigue. Sin AC para el lado agudo, ni en SPEC-008 ni en SPEC-003. | ¿Se añade este AC, aquí o en SPEC-003? | no |
| H-053 | menor | completitud | SPEC-008 §16: «la detención en la primera regla incumplida se verifica por SPEC-003/AC-033 y SPEC-003/AC-046». | Cambió en v1.6, de media a menor. La traza ya existe y SPEC-003/AC-046 cubre la detención en autorización frente a la crónica sin fecha. Queda el otro caso de H-042: una crónica no autorizada con el año de festivos faltante. S2 lo puede derivar de SPEC-003/BR-008. | ¿Se añade ese caso a SPEC-003/AC-046? | no |
| H-013 | menor | trazabilidad | SPEC-008/CL-020: «Si la prevalidación de una fórmula crónica se realiza un sábado o previo a un festivo registrado en el catálogo de festivos de Colombia» | Cambió, de media a menor. SPEC-003/AC-037, AC-038, AC-042, AC-043 y AC-044 ya cubren la conducta, pero SPEC-008 §16 sigue trazando CL-020 solo a SPEC-008/AC-043. | ¿Se remite a esos AC de SPEC-003? | no |
| H-026 | menor | trazabilidad | SPEC-008 §16: «HU-010: RF-075, RF-076, RF-077, RF-078, RF-080, RF-082, RF-083, RF-084; RNF-017, RNF-018» | Sigue. La historia es del paciente, pero incluye cambios de prueba, datos de prueba y métricas. | — | no |
| H-027 | menor | consistencia | SPEC-008/RF-083: «sobre-reservas en cero y escenarios asistidos» | Cambió en v1.7. La misma frase deja «en evaluación» las «sobre-reservas», pero las sigue listando como requeridas. | — | no |
| H-028 | menor | completitud | SPEC-008/RNF-018: «desplazamientos evitados, novedades detectadas antes del desplazamiento y tasa de éxito por tarea» | Sigue. SPEC-008/RF-083 lista además métricas sin definición ni AC. | — | no |
| H-029 | menor | consistencia | SPEC-008/AC-040: «(afiliación inactiva, fórmula vencida, autorización no vigente, medicamento no cubierto, datos no coinciden, sin existencias, otro)» | Sigue. El contexto 3.7 dice «fórmula vencida o inválida», «sin existencias pese a reserva» y «otro, con descripción». | — | no |
| H-030 | menor | consistencia | SPEC-008, Análisis de impacto: «DEC-P05, DEC-P08, DEC-P09, DEC-P12: afectan RF-076, RF-078, AC-035, AC-037, AC-044, AC-045, AC-046.» | Sigue. SPEC-008/AC-045 y SPEC-008/AC-046 son de vigencia, y la SPEC ya quitó DEC-P12 de esa regla. | — | no |
| H-031 | menor | consistencia | SPEC-008, Contradicciones detectadas: «Corrección por DEC-P09 y SPEC-003/RF-023» | Sigue. No registra que DEC-P13 modifica el contexto 3.5, cosa que SPEC-003 sí hace. | — | no |
| H-032 | menor | completitud | SPEC-008 §13: «obligación de la EPS de entregar lo faltante en 48 horas» | Sigue. Aviso del lint. No es conducta del producto, pero omite la condición del contexto 3.11. | — | no |
| H-033 | menor | completitud | SPEC-008, Análisis: «Actores: paciente, dispensador.» SPEC-008 §4: «Actores: paciente, facilitador comunitario, persona que actúa por el paciente (cuidador, tutor o familiar), dispensador.» | Cambió. §4 ya lista a todos, pero Análisis no se actualizó. | — | no |
| H-035 | menor | completitud | SPEC-008/AC-046: «cuya fecha límite de vigencia es exactamente igual a la fecha actual de prevalidación» | Sigue. El lado «por encima» no tiene AC con fecha. En v1.10, SPEC-008/AC-055 fija el límite a los dos lados de la medianoche, pero no la fecha límite posterior. | — | no |
| H-036 | menor | completitud | SPEC-008/AC-034: «Dado un paciente consultado en la EPS simulada por su número de cédula» | Sigue. Sin caso de cédula inexistente; conviene remitir a SPEC-001/AC-012. | — | no |
| H-037 | menor | trazabilidad | `docs/mvp.md`: «`REQ-008` (Mensajería real): `Debe`.» | Sigue. REQ-008 está en EPIC-007, pero SPEC-008 no lo cubre. El arreglo está en `docs/mvp.md` o en otra SPEC. | ¿Qué SPEC es dueña de REQ-008? | no |
| H-038 | menor | consistencia | SPEC-008/RF-082: «permitir provocar modificaciones de prueba en los datos de la EPS simulada (afiliación, vigencia de fórmula o estado de autorizaciones)» | Sigue. Un cambio provocado de vigencia puede salir del rango de SPEC-008/BR-025. En v1.10 pesa algo más: SPEC-008/AC-056 revisa «cada fórmula» del conjunto de prueba, y una fórmula vencida a propósito (A1, AC-045) lo incumple. | ¿AC-056 se aplica al conjunto de datos base, antes de provocar cambios? | no |
| H-039 | menor | consistencia | SPEC-008/RF-080: «la información oficial de puntos de atención presencial, enlaces o trámites de autorización» | Sigue. En un prototipo simulado la información no es «oficial», y no queda claro si son los puntos de SPEC-008/RF-079. | — | no |
| H-040 | menor | completitud | SPEC-008/RF-079: «ventanas de 1 hora, capacidad máxima de citas por ventana» | Sigue. Sin casos de límite; se revisa si entra el agendamiento. | — | no |
| H-041 | menor | trazabilidad | SPEC-008/RF-082: «Origen: necesidad, DEC-010 y DEC-P36.» | Sigue. Los `DEC-nn` internos siguen como origen vigente (T-014). | — | no |
| H-046 | menor | completitud | SPEC-008 §8, paso 2: «se detiene toda la solicitud»; SPEC-008 §8, paso 7: «El sistema registra el evento de prevalidación y resultado»; SPEC-008/AC-042: «Dado un flujo de prevalidación completado». | Nuevo. Si la solicitud se detiene en el paso 2, el flujo no llega al paso 7 y ningún AC exige registrar esa novedad, aunque es una de las métricas de SPEC-008/RNF-018. Severidad limitada: sin REQ Debe. | ¿Una solicitud detenida también registra su evento? | no |
| H-051 | menor | trazabilidad | SPEC-008 §3: «Consulta de catálogo simulado de cobertura PBS y catálogo de diagnósticos crónicos.» SPEC-008 §17: «Versión 1.4: actualización a estado Candidata aplicando el informe de revisión estricta.» | Nuevo. Comparada con la v1.3, la v1.4 cambió §4, HU-010 y quitó «CIE-10» en §3 y §12, sin registrarlo en el historial ni en el impacto. | — | no |
| H-052 | menor | consistencia | SPEC-008 §8, paso 6: «comparando el diagnóstico con el catálogo de diagnósticos crónicos». SPEC-008/RF-078: «comparando el código de diagnóstico CIE-10 asignado a la fórmula». | Nuevo. La reescritura quitó del flujo la asignación del diagnóstico de DEC-P09. El requisito sigue vigente, pero el flujo ya no la nombra. | — | no |
| H-054 | menor | ambigüedad | SPEC-008 §8, paso 6: «la primera regla incumplida». SPEC-008 §8, paso 4: «verifica la cobertura PBS de cada medicamento». SPEC-003/BR-008: «esa fórmula queda no apta con su motivo.» | Nuevo en v1.5. No se define qué cuenta como regla incumplida. Al pie de la letra, un medicamento no PBS podría detener la fórmula en el paso 4, antes de la autorización, y el año faltante del paso 6 quedaría no apta por la remisión a SPEC-003/BR-008. Los oráculos sí están fijados: SPEC-008/BR-026 y SPEC-008/AC-047 dan apto con autorización, y SPEC-008/AC-052 da sin resultado por DEC-P19. Por eso no cambia un resultado y no hace falta decisión. | ¿Se aclara que ser no PBS no es incumplimiento y que el año faltante es error de sistema? | no |
| H-055 | menor | consistencia | SPEC-008 §8, paso 6: «(el tratamiento se clasifica comparando el diagnóstico con el catálogo de diagnósticos crónicos)»; «La evaluación de cada fórmula se detiene en la primera regla incumplida». SPEC-003/RF-023: «El sistema debe clasificar cada fórmula como agudo o crónico». | Nuevo en v1.5. Como SPEC-008 clasifica en su paso 6, una fórmula detenida en los pasos 3 o 5 ya no se clasifica; en SPEC-003 §8 se clasifica en el paso 6, antes de la afiliación, y se clasifican todas. No cambia apta/no apta, pero sí lo que un caso puede observar sobre la clasificación de una fórmula no apta. Es otra cara de H-022. | ¿La clasificación se hace siempre, como SPEC-003 §8, y SPEC-008 solo la consume? | no |
| H-056 | menor | trazabilidad | SPEC-008, Verificación: «Cobertura de AC: cumple. Todos los RF, RNF, BR y CL cuentan con al menos un criterio de aceptación trazado en la sección 16.» SPEC-008, Verificación: «Consistencia con el contexto: cumple.» | Cambió en v1.10. «Completitud» es exacta y ya nombra la obligación de RF-084 sin AC. H-014 ya no sostiene el hallazgo. Siguen los dos «cumple» sin sostén: «Cobertura de AC» es nominal para la obligación de RF-084 (H-012), y H-029 choca con el contexto 3.7. | Pasar los dos «cumple» a «parcial». | no |
| H-060 | menor | verificabilidad | SPEC-008/RF-083: «las métricas de novedades usan totales ya agregados (DEC-P51)». | Nuevo en v1.7. SPEC-008/AC-054 comprueba lo que queda del evento, pero ningún AC comprueba que los totales sobrevivan a la revocación ni cuándo se agregan. Severidad limitada: sin REQ Debe. | ¿Se añade un AC del total antes y después de revocar? | no |
| H-061 | menor | consistencia | SPEC-008 §3: «(se mantienen especificados en la SPEC para fases posteriores)». SPEC-008 §14: «Funcionalidades de agendamiento, ventanas, inventario y validación presencial en punto en evaluación (DEC-P35).» | Nuevo en v1.7. La sección 3 sigue diciendo «fases posteriores», y la sección 14 deja bajo «Fuera de alcance» lo que DEC-P35 dice que no está fuera. Ambas líneas son las que pidió la orden. | ¿Se quita «para fases posteriores» y se mueve la línea de la sección 14 a la sección 3? | no |
| H-062 | menor | ambigüedad | SPEC-008 §8, paso 6: «suspende el resultado de la fórmula afectada». SPEC-008 §8, paso 6: «si requiere cálculo de fecha hábil». | Nuevo en v1.7. «Suspende» sugiere un estado que DEC-P43 descarta. «Si requiere» queda de H-049: toda comparación con la cita posible lo requiere. No cambia el resultado. | Escribir «no emite resultado» y quitar «si requiere». | no |
| H-063 | menor | trazabilidad | SPEC-008/AC-041: «cuando el sistema ejecuta la nueva prevalidación». | Nuevo en v1.7. DEC-P41 nombra SPEC-008/AC-041, pero la SPEC no la cita. SPEC-008 A1 usa afiliación inactiva y fórmula vencida, que DEC-P41 no nombra. Cambió en v1.8: PREG-076 cita SPEC-008, tiene OPEN-Q en SPEC-003 (OPEN-Q-022) y no aquí. | Ver `docs/preguntas/PREG-076.md`. | no |
| H-064 | menor | trazabilidad | SPEC-008, Análisis de impacto: «DEC-P16: afecta RF-076, modelo de dominio y AC-050.» | Nuevo en v1.7. El Análisis de impacto se reescribió sin pedido: recortó las líneas de DEC-P01 a DEC-P19 y borró las de T-036, flujo, disociación, detención, orígenes y correcciones de la v1.6. No se pierde ninguna regla: los orígenes y el historial las conservan. Tampoco están en el historial RF-076, RF-077, paso 4, paso 7 ni el borrado de los bloques de OPEN-Q; todos siguen las decisiones. | Registrar los cambios en el historial. | no |
| H-067 | menor | trazabilidad | SPEC-008/AC-050: «Origen: RF-076, DEC-P16.» SPEC-008 §16: «RF-084: Origen: DEC-P13, DEC-P19, DEC-P43 y DEC-P50; verificado por AC-043, AC-050, AC-052.» SPEC-008/RF-084: «Una fórmula crónica sin fecha habilitada queda no apta antes de consultar el catálogo (DEC-P50).» | Nuevo en v1.9, resto de H-066. La fila ya apunta a AC-050, pero el origen del AC no cita RF-084, BR-027 ni DEC-P50. Además, AC-050 no dice que falte el año en el catálogo, así que no comprueba «antes de consultar el catálogo»: eso lo hace SPEC-003/AC-051. S2 debe usar SPEC-003/AC-051 para esa prioridad. Corrige un dato que se dio en H-066: AC-050 no verifica por sí solo esa frase. | Citar en SPEC-008 §16 también SPEC-003/AC-051 y completar el origen de AC-050. | no |
| H-068 | menor | trazabilidad | SPEC-008, Análisis: «Datos de prueba: conjuntos de datos donde las fórmulas de prueba tienen vigencias de 8 a 9 meses tras la fecha de prescripción, ambos extremos incluidos». SPEC-008 §13: «fórmulas de prueba vigentes entre 8 y 9 meses tras la prescripción, extremos incluidos.» SPEC-008 §17: «precisión de hora de Colombia y ejecución en BR-025, adición de AC-055 y AC-056.» | `[CONFIRMADO]` Nuevo en v1.10. La petición decía «no cambies otras líneas», y estas dos líneas cambiaron sin estar en el historial. Las dos siguen DEC-P72 y quitan una inconsistencia («tras la consulta»), así que no hay cambio de fondo. | Registrar las dos líneas en el historial. | no |
| H-069 | menor | ambigüedad | SPEC-008/AC-056: «su fecha límite está entre 8 y 9 meses después de su fecha de prescripción, ambos extremos incluidos.» | `[INFERIDO]` Nuevo en v1.10. No se dice cómo se suman meses a un fin de mes: 9 meses después del 31 de mayo puede ser el 28 de febrero o el 2 de marzo. SPEC-002 ya resuelve un caso parecido para la vinculación («ajustando al último día del mes si la fecha no existe»), pero esa regla no se extiende aquí sin decisión. S2 puede evitarlo con prescripciones anteriores al día 29. | ¿Se usa el mismo ajuste al último día del mes que en SPEC-002? | no |
| H-070 | menor | trazabilidad | SPEC-008/BR-025: «La fecha de prevalidación es la del momento en que el sistema ejecuta las reglas, en hora de Colombia (DEC-P70, DEC-P71).» SPEC-008/RF-084: «Si al prevalidar una fórmula crónica el catálogo no tiene configurado el año necesario». | `[CONFIRMADO]` Nuevo en v1.10. DEC-P71 nombra también SPEC-008/RF-084, AC-046 y AC-052, pero la definición solo quedó en BR-025, la regla de vigencia. RF-084 depende de la misma fecha (31 de diciembre a las 23:59:59 frente al 1 de enero a las 00:00:00) y no la cita. Ningún AC cubre el cambio de año a medianoche. `[INFERIDO]` «El momento» se lee como un instante único por solicitud; si cada regla tomara su propia hora, una solicitud cargada cerca de la medianoche mezclaría dos fechas. Lo mismo vale para SPEC-003 (su H-095). | Citar BR-025 en RF-084 y decir que la fecha se toma una sola vez por solicitud. | no |

## OPEN-Q pendientes

Ninguna. En v1.10, OPEN-Q-009 quedó respondida por DEC-P70 y DEC-P71 (H-020 resuelto) y OPEN-Q-010 por DEC-P72 (H-015 resuelto).

PREG-074 sigue abierta y cita SPEC-008 sin OPEN-Q propia. PREG-076 quedó respondida por DEC-P76; esa decisión nombra SPEC-008/A1 y AC-041, que la v1.10 no tocó (ver H-063).


## Valores límite revisados

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| Fecha límite de vigencia frente a fecha de prevalidación | SPEC-008/AC-045 (vencida); SPEC-008/AC-055 (00:00:00 del día siguiente, vencida) | SPEC-008/AC-046 (igual, vigente); SPEC-008/AC-055 (23:59:59 del día D, vigente) | Sin AC propio; implícito en SPEC-003/AC-001 | Parcial (H-035) |
| 20 dígitos del número de fórmula | SPEC-003/AC-050 (19 dígitos) | SPEC-008/AC-035 y SPEC-008/AC-044 | SPEC-003/AC-050 (21 dígitos y no numéricos) | Cumple en SPEC-003 por DEC-P42 |
| 8 a 9 meses en datos de prueba | SPEC-008/AC-056 (menos de 8 meses no cumple) | SPEC-008/AC-056 (8 y 9 meses exactos cumplen) | SPEC-008/AC-056 (más de 9 meses no cumple) | Cumple, como propiedad del conjunto de datos (H-069, H-038) |
| Primer día hábil siguiente | No aplica | SPEC-008/AC-043; SPEC-003/AC-023, AC-034, AC-035, AC-036 | SPEC-003/AC-037 (festivo entre semana), AC-038 (cambio de año), AC-042 (festivos consecutivos), AC-043 (prevalidación en festivo) y AC-044 (sábado festivo); no están en la traza de SPEC-008 | Cumple en SPEC-003 (H-013) |
| Año en catálogo de festivos (en curso y siguiente) | Falta el año necesario: SPEC-008/AC-052; sin fecha habilitada: SPEC-003/AC-051 | Obligación de tener ambos años sin AC | No aplica | Parcial (H-012) |
| 1 hora (ventana) | Sin AC | SPEC-008/AC-038 (sin límites) | Sin AC | En evaluación (DEC-P35) (H-040) |
| 48 horas | No aplica | No aplica | No aplica | Norma citada, no conducta del producto (H-032) |
| 30 unidades, 10 minutos, 3 intentos, 90 días | No aplica | No aplica | No aplica | No aparecen en SPEC-008 |

## Preguntas creadas

- `docs/preguntas/PREG-050.md` — ¿Qué puede conservarse en un evento tras una revocación y qué observación demuestra que quedó disociado de la identidad? — bloquea: no. Respondida por DEC-P51.

No se repitieron preguntas. Los hallazgos que siguen conservan PREG-025 y PREG-026.

Las revisiones de la v1.8, la v1.9 y la v1.10 no crean preguntas. En la v1.10, PREG-018, PREG-025 y PREG-026 están respondidas (DEC-P70, DEC-P71, DEC-P72).

La revisión de la v1.7 no crea preguntas propias de esta SPEC. Remite a dos creadas en la revisión de SPEC-002 y SPEC-003: `docs/preguntas/PREG-074.md` (prioridad de REQ-023 y otros en `docs/mvp.md`) y `docs/preguntas/PREG-076.md` (nueva prevalidación, H-063). H-057 no creó PREG, para no reabrir DEC-P31; lo cerró DEC-P53.

La revisión de la v1.6 no crea preguntas: H-056 se corrige en Especificaciones y H-049 sigue en PREG-013.

La revisión de la v1.5 no crea preguntas: H-053, H-054 y H-055 se corrigen en Especificaciones sin decisión nueva, y la prioridad entre DEC-P16 y DEC-P19 ya está en PREG-013.

## Coherencia con SPEC-003 v1.12 y SPEC-002 v1.11

En v1.10, frente a SPEC-003 v1.13: las dos SPEC llevan la misma frase de DEC-P70 y DEC-P71 (SPEC-008/BR-025; SPEC-003/RF-024 paso 2 y BR-015). La zona horaria ya no es un vacío compartido. Lo que sigue más abajo se escribió frente a la v1.12.

- Coinciden: orden de evaluación, detención por afiliación, detención en la primera regla incumplida, regla de vigencia, regla PBS y autorización de DEC-P11, origen del indicador PBS (DEC-P34), prioridad del catálogo de DEC-P17, medicamento ausente (SPEC-003/BR-011 y AC-047 con SPEC-008/BR-026 y AC-053), primer día hábil de DEC-P13, resultado de DEC-P16, prioridad de DEC-P50 y año faltante. RF-084 y BR-027 ya coinciden con SPEC-003/RF-024 paso 5. La sección 14 de ambas SPEC tiene el mismo texto de DEC-P53. La revocación encaja de punta a punta: SPEC-002/RF-087 confirma, SPEC-002/AC-033 dispara, SPEC-001/RF-009 elimina y SPEC-008/AC-054 fija lo que queda.
- No coinciden: código frente a diagnóstico (H-021) y momento de la clasificación (H-055). DEC-P09 ya usa el mismo término (H-065 resuelto).
- Diferencia sin efecto en apta/no apta: SPEC-003 §8 clasifica en el paso 6, antes de la afiliación, y SPEC-008 §8 en su paso 6, al final. S2 no debe convertirla en un caso de orden mientras H-055 siga abierto.
- Vacíos compartidos: forma de observar «la persona debe iniciar una solicitud nueva» (SPEC-003/H-075) y fórmula sin resultado junto a otras fórmulas (SPEC-003/H-073). La zona horaria tiene preguntas iguales en SPEC-003/OPEN-Q-016 y SPEC-008/OPEN-Q-009.
- DEC-P54 a DEC-P57 no cambian ninguna regla de SPEC-008. DEC-P45 no afecta sus RF activos: las notificaciones de RF-082 ya están en evaluación.


## Seguimiento de la revisión transversal

- Cerrados en SPEC-008: T-002 (identificación; la comparación está en SPEC-003/BR-013), T-006, T-035, T-036 y T-037.
- Cerrado en la v1.7: T-034 (actor definido por DEC-P36; H-016 resuelto).
- Abierto: T-014 para DEC-010 y DEC-011 (H-041). T-016 no nombra a SPEC-008, pero su patrón se repite aquí (H-022).

## Confirmado e inferido

- CONFIRMADO: los estados de la tabla salen de comparar los textos de la v1.3, la v1.4 y SPEC-003 v1.7. H-044 y H-051 salen de esa comparación directa. El estado de H-042, H-053 y H-055 sale de comparar la v1.4, la v1.5 y SPEC-003 v1.8.
- CONFIRMADO en la v1.8: los estados de «Revisión de la v1.8» salen de comparar la v1.7, la v1.8, `docs/decisiones.md`, SPEC-003 v1.11 y SPEC-001 aprobada.
- CONFIRMADO en la v1.9: los estados de «Revisión de la v1.9» salen de comparar la v1.8, la v1.9, `docs/decisiones.md`, SPEC-003 v1.12 y SPEC-002 v1.11.
- INFERIDO: H-007, H-049 (que SPEC-008 adopta una opción de PREG-013), H-054 (la lectura al pie de la letra de «regla incumplida») y la clasificación de REQ de `docs/mvp.md`, que está en borrador. Que la frase del paso 6 alcance los pasos 3 a 6 es una lectura de este revisor, apoyada en «cada fórmula» y en SPEC-003/BR-008.
- PENDIENTE: PREG-074. PREG-018, PREG-025 y PREG-026 quedaron respondidas en v1.10 (DEC-P70, DEC-P71, DEC-P72), y PREG-076 por DEC-P76.
- CONFIRMADO en la v1.10: los estados de «Revisión de la v1.10» salen de comparar la v1.9 aprobada, la v1.10, `docs/decisiones.md` (DEC-P25, DEC-P70 a DEC-P72), SPEC-003 v1.13 y SPEC-002 v1.11. INFERIDO: H-069 y la lectura de «el momento» como un solo instante (H-070).
- La sección «Verificación» de la SPEC no se usó como evidencia. Sus líneas «Consistencia con el contexto» y «Cobertura de AC» dicen `cumple`, y esta revisión no lo confirma (H-056). Su línea «Completitud» se comparó con §15 y es exacta.
- CONFIRMADO en la v1.6: los estados de «Revisión de la v1.6» salen de comparar la v1.5, la v1.6 y SPEC-003 v1.9. INFERIDO: el acercamiento del paso 6 a la opción 1 de PREG-013 (H-049).
- CONFIRMADO en la v1.7: los estados de «Revisión de la v1.7» salen de comparar la v1.6, la v1.7, SPEC-003 v1.10 y SPEC-001 aprobada. INFERIDO: el alcance de DEC-P31 (H-057) y la lectura de «sin cambiar el comportamiento» (H-017).

## Criterios

- Verificabilidad: no cumple. En v1.10 se revisaron AC-055 y AC-056: los dos tienen oráculo de pasa/no pasa (H-014 resuelto). SPEC-008/AC-041 sigue sin oráculo, y hay obligaciones sin observación (H-012, H-017, H-023, H-060).
- No ambigüedad: no cumple. «Estrictamente» y la zona horaria quedaron resueltos (H-015, H-020). Quedan «regla incumplida», H-062 y H-069.
- Completitud: no cumple. Siguen H-012, H-024, H-046 y H-053.
- Consistencia: no cumple. Se contrastó con DEC-P25, DEC-P70 a DEC-P72, SPEC-003 v1.13 y SPEC-002 v1.11, sin choques nuevos. Quedan H-055 y H-061.
- Trazabilidad: no cumple. Los orígenes y filas pedidos para AC-055 y AC-056 están. Quedan cambios sin registrar (H-051, H-064, H-068), «Verificación» con dos «cumple» sin sostén (H-056), H-067 y H-070.

## Conclusión

`APTA_CON_RESERVAS`: no hay hallazgos bloqueantes ni altos en la v1.10. Ya no quedan OPEN-Q y las tres decisiones están bien aplicadas. Nada de la v1.10 desaconseja aprobarla. Antes de moverla a `aprobadas/` conviene pasarla a LF (ver «Revisión de la v1.10»). Lo que sigue se escribió para la v1.9 y se mantiene: S2 puede diseñar casos de lo confirmado. Ninguna OPEN-Q impide formalmente aprobar, y lo mínimo que se pedía antes de congelar ya está. Nada de lo que queda desaconseja aprobarla; S2 debe recordar H-067 y usar SPEC-003/AC-051 para la prioridad de DEC-P50. `aprobado_por` queda vacío: la decisión es de una persona.
