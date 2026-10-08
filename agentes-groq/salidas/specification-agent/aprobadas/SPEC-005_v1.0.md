<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-07 19:49
Petición: El equipo aprueba la SPEC-005
-->

# SPEC-005. Revocatoria de consentimiento y eliminación de datos - Versión 1.0

Estado: Aprobada y congelada
Modo: Aprobación
Necesidad original: "El titular puede revocar su consentimiento y pedir que se eliminen sus datos."
Épica: EPIC-001

## Análisis
- Objetivo: permitir que el titular del consentimiento revoque su autorización para el tratamiento de datos y solicite la eliminación de los mismos, asegurando la cancelación de reservas activas y la liberación de cupos y medicamentos.
- Alcance inicial: solicitud de revocatoria de consentimiento y eliminación de datos desde la aplicación web o el bot de Telegram, aplicando la cancelación de reservas activas y el envío de confirmación.
- Actores: paciente, EPS simulada, inventario simulado.
- Contexto aplicable: 3.1, 3.2, 3.5, 3.6, 3.8, 3.11.

## Modelo de dominio
- Titular: persona que revoca el consentimiento y solicita la eliminación de datos. Origen: contexto 3.2.
- Consentimiento: autorización de tratamiento de datos otorgada por el titular. Origen: contexto 3.2.
- Reserva: existencias y cupo apartados para una cita, asociadas al paciente. Origen: contexto 2.4 y 3.5.
- Cita: ventana escogida en un punto para recoger los medicamentos reservados. Origen: contexto 2.4 y 3.5.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Permitir que el titular revoque el consentimiento y solicite la eliminación de sus datos, garantizando la eliminación de reservas activas, la liberación de cupos y medicamentos, y la notificación correspondiente.

### 2. Contexto
El sistema debe permitir que el titular del consentimiento lo revoque en cualquier momento. Al hacerlo, se eliminan los datos del titular y cualquier reserva activa, liberando cupos y medicamentos para otras personas, conforme a las reglas de la Ley 1581 de 2012 y el contexto del producto.
Decisiones del equipo:
- DEC-001. La necesidad pertenece a la épica EPIC-001. Responde a OPEN-Q-001.
- DEC-002. Se puede solicitar la revocatoria del consentimiento por ambos canales (aplicación web y Telegram). Responde a OPEN-Q-002.
- DEC-003. El mensaje de confirmación es: Tu consentimiento fue revocado y tus datos fueron eliminados. Si tenías reservas activas, quedaron canceladas y los cupos disponibles para otras personas. Para volver a usar el servicio tendrás que verificar tu identidad y aceptar de nuevo el tratamiento de datos. Responde a OPEN-Q-003.

### 3. Alcance
- Incluye la solicitud de revocatoria del consentimiento y eliminación de datos desde la aplicación web y el bot de Telegram.
- Incluye la eliminación de reservas activas, la liberación de cupos y medicamentos, y el envío del mensaje de confirmación.

### 4. Actores e historias de usuario
Actores: paciente, EPS simulada, inventario simulado.
- HU-005. Como paciente, quiero revocar mi consentimiento y pedir la eliminación de mis datos, para que mi información ya no sea tratada por el sistema y se liberen mis reservas.

### 5. Requisitos funcionales
- RF-015. El sistema debe permitir al titular solicitar la revocatoria del consentimiento y la eliminación de sus datos a través de la aplicación web y el bot de Telegram. Origen: necesidad, contexto 3.1, DEC-002.
- RF-016. Al ejecutarse la revocatoria del consentimiento, el sistema debe eliminar los datos del titular del ámbito de gestión de Pharma Express. Origen: contexto 3.2.
- RF-017. Si existen reservas activas asociadas al titular, el sistema debe eliminarlas, liberando de forma automática el cupo y los medicamentos para que queden disponibles para otras personas. Origen: contexto 3.2, contexto 3.5.
- RF-018. El sistema debe enviar el mensaje de confirmación de revocatoria y eliminación por todos los medios registrados del paciente (notificación web, Telegram, SMS y correo). Origen: DEC-003, contexto 3.6.

### 6. Requisitos no funcionales
- RNF-005. Disponibilidad de canales. La solicitud de revocatoria debe estar disponible de forma permanente a través de la aplicación web y Telegram. Se verifica con: pruebas de disponibilidad de rutas de usuario en ambos canales. Origen: necesidad, contexto 3.1.

### 7. Reglas de negocio
- BR-008. Si el titular tiene reservas activas al momento de revocar el consentimiento, estas se eliminan y el cupo y los medicamentos quedan disponibles para otras personas. Origen: contexto 3.2.

### 8. Flujo principal
1. El titular accede a la opción de revocar el consentimiento y eliminar sus datos desde la aplicación web o Telegram.
2. El sistema solicita confirmación de la acción advirtiendo que se eliminarán sus datos y reservas activas.
3. El titular confirma la revocatoria.
4. El sistema revoca el consentimiento y elimina los datos del titular.
5. El sistema verifica si existen reservas activas asociadas; en caso afirmativo, las cancela y libera los cupos y medicamentos.
6. El sistema muestra en pantalla y envía por todos los medios del paciente el mensaje de confirmación aprobado.

### 9. Flujos alternativos y de excepción
- A1. El titular cancela el proceso antes de confirmar. El sistema no realiza ninguna modificación y mantiene el consentimiento y las reservas vigentes.
- E1. El titular no tiene reservas activas al momento de la revocatoria. El sistema completa la revocatoria, elimina los datos y envía la confirmación omitiendo la mención a reservas.

### 10. Casos límite
- CL-006. Solicitud de revocatoria con reservas activas: el sistema elimina las reservas, libera los cupos y medicamentos, y notifica correctamente. Origen: contexto 3.2, DEC-003.

### 11. Criterios de aceptación
- AC-011. Dado un paciente con una reserva activa, cuando solicita y confirma la revocatoria de su consentimiento desde la aplicación web o Telegram, entonces el sistema elimina sus datos, cancela la reserva activa, libera el cupo y los medicamentos, y envía el mensaje de confirmación establecido por todos sus medios. Origen: necesidad, contexto 3.2, contexto 3.5, DEC-002, DEC-003.

### 12. Dependencias
- Verificación de identidad y vinculación de canales.
- Inventario simulado y puntos de dispensación.
- Servicios de notificación reales (Telegram, SMS, correo) y web.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: obligación de la EPS de entregar lo faltante en máximo 48 horas. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Cita de continuidad. Origen: contexto 3.10.
- Pendientes y entrega parcial gestionada por el sistema. Origen: contexto 3.10.
- Reprogramación. Origen: contexto 3.10.
- Reporte de concordancia entre prevalidación y validación oficial. Origen: contexto 3.10.
- Vigilancia automática del inventario o de las autorizaciones. Origen: contexto 3.10.
- Trámite de autorizaciones. Origen: contexto 3.10.
- Registro de pacientes y actualización de sus datos. Origen: contexto 3.10.
- Domicilio. Origen: contexto 3.10.
- Aplicación móvil instalable y WhatsApp. Origen: contexto 3.10.
- Medición SUS y metas de desempeño. Origen: contexto 3.10.
- Integración real con EPS, MIPRES, ADRES o inventarios reales. Origen: contexto 3.10.
- Facturación, prescripción o modificación de fórmulas. Origen: contexto 3.10.
- Uso de datos reales de pacientes. Origen: contexto 3.10.

### 15. Preguntas abiertas
- OPEN-Q-001: Respondida (DEC-001)
- OPEN-Q-002: Respondida (DEC-002)
- OPEN-Q-003: Respondida (DEC-003)

### 16. Trazabilidad
- HU-005: RF-015, RF-016, RF-017, RF-018; RNF-005; BR-008; CL-006; AC-011.
- RF-015: verificado por AC-011.
- RF-016: verificado por AC-011.
- RF-017: verificado por AC-011.
- RF-018: verificado por AC-011.
- RNF-005: verificado por AC-011.
- BR-008: verificado por AC-011.
- CL-006: verificado por AC-011.

### 17. Historial de cambios
- Versión 0.1: creación a partir de la necesidad y respuesta a las preguntas abiertas de canal y mensaje de confirmación.
- Versión 1.0: aprobación formal por parte del equipo y congelamiento de la especificación.

## Verificación
- Completitud: cumple. Se especificaron los requisitos funcionales, no funcionales, reglas de negocio, flujo principal, excepciones, casos límite y criterios de aceptación para la revocatoria y eliminación de datos.
- Consistencia interna: cumple. Los RF-015 a RF-018 y BR-008 son coherentes con el flujo principal y el AC-011.
- Consistencia con el contexto: cumple. Coincide plenamente con las reglas del contexto 3.2 sobre la revocatoria de consentimiento y eliminación de datos, y con el contexto 3.6 sobre los medios de notificación.
- No ambigüedad: cumple. Los términos y pasos están definidos sin ambigüedad.
- Verificabilidad: cumple. Todos los requisitos cuentan con criterios de aceptación claros basados en comportamientos observables.
- Trazabilidad: cumple. Cada historia de usuario y requisito se vincula correctamente con sus elementos de verificación.
- No invención: cumple. No se inventaron reglas ni cifras; se utilizaron las decisiones aportadas por el equipo y el contexto del producto.
- Delimitación: cumple. Los límites de la funcionalidad están claramente definidos y los elementos fuera de alcance se excluyen explícitamente.

## Siguiente paso
La SPEC-005 versión 1.0 quedó aprobada y congelada.
