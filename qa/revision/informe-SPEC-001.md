# Informe de revisión — SPEC-001

Fecha: 2026-11-02
Revisor: S1 (prueba estática)
Veredicto: NO_APTA
Lint previo: `python qa/scripts/lint_spec.py` sobre v1.6: sin hallazgos mecánicos bloqueantes. Definiciones: RF 12, BR 5, RNF 2, CL 4, AC 19 (AC-001 a AC-013 y AC-015 a AC-020; AC-014 no se usa y está registrado en el historial). 1 aviso de tipo `limite`: «9 minutos» (línea 152, CL-003), el mismo desde v1.1 (H-001). El lint no sustituye esta revisión: el hallazgo bloqueante de esta ronda (H-019) es de juicio sobre consistencia, no mecánico, y el lint no lo detecta.
SPEC revisada: `agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.6.md` (versión 1.6). La cabecera del archivo dice «Estado: Aprobada y congelada» y el historial dice «Versión 1.6 (aprobación): aprobada y congelada por el equipo, sin cambios de contenido»: la aprobación de esta versión fue determinista (congela la última Candidata, sin paso de modelo ni de S1; ver `CLAUDE.md`, «Aprobar una SPEC o ARQ»), es decir, ocurrió **antes** de esta revisión S1, no después. Esta revisión es la que exige el cambio de hash (`pipeline.json`: `identidad.spec_hash` sigue en `d278bfd11dc3`, de v1.5; el hash real de v1.6 es `e741b16632c3`; calculado con `sha256` truncado a 12, igual que `orquestador.py:hash_archivo`). Comparada contra la aprobada anterior `aprobadas/SPEC-001_v1.5.md` con `diff` línea por línea (ambas en LF). Sexta revisión: cubre el cambio frente a v1.5 (reescritura de AC-003 y AC-005 «según PREG-004 y PREG-005», según el historial de la SPEC); lo demás se conserva de las revisiones de v1.5, v1.4, v1.3, v1.2 y v1.1, ya hechas en este mismo informe.
MVP: Dentro del Debe (módulo `identidad`; DEC-P01). `docs/mvp.md` tiene `aprobado_por: Camila` y `hash_specs: 0e5fdf3938e8`, fijado el 2026-10-31 sobre SPEC-001 v1.5; la tabla de Requisitos cita explícitamente `SPEC-001/AC-003` como uno de los AC verificables de `REQ-001` (`Debe`). El MVP no comprueba automáticamente el hash de cada SPEC (`CLAUDE.md`): la aprobación del MVP sigue vigente formalmente, pero el AC que cita para REQ-001 cambió de contenido en v1.6 y ese contenido tiene el hallazgo bloqueante de abajo.

## Resumen (3 líneas)

La v1.6 reescribe AC-003 y AC-005 «según PREG-004 y PREG-005»; PREG-004 y PREG-005 son preguntas de **implementación de pruebas** (firma de `esCodigoVigente`, contrato de `registrarAutorizacion`), no piden cambiar el contenido de negocio de ningún AC, y las dos están marcadas `Bloquea: no`. El cambio a AC-005 es una aclaración de redacción sin problema. El cambio a AC-003 introduce una precondición («identidad ya verificada») que no puede coexistir con la otra precondición del mismo «Dado» («un código de verificación activo») según BR-003, CL-001, la sección 7.2 y el flujo principal de la propia SPEC: no hay un estado del sistema que cumpla las dos a la vez, así que AC-003 queda sin caso posible (H-019, bloqueante).
Esto afecta directamente a `REQ-001` (`Debe`), que `docs/mvp.md` verifica en parte con `SPEC-001/AC-003`. También se abre H-020 (media): la justificación «según PREG-004» no corresponde a lo que PREG-004 decidió.
Total abiertos: 9 (1 bloqueante, 0 altos, 2 medios, 6 menores); 11 resueltos. Se creó PREG-084, con `Bloquea: sí`. El módulo `identidad` no puede avanzar con esta versión (ver «Conclusión»).

Etiquetas en la columna Problema: `[CONFIRMADO]` sale del texto citado o de un registro aprobado; `[INFERIDO]` es una conclusión de S1 que una persona debe confirmar.

## Revisión de v1.6

La diferencia con la v1.5 aprobada se revisó línea por línea con `diff` (las dos versiones están en LF, sin diferencia de fin de línea que revisar).

### Lo que cambia y lo que no

| Elemento | v1.5 | v1.6 | Tipo de cambio |
|---|---|---|---|
| Cabecera / título / `Análisis` / `Análisis de impacto` / `Historial de cambios` / `Siguiente paso` | — | Actualizados a v1.6, citan PREG-004 y PREG-005 | Metadatos, sin regla de negocio nueva |
| Modelo de dominio, RF-009 | «anulable al solicitar uno nuevo…»; RF-009: «…registros de auditoría disociados **de la identidad**…» | «anulable al solicitar **un nuevo código**…»; RF-009: «…registros de auditoría disociados…» (sin «de la identidad») | Redacción. La frase de RF-009 queda igual a como ya dice BR-004 y RNF-002 («registros de auditoría disociados», sin «de la identidad»); mejora la consistencia interna en vez de romperla. No es hallazgo. |
| §16, RF-006 | «verificado por AC-009, AC-011, AC-012, AC-013, AC-015, AC-017» | agrega AC-003 a esa lista | Trazabilidad. Razonable: RF-006 es el único RF que nombra «pedir un código nuevo» como opción de la ruta alterna, y AC-003 prueba ese camino cuando sí se puede pedir. No es hallazgo por sí solo; ver H-019 sobre el contenido de AC-003. |
| Verificación, «Consistencia interna» | «parcial. DEC-P78 se aplicó en…; falta fijar el valor del tope…» | «cumple. Todos los criterios de aceptación actualizados (AC-003 y AC-005) son consistentes con RF-006, RF-007 y BR-003.» | Esta frase es la propia autoevaluación de la SPEC. H-019 la contradice: AC-003 no es consistente con BR-003 tal como quedó. |
| **AC-003** | «Dado un celular con al menos dos envíos disponibles antes del tope de RF-012, y que el usuario solicita un código de verificación y posteriormente pide otro antes de que venza el primero, cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.» | «Dado un usuario con identidad ya verificada y un código de verificación activo de un intento previo, cuando solicita un nuevo código estando por debajo del tope de RF-012, entonces el sistema emite el nuevo código y el anterior queda anulado de inmediato. Origen: RF-006, BR-003, PREG-004.» | Regla de negocio. Ver H-019. |
| **AC-005** | «Dado que el usuario tiene la identidad verificada y se dispone a cargar documentos, cuando el sistema lo solicita, entonces exige la aceptación de la autorización separada para datos de salud.» | «Dado un usuario con identidad verificada que se dispone a cargar documentos, cuando el sistema presenta la solicitud de carga, entonces exige explícitamente la aceptación de la autorización separada para datos de salud antes de continuar. Origen: RF-007, PREG-005.» | Regla de negocio, pero sin cambio de fondo: agrega «explícitamente» y «antes de continuar», que ya se podían leer en RF-007 y BR-001. No introduce ninguna condición nueva ni contradice nada. No es hallazgo. |

Nada más cambia: el resto del cuerpo (RF-001 a RF-012 salvo RF-009 en la frase ya comentada, RNF, BR, estados 7.2, flujo principal, flujos alternativos, casos límite, el resto de la sección 11, dependencias, restricciones, fuera de alcance y el resto de §16) es idéntico byte a byte entre v1.5 y v1.6.

### El problema de AC-003 (H-019)

AC-003 queda trazado en §16 bajo **HU-002** («Como usuario, quiero verificar mi identidad mediante un código de un solo uso enviado a mis medios de contacto para acceder a mis datos de la EPS»), es decir, es parte del proceso para **llegar** a tener la identidad verificada, no algo que ocurre después.

La sección 7.2 (Estados y transiciones) solo permite dos transiciones desde «Identidad Verificada»: a «Autorización Salud Registrada» o a «Revocado». Ninguna transición vuelve a «Código Emitido» ni a «Código Emitido (Nuevo)». El flujo principal (sección 8) tampoco tiene, después del paso 10 («El sistema confirma que el código es correcto, valida exitosamente la identidad y habilita el acceso a la gestión»), ningún paso que vuelva a generar o solicitar un código de verificación; el paso 11 pasa directo a la autorización de datos de salud.

BR-003 y CL-001 — las reglas que realmente describen «pedir un código nuevo mientras otro sigue vigente» — no tienen la condición «identidad ya verificada»:
- BR-003: «Si el usuario solicita un nuevo código mientras otro sigue vigente, el código anterior queda anulado de inmediato y solo es válido el último emitido.»
- CL-001: «si el usuario solicita un código nuevo antes de ingresar el anterior, el código previo queda invalidado de inmediato y solo el nuevo es aceptado.»

AC-003 (v1.6) exige al mismo tiempo «identidad ya verificada» **y** «un código de verificación activo de un intento previo». Con el modelo de estados de la propia SPEC, esas dos condiciones son mutuamente excluyentes: un código solo está activo en el estado «Código Emitido» (o sus variantes), que es anterior a «Identidad Verificada». No existe un estado del sistema, según SPEC-001 v1.6, que satisfaga el «Dado» de AC-003 tal como está escrito. Esto no es solo una imprecisión de redacción: impide construir el caso de prueba (TC-013) sin decidir primero, por fuera de la SPEC, cuál de las dos condiciones se descarta.

`[INFERIDO]` La hipótesis más probable es que el modelo generador copió el patrón de precondición que usan AC-005, AC-007 y AC-008 («Dado un usuario/titular con identidad verificada…», que sí es correcto para esos tres, porque describen acciones posteriores a verificar la identidad) y lo aplicó por error a AC-003, que describe una acción **dentro** del propio proceso de verificación. No se da como hecho; lo decide Especificaciones.

### El origen citado no corresponde (H-020)

El «Análisis de impacto» de la v1.6 dice: «PREG-004 y PREG-005: afecta AC-003 y AC-005. Ambos actualizados para reflejar correctamente la condición inicial y los parámetros de la verificación.»

`docs/preguntas/PREG-004.md` (Estado: resuelta, Bloquea: no) dice textualmente: «¿Cómo debe recibir `esCodigoVigente` el contexto del código vigente (código, emisión, intentos, inactivo) sin usar estado global?» y la decisión registrada es: «Segundo argumento `esCodigoVigente(codigo, contexto?)`. El TC debe pasar el contexto con el código vigente.» Es una decisión sobre la firma de una función de implementación para la prueba TC-013, no sobre el contenido del «Dado/Cuando/Entonces» de AC-003. PREG-004 no pide, ni permite inferir, que AC-003 deba decir «identidad ya verificada»; de hecho, el «Contexto» de PREG-004 sigue describiendo el mismo escenario de v1.5 («La prueba TC-013 llama `esCodigoVigente('741203')`…», sobre el código vigente, no sobre la identidad). La reescritura de AC-003 no es una consecuencia necesaria de PREG-004, y es precisamente esa reescritura la que introduce H-019.

`docs/preguntas/PREG-005.md` sí tiene relación más directa con AC-005 (el método `registrarAutorizacion(solicitudId)`), pero tampoco pide cambiar el «Dado/Cuando/Entonces» de AC-005; el cambio real en AC-005 es una aclaración de redacción sin contradicción, así que no se abre un hallazgo bloqueante por esto, solo la observación de trazabilidad.

### Impacto en el módulo `identidad` (v1.6)

Como con cada versión anterior de SPEC-001, al existir ya en `aprobadas/` con un hash distinto al registrado en `pipeline.json` (`d278bfd11dc3` vs. `e741b16632c3` real), se repite el patrón de DEC-P79/OBS-017: la revisión, los oráculos (`qa/casos/TC-001` a `TC-014`), las pruebas y la implementación del módulo `identidad` quedan invalidados en bloque hasta que una persona vuelva a marcarlos. Con el veredicto `NO_APTA` de esta revisión, el bloqueo es doble: además de la invalidación mecánica por hash, **S2 no puede rediseñar TC-013 (SPEC-001/AC-003) tal como está escrito**, porque no hay un estado del sistema que cumpla su «Dado». El resto de los TC asociados a AC no tocados por v1.6 (TC-001 a TC-012 y TC-014) no cambian de contenido frente a lo ya dicho para v1.5, pero igual deben volver a marcarse por el cambio de hash.

## Hallazgos que pretendía resolver

La v1.6 no declara ningún hallazgo abierto que se propusiera resolver (su historial solo cita PREG-004 y PREG-005, ambas marcadas `Bloquea: no` y ajenas al contenido de negocio). Los hallazgos abiertos heredados de v1.5 (H-001, H-004, H-005, H-006, H-007, H-017, H-018) no cambian: ninguna de las líneas que tocan sigue teniendo el mismo texto que en v1.5.

## Hallazgos

Total abiertos: 9 (1 bloqueante, 0 altos, 2 medios, 6 menores): H-001, H-004, H-005, H-006, H-007, H-017, H-018, H-019 y H-020. Resueltos: H-002, H-003 y H-008 en v1.3; H-009, H-010 y H-011 en v1.4; H-012, H-013, H-014, H-015 y H-016 en v1.5. H-005 sigue resuelto en parte. H-019 y H-020 son nuevos de v1.6. La columna «Severidad» de los resueltos es la que tenían al abrirse.

| id | Severidad | Tipo | Cita literal | Problema | Pregunta sugerida | Bloquea | Estado (v1.6) |
|----|-----------|------|--------------|----------|-------------------|---------|---------------|
| H-019 | bloqueante | consistencia | SPEC-001/AC-003 (v1.6): «Dado un usuario con identidad ya verificada y un código de verificación activo de un intento previo, cuando solicita un nuevo código estando por debajo del tope de RF-012, entonces el sistema emite el nuevo código y el anterior queda anulado de inmediato.» | `[CONFIRMADO]` Nuevo en v1.6. Las dos precondiciones del «Dado» no pueden coexistir: SPEC-001/BR-003 («Si el usuario solicita un nuevo código mientras otro sigue vigente…», sin condición de identidad verificada), SPEC-001/CL-001 (la misma regla) y la sección 7.2 (ningún estado posterior a «Identidad Verificada» conserva un código activo; sus únicas transiciones son a «Autorización Salud Registrada» o a «Revocado») y el flujo principal (paso 10 habilita el acceso; no hay paso posterior que vuelva a emitir códigos) muestran que un código solo está activo antes de llegar a «Identidad Verificada». AC-003 está trazado en §16 bajo HU-002 («verificar mi identidad»), que ocurre antes de verificarla. No existe un estado del sistema, según la propia SPEC, que cumpla el «Dado» tal como está escrito: S2 no puede construir el caso (TC-013) sin decidir, por fuera de la SPEC, qué parte de la precondición se descarta. | ¿AC-003 debe quitar la condición «identidad ya verificada» y volver a una precondición solo sobre el código y el tope (como en v1.5, «un celular con al menos dos envíos disponibles antes del tope»), o se refiere a un escenario distinto que no es tema de esta SPEC (p. ej., la revalidación de vinculación de SPEC-002/RF-015, que ya genera un código nuevo sin pedir cédula tras una identidad verificada antes)? Ver `docs/preguntas/PREG-084.md`. | sí |
| H-020 | media | trazabilidad | SPEC-001, Análisis de impacto (v1.6): «PREG-004 y PREG-005: afecta AC-003 y AC-005. Ambos actualizados para reflejar correctamente la condición inicial y los parámetros de la verificación.» | `[CONFIRMADO]` Nuevo en v1.6. `docs/preguntas/PREG-004.md` decide la firma de una función de implementación, `esCodigoVigente(codigo, contexto?)`, para la prueba TC-013; no decide ni permite inferir ninguna condición de negocio de AC-003. La reescritura de AC-003 no es una consecuencia de lo que PREG-004 resolvió, y es justo esa reescritura la que introduce H-019. `docs/preguntas/PREG-005.md` sí se relaciona con AC-005 (el método `registrarAutorizacion`), pero tampoco pedía cambiar su «Dado/Cuando/Entonces»; ese cambio no es hallazgo porque no introduce contradicción. | ¿Los cambios de contenido de negocio en AC-003 y AC-005 debían hacerse en la SPEC, o la respuesta de PREG-004 y PREG-005 era solo para el oráculo/TC y el contrato de servicio (alcance de S2), sin tocar el «Dado/Cuando/Entonces» de la SPEC? | no |
| H-001 | menor | completitud | SPEC-001/CL-003: «un código correcto ingresado a los 9 minutos y 59 segundos es validado exitosamente; si se ingresa a los 10 minutos exactos (10m 00s) o después, el sistema lo rechaza por expiración y despliega la ruta alterna.» | `[CONFIRMADO]` Sigue igual en v1.6. El lint marca «9 minutos» sin un AC que lo diga con esas palabras; CL-003 y SPEC-001/AC-009 («10:09:59» / «10:10:00») cubren debajo, en el límite y por encima. Es un aviso mecánico de la herramienta, no del criterio. | — | no | Abierto (aviso mecánico). Sin cambios en v1.6. |
| H-004 | menor | completitud | SPEC-001/RF-012: «El sistema debe limitar el envío de códigos con un tope configurable por celular y ventana de tiempo.» SPEC-001/AC-015: «Dado un celular que alcanzó el tope de envíos de su ventana de tiempo». | `[CONFIRMADO]` Sigue igual en v1.6. Ningún AC dice que los envíos vuelven cuando pasa la ventana, ni si la ventana es fija o móvil. El valor lo fija el equipo (DEC-P61) y sigue sin fijar (OBS-019). | ¿Se añade un AC de vuelta a enviar al terminar la ventana, y quién decide si es fija o móvil? | no | Abierto, sin cambios en v1.6. |
| H-005 | menor | ambigüedad | SPEC-001/AC-015: «cuando se solicita otro código para esa cédula». SPEC-001/RF-012: «un tope configurable por celular». | `[CONFIRMADO]` Sigue igual en v1.6. Si dos pacientes sintéticos comparten el celular registrado (un cuidador, contexto 3.3), el tope es común a las dos cédulas, porque RF-012 cuenta por celular; ningún AC lo comprueba. | Añadir el caso de dos cédulas con el mismo celular. | no | Resuelto en parte (v1.3). Sin cambios en v1.6. |
| H-006 | menor | consistencia | SPEC-001/RF-012: «El sistema debe limitar el envío de códigos». SPEC-002/RF-015: «iniciar de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación (sin exigir reingresar la cédula).» | `[INFERIDO]` Sigue igual en v1.6. DEC-P61 habla de «El envío de códigos», sin limitarlo a la verificación de SPEC-001. La reactivación de SPEC-002 también envía códigos al celular; el dueño del arreglo es SPEC-002. | ¿El tope cuenta también los códigos de reactivación de SPEC-002/RF-015? | no | Abierto, sin cambios (corresponde a SPEC-002). |
| H-007 | menor | trazabilidad | SPEC-001, Verificación: «Consistencia interna: cumple. Todos los criterios de aceptación actualizados (AC-003 y AC-005) son consistentes con RF-006, RF-007 y BR-003.» SPEC-001, Verificación: «Completitud: cumple.» | `[CONFIRMADO]` En v1.6 «Consistencia interna» pasa de «parcial» a «cumple», pero H-019 muestra que AC-003 no es consistente con BR-003. «Completitud» sigue en «cumple», aunque faltan la vuelta al terminar la ventana (H-004) y el caso de dos cédulas (H-005). | Corregir «Consistencia interna» a «no cumple» mientras H-019 esté abierto, y pasar «Completitud» a «parcial». | no | Abierto. Empeora en v1.6: la autoevaluación ahora contradice un hallazgo bloqueante. |
| H-017 | media | consistencia | SPEC-001/RF-011; SPEC-001/AC-013; SPEC-001/AC-020. | `[CONFIRMADO]` Sigue igual en v1.6 (texto sin cambios). Ver el detalle completo en «Revisión de v1.5» más abajo. | Ver `docs/preguntas/PREG-081.md`. | no | Abierto, sin cambios en v1.6. |
| H-018 | menor | completitud | SPEC-001/AC-020; SPEC-001/RF-012; SPEC-001/AC-013. | `[CONFIRMADO]` Sigue igual en v1.6 (texto sin cambios). Ver el detalle completo en «Revisión de v1.5» más abajo. | Añadir el sentido inverso a AC-020 y decir que «llegó» es «sin falla detectada por el sistema». | no | Abierto, sin cambios en v1.6. |

## Valores límite revisados

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| 10 minutos (vigencia del código) | 9:59:59: el código correcto se valida (CL-003; SPEC-001/AC-009) | 10:00:00: se rechaza, se inactiva y se despliega la ruta alterna (CL-003; SPEC-001/AC-009) | 10:10:00 o después: se rechaza por expirado (SPEC-001/AC-009) | Cumple. Sin cambios en v1.6. |
| 3 intentos (ingreso del código) | Intento 1 o 2 fallido: reintento con intentos restantes (BR-005; SPEC-001/AC-010) | 3.er intento fallido: código inactivo y ruta alterna con la condición del tope (BR-005; CL-004; SPEC-001/AC-011) | Intento sobre código inactivo: rechazado (CL-004) | Cumple. Sin cambios en v1.6. |
| Tope de envíos por celular (DEC-P61, DEC-P68, DEC-P78, DEC-P82) | SPEC-001/AC-016 y AC-019 (a dos del tope) siguen sirviendo para «debajo». **AC-003 ya no sirve como caso de «debajo» (H-019): su «Dado» no se puede construir.** A un envío del tope con todos los canales fallidos: AC-018 | A un envío del tope con caso mixto: AC-020 lo lleva al tope. Tope alcanzado: SPEC-001/AC-015 y AC-017 (el código vigente sigue valiendo) | Al terminar la ventana: sin AC | Parcial, y empeora en v1.6: el lado de «debajo» pierde a AC-003 como caso directo (H-019), aunque AC-016 y AC-019 lo siguen cubriendo. Valor y ventana sin fijar (OBS-019). Faltan el sentido inverso del mixto (H-018), el aviso del mixto (H-017), H-004 y H-005. |

Los valores 30 unidades, 48 horas y 90 días son de otros módulos y no aparecen en SPEC-001.

## Preguntas creadas

- `docs/preguntas/PREG-084.md` — ¿AC-003 (v1.6) debe quitar la condición «identidad ya verificada» y volver a una precondición solo sobre el código y el tope, o se refiere a un escenario distinto que no es tema de SPEC-001? — bloquea: sí (revisión de v1.6, H-019).
- `docs/preguntas/PREG-081.md` — Si un canal falla y el otro entrega el código, ¿se avisa la falla y se ofrece reintentar el envío? ¿Ese reintento cuenta para el tope? — bloquea: no (revisión de v1.5, H-017). Sigue abierta en v1.6.
- `docs/preguntas/PREG-080.md` — Si el código llega por un solo canal (falla el SMS y llega el correo, o al revés), ¿cuenta como envío para el tope? — bloquea: no (revisión de v1.4, H-015). Respondida por DEC-P82 en el conteo y aplicada en v1.5; la parte de AC-013 no se respondió y pasa a PREG-081.
- `docs/preguntas/PREG-079.md` — Al alcanzar el tope de envíos, ¿sigue valiendo el código vigente y qué cuenta como un envío? — bloquea: no (revisión de v1.2, H-002 y H-003). Respondida por DEC-P78 y aplicada en v1.3 y v1.4.

H-020 no necesita una pregunta propia: la evidencia (el texto de PREG-004 y PREG-005) ya está completa; lo que falta decidir es si Especificaciones corrige AC-003 quitando la condición, lo que ya pide PREG-084. H-018 es de edición y no necesita pregunta: DEC-P82 ya decide el sentido inverso. H-013, H-014 y H-016 (resueltos en v1.5) eran de edición y no necesitaban pregunta: DEC-P78 ya decide su contenido. H-004 sigue pendiente en OBS-009, y H-006 es de SPEC-002. La revisión de v1.1 no creó preguntas: la ambigüedad del vencimiento del código la respondió DEC-01 (OPEN-Q-001), registrada en `docs/preguntas/PREG-001.md`.

## Confirmado e inferido

- CONFIRMADO: los estados de v1.6 salen de comparar byte a byte la v1.5 aprobada con la v1.6 aprobada, de `docs/preguntas/PREG-004.md` y `docs/preguntas/PREG-005.md`, de la sección 7.2 y el flujo principal de la propia SPEC-001 v1.6, de `pipeline.json` (hash registrado vs. hash real) y de `docs/mvp.md` (REQ-001 cita SPEC-001/AC-003). Lo anterior (v1.1 a v1.5) sale además de `docs/decisiones.md` (DEC-P61, DEC-P68, DEC-P78, DEC-P82), SPEC-002 v1.11, ARQ-005/ADR-006 y el código del módulo `identidad`.
- INFERIDO: que el error de AC-003 viene de copiar el patrón de precondición de AC-005/AC-007/AC-008 (H-019); el tope común a dos cédulas (H-005); su alcance a la reactivación de SPEC-002 (H-006); y la forma de diseñar AC-018/AC-019 (H-014, ya resuelto). En H-017 no se infiere la respuesta. El significado de «llegó» (H-018) es inferido.
- La sección «Verificación» de la SPEC no se usó como evidencia a favor: en v1.6 esa sección se contradice con H-019 (H-007).

## Criterios

- Verificabilidad: **no cumple**. AC-003 no tiene un «Dado» construible según el propio modelo de estados de la SPEC (H-019). El resto de los AC (AC-001, AC-002, AC-004 a AC-013, AC-015 a AC-020) conserva oráculo observable, igual que en v1.5.
- No ambigüedad: cumple en parte, sin cambios de fondo frente a v1.5. Siguen abiertas la ventana fija o móvil (H-004), si AC-013 aplica al caso mixto (H-017) y qué es «llegó» (H-018).
- Completitud: no cumple. Faltan la vuelta al terminar la ventana (H-004), el caso de dos cédulas con el mismo celular (H-005), el aviso del caso mixto (H-017) y el sentido inverso del mixto (H-018).
- Consistencia: **no cumple**. AC-003 contradice BR-003, CL-001, la sección 7.2 y el flujo principal de la misma SPEC v1.6 (H-019); la propia sección «Verificación» de la SPEC declara «cumple» donde no cumple (H-007).
- Trazabilidad: cumple en lo pedido para RF/BR/CL, con una reserva nueva: el «Análisis de impacto» atribuye el cambio de AC-003 a PREG-004, y PREG-004 no decide ese contenido (H-020).

## Revisión de v1.5

La diferencia con la v1.4 aprobada se revisó línea por línea, sin contar los finales de línea: el borrador v1.5 está guardado con CRLF y la v1.4 aprobada con LF.

### Comprobación de DEC-P82

Texto en `docs/decisiones.md`: «Responde PREG-080 y precisa DEC-P78. Un envío cuenta para el tope si el código llegó por al menos un canal; solo es fallido si fallan todos los canales.» La decisión dice que afecta a «SPEC-001/RF-012, AC-013, AC-018, AC-019».

| Elemento | Texto en v1.5 | Estado |
|---|---|---|
| Sección 2 | «DEC-P82. Responde PREG-080 y precisa DEC-P78. ...» | Bien aplicada. Coincide palabra por palabra con `docs/decisiones.md`. |
| RF-012 | «Un envío cuenta para el tope si el código llegó por al menos un canal; solo es fallido si fallan todos los canales (DEC-P82).» | Bien aplicada y sin extender. No choca con la frase de DEC-P78 que la precede: «envío fallido» queda definido como «fallan todos». |
| AC-018 | «cuando fallan todos los canales al enviar el código, entonces ese envío no cuenta para el tope y la siguiente petición de código se envía.» | Bien aplicada. Resuelve H-014 en su parte. |
| AC-019 | «Dado un celular a dos envíos del tope de RF-012 [...] entonces cuenta un solo envío y la siguiente petición de código todavía se envía.» | Correcto. Si contara dos, el celular quedaría en el tope y la siguiente petición no se enviaría: el AC distingue uno de dos. |
| AC-020 (nuevo) | «cuando el SMS falla y el correo llega, entonces ese envío cuenta para el tope y la siguiente petición muestra la ruta alterna sin la opción de pedir un código nuevo.» | Bien aplicada. Coincide con AC-015 y AC-017. Solo cubre un sentido del caso mixto (H-018). |
| AC-013 y E5 | Sin cambios. AC-013: «Un envío fallido no cuenta para el tope de RF-012 (DEC-P78).» | En el conteo no hay contradicción: con DEC-P82, «envío fallido» es el que falla en todos los canales. Sí queda sin decidir si en el caso mixto se avisa y se ofrece reintentar (H-017, PREG-081). El registro dice que DEC-P82 afecta AC-013, y AC-013 no cambió. |

### Valor límite del tope: AC-003, AC-017, AC-018, AC-019 y AC-020

Con T el tope y E los envíos ya contados en la ventana:

| AC | Punto de partida | Qué pasa | Oráculo | Choca con |
|---|---|---|---|---|
| SPEC-001/AC-003 | T − E ≥ 2 | Primera petición: T − E ≥ 1. Segunda: sigue por debajo del tope, envía y anula. | El código anterior se rechaza. | Nada. Con T − E = 1, AC-003 ya no aplica y manda AC-017. |
| SPEC-001/AC-016 | Por debajo del tope en el momento de pedir | Envía y anula. | El anterior queda anulado. | Nada. |
| SPEC-001/AC-019 | T − E = 2 | SMS y correo cuentan 1: T − E = 1. | La siguiente se envía. | Nada. |
| SPEC-001/AC-018 | T − E = 1 | Fallan todos: no cuenta, T − E = 1. | La siguiente se envía. | Nada. |
| SPEC-001/AC-020 | T − E = 1 | Mixto: cuenta, T − E = 0. | La siguiente muestra la ruta alterna sin código nuevo. | Nada con AC-015 ni AC-017. Ver H-017 por AC-013. |
| SPEC-001/AC-015, AC-017 | T − E = 0 | No envía. | Ruta alterna; el código vigente sigue valiendo. | Nada. |

H-013 queda resuelto: ningún par de AC da oráculos opuestos para el mismo punto de partida. (Nota de la revisión de v1.6: la tabla describe el texto de AC-003 **de v1.5**, que es correcto; en v1.6 ese texto cambió y el problema vuelve, aunque de otra forma — ver H-019.)

### Hallazgos que pretendía resolver

| id | Severidad anterior | Estado en v1.5 | Evidencia |
|---|---|---|---|
| H-012 | menor | Resuelto | RF-012: «Origen: DEC-P61, DEC-P68, DEC-P78, DEC-P82.» BR-003 y CL-001: «Origen: contexto 3.2, DEC-01, DEC-P78.» Igual en §16. La línea de impacto de DEC-P78 sigue sin RF-006, E5 ni AC-009; no se cuenta, porque ninguna regla depende de ella. |
| H-013 | media | Resuelto | AC-003: «Dado un celular con al menos dos envíos disponibles antes del tope de RF-012». Ver la tabla anterior. |
| H-014 | menor | Resuelto | AC-018 y AC-019 terminan en «la siguiente petición de código (todavía) se envía», que se observa. |
| H-015 | media | Resuelto por DEC-P82 | RF-012, AC-018 y AC-020. Lo que PREG-080 preguntaba sobre AC-013 en el caso mixto pasa a H-017. |
| H-016 | menor | Resuelto | 7.2: «si el celular no alcanzó el tope de RF-012; con el tope alcanzado, se aplica AC-015.» Paso 7: «si el celular no alcanzó el tope de RF-012; si lo alcanzó, se aplica AC-015.» No hay un estado propio de tope alcanzado, pero el oráculo está en AC-015. |

### Cambios fuera del historial

- Cambios de fondo fuera del historial: ninguno. El diff coincide con los cinco puntos de la petición. El historial y la línea de impacto dicen «H-012 a H-016»; H-015 lo resuelve DEC-P82, así que el rango es correcto.
- Ajuste a mano anotado («se corrigió una palabra en inglés en Verificación»): «Verificación» es idéntica a la de v1.4. El ajuste solo deshace lo que tocó el generador.
- «Verificación»: no se tocó, como pedía la orden. Por eso sigue sin DEC-P82 ni AC-020 (H-007).
- Fin de línea: el borrador está en CRLF. Antes de moverlo a `aprobadas/` hay que pasarlo a LF, por el hash. No es un hallazgo de la SPEC.

### Impacto en el módulo identidad (v1.5)

Al aprobar, el cambio de hash vuelve a invalidar la revisión, los oráculos, las pruebas, la implementación y el humo del módulo `identidad` (como en DEC-P79). Cambios respecto de la v1.4:

- TC-013 (SPEC-001/AC-003) parte de un celular con al menos dos envíos disponibles, como dice ya el AC.
- Los casos de AC-018 y AC-019 usan el observable «la siguiente petición se envía». Hace falta un caso nuevo para AC-020. Todos necesitan el valor del tope y de la ventana (OBS-019); mientras no exista, se parametrizan o quedan como `supuesto`.
- El aviso del caso mixto (AC-013) queda como `supuesto` hasta PREG-081.

## Revisión de v1.4

La diferencia con la v1.3 se revisó línea por línea. Los dos borradores están guardados con CRLF.

### Comprobación de los arreglos pedidos

| Hallazgo | Texto en v1.4 | Estado |
|---|---|---|
| H-009 (AC-003 frente a AC-017) | SPEC-001/AC-003: «Dado un celular por debajo del tope de RF-012, y que el usuario solicita un código de verificación y posteriormente pide otro antes de que venza el primero, cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.» | Resuelto en el caso general: con el tope alcanzado de partida, AC-003 ya no aplica y manda AC-017. Queda un borde: el «Dado» se evalúa antes de la primera petición, y esa petición gasta un envío. Con el celular a un envío del tope, la segunda petición ocurre con el tope alcanzado y los dos AC vuelven a chocar (H-013). |
| H-010, E3 | Paso 1: «Si el celular está por debajo del tope de RF-012, el sistema anula de inmediato el código previo; con el tope alcanzado, el código previo sigue vigente (DEC-P78).» Paso 2: «... Con el tope de RF-012 alcanzado, no emite código nuevo y se aplica AC-017.» | Resuelto. La condición va ahora en el paso 1 y se evalúa en el momento de la petición. |
| H-010, 7.2 | «Transición a "Código Emitido (Nuevo)": provocada por Usuario al solicitar nuevo código con el celular por debajo del tope de RF-012 (anula el anterior). Con el tope alcanzado no hay transición y el código vigente conserva su estado (DEC-P78).» | Resuelto. No hay estado propio de «tope alcanzado», pero la frase deja claro que el código no cambia de estado; basta para el oráculo. Falta el tope en la primera emisión, «Pendiente de Verificación» → «Código Emitido» (H-016, menor). |
| H-010, sección 3 | «(nuevo código salvo con el tope de RF-012 alcanzado, orientación EPS, atención presencial)» | Resuelto. |
| H-010, modelo de dominio | «anulable al solicitar uno nuevo por debajo del tope de RF-012 (DEC-P78)» | Resuelto. |
| H-010, DEC-01 | «Modificada por DEC-P61, DEC-P68 y DEC-P78: existe un tope configurable de envíos de código por celular y ventana de tiempo.» | Resuelto. El cuerpo de DEC-01 («el anterior queda anulado y solo vale el último») se conserva como texto histórico de la decisión, y la nota remite a DEC-P78. No se cuenta como hallazgo: BR-003, CL-001, E3, 7.2 y AC-017 dicen la regla vigente. |
| H-011 | AC-018 y AC-019 nuevos. | Resuelto: las dos reglas de conteo de DEC-P78 ya tienen AC. Quedan reservas de verificabilidad (H-014) y el caso de envío parcial, que DEC-P78 no decide (H-015, PREG-080). |
| H-012 | Análisis de impacto: «DEC-P78 (v1.4): afecta además AC-003, E3, la sección 7.2, la sección 3, el modelo de dominio y DEC-01, y añade AC-018 y AC-019; AC-015 cambió en v1.3 por H-005.» §16: «CL-001: ... verificado por AC-003, AC-017.» y «RF-006: ... AC-015, AC-017.» | Resuelto en parte. Siguen sin citar DEC-P78 los orígenes de RF-012 («Origen: DEC-P61, DEC-P68», en el cuerpo y en §16), BR-003 y CL-001. La línea de impacto no dice nada de RF-006, E5 y AC-009, que DEC-P78 nombra y que no cambian. |

### Comprobaciones pedidas

- AC-003 frente a AC-017: ya no hay oráculos opuestos si el celular está con el tope alcanzado de partida, ni si está a dos o más envíos del tope. Sí los hay con el celular a un envío del tope, porque la primera petición de AC-003 lo deja en el tope (H-013). AC-016 y E3 evalúan la condición en el momento de pedir otro, y AC-003 la evalúa antes de la primera petición.
- E3, 7.2, sección 3, modelo de dominio y DEC-01: respetan DEC-P78 (ver la tabla).
- AC-018: coherente con RF-012 y DEC-P78, y el límite (a un envío del tope) está bien elegido. El resultado «el usuario puede pedir otro código» no dice qué se observa; lo comprobable es que la siguiente petición sí envía un código (H-014). Usa «pedir otro código» donde AC-013 y E5 dicen «reintentar el envío»; no se contradicen, porque ninguno de los dos cuenta para el tope.
- AC-019: coherente con RF-012 y DEC-P78. «Cuenta un solo envío» es un estado interno sin punto de partida ni resultado observable (H-014). No cubre el caso en que el código llega por un solo canal (H-015).
- Textos que anulan el código o ofrecen uno nuevo sin la condición del tope: ninguno en lo que pidió H-010. Quedan:
  - 7.2, «Pendiente de Verificación» → «Código Emitido»: «provocada por Sistema al validar cédula en EPS simulada y enviar código por SMS/correo.» Y el paso 7 del flujo principal: «El sistema genera y envía el código de un solo uso por SMS y correo (si existe).» Ninguno de los dos tiene la condición del tope en la primera emisión. AC-015 la cubre como oráculo, pero 7.2 no tiene la transición (H-016, menor).
  - El cuerpo de DEC-01 (texto histórico; la nota remite a DEC-P78) y la «Necesidad original» (cita textual). Ninguno de los dos se cuenta.
  - E5 y AC-013 («reintentar el envío»): no chocan, porque un envío fallido no cuenta.
- `[INFERIDO]` Lo que H-011 anotaba sigue igual: por debajo del tope, E3 paso 1 anula el código anterior antes de enviar el nuevo; si ese envío falla, la persona queda sin código hasta reintentar (AC-013). La SPEC lo dice así y DEC-P78 no lo cambia. Se anota por si el equipo no lo quiere; no es hallazgo.
- Cambios de fondo fuera del historial: ninguno. El diff coincide con los cinco puntos de la petición. El ajuste a mano anotado («Versión 1.4, ajuste de edición sin cambio de reglas: se corrigió una palabra en inglés en Verificación.») no deja rastro de fondo: la única línea de «Verificación» que cambia es «Consistencia interna», y su texto es el que dictó la orden. La línea del ajuste a mano repite la de la v1.3; no es hallazgo. La cabecera sigue en «gemini-3.5-flash».
- «Verificación»: «Consistencia interna» dice que DEC-P78 se aplicó en «AC-015 a AC-019», lo que incluye AC-016, que no cambió. No nombra la sección 3, el modelo de dominio ni DEC-01. «Completitud» sigue en «cumple», aunque H-004 y H-016 están abiertos (H-007).
- Fin de línea: el borrador v1.4 está en CRLF. Antes de moverlo a `aprobadas/` hay que pasarlo a LF, por el hash. No es un hallazgo de la SPEC.

### Impacto en el módulo identidad (v1.4)

Lo dicho para la v1.2 y la v1.3 sigue valiendo: al aprobar se invalidan la revisión, los 14 oráculos, las pruebas, la implementación y el humo del módulo `identidad`. Cambios respecto de la v1.3:

- TC-013 (SPEC-001/AC-003): su oráculo debe partir de un celular con al menos dos envíos disponibles antes del tope, hasta que se corrija H-013.
- Hacen falta casos nuevos para SPEC-001/AC-018 y AC-019, además de los de AC-015, AC-016 y AC-017. Todos necesitan el valor del tope y de la ventana (OBS-009); mientras no exista, se parametrizan o quedan como `supuesto`. El caso de envío por un solo canal queda como `supuesto` hasta que se responda PREG-080.

## Revisión de v1.3 (conservada)

La diferencia con la v1.2 se revisó línea por línea. Los dos borradores están guardados con CRLF.

### Comprobación de DEC-P78 (v1.3)

Texto en `docs/decisiones.md`: «Con el tope alcanzado, pedir otro código no anula el vigente, que vale hasta vencer o agotar sus intentos; solo se muestra la ruta alterna. Un envío fallido no cuenta para el tope, y un código enviado por SMS y correo cuenta como un solo envío.» La decisión dice que afecta a «SPEC-001/BR-003, CL-001, RF-006, RF-012, E5, AC-003, AC-009, AC-011, AC-013, AC-015».

| Elemento | Texto en v1.3 | Estado |
|---|---|---|
| Sección 2 | «DEC-P78. Responde PREG-079 y precisa DEC-P68. ...» | Bien aplicada. Coincide palabra por palabra con `docs/decisiones.md`. |
| BR-003 | «Con el tope de RF-012 alcanzado, la petición no anula el código vigente, que sigue valiendo hasta vencer o agotar sus intentos (DEC-P78).» | Bien aplicada. |
| CL-001 | La misma frase. | Bien aplicada. En §16, CL-001 sigue verificado solo por AC-003 (H-012). |
| RF-012 | «Un envío fallido no cuenta para el tope, y un código enviado por SMS y por correo cuenta como un solo envío (DEC-P78).» | Bien aplicada. Ningún AC comprueba que SMS más correo cuente como un solo envío (H-011). |
| RF-006 | Sin cambios: «La opción de pedir un código nuevo no se ofrece cuando se alcanzó el tope de RF-012.» | Coherente con DEC-P78. AC-017 también lo verifica, pero §16 no lo lista (H-012). |
| E2 paso 2 | «solicitar nuevo código (salvo con el tope de RF-012 alcanzado)» | Bien aplicada. |
| E3 | Paso 1: «El sistema anula de inmediato el código previo.» Paso 2: «... Con el tope de RF-012 alcanzado, no emite código nuevo y se aplica AC-017.» | Incompleta. La condición se añadió al paso 2, pero el paso 1 anula el código sin condición y se ejecuta antes (H-010). |
| E5 | Sin cambios. | DEC-P78 la nombra. La regla del envío fallido solo está en AC-013 (H-011). No contradice nada. |
| AC-003 | Sin cambios: «cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.» | No aplicada. DEC-P78 lo nombra y choca con AC-017 (H-009). |
| AC-009 | Sin cambios: «muestra la ruta alterna». | Coherente. No enumera opciones; la ruta alterna queda definida por RF-006 y RF-012. |
| AC-011 | «(nuevo código salvo con el tope de RF-012 alcanzado, orientación EPS, atención presencial)» | Bien aplicada. |
| AC-013 | «Un envío fallido no cuenta para el tope de RF-012 (DEC-P78).» | Coherente. La frase queda fuera del Dado/Cuando/Entonces y no tiene caso de límite (H-011). «Reintentar el envío» no choca con el tope: la petición no se cuenta. |
| AC-015 | «para una cédula cuyo celular registrado es ese» | Bien aplicada (H-005, primera parte). |
| AC-016 | Sin cambios: «Dado un celular por debajo del tope ... anula el anterior de inmediato». | Coherente con BR-003 y AC-017: por debajo del tope se anula, con el tope alcanzado no. |
| AC-017 (nuevo) | «Dado un celular que alcanzó el tope y un código todavía vigente, cuando se solicita otro código, entonces el sistema no envía ninguno, muestra la ruta alterna sin la opción de pedir un código nuevo, y el código vigente sigue siendo aceptado.» | Bien aplicada y verificable. Choca con AC-003 (H-009). |
| 7.2 | Sin cambios: «Transición a "Código Emitido (Nuevo)": provocada por Usuario al solicitar nuevo código (anula el anterior).» | No aplicada. Anula sin condición y no hay transición para el tope alcanzado (H-010). |

### Comprobaciones pedidas (v1.3)

- Contradicción con AC-003: sí la hay (H-009). Con el tope alcanzado, «pide otro» y luego «intenta usar el código anterior»: AC-003 lo rechaza y AC-017 lo acepta. DEC-P78, la decisión más reciente, resuelve a favor de AC-017. Aun así, la SPEC da dos oráculos opuestos para el mismo caso.
- Con AC-009: no hay contradicción. Con AC-016: no hay contradicción; la condición «por debajo del tope» lo separa de AC-017. Con RF-006: no hay contradicción.
- Estado de los códigos en 7.2: contradice DEC-P78 (H-010). La transición «Código Emitido (Nuevo)» anula el anterior siempre, y 7.2 no tiene ningún estado ni transición para el tope alcanzado. Lo pedía H-003 y la orden de la v1.3 no lo incluyó.
- Textos que ofrecen «pedir un código nuevo» o anulan el código sin la condición del tope:
  - Sección 3: «Gestión de rutas alternas ante fallos de verificación (nuevo código, orientación EPS, atención presencial).»
  - Modelo de dominio: «anulable al solicitar uno nuevo».
  - DEC-01: «si se pide un nuevo código mientras otro sigue vigente, el anterior queda anulado y solo vale el último». Su nota cita DEC-P61 y DEC-P68, pero no DEC-P78.
  - E3, paso 1.
  - 7.2, transición «Código Emitido (Nuevo)».
  - AC-003.
  - La «Necesidad original» también dice «nuevo código», pero es una cita textual de la petición y no se cuenta.
- Cambios de fondo fuera del historial: ninguno. El diff coincide con los seis puntos de la petición. El ajuste a mano anotado («se corrigió una palabra en inglés en Verificación») no deja rastro de fondo en el diff. La única línea de «Verificación» que cambia es «Consistencia interna», y su texto es el que dictó la orden. La cabecera cambia el modelo a «gemini-3.5-flash», sin efecto.
- La línea de «Análisis de impacto» de DEC-P78 dice «afecta BR-003, CL-001, RF-012, E2, E3, AC-011, AC-013, AC-015, AC-017. Todos actualizados.» Omite AC-003, RF-006, E5 y AC-009, que la decisión nombra. AC-015 cambió por H-005, no por DEC-P78 (H-012).
- «Verificación»: «Consistencia interna» pasó a «parcial», como pidió la orden, pero dice que el tope «se aplicó en ... E3», y E3 paso 1 no lo aplica. «Completitud» sigue en «cumple» (H-007).
- Fin de línea: el borrador v1.3 está en CRLF. Antes de moverlo a `aprobadas/` hay que pasarlo a LF, por la misma razón que en la v1.2: el hash. No es un hallazgo de la SPEC.

### Impacto en el módulo identidad (v1.3)

Todo lo dicho para la v1.2 sigue valiendo: al aprobar se invalidan la revisión, los 14 oráculos, las pruebas, la implementación y el humo del módulo `identidad`. Cambios respecto de la v1.2:

- TC-013 (SPEC-001/AC-003) ya no depende de PREG-079, pero depende de H-009: su oráculo debe llevar la precondición «por debajo del tope».
- TC-012 (SPEC-001/AC-013) ya puede escribirse: el envío fallido no se cuenta.
- Hace falta un caso nuevo para SPEC-001/AC-017, además de los de AC-015 y AC-016. Los tres necesitan el valor del tope y de la ventana (OBS-009); mientras no exista, se parametriza o queda como `supuesto`.

## Valores límite revisados (histórico de v1.5)

Esta tabla queda conservada de la revisión de v1.5; la tabla vigente para v1.6 es la de la sección «Valores límite revisados» al inicio de este informe.

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| 10 minutos (vigencia del código) | 9:59:59: el código correcto se valida (CL-003; SPEC-001/AC-009) | 10:00:00: se rechaza, se inactiva y se despliega la ruta alterna (CL-003; SPEC-001/AC-009) | 10:10:00 o después: se rechaza por expirado (SPEC-001/AC-009) | Cumple. La ruta alterna queda condicionada por RF-006 y RF-012. |
| 3 intentos (ingreso del código) | Intento 1 o 2 fallido: reintento con intentos restantes (BR-005; SPEC-001/AC-010) | 3.er intento fallido: código inactivo y ruta alterna con la condición del tope (BR-005; CL-004; SPEC-001/AC-011) | Intento sobre código inactivo: rechazado (CL-004) | Cumple. |
| Tope de envíos por celular (DEC-P61, DEC-P68, DEC-P78, DEC-P82) | Por debajo: SPEC-001/AC-016, AC-003 (al menos dos disponibles) y AC-019 (a dos del tope). A un envío del tope con todos los canales fallidos: AC-018 | A un envío del tope con caso mixto: AC-020 lo lleva al tope. Tope alcanzado: SPEC-001/AC-015 y AC-017 (el código vigente sigue valiendo) | Al terminar la ventana: sin AC | Parcial. Ya no hay oráculos opuestos (H-013 resuelto). Valor y ventana sin fijar (OBS-019). Faltan el sentido inverso del mixto (H-018), el aviso del mixto (H-017, PREG-081), H-004 y H-005. |

## Preguntas creadas (histórico de v1.5)

- `docs/preguntas/PREG-081.md` — Si un canal falla y el otro entrega el código, ¿se avisa la falla y se ofrece reintentar el envío? ¿Ese reintento cuenta para el tope? — bloquea: no (revisión de v1.5, H-017).
- `docs/preguntas/PREG-080.md` — Si el código llega por un solo canal (falla el SMS y llega el correo, o al revés), ¿cuenta como envío para el tope? — bloquea: no (revisión de v1.4, H-015). Respondida por DEC-P82 en el conteo y aplicada en v1.5; la parte de AC-013 no se respondió y pasa a PREG-081.
- `docs/preguntas/PREG-079.md` — Al alcanzar el tope de envíos, ¿sigue valiendo el código vigente y qué cuenta como un envío? — bloquea: no (revisión de v1.2, H-002 y H-003). Respondida por DEC-P78 y aplicada en v1.3 y v1.4.

H-018 es de edición y no necesita pregunta: DEC-P82 ya decide el sentido inverso. H-013, H-014 y H-016 (resueltos en v1.5) eran de edición y no necesitaban pregunta: DEC-P78 ya decide su contenido. H-004 sigue pendiente en OBS-009, y H-006 es de SPEC-002. La revisión de v1.1 no creó preguntas: la ambigüedad del vencimiento del código la respondió DEC-01 (OPEN-Q-001), registrada en `docs/preguntas/PREG-001.md`.

## Confirmado e inferido (histórico de v1.5)

- CONFIRMADO: los estados salen de comparar la v1.4 aprobada y la v1.5, la v1.3 y la v1.4, y de `docs/decisiones.md` (DEC-P61, DEC-P68, DEC-P78, DEC-P82) y PREG-080. Lo anterior sale además de la v1.2, la v1.1 aprobada, SPEC-002 v1.11, ARQ-005/ADR-006, `pipeline.json`, `qa/casos/` y el código del módulo `identidad`.
- INFERIDO: el tope común a dos cédulas (H-005), su alcance a la reactivación de SPEC-002 (H-006), la anulación por debajo del tope cuando el envío falla (anotada en «Revisión de v1.4») y la forma de diseñar AC-018 y AC-019 (H-014). En H-017 no se infiere la respuesta; la lectura posible queda marcada como `[INFERIDO]`. El significado de «llegó» (H-018) es inferido.
- La sección «Verificación» de la SPEC no se usó como evidencia.

## Criterios (histórico de v1.5)

- Verificabilidad: cumple, con reserva. AC-003, AC-017, AC-018, AC-019 y AC-020 tienen oráculo observable una vez fijado el tope (H-014 resuelto). El aviso del caso mixto no tiene oráculo (H-017).
- No ambigüedad: cumple en parte. Ya no hay ambigüedad en el momento en que se evalúa AC-003 (H-013). Siguen la ventana fija o móvil (H-004), si AC-013 aplica al caso mixto (H-017) y qué es «llegó» (H-018).
- Completitud: no cumple. Faltan la vuelta al terminar la ventana (H-004), el caso de dos cédulas con el mismo celular (H-005), el aviso del caso mixto (H-017, PREG-081) y el sentido inverso del mixto (H-018). 7.2 ya tiene el tope en la primera emisión (H-016).
- Consistencia: cumple en parte. Ningún par de AC da oráculos opuestos en el tope. DEC-P82 coincide con `docs/decisiones.md` y no contradice el conteo de AC-013 ni de E5; queda la opción «reintentar el envío» en el caso mixto en el tope (H-017).
- Trazabilidad: cumple en lo pedido. AC-020 está en HU-002 y RF-012, y DEC-P78 y DEC-P82 en los orígenes (H-012 resuelto). Falta la línea «Verificación» (H-007).

## Revisión de v1.2 (conservada)

La diferencia con la v1.1 aprobada se revisó línea por línea, sin contar los finales de línea: el borrador v1.2 está guardado con CRLF y la v1.1 aprobada con LF.

### Comprobación por decisión (v1.2)

| Decisión | Aplicada en | Estado |
|---|---|---|
| DEC-P53 | Sección 2: «DEC-P53. El manejo de fallas de las fuentes simuladas durante la prevalidación queda fuera de alcance; esta SPEC conserva RF-010 y AC-012 para la verificación de identidad.» | Bien aplicada. Es informativa: RF-010, E4 y AC-012 («o la EPS no responde») no cambian, como dice la decisión. |
| DEC-P61 | RF-012, AC-016, nota en DEC-01 | Bien aplicada. «No rechaza una solicitud por tiempo de espera» y «El valor del tope y de la ventana lo fija el equipo» siguen la decisión. No se inventa ningún valor. |
| DEC-P68 | RF-012, RF-006, AC-015 | Bien aplicada. La ruta alterna con el tope alcanzado ofrece «solo» la EPS y la atención presencial. DEC-P68 prevalece sobre DEC-01; la nota «Modificada por DEC-P61 y DEC-P68» lo deja ver. |

### Comprobaciones pedidas (v1.2)

- RF-012 frente a RF-006: coherentes. RF-006: «La opción de pedir un código nuevo no se ofrece cuando se alcanzó el tope de RF-012.» Pero E2, AC-009 y AC-011, que bajan RF-006 a flujo y a AC, no recibieron la condición (H-003).
- RF-012 frente a BR-003, CL-001 y AC-003: por debajo del tope, coherentes, y AC-016 lo comprueba. Con el tope alcanzado hay un vacío: BR-003 y CL-001 anulan el código vigente cuando se «solicita» uno nuevo, y RF-012 no envía otro. La persona se quedaría sin código válido, cosa que ninguna decisión dice (H-002, PREG-079).
- DEC-01: la frase «No se impone un límite global adicional» queda junto a «Modificada por DEC-P61 y DEC-P68: existe un tope configurable». No se contradicen al pie de la letra (el tope es por celular, no global), pero conviene que la próxima versión lo diga así.
- Hueco de AC-014: aceptable. Los id de AC no tienen que ser seguidos, y el lint no lo marca. `apps/api/src/modulos/identidad/servicios/revocacion.service.ts` cita «AC-014» en su cabecera, y ese AC no existe en v1.1. Si el AC del tope tomara ese número, el código v0 parecería trazado a un AC que no implementa. El hueco evita esa trazabilidad falsa. Condiciones: registrar en la SPEC que AC-014 no se usa (H-008), y que quien rehaga el código (INC-20261031-001) quite la cita a «AC-014».
- ARQ-005/ADR-006 dice «SPEC-001 no sufre modificaciones» y «Preserva intacta la regla de negocio SPEC-001/BR-003». Tras DEC-P68 la SPEC sí cambia. ARQ-005 está congelada; no es hallazgo de la SPEC, pero queda anotado para la próxima versión de la arquitectura. Con DEC-P78, BR-003 cambia también en su texto.
- Cambios de fondo fuera del historial: ninguno. El diff coincide con los cuatro puntos de la petición. El título «Análisis de impacto» se corrigió (punto 4). La cabecera cambia el modelo a «gemini-3.7-flash», sin efecto.
- «Verificación»: no se tocó, como pedía la orden. Por eso todas sus líneas siguen en «cumple» (H-007).
- AC-015 y AC-016 no llevan «Origen:», igual que AC-001 a AC-013. La traza está en la sección 16. No es hallazgo.
- Fin de línea: el borrador está en CRLF. `orquestador.py` calcula el hash sobre los bytes sin normalizar, y `.gitattributes` fija LF al confirmar. Antes de aprobar, conviene pasarlo a LF para que el hash fijado no cambie en el siguiente checkout. No es un hallazgo de la SPEC.

### Impacto en el módulo identidad (v1.2)

`pipeline.json` registra para `identidad`: `spec_hash` `6e3ea037860b` (v1.1), `revision` APTA, `oraculos` aprobados, `pruebas` e `implementacion` pendientes. Cuando una nueva versión esté en `aprobadas/` con su nuevo hash, `orquestador.py` (`reconciliar`) pasa a `pendiente` revisión, oráculos, pruebas, implementación y humo.

- Revisión: la línea «Veredicto:» de este informe es la que leerá el orquestador.
- Oráculos (`qa/casos/TC-001` a `TC-014`, todos `definitivo`): quedan invalidados en bloque y una persona debe volver a marcarlos.
  - Cambian de contenido: TC-006 (SPEC-001/AC-009) y TC-008 (SPEC-001/AC-011), cuya ruta alterna incluye «solicitar nuevo código», y TC-013 (SPEC-001/AC-003), que dependía de PREG-079 cuando se alcanza el tope. TC-012 (SPEC-001/AC-013) dependía de PREG-079 en lo de «reintentar el envío» con el tope alcanzado.
  - No cambian de contenido: TC-001 a TC-005, TC-007, TC-009 a TC-011 y TC-014. Sí deben volver a marcarse.
  - Faltan casos nuevos para SPEC-001/AC-015 y AC-016. El oráculo de AC-015 necesita el valor del tope y de la ventana, que el equipo no ha fijado (OBS-009 de `docs/mvp.md`): hasta entonces es `supuesto` o se parametriza.
- Pruebas (S3): ya estaban pendientes y nunca se ejecutaron (ruta de importación, PREG-003 a PREG-005). Faltan las de AC-015 y AC-016, y las de TC-006, TC-008 y TC-013 deben seguir los oráculos corregidos.
- Implementación: el código v0 no tiene ningún tope (no hay `tope` ni `ventana` en `apps/api/src/modulos/identidad/`) y ya estaba declarado como base no válida (INC-20261031-001). Su cabecera cita un «AC-014» que no existe.

## Revisión de v1.1 (conservada)

La v1.1 corrigió H-001 a H-005 del informe de v1.0 (veredicto NO_APTA). Incorporó el caso de éxito con código válido (SPEC-001/AC-004), el límite de los 10 minutos (CL-003, SPEC-001/AC-009), los 3 intentos (BR-005, CL-004), las excepciones de la EPS simulada y de la mensajería (RF-010, RF-011, E4, E5, SPEC-001/AC-012, SPEC-001/AC-013) y los estados y transiciones (7.2). Esa revisión dio `APTA`, con H-001 como único hallazgo.

## Conclusión

`NO_APTA`: hay un hallazgo bloqueante nuevo en v1.6. AC-003 quedó reescrito «según PREG-004», pero PREG-004 solo decidía la firma de una función de prueba (`esCodigoVigente(codigo, contexto?)`), no una condición de negocio; el texto nuevo («Dado un usuario con identidad ya verificada y un código de verificación activo…») exige dos condiciones que, según BR-003, CL-001, la sección 7.2 y el flujo principal de la misma SPEC v1.6, no pueden darse juntas. AC-003 es uno de los AC que `docs/mvp.md` cita para `REQ-001` (`Debe`), así que el hallazgo bloquea ese requisito, no solo un detalle de redacción.

Esta versión ya está «Aprobada y congelada» (congelación determinista, sin paso de S1 antes de congelar), pero eso no habilita a `identidad` a avanzar: por las reglas del proyecto, el veredicto de esta revisión S1 es el que decide si el módulo sigue, y con `NO_APTA` el módulo se detiene y vuelve a Especificaciones. Hace falta una versión nueva (v1.7) que corrija AC-003 — ya sea retomando la condición de v1.5 («un celular con al menos dos envíos disponibles antes del tope») u otra que no choque con el modelo de estados —, que una persona vuelva a aprobar, y que esta revisión se repita sobre esa versión antes de que S2 retome los oráculos TC-001 a TC-014 del módulo `identidad`. El resto de la SPEC (todo salvo AC-003 y, en menor medida, AC-005, que no tiene problema) no cambió de fondo frente a v1.5, cuyo veredicto era `APTA_CON_RESERVAS` con H-017 y H-018 como únicos hallazgos no bloqueantes; esos dos siguen abiertos y no bloquean, pero quedan a la espera de la misma corrección.

`aprobado_por` de este informe queda vacío: el veredicto y la decisión de pedir la v1.7 son de una persona.
