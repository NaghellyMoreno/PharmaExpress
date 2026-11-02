# Informe de revisión — SPEC-001

Fecha: 2026-11-02
Revisor: S1 (prueba estática)
Veredicto: APTA_CON_RESERVAS
Lint previo: `python qa/scripts/lint_spec.py` (PYTHONUTF8=1) sobre v1.5: sin hallazgos bloqueantes. Definiciones: RF 12, BR 5, RNF 2, CL 4, AC 19 (AC-001 a AC-013 y AC-015 a AC-020; AC-014 no se usa y está registrado en el historial). 1 aviso de tipo `limite`: «9 minutos» (línea 159, CL-003), el mismo de v1.1 a v1.4 (H-001). El lint no sustituye esta revisión.
SPEC revisada: agentes-ia/salidas/specification-agent/borradores/SPEC-001/SPEC-001_v1.5.md (versión 1.5, estado Candidata), frente a la aprobada `aprobadas/SPEC-001_v1.4.md`. Quinta revisión, corta: solo cubre el cambio frente a la v1.4 (DEC-P82 y los arreglos de H-012, H-013, H-014 y H-016). Lo demás se conserva de las revisiones de v1.4, v1.3, v1.2 y v1.1. Texto de DEC-P82 contrastado con `docs/decisiones.md` y con PREG-080.
MVP: Dentro del Debe (módulo `identidad`; DEC-P01). `docs/mvp.md` sigue en borrador y sin `aprobado_por`.

## Resumen (3 líneas)

La v1.5 aplica DEC-P82 sin extender su alcance (RF-012, AC-018, AC-020) y resuelve H-012, H-013, H-014, H-015 y H-016. AC-003, AC-017, AC-018, AC-019 y AC-020 ya no dan oráculos opuestos en el valor límite del tope. No hay cambios de fondo fuera del historial.
Entran 2 hallazgos nuevos. H-017 (media): DEC-P82 no contradice el conteo de AC-013 ni de E5, pero no decide si en el caso mixto se avisa la falla y se ofrece «reintentar el envío», que con AC-020 cae justo en el tope (PREG-081, no bloquea). H-018 (menor): falta el sentido inverso del caso mixto y qué es «llegó».
Total abiertos: 7 (0 bloqueantes, 0 altos, 1 medio, 6 menores); 11 resueltos. Se creó PREG-081. Nada impide formalmente aprobarla (ver «Conclusión»).

Etiquetas en la columna Problema: `[CONFIRMADO]` sale del texto citado o de un registro aprobado; `[INFERIDO]` es una conclusión de S1 que una persona debe confirmar.

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

H-013 queda resuelto: ningún par de AC da oráculos opuestos para el mismo punto de partida.

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

## Hallazgos

Total abiertos: 7 (0 bloqueantes, 0 altos, 1 medio, 6 menores): H-001, H-004, H-005, H-006, H-007, H-017 y H-018. Resueltos: H-002, H-003 y H-008 en v1.3; H-009, H-010 y H-011 en v1.4; H-012, H-013, H-014, H-015 y H-016 en v1.5. H-005 sigue resuelto en parte. H-001 viene de v1.1; H-002 a H-008, de v1.2; H-009 a H-012, de v1.3; H-013 a H-016, de v1.4; H-017 y H-018 son nuevos de v1.5. La columna «Severidad» de los resueltos es la que tenían al abrirse.

| id | Severidad | Tipo | Cita literal | Problema | Pregunta sugerida | Bloquea | Estado (v1.5) |
|----|-----------|------|--------------|----------|-------------------|---------|---------------|
| H-001 | menor | completitud | SPEC-001/CL-003: «un código correcto ingresado a los 9 minutos y 59 segundos es validado exitosamente; si se ingresa a los 10 minutos exactos (10m 00s) o después, el sistema lo rechaza por expiración y despliega la ruta alterna.» | `[CONFIRMADO]` Sigue en v1.3. El lint marca «9 minutos» sin un AC que lo diga con esas palabras; CL-003 y SPEC-001/AC-009 («10:09:59» / «10:10:00») cubren debajo, en el límite y por encima. Es un aviso mecánico de la herramienta, no del criterio. | — | no | Abierto (aviso mecánico). Sin cambios en v1.5. (v1.4: Abierto (aviso mecánico). Sin cambios en v1.4. (v1.3: Abierto (aviso mecánico))) |
| H-002 | media | consistencia | SPEC-001/BR-003: «Si el usuario solicita un nuevo código mientras otro sigue vigente, el código anterior queda anulado de inmediato y solo es válido el último emitido.» SPEC-001/CL-001: «el código previo queda invalidado de inmediato y solo el nuevo es aceptado.» SPEC-001/RF-012: «Al alcanzarlo, no envía más códigos». | `[CONFIRMADO]` Nuevo en v1.2. Con el tope alcanzado y un código vigente, BR-003, CL-001, E3 y SPEC-001/AC-003, leídos al pie de la letra, anulan el código al pedir otro, y RF-012 no envía ninguno: la persona queda sin código válido. AC-015 no dice qué pasa con el código vigente. DEC-P61 y DEC-P68 no tratan el caso. `[INFERIDO]` «Solo es válido el último emitido» sugiere que la anulación ocurre al emitir, así que el código vigente seguiría valiendo; pero no se da por hecho. | Ver `docs/preguntas/PREG-079.md`. | no | Resuelto en v1.3. (v1.4: Resuelto en v1.3. (v1.3: Resuelto en v1.3. DEC-P78 responde PREG-079, y BR-003, CL-001 y AC-017 dicen que el código vigente sigue valiendo. Lo que queda (AC-003, E3 paso 1, 7.2) pasa a H-009 y H-010.)) |
| H-003 | media | consistencia | SPEC-001/AC-011: «entonces inactiva el código actual y muestra de inmediato las opciones de la ruta alterna (nuevo código, orientación EPS, atención presencial).» SPEC-001, E2, paso 2: «El sistema muestra la ruta alterna: solicitar nuevo código, orientación para actualizar datos en la EPS o atención presencial.» SPEC-001/RF-006: «La opción de pedir un código nuevo no se ofrece cuando se alcanzó el tope de RF-012.» | `[CONFIRMADO]` Nuevo en v1.2. AC-011, AC-009 («muestra la ruta alterna»), E2, E3 («genera, emite y envía un nuevo código»), el paso 7 del flujo y la transición «Código Emitido (Nuevo)» de 7.2 no tienen la condición del tope. Si el tercer intento fallido ocurre con el tope alcanzado, AC-011 exige ofrecer «nuevo código» y RF-006 lo prohíbe. 7.2 no tiene estado ni transición de tope alcanzado. E5 y SPEC-001/AC-013 ofrecen «reintentar el envío» sin decir qué pasa con el tope (PREG-079). S2 puede diseñar AC-009 y AC-011 con la precondición «por debajo del tope». | Añadir «por debajo del tope» a AC-009 y AC-011, la condición a E2, E3 y paso 7, y el estado de tope alcanzado en 7.2. | no | Resuelto en v1.3. (v1.4: Resuelto en v1.3. (v1.3: Resuelto en v1.3 en lo que ofrece la opción: E2, AC-011 y E3 paso 2 llevan la condición, AC-009 no enumera opciones y AC-013 queda claro con DEC-P78. El paso 7 lo cubre AC-015. Lo que queda (E3 paso 1, 7.2, sección 3, modelo de dominio) pasa a H-010.)) |
| H-004 | menor | completitud | SPEC-001/RF-012: «El sistema debe limitar el envío de códigos con un tope configurable por celular y ventana de tiempo.» SPEC-001/AC-015: «Dado un celular que alcanzó el tope de envíos de su ventana de tiempo». | `[CONFIRMADO]` Nuevo en v1.2. Valores límite incompletos: AC-016 da el lado de debajo, y AC-015 y AC-017 el del límite. Ningún AC dice que los envíos vuelven cuando pasa la ventana, ni si la ventana es fija o móvil. El valor lo fija el equipo (DEC-P61) y sigue sin fijar (OBS-009). Severidad limitada porque el valor aún no existe. | ¿Se añade un AC de vuelta a enviar al terminar la ventana, y quién decide si es fija o móvil? | no | Abierto, sin cambios en v1.5. (v1.4: Abierto, sin cambios en v1.4. (v1.3: Abierto, sin cambios en v1.3.)) |
| H-005 | menor | ambigüedad | SPEC-001/AC-015: «cuando se solicita otro código para esa cédula». SPEC-001/RF-012: «un tope configurable por celular». | `[CONFIRMADO]` Nuevo en v1.2. «Esa cédula» no tiene antecedente: el «Dado» habla de un celular. `[INFERIDO]` Si dos pacientes sintéticos comparten el celular registrado (un cuidador, contexto 3.3), el tope es común a las dos cédulas, porque RF-012 cuenta por celular; ningún AC lo comprueba. | Escribir «para una cédula cuyo celular registrado es ese» y añadir el caso de dos cédulas con el mismo celular. | no | Resuelto en parte (v1.3). Sin cambios en v1.5. (v1.4: Resuelto en parte (v1.3). Sin cambios en v1.4: sigue sin AC el caso de dos cédulas con el mismo celular. (v1.3: Resuelto en parte. v1.3 dice «para una cédula cuyo celular registrado es ese». Sigue sin AC el caso de dos cédulas con el mismo celular.)) |
| H-006 | menor | consistencia | SPEC-001/RF-012: «El sistema debe limitar el envío de códigos». SPEC-002/RF-015: «iniciar de inmediato el flujo de revalidación solicitando únicamente un nuevo código de verificación (sin exigir reingresar la cédula).» | `[INFERIDO]` Nuevo en v1.2. DEC-P61 habla de «El envío de códigos», sin limitarlo a la verificación de SPEC-001. La reactivación de SPEC-002 también envía códigos al celular, así que el tope la alcanzaría, pero SPEC-002 no dice qué ruta alterna muestra al alcanzarlo. El dueño del arreglo es SPEC-002. | ¿El tope cuenta también los códigos de reactivación de SPEC-002/RF-015? | no | Abierto, sin cambios (corresponde a SPEC-002). (v1.4: Abierto, sin cambios (corresponde a SPEC-002). (v1.3: Abierto, sin cambios (corresponde a SPEC-002).)) |
| H-007 | menor | trazabilidad | SPEC-001, Verificación: «Consistencia interna: parcial. El tope de RF-012 se aplicó en BR-003, CL-001, E2, E3, AC-011 y AC-013; falta fijar el valor del tope y de la ventana (DEC-P61).» SPEC-001, Verificación: «Completitud: cumple.» | `[CONFIRMADO]` Nuevo en v1.2. En v1.2 todas las líneas decían «cumple». En v1.3 «Consistencia interna» pasa a «parcial», pero dice que el tope se aplicó en E3, y E3 paso 1 no lo aplica (H-010); tampoco menciona AC-003 (H-009). «Completitud» sigue en «cumple», aunque faltan la vuelta al terminar la ventana (H-004) y 7.2 (H-010). | Corregir «Consistencia interna» cuando se arreglen H-009 y H-010, y pasar «Completitud» a «parcial». | no | Abierto. «Verificación» no cambió en v1.5, como pedía la orden: «Consistencia interna» no nombra DEC-P82 ni AC-020, y «Completitud» sigue en «cumple». (v1.4: Abierto. En v1.4 «Consistencia interna» dice «AC-015 a AC-019» (AC-016 no cambió) y no nombra la sección 3, el modelo de dominio ni DEC-01. «Completitud» sigue en «cumple». (v1.3: Abierto, mejorado en parte.)) |
| H-008 | menor | trazabilidad | SPEC-001 §16: «HU-002: ... AC-012, AC-013, AC-015, AC-016.» SPEC-001 §17: «Versión 1.2: incorporación de DEC-P61 y DEC-P68 (tope configurable de envíos de código por celular y ventana de tiempo, adición de RF-012, AC-015, AC-016, modificación de DEC-01 y RF-006)». | `[CONFIRMADO]` Nuevo en v1.2. El salto de AC-013 a AC-015 es intencional y aceptable, pero la SPEC no lo explica. Una versión futura podría usar AC-014 y dar por trazado el código v0, que ya cita ese número. | Anotar en el historial que AC-014 no se usa, por la cita del código v0. | no | Resuelto en v1.3. (v1.4: Resuelto en v1.3. (v1.3: Resuelto en v1.3. El historial dice: «No se usa el identificador AC-014: el código v0 del módulo identidad ya cita un AC-014 inexistente.»)) |
| H-009 | alta | consistencia | SPEC-001/AC-003: «Dado que el usuario solicita un código de verificación y posteriormente pide otro antes de que venza el primero, cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.» SPEC-001/AC-017: «Dado un celular que alcanzó el tope y un código todavía vigente, cuando se solicita otro código, entonces el sistema no envía ninguno, muestra la ruta alterna sin la opción de pedir un código nuevo, y el código vigente sigue siendo aceptado.» | `[CONFIRMADO]` Nuevo en v1.3. AC-003 no tiene la condición «por debajo del tope». Con el tope alcanzado, los dos AC dan oráculos opuestos para el mismo caso: AC-003 rechaza el código anterior y AC-017 lo acepta. DEC-P78 nombra AC-003 entre los elementos afectados, pero la orden de la v1.3 no lo incluyó, y «Análisis de impacto» dice «Todos actualizados» sin listarlo. Prevalece AC-017, por la DEC-P78, más reciente; por eso no se marca como bloqueante. S2 puede diseñar AC-003 con la precondición «por debajo del tope». Un caso escrito con AC-003 al pie de la letra fallaría contra una implementación correcta. | Añadir a AC-003 «Dado un celular por debajo del tope, ...» o una frase equivalente, en la misma versión que H-010. | no | Resuelto en v1.4. (v1.4: **Resuelto en v1.4** en el caso general (AC-003 empieza «Dado un celular por debajo del tope de RF-012»). El borde de un envío del tope pasa a H-013. (v1.3: Abierto)) |
| H-010 | media | consistencia | SPEC-001, E3, paso 1: «El sistema anula de inmediato el código previo.» SPEC-001, 7.2: «Transición a "Código Emitido (Nuevo)": provocada por Usuario al solicitar nuevo código (anula el anterior).» Modelo de dominio: «anulable al solicitar uno nuevo». Sección 3: «Gestión de rutas alternas ante fallos de verificación (nuevo código, orientación EPS, atención presencial).» SPEC-001/DEC-01: «si se pide un nuevo código mientras otro sigue vigente, el anterior queda anulado y solo vale el último». | `[CONFIRMADO]` Nuevo en v1.3; es lo que queda de H-002 y H-003. En E3 la condición del tope está en el paso 2, pero el paso 1, que va antes, anula el código sin condición. Leído en orden, el flujo anula el código vigente y luego no emite otro, que es lo que DEC-P78 prohíbe. 7.2 sigue sin estado ni transición para el tope alcanzado y anula siempre. La sección 3 y el modelo de dominio repiten la regla sin condición. La nota de DEC-01 no cita DEC-P78. BR-003, CL-001 y AC-017 son claros, y por eso la severidad es media y no alta. | En E3, poner la condición antes del paso 1 (o «salvo con el tope de RF-012 alcanzado» en el paso 1). En 7.2, añadir la transición «Código Emitido» → «Código Emitido» (tope alcanzado: no anula, muestra ruta alterna). Añadir la condición en la sección 3, el modelo de dominio y la nota de DEC-01. | no | Resuelto en v1.4. (v1.4: **Resuelto en v1.4.** E3 paso 1, 7.2, la sección 3, el modelo de dominio y la nota de DEC-01 llevan la condición. La primera emisión en 7.2 pasa a H-016. (v1.3: Abierto)) |
| H-011 | menor | verificabilidad | SPEC-001/RF-012: «Un envío fallido no cuenta para el tope, y un código enviado por SMS y por correo cuenta como un solo envío (DEC-P78).» SPEC-001/AC-013: «... ofrece las opciones de reintentar el envío o acudir a atención presencial. Un envío fallido no cuenta para el tope de RF-012 (DEC-P78).» | `[CONFIRMADO]` Nuevo en v1.3. Las dos reglas de conteo de DEC-P78 cambian dónde está el límite del tope, pero ningún AC las comprueba con un caso de pasa/no pasa. La frase de AC-013 va fuera del Dado/Cuando/Entonces y no da el caso de límite: con un celular en tope − 1, un envío fallido seguido de otra petición debe enviar. Ningún AC dice que un código enviado por SMS y por correo deje el contador en tope − 1 y no en tope − 2. E5 no recibió la regla. `[INFERIDO]` Por debajo del tope, si se pide un código nuevo y el envío falla, E3 paso 1 y BR-003 ya anularon el anterior. La persona queda sin código hasta que reintente (AC-013). La SPEC lo dice así; se anota por si el equipo no lo quiere. | Añadir AC parametrizados con el tope: «Dado un celular en tope − 1 y un envío fallido, cuando se pide otro código, entonces se envía» y «Dado un celular en tope − 2 con SMS y correo registrados, cuando se envía un código, entonces el celular queda en tope − 1». | no | Resuelto en v1.4. (v1.4: **Resuelto en v1.4** con AC-018 y AC-019. Las reservas de verificabilidad pasan a H-014 y el envío por un solo canal a H-015. (v1.3: Abierto)) |
| H-012 | menor | trazabilidad | SPEC-001, Análisis de impacto: «DEC-P78: afecta BR-003, CL-001, RF-012, E2, E3, AC-011, AC-013, AC-015, AC-017. Todos actualizados.» SPEC-001 §16: «CL-001: Origen: contexto 3.2 y DEC-01; verificado por AC-003.» SPEC-001 §16: «RF-006: Origen: contexto 3.2; verificado por AC-009, AC-011, AC-012, AC-013, AC-015.» | `[CONFIRMADO]` Nuevo en v1.3. La línea de impacto omite AC-003, RF-006, E5 y AC-009, que DEC-P78 nombra, y aun así dice «Todos actualizados» (AC-003 no lo está, H-009). Incluye AC-015, que cambió por H-005 y no por DEC-P78. En §16, CL-001 ahora tiene la cláusula del tope, pero solo la verifica AC-003, que dice lo contrario; falta AC-017. RF-006 no lista AC-017, aunque este verifica que no se ofrece «pedir un código nuevo». El origen de CL-001 y de BR-003 no cita DEC-P78. | Corregir la línea de impacto y añadir AC-017 a CL-001 y a RF-006 en §16. | no | **Resuelto en v1.5.** RF-012, BR-003 y CL-001 citan DEC-P78 en su línea y en §16; RF-012 también DEC-P82. (v1.4: **Resuelto en parte (v1.4).** Línea de impacto añadida, y AC-017 está en CL-001 y RF-006 en §16. Siguen sin citar DEC-P78 los orígenes de RF-012, BR-003 y CL-001, y la línea de impacto no menciona RF-006, E5 ni AC-009. (v1.3: Abierto)) |
| H-013 | media | consistencia | SPEC-001/AC-003: «Dado un celular por debajo del tope de RF-012, y que el usuario solicita un código de verificación y posteriormente pide otro antes de que venza el primero, cuando intenta usar el código anterior, entonces el sistema lo rechaza por estar anulado.» SPEC-001/AC-017: «Dado un celular que alcanzó el tope y un código todavía vigente, cuando se solicita otro código, entonces el sistema no envía ninguno, muestra la ruta alterna sin la opción de pedir un código nuevo, y el código vigente sigue siendo aceptado.» SPEC-001/AC-016: «Dado un celular por debajo del tope, cuando se solicita un código nuevo mientras otro sigue vigente». | `[CONFIRMADO]` Nuevo en v1.4; es lo que queda de H-009. En AC-003 la condición se toma antes de la primera petición, y esa petición gasta un envío. Con el celular a un envío del tope (tope − 1), la primera petición lo deja en el tope y la segunda cae en AC-017: AC-003 rechaza el código anterior y AC-017 lo acepta. Es justo el valor límite del tope, el que un caso de borde va a probar. AC-016, E3 paso 1 y 7.2 evalúan la condición en el momento de pedir otro, así que la intención está clara y prevalece AC-017 (DEC-P78); por eso es media y no alta. | Reescribir el «Dado» de AC-003 para que la condición valga en la segunda petición: «Dado un celular que sigue por debajo del tope de RF-012 cuando el usuario pide el segundo código, ...» o «Dado un celular con al menos dos envíos disponibles antes del tope, ...». | no | **Resuelto en v1.5.** AC-003: «Dado un celular con al menos dos envíos disponibles antes del tope de RF-012». (v1.4: Abierto) |
| H-014 | menor | verificabilidad | SPEC-001/AC-018: «entonces ese envío no cuenta para el tope y el usuario puede pedir otro código.» SPEC-001/AC-019: «Dado un paciente con celular y correo registrados, cuando el sistema envía un código por SMS y por correo, entonces cuenta un solo envío para el tope de RF-012.» | `[CONFIRMADO]` Nuevo en v1.4. «No cuenta para el tope» y «cuenta un solo envío» son estados internos. En AC-018, «puede pedir otro código» no dice qué se observa: a un envío del tope ya podía pedirlo antes del fallo; lo comprobable es que la siguiente petición sí envía un código. AC-019 no da el punto de partida del contador ni un resultado observable: no se distingue «cuenta uno» de «cuenta dos» salvo que se lea el contador interno o se parta de un valor cercano al tope. `[INFERIDO]` S2 puede diseñarlos leyendo el registro de envíos o con estos observables; no impide diseñar casos. | AC-018: «..., entonces la siguiente petición envía un código». AC-019: «Dado un celular a dos envíos del tope, con celular y correo registrados, cuando se envía un código por SMS y por correo, entonces la siguiente petición todavía envía un código.» | no | **Resuelto en v1.5.** AC-018 y AC-019 terminan en «la siguiente petición de código (todavía) se envía». (v1.4: Abierto) |
| H-015 | media | completitud | SPEC-001/RF-012: «Un envío fallido no cuenta para el tope, y un código enviado por SMS y por correo cuenta como un solo envío (DEC-P78).» SPEC-001/AC-018: «cuando un envío del código falla en el servicio externo». SPEC-001/AC-013: «Dado un fallo en el servicio externo de SMS o correo al enviar el código». | `[CONFIRMADO]` Nuevo en v1.4. DEC-P78 decide los dos extremos (falla todo: no cuenta; llega todo: cuenta uno), pero no el caso mixto: con celular y correo registrados, falla el SMS y llega el correo, o al revés. El tope se cuenta «por celular», y si falla el SMS el celular no recibió nada. Tampoco se dice si en el caso mixto se aplica AC-013 (avisar la falla y ofrecer reintentar). Cambia el oráculo de AC-018 y AC-019 justo en el límite del tope. No se infiere ninguna respuesta. | Ver `docs/preguntas/PREG-080.md`. | no | **Resuelto por DEC-P82 en v1.5** (RF-012, AC-018, AC-020). La parte de AC-013 pasa a H-017. (v1.4: Abierto) |
| H-016 | menor | completitud | SPEC-001, 7.2: «Transición a "Código Emitido": provocada por Sistema al validar cédula en EPS simulada y enviar código por SMS/correo.» SPEC-001, flujo principal, paso 7: «El sistema genera y envía el código de un solo uso por SMS y correo (si existe).» SPEC-001/AC-015: «entonces el sistema no envía ningún código y presenta la ruta alterna». | `[CONFIRMADO]` Nuevo en v1.4 (antes estaba dentro de H-003, que daba el paso 7 por cubierto con AC-015). En la primera emisión, con el celular ya en el tope, no se envía código (RF-012, AC-015), pero 7.2 no tiene transición de «Pendiente de Verificación» a la ruta alterna por tope, y el paso 7 no lleva la condición. El oráculo está en AC-015; por eso es menor. | Añadir en 7.2 la transición «Pendiente de Verificación» → ruta alterna (tope de RF-012 alcanzado: no envía código) y la condición en el paso 7. | no | **Resuelto en v1.5.** 7.2 y paso 7 llevan la condición del tope y remiten a AC-015. (v1.4: Abierto) |
| H-017 | media | consistencia | SPEC-001/RF-011: «Ante fallo en los servicios externos de envío de SMS o correo, el sistema debe notificar la falla en la entrega del mensaje y permitir reintentar el envío o dirigirse a la atención presencial.» SPEC-001/AC-013: «Dado un fallo en el servicio externo de SMS o correo al enviar el código, cuando el sistema detecta la falla de entrega, entonces informa la novedad al usuario y ofrece las opciones de reintentar el envío o acudir a atención presencial.» SPEC-001/AC-020: «cuando el SMS falla y el correo llega, entonces ese envío cuenta para el tope y la siguiente petición muestra la ruta alterna sin la opción de pedir un código nuevo.» | `[CONFIRMADO]` Nuevo en v1.5. DEC-P82 decide el conteo del caso mixto, pero no si en él se aplican RF-011, E5 y AC-013. PREG-080 lo preguntaba («Tampoco se dice si en el caso mixto se aplica AC-013») y la respuesta no lo trata. Al pie de la letra, un SMS que falla es «un fallo en el servicio externo de SMS», y AC-013 exige avisar y ofrecer «reintentar el envío». En el punto de partida de AC-020 (a un envío del tope), ese envío ya alcanzó el tope. Si el reintento manda el código, choca con RF-012 («Al alcanzarlo, no envía más códigos») y con AC-020. Si no lo manda, AC-013 ofrece una opción que no funciona. Tampoco se dice si un reintento cuenta para el tope. En el conteo, DEC-P82 no contradice AC-013 ni E5: «Un envío fallido no cuenta» sigue valiendo, ahora con «solo es fallido si fallan todos los canales». `[INFERIDO]` Una lectura posible es que AC-013 solo aplica cuando fallan todos; no se da por hecha. | Ver `docs/preguntas/PREG-081.md`. | no | Abierto |
| H-018 | menor | completitud | SPEC-001/AC-020: «cuando el SMS falla y el correo llega». SPEC-001/RF-012: «Un envío cuenta para el tope si el código llegó por al menos un canal». SPEC-001/AC-013: «cuando el sistema detecta la falla de entrega». | `[CONFIRMADO]` Nuevo en v1.5. Solo un sentido del caso mixto tiene AC. El otro (llega el SMS y falla el correo) no lo tiene, aunque DEC-P82 lo decide igual. «Llegó» no se define frente a lo que el sistema observa: AC-013 habla de detectar la falla, pero no se dice si cuenta la aceptación del proveedor o una confirmación de entrega, ni qué pasa si la falla se informa después de contar el envío. `[INFERIDO]` Con servicios simulados, «llegó» equivale a «sin falla detectada», y S2 puede usarlo como `supuesto`. | Añadir el sentido inverso a AC-020 y decir que «llegó» es «sin falla detectada por el sistema». | no | Abierto |

## Valores límite revisados

| Valor | Debajo | En el límite | Por encima | Estado |
|---|---|---|---|---|
| 10 minutos (vigencia del código) | 9:59:59: el código correcto se valida (CL-003; SPEC-001/AC-009) | 10:00:00: se rechaza, se inactiva y se despliega la ruta alterna (CL-003; SPEC-001/AC-009) | 10:10:00 o después: se rechaza por expirado (SPEC-001/AC-009) | Cumple. La ruta alterna queda condicionada por RF-006 y RF-012. |
| 3 intentos (ingreso del código) | Intento 1 o 2 fallido: reintento con intentos restantes (BR-005; SPEC-001/AC-010) | 3.er intento fallido: código inactivo y ruta alterna con la condición del tope (BR-005; CL-004; SPEC-001/AC-011) | Intento sobre código inactivo: rechazado (CL-004) | Cumple. |
| Tope de envíos por celular (DEC-P61, DEC-P68, DEC-P78, DEC-P82) | Por debajo: SPEC-001/AC-016, AC-003 (al menos dos disponibles) y AC-019 (a dos del tope). A un envío del tope con todos los canales fallidos: AC-018 | A un envío del tope con caso mixto: AC-020 lo lleva al tope. Tope alcanzado: SPEC-001/AC-015 y AC-017 (el código vigente sigue valiendo) | Al terminar la ventana: sin AC | Parcial. Ya no hay oráculos opuestos (H-013 resuelto). Valor y ventana sin fijar (OBS-019). Faltan el sentido inverso del mixto (H-018), el aviso del mixto (H-017, PREG-081), H-004 y H-005. |

Los valores 30 unidades, 48 horas y 90 días son de otros módulos y no aparecen en SPEC-001.

## Preguntas creadas

- `docs/preguntas/PREG-081.md` — Si un canal falla y el otro entrega el código, ¿se avisa la falla y se ofrece reintentar el envío? ¿Ese reintento cuenta para el tope? — bloquea: no (revisión de v1.5, H-017).
- `docs/preguntas/PREG-080.md` — Si el código llega por un solo canal (falla el SMS y llega el correo, o al revés), ¿cuenta como envío para el tope? — bloquea: no (revisión de v1.4, H-015). Respondida por DEC-P82 en el conteo y aplicada en v1.5; la parte de AC-013 no se respondió y pasa a PREG-081.
- `docs/preguntas/PREG-079.md` — Al alcanzar el tope de envíos, ¿sigue valiendo el código vigente y qué cuenta como un envío? — bloquea: no (revisión de v1.2, H-002 y H-003). Respondida por DEC-P78 y aplicada en v1.3 y v1.4.

H-018 es de edición y no necesita pregunta: DEC-P82 ya decide el sentido inverso. H-013, H-014 y H-016 (resueltos en v1.5) eran de edición y no necesitaban pregunta: DEC-P78 ya decide su contenido. H-004 sigue pendiente en OBS-009, y H-006 es de SPEC-002. La revisión de v1.1 no creó preguntas: la ambigüedad del vencimiento del código la respondió DEC-01 (OPEN-Q-001), registrada en `docs/preguntas/PREG-001.md`.

## Confirmado e inferido

- CONFIRMADO: los estados salen de comparar la v1.4 aprobada y la v1.5, la v1.3 y la v1.4, y de `docs/decisiones.md` (DEC-P61, DEC-P68, DEC-P78, DEC-P82) y PREG-080. Lo anterior sale además de la v1.2, la v1.1 aprobada, SPEC-002 v1.11, ARQ-005/ADR-006, `pipeline.json`, `qa/casos/` y el código del módulo `identidad`.
- INFERIDO: el tope común a dos cédulas (H-005), su alcance a la reactivación de SPEC-002 (H-006), la anulación por debajo del tope cuando el envío falla (anotada en «Revisión de v1.4») y la forma de diseñar AC-018 y AC-019 (H-014). En H-017 no se infiere la respuesta; la lectura posible queda marcada como `[INFERIDO]`. El significado de «llegó» (H-018) es inferido.
- La sección «Verificación» de la SPEC no se usó como evidencia.

## Criterios

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

`APTA_CON_RESERVAS`: no hay hallazgos bloqueantes ni altos en v1.5. DEC-P82 queda bien aplicada en RF-012, AC-018 y AC-020, sin extender su alcance. Se resuelven H-012, H-013, H-014, H-015 y H-016. AC-003, AC-017, AC-018, AC-019 y AC-020 ya no dan oráculos opuestos en el valor límite del tope. S2 puede diseñar todos los casos del tope; el aviso del caso mixto (AC-013) queda como `supuesto` hasta PREG-081.

Nada impide formalmente aprobarla. H-017 es media y no da oráculos opuestos para AC-020, que es lo que S2 necesita en el límite; solo deja sin decidir qué ve la persona en el caso mixto. Como cada aprobación de SPEC-001 invalida en bloque los oráculos y las pruebas del módulo `identidad`, conviene que una persona decida si espera la respuesta de PREG-081 para incluirla en esta misma versión, junto con H-018, que es una frase. Antes de mover el archivo a `aprobadas/` hay que pasarlo a LF. `aprobado_por` queda vacío: la decisión es de una persona.
