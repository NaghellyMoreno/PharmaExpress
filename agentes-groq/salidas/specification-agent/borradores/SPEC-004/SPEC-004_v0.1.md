<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-07 19:30
Petición: La autorización para tratar datos de salud es separada del aviso de privacidad y se pide antes de cargar cualquier documento
-->

# SPEC-004. Autorización separada para el tratamiento de datos de salud - Versión 0.1

Estado: Borrador
Modo: Iteración
Necesidad original: "La autorización para tratar datos de salud es separada del aviso de privacidad y se pide antes de cargar cualquier documento"
Épica: EPIC-001

## Análisis
- Objetivo: garantizar que el usuario otorgue una autorización explícita para el tratamiento de datos de salud de manera independiente al aviso de privacidad y previa a la carga de cualquier documento médico.
- Alcance inicial: presentación, aceptación y registro de la autorización de datos de salud en la aplicación web y en Telegram antes de permitir la carga de fórmulas o historias clínicas.
- Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- Contexto aplicable: 3.1, 3.2, 3.3, 3.4, 3.11.

## Modelo de dominio
- Autorización de datos de salud: pertenece a una sesión del paciente; se registra una por sesión cuando el usuario la acepta. Origen: DEC-002.
- Documento: fórmula o historia clínica; pertenece a la solicitud del paciente y requiere una autorización de datos de salud previa y válida en la sesión. Origen: contexto 3.2, 3.4 y DEC-002.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Asegurar que el sistema obtenga y registre una autorización explícita y separada para el tratamiento de datos de salud antes de que el usuario cargue cualquier documento médico en la aplicación web o en Telegram.

### 2. Contexto
La Ley 1581 de 2012 y el Decreto 1377 de 2013 establecen que los datos de salud son sensibles y requieren autorización explícita del titular. El sistema Pharma Express exige que esta autorización sea un paso independiente del aviso de privacidad y obligatorio antes de adjuntar fórmulas o historias clínicas.
Decisiones del equipo:
- DEC-001. La épica de esta SPEC es EPIC-001. Responde a OPEN-Q-001.
- DEC-002. El sistema da por aceptada la autorización para tratar datos de salud para la sesión. Responde a OPEN-Q-002.
- DEC-003. El sistema registra la fecha, el canal, el rol y la referencia a los documentos que cubre cuando se otorga la autorización de datos de salud. Responde a OPEN-Q-003.

### 3. Alcance
- Presentación de la autorización separada para el tratamiento de datos de salud en la aplicación web y en Telegram.
- Solicitud de aceptación obligatoria antes de permitir la carga de cualquier documento (fórmulas o historias clínicas).
- Registro de los metadatos de la autorización (fecha, canal, rol y referencia a los documentos que cubre) en la sesión.

### 4. Actores e historias de usuario
Actores: paciente, persona que actúa por el paciente, facilitador comunitario.
- HU-004. Como usuario, quiero otorgar una autorización separada para el tratamiento de mis datos de salud antes de cargar documentos, para cumplir con la normativa y proteger mi privacidad.

### 5. Requisitos funcionales
- RF-012. El sistema debe presentar una autorización para el tratamiento de datos de salud separada del aviso de privacidad antes de permitir cargar cualquier documento. Origen: necesidad y contexto 3.2.
- RF-013. El sistema debe bloquear la carga de documentos (fórmulas e historia clínica) hasta que el usuario acepte expresamente la autorización de datos de salud en la sesión actual. Origen: necesidad y DEC-002.
- RF-014. El sistema debe registrar la fecha, el canal, el rol de quien acepta y la referencia a los documentos que cubre cuando se otorga la autorización de datos de salud. Origen: DEC-003.

### 6. Requisitos no funcionales
- RNF-004. Privacidad y cumplimiento normativo. Los datos de salud deben contar con el consentimiento explícito registrado antes de su procesamiento digital en la plataforma. Se verifica con: auditoría de los registros de aceptación por sesión y pruebas de flujo de carga de documentos. Origen: contexto 3.11 y necesidad.

### 7. Reglas de negocio
- BR-007. La autorización para tratar datos de salud es independiente del aviso de privacidad general, se valida por sesión y es un requisito obligatorio previo para cargar documentos. Origen: necesidad y DEC-002.

### 8. Flujo principal
1. El usuario supera la verificación de identidad y vincula su canal.
2. El usuario inicia el proceso para cargar documentos médicos (fórmulas o historia clínica).
3. El sistema presenta el texto de la autorización para el tratamiento de datos de salud, separado del aviso de privacidad.
4. El usuario acepta explícitamente la autorización de datos de salud.
5. El sistema registra la aceptación guardando la fecha, el canal, el rol y la referencia a los documentos que cubre.
6. El sistema habilita la interfaz para adjuntar los documentos médicos.

### 9. Flujos alternativos y de excepción
- E1. El usuario rechaza o no acepta la autorización de datos de salud. El sistema impide la carga de documentos y mantiene al usuario en la pantalla anterior o de inicio de gestión.

### 10. Casos límite
- CL-005. El usuario intenta cargar un documento sin aceptar la autorización de datos de salud: el sistema bloquea la acción y muestra nuevamente el texto de autorización obligatorio. Origen: necesidad.

### 11. Criterios de aceptación
- AC-009. Dado un usuario autenticado que intenta cargar una fórmula o historia clínica, cuando el sistema presenta la autorización de datos de salud y el usuario la acepta, entonces el sistema registra la fecha, el canal, el rol y la referencia a los documentos que cubre, y permite continuar con la carga de los archivos. Origen: necesidad y DEC-003.
- AC-010. Dado un usuario que ya aceptó la autorización de datos de salud en la sesión actual, cuando carga un segundo documento en la misma sesión, entonces el sistema no vuelve a solicitar la aceptación y permite la carga de inmediato. Origen: DEC-002.

### 12. Dependencias
- Verificación de identidad y vinculación de canales.
- Módulos de interfaz de usuario de la aplicación web y del bot de Telegram.

### 13. Restricciones
- El equipo consta de cuatro personas y cuenta con aproximadamente 8 semanas para el desarrollo. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: la entrega incompleta y la entrega en 48 horas son obligaciones de la EPS y su red, no de Pharma Express. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Modificación del aviso de privacidad general de la plataforma. Origen: necesidad.
- Trámite o gestión de autorizaciones médicas ante la EPS. Origen: contexto 3.10.
- Registro de pacientes y actualización de sus datos. Origen: contexto 3.10.
- Componente de almacenamiento y cifrado de los registros de auditoría de datos sensibles: tema para arquitectura. Origen: RF-014.

### 15. Preguntas abiertas
- Ninguna.

### 16. Trazabilidad
- HU-004: RF-012, RF-013, RF-014; RNF-004; BR-007; AC-009, AC-010; CL-005.
- RF-012: verificado por AC-009.
- RF-013: verificado por AC-009, AC-010, CL-005.
- RF-014: verificado por AC-009.
- BR-007: verificado por AC-009, AC-010.
- CL-005: verificado por AC-009, CL-005.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y respuestas a las preguntas de aclaración (EPIC-001, aceptación por sesión y registro de metadatos).

## Verificación
- Completitud: cumple. Se cubren la presentación, el bloqueo previo a la carga, el registro por sesión de los metadatos y la excepción por rechazo.
- Consistencia interna: cumple. Los RF, BR, flujos y AC concuerdan en que la autorización es previa, obligatoria por sesión y registra fecha, canal, rol y referencia.
- Consistencia con el contexto: cumple. Se alinea con la Ley 1581 de 2012 y el Decreto 1377 de 2013 mencionados en el contexto 3.11 y con las reglas de separación respecto al aviso de privacidad.
- No ambigüedad: cumple. Los términos de aceptación por sesión y los datos a registrar son claros y definidos por el equipo.
- Verificabilidad: cumple. Todos los criterios de aceptación describen comportamientos observables y verificables.
- Trazabilidad: cumple. Cada HU, RF, RNF, BR y CL está vinculado correctamente en la sección 16.
- No invención: cumple. Todos los detalles provienen de la necesidad original y de las respuestas aprobadas del equipo.
- Delimitación: cumple. Se excluyen explícitamente el aviso general de privacidad y los trámites de EPS.

## Siguiente paso
La SPEC-004 versión 0.1 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
