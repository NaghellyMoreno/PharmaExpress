<!--
Agente: Generador de historias de usuario (INVEST)
Modelo: openai/gpt-oss-120b
Fecha: 2026-09-23 17:06
Petición: Genera 5 historias para la épica de atención asistida a adultos mayores sin celular
-->

## Supuestos
- Los adultos mayores no poseen smartphone ni acceso a WhatsApp.  
- Un cuidador o familiar dispone de un teléfono fijo o móvil para comunicarse con el canal asistido.  
- El prototipo simula los servicios externos (EPS, ADRES, inventario, Disfarma) mediante archivos JSON con datos ficticios.  
- El horario de atención del canal asistido es de 08:00 a 17:00 h (parámetro configurable).  
- Los documentos de identidad y números de fórmula son ficticios y se validan contra el mock.  

## Historias de usuario

### HU-01 — Registro de adulto mayor en pre‑dispensación
**Yo, como** adulto mayor que acude acompañado de su cuidador,  
**quiero** que el cuidador registre mis datos en el sistema de pre‑dispensación,  
**para** iniciar el proceso y evitar llegar al punto sin haber sido identificado.

**Está hecho cuando:**
- **Dado** que el cuidador está en el punto de atención y entrega número de documento y nombre del adulto mayor, **cuando** solicita el registro, **entonces** el sistema crea un perfil y muestra el mensaje “Registro exitoso”.
- **Dado** que el número de documento no existe en el mock de usuarios, **cuando** se intenta registrar, **entonces** el sistema muestra “Documento no encontrado, acudir a la EPS”.
- **Dado** que el adulto mayor ya tiene un perfil activo, **cuando** se intenta registrar de nuevo, **entonces** el sistema muestra “Usuario ya registrado”.

**Cómo se simula en el prototipo:** archivo JSON `usuarios_ficticios.json` con documentos, nombres y estado de afiliación.

**Evaluación INVEST:**
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Comentario INVEST:** Independiente porque no depende de ninguna otra historia; negociable al no definir la pantalla exacta; valor claro (evita desplazamiento inútil); estimable y pequeña (3 criterios); testeable con datos de mock.

---

### HU-02 — Validar fórmula y cobertura vía llamada al operador
**Yo, como** cuidador de un adulto mayor,  
**quiero** llamar al operador del canal asistido y proporcionar número de identificación y número de fórmula,  
**para** saber si la fórmula está vigente y cubierta antes de acudir al punto.

**Está hecho cuando:**
- **Dado** que la fórmula está vigente y la EPS indica cobertura, **cuando** el operador consulta el mock, **entonces** informa “Fórmula vigente y cubierta”.
- **Dado** que la fórmula está vencida, **cuando** el operador la consulta, **entonces** informa “Fórmula vencida, necesita renovación”.
- **Dado** que la EPS muestra al adulto mayor como “suspendido”, **cuando** el operador verifica, **entón** informa “Usuario no activo, regularizar afiliación”.

**Cómo se simula en el prototipo:** dos archivos JSON (`formulas_ficticias.json` y `eps_estados.json`) que relacionan número de fórmula con vigencia y cobertura.

**Evaluación INVEST:**
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Comentario INVEST:** Independiente (no requiere registro previo, usa datos simulados); negociable (no prescribe el guion exacto de la llamada); valorado (evita desplazamiento innecesario); estimable y pequeña (3 criterios); testeable mediante simulación de respuestas.

---

### HU-03 — Reservar medicamento con ayuda del asistente en el punto
**Yo, como** asistente de dispensación en el punto de Disfarma,  
**quiero** reservar el medicamento para el adulto mayor una vez validadas fórmula y cobertura,  
**para** garantizar que el producto esté disponible cuando el adulto mayor llegue.

**Está hecho cuando:**
- **Dado** que el adulto mayor está registrado y la validación previa es positiva, **cuando** el asistente reserva el medicamento, **entonces** el sistema marca la reserva y genera un número de turno.
- **Dado** que el medicamento solicitado no aparece en el mock de inventario, **cuando** se intenta reservar, **entonces** el sistema muestra “Producto no disponible, ofrecer alternativa”.
- **Dado** que la cantidad solicitada supera el límite configurado (`[por definir con el equipo]`), **cuando** se confirma la reserva, **entonces** el sistema muestra “Cantidad excede límite permitido”.

**Cómo se simula en el prototipo:** archivo JSON `inventario_ficticio.json` con códigos de producto, disponibilidad y límite por reserva.

**Evaluación INVEST:**
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Comentario INVEST:** Independiente (no depende de la historia de registro, usa datos simulados); negociable (no fija la forma de generar el número de turno); valor (asegura disponibilidad); estimable y pequeña (3 criterios); testeable con datos de mock.

---

### HU-04 — Envío de confirmación de reserva al cuidador vía SMS o llamada
**Yo, como** cuidador del adulto mayor,  
**quiero** recibir la confirmación de la reserva por SMS o, si el número es inválido, mediante una llamada automática,  
**para** poder presentar el comprobante al llegar al punto.

**Está hecho cuando:**
- **Dado** que la reserva se completó y el número de contacto del cuidador es válido, **cuando** el sistema envía el SMS, **entonces** el mensaje contiene número de reserva, fecha y hora de atención.
- **Dado** que el número de contacto es inválido o no acepta SMS, **cuando** el sistema detecta el error, **entón** genera una llamada automática que reproduce la misma información.
- **Dado** que la reserva falla, **cuando** el sistema intenta enviar la confirmación, **entón** muestra “No se pudo enviar confirmación, intente nuevamente”.

**Cómo se simula en el prototipo:** script que lee `reservas_ficticias.json` y, según formato de número, muestra en consola “SMS enviado” o “Llamada simulada”.

**Evaluación INVEST:**
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Comentario INVEST:** Independiente (no necesita otras historias para ejecutarse); negociable (no especifica proveedor de SMS); valor (garantiza que el cuidador tenga el comprobante); estimable y pequeña (3 criterios); testeable mediante salida de consola.

---

### HU-05 — Presentar comprobante impreso y validar en ventanilla
**Yo, como** adulto mayor que llega al punto de dispensación con el comprobante impreso,  
**quiero** que el personal de ventanilla valide el comprobante contra el sistema,  
**para** que me entreguen el medicamento sin necesidad de esperar una nueva validación.

**Está hecho cuando:**
- **Dado** que el adulto mayor presenta el comprobante con número de reserva válido, **cuando** el personal lo ingresa en el mock, **entonces** el sistema muestra “Reserva válida, proceder a entrega”.
- **Dado** que el número de reserva no existe o está alterado, **cuando** el personal lo verifica, **entón** muestra “Reserva no encontrada, solicitar nuevo proceso”.
- **Dado** que la reserva está asociada a un medicamento fuera de stock (según mock), **cuando** se valida, **entón** muestra “Producto no disponible, ofrecer alternativa”.

**Cómo se simula en el prototipo:** pantalla de búsqueda que consulta `reservas_ficticias.json` y `inventario_ficticio.json`.

**Evaluación INVEST:**
| I | N | V | E | S | T |
|---|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Comentario INVEST:** Independiente (solo necesita datos de reserva); negociable (no define el formato exacto del comprobante impreso); valor (reduce tiempo de atención); estimable y pequeña (3 criterios); testeable con datos de mock.

---

## Resumen
| Historia | Rol | I | N | V | E | S | T | Puntaje |
|---|---|---|---|---|---|---|---|---|
| HU-01 | Adulto mayor / Cuidador | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| HU-02 | Cuidador | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| HU-03 | Asistente de punto | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| HU-04 | Cuidador | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |
| HU-05 | Adulto mayor | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 |

**Observaciones para el equipo:**
- Priorizar HU-01 y HU-02 para validar rápidamente la viabilidad del canal asistido antes de implementar reservas.  
- Definir como parámetro configurable el límite de unidades por reserva y el tiempo máximo de respuesta del mock de EPS (`[por definir con el equipo]`).  
- Verificar que los cuidadores tengan al menos un número de contacto válido; en caso contrario, planificar un proceso de captura de número durante HU-01.
