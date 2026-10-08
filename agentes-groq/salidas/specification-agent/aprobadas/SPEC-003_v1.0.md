<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-07 19:24
Petición:   El sistema debe conservar un registro que indique si la aceptación del tratamiento de datos la hizo el titular o un tercero (cuidador o facilitador), con la fecha y el canal utilizado.
-->

# SPEC-003. Registro de aceptación del tratamiento de datos - Versión 1.0

Estado: Aprobada y congelada
Modo: Iteración
Necesidad original: "El sistema debe conservar un registro que indique si la aceptación del tratamiento de datos la hizo el titular o un tercero (cuidador o facilitador), con la fecha y el canal utilizado."
Épica: EPIC-001

## Análisis
- Objetivo: conservar de forma auditable la trazabilidad de la aceptación del tratamiento de datos, indicando si provino del titular o de un tercero, junto con la fecha y el canal.
- Alcance inicial: registro de la aceptación del tratamiento de datos en los canales disponibles (web y Telegram), diferenciando el rol (titular o tercero), la fecha exacta y el canal.
- Actores: paciente, tercero (cuidador, tutor o facilitador).
- Contexto aplicable: 3.1, 3.2, 3.3, 3.11.

## Modelo de dominio
- Registro de aceptación: pertenece a un paciente y a un canal; indica si fue aceptado por el titular o un tercero, la fecha, el canal utilizado y el estado de vigencia o revocación. Origen: contexto 3.2 y DEC-002, DEC-003.
- Canal: aplicación web o bot de Telegram. Origen: contexto 3.1.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
- DEC-001: afecta a HU-003, RF-010, RNF-003, BR-005, CL-004, AC-007. Todos actualizados con la información de la épica EPIC-001.
- DEC-002: afecta a RF-010, BR-005 y AC-007 estableciendo que el almacenamiento es interno en el sistema. Todos actualizados.
- DEC-003: afecta a RF-011, BR-006, CL-004 y AC-008 estableciendo que al revocar el consentimiento, el registro se marca como revocado. Todos actualizados.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Conservar un registro interno y auditable de la aceptación del tratamiento de datos personales y de salud, diferenciando si fue otorgada por el titular o un tercero, e incluyendo la fecha exacta y el canal de recepción.

### 2. Contexto
Antes de pedir cualquier dato, el sistema muestra el aviso de privacidad y pide aceptar el tratamiento de datos con la declaración explícita de si se actúa como titular o como tercero. Este registro debe persistir internamente en el sistema y actualizar su estado si el consentimiento es revocado posteriormente.
Decisiones del equipo:
- DEC-001. La necesidad pertenece a la épica EPIC-001. Responde a OPEN-Q-001.
- DEC-002. El registro de aceptación y su fecha se almacenan en el sistema interno sin requerir una interfaz especial de auditoría. Responde a OPEN-Q-002.
- DEC-003. Si el paciente o un tercero revoca el consentimiento, el registro histórico de aceptación se marca como revocado. Responde a OPEN-Q-003.

### 3. Alcance
- Registro de quién aceptó el tratamiento de datos (titular o tercero).
- Registro de la fecha y hora de la aceptación.
- Registro del canal utilizado (aplicación web o Telegram).
- Actualización del estado del registro a revocado en caso de que se solicite la revocación del consentimiento.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente (cuidador, tutor o facilitador).
- HU-003. Como administrador o sistema, quiero conservar un registro de la aceptación del tratamiento de datos indicando si fue el titular o un tercero, la fecha y el canal, para garantizar la trazabilidad legal y de cumplimiento normativo. Origen: necesidad y contexto 3.2.

### 5. Requisitos funcionales
- RF-010. El sistema debe registrar y almacenar internamente la aceptación del tratamiento de datos, capturando si fue realizada por el titular o un tercero, la fecha exacta y el canal utilizado (web o Telegram). Origen: necesidad y DEC-002.
- RF-011. Si el titular o el tercero revoca el consentimiento, el sistema debe actualizar el registro de aceptación correspondiente marcándolo como revocado. Origen: contexto 3.2 y DEC-003.

### 6. Requisitos no funcionales
- RNF-003. Integridad y disponibilidad del registro: el sistema debe garantizar que los datos del registro de aceptación permanezcan inalterables salvo por la acción de revocación explícita. Se verifica con: revisión de logs de transacciones internas y pruebas de persistencia. Origen: necesidad y contexto 3.2.

### 7. Reglas de negocio
- BR-005. La aceptación del tratamiento de datos es obligatoria antes de registrar cualquier dato o cargar documentos, y debe quedar asociada de manera inequívoca al registro del paciente, especificando el actor (titular o tercero), la fecha y el canal. Origen: contexto 3.2.
- BR-006. Cuando se revoque el consentimiento, el registro de aceptación no se elimina físicamente, sino que se actualiza a estado revocado, y se eliminan las reservas activas asociadas. Origen: contexto 3.2 y DEC-003.

### 8. Flujo principal
1. El usuario accede al canal web o Telegram y visualiza el aviso de privacidad.
2. El usuario acepta el tratamiento de datos seleccionando si es el titular o actúa como tercero.
3. El sistema captura la fecha, la hora, el canal y el rol del aceptante (titular o tercero).
4. El sistema almacena el registro internamente asociado al paciente y permite continuar con el proceso.

### 9. Flujos alternativos y de excepción
- E1. Revocación del consentimiento: el titular o tercero solicita revocar el consentimiento previamente otorgado. El sistema localiza el registro de aceptación asociado, cambia su estado a revocado, elimina las reservas activas y procede con la eliminación de los datos según las políticas de privacidad.

### 10. Casos límite
- CL-004. Revocación de un consentimiento ya marcado como revocado: si se intenta revocar un consentimiento que ya se encuentra en estado revocado, el sistema mantiene el estado actual sin generar errores adicionales. Origen: DEC-003.

### 11. Criterios de aceptación
- AC-007. Dado que un usuario acepta el tratamiento de datos en la aplicación web indicando que actúa como tercero, cuando se completa la acción, entonces el sistema almacena un registro interno que especifica que fue un tercero, la fecha actual y el canal web. Origen: necesidad y DEC-002.
- AC-008. Dado un paciente con un registro de aceptación de datos activo, cuando el titular solicita la revocación del consentimiento, entonces el sistema actualiza el estado del registro de aceptación a revocado. Origen: contexto 3.2 y DEC-003.

### 12. Dependencias
- Módulo de verificación de identidad y aceptación de términos (contexto 3.2).
- Canales de interacción (aplicación web y bot de Telegram, contexto 3.1).

### 13. Restricciones
- El equipo cuenta con cuatro personas y aproximadamente 8 semanas (contexto 3.9).
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera (contexto 3.9).
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular (contexto 3.11).

### 14. Fuera de alcance
- Interfaz gráfica o módulo especial de auditoría externa para consultar los registros de aceptación (DEC-002).
- Creación de cuentas o registro de pacientes nuevos por fuera de los datos provistos por la EPS simulada (contexto 3.10).
- Persistencia del modelo de base de datos o elección de gestor de datos: tema para arquitectura. Origen: RF-010.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001)
- OPEN-Q-002: Respondida (DEC-002)
- OPEN-Q-003: Respondida (DEC-003)

### 16. Trazabilidad
- HU-003: RF-010, RF-011; BR-005, BR-006; AC-007, AC-008; CL-004.
- RF-010: verificado por AC-007.
- RF-011: verificado por AC-008.
- BR-005: verificado por AC-007.
- BR-006: verificado por AC-008.
- CL-004: verificado por AC-008.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y definición de preguntas de aclaración.
- Versión 1.0: incorporación de las respuestas del equipo sobre el almacenamiento interno y el marcado del registro como revocado, quedando la SPEC completa y lista para revisión.

## Verificación
- Completitud: cumple. Se cubren todas las facetas de la necesidad original, incluyendo el rol (titular/tercero), la fecha, el canal y la revocación.
- Consistencia interna: cumple. Los RF, BR, flujos, casos límite y criterios de aceptación reflejan de manera coherente el almacenamiento interno y la actualización a estado revocado.
- Consistencia con el contexto: cumple. Coincide exactamente con el tratamiento de datos, la revocación y la participación de terceros descritos en las secciones 3.2 y 3.3.
- No ambigüedad: cumple. Los términos sobre el registro interno y el estado revocado están definidos sin ambigüedades.
- Verificabilidad: cumple. Cada requisito y regla cuenta con criterios de aceptación en formato Dado-Cuando-Entonces verificables.
- Trazabilidad: cumple. Todos los elementos tienen su origen y relación trazada correctamente en la sección 16.
- No invención: cumple. No se incluyeron reglas, plazos ni normas fuera del contexto y las respuestas explícitas del equipo.
- Delimitación: cumple. Los aspectos técnicos de almacenamiento se derivaron a arquitectura y se excluyó una interfaz de auditoría dedicada según la decisión del equipo.

## Siguiente paso
La SPEC-003 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
