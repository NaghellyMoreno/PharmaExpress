<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:56
Petición: Atención en el punto y cierre de entrega. El dispensador se autentica con un usuario de rol dispensador asignado a un punto. Valida el código de entrega en QR o numérico; el sistema verifica que pertenezca a una cita de su punto, que no esté usado ni anulado y que la hora actual esté dentro de la ventana. Si llega antes, se indica esperar el inicio; si llega después, se indica que la cita expiró y que puede acudir a la atención presencial o iniciar una nueva solicitud. Al validar, se registra la hora de llegada y se muestra al dispensador el paciente, las fórmulas, los medicamentos reservados y el resultado de la prevalidación, indicando que es preliminar. El dispensador registra la validación oficial y cierra cada medicamento como entregado o no entregado con un motivo del catálogo aprobado: afiliación inactiva, fórmula vencida o inválida, autorización no vigente, medicamento no cubierto, datos del paciente no coinciden, sin existencias pese a reserva, u otro con descripción. Al cerrar, el código queda usado, la cita cerrada y se actualiza el estado de cada fórmula. Si hay medicamentos no entregados, se indica que la gestión corresponde a Disfarma y no se crean pendientes ni seguimiento. Si una fórmula crónica quedó entregada, se programa el aviso de próxima entrega. EPIC-006.
-->

# SPEC-006. Atención en el punto y cierre de entrega - Versión 1.0

Estado: Candidata
Modo: Inicial
Necesidad original: "Atención en el punto y cierre de entrega. El dispensador se autentica con un usuario de rol dispensador asignado a un punto. Valida el código de entrega en QR o numérico; el sistema verifica que pertenezca a una cita de su punto, que no esté usado ni anulado y que la hora actual esté dentro de la ventana. Si llega antes, se indica esperar el inicio; si llega después, se indica que la cita expiró y que puede acudir a la atención presencial o iniciar una nueva solicitud. Al validar, se registra la hora de llegada y se muestra al dispensador el paciente, las fórmulas, los medicamentos reservados y el resultado de la prevalidación, indicando que es preliminar. El dispensador registra la validación oficial y cierra cada medicamento como entregado o no entregado con un motivo del catálogo aprobado: afiliación inactiva, fórmula vencida o inválida, autorización no vigente, medicamento no cubierto, datos del paciente no coinciden, sin existencias pese a reserva, u otro con descripción. Al cerrar, el código queda usado, la cita cerrada y se actualiza el estado de cada fórmula. Si hay medicamentos no entregados, se indica que la gestión corresponde a Disfarma y no se crean pendientes ni seguimiento. Si una fórmula crónica quedó entregada, se programa el aviso de próxima entrega."
Épica: EPIC-006

## Análisis
- Objetivo: permitir que el dispensador autenticado valide el código de entrega de una cita en su punto, verifique las condiciones de tiempo y vigencia, consulte los datos preliminares y registre la validación oficial cerrando cada medicamento como entregado o no entregado.
- Alcance inicial: autenticación del dispensador, validación del código (QR o numérico) según punto, ventana y estado, registro de la hora de llegada, visualización de datos preliminares, registro de la validación oficial por medicamento con motivo estandarizado y actualización de estados, códigos, citas y avisos posteriores.
- Actores: dispensador, paciente (o persona que actúa por él), EPS simulada, inventario simulado.
- Contexto aplicable: 2.3, 3.5, 3.7, 3.8, 3.9, 3.10, 3.11.

## Modelo de dominio
- Dispensador: personal del punto con usuario y rol en el sistema. Origen: contexto 2.3.
- Punto de dispensación: ubicación física con nombre ficticio, horario, ventanas, capacidad e inventario configurables. Origen: contexto 3.8.
- Cita: ventana de 1 hora en un punto, con medicamentos reservados y un código de entrega de un solo uso. Origen: contexto 2.4, 3.5.
- Código de entrega: código de un solo uso, en QR y numérico, ligado a una cita. Origen: contexto 2.4, 3.5.
- Fórmula: prescripción con uno o más medicamentos, unidad de validación. Origen: contexto 2.4, 3.4.
- Medicamento: componente de la fórmula sujeto a validación, reserva y entrega. Origen: contexto 2.4, 3.4.
- Validación oficial: la que registra el dispensador en el punto. Origen: contexto 2.4.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- No hay preguntas pendientes.

## Especificación

### 1. Objetivo
Permitir la atención presencial en el punto de dispensación mediante la validación de credenciales del dispensador, la verificación del código de entrega de la cita (en formato QR o numérico), la consulta de la prevalidación y el registro oficial del estado de entrega de cada medicamento con los motivos definidos.

### 2. Contexto
El sistema opera en los puntos de dispensación del gestor farmacéutico Disfarma. El dispensador es el único actor con usuario y rol en el sistema. La validación oficial ocurre en el punto y contrasta con la prevalidación preliminar realizada previamente.
Decisiones del equipo:
- No hay decisiones adicionales pendientes.

### 3. Alcance
- Autenticación del dispensador con usuario y rol en su punto asignado.
- Ingreso y verificación de código de entrega (QR o numérico).
- Verificación de pertenencia al punto, estado de uso, anulación y ventana de tiempo de la cita.
- Manejo de llegada anticipada (esperar el inicio) y llegada posterior (cita expirada, orientación presencial o nueva solicitud).
- Registro de la hora de llegada en el momento de validar el código.
- Visualización para el dispensador de los datos del paciente, fórmulas, medicamentos reservados y prevalidación con advertencia de que es preliminar.
- Registro de validación oficial y cierre de cada medicamento como entregado o no entregado.
- Selección obligatoria de motivo de no entrega de catálogo aprobado (afiliación inactiva, fórmula vencida o inválida, autorización no vigente, medicamento no cubierto, datos del paciente no coinciden, sin existencias pese a reserva, u otro con descripción).
- Actualización de estado del código (usado), de la cita (cerrada) y de cada fórmula.
- Indicación de que la gestión de medicamentos no entregados corresponde a Disfarma, sin crear pendientes ni seguimiento.
- Programación del aviso de próxima entrega si una fórmula crónica queda totalmente entregada.

### 4. Actores e historias de usuario
Actores: dispensador, paciente.
- HU-008. Como dispensador, quiero validar el código de una cita en mi punto para registrar la llegada del paciente, revisar la prevalidación y registrar la entrega oficial de los medicamentos.

### 5. Requisitos funcionales
- RF-058. El sistema debe permitir que el dispensador se autentique utilizando un usuario con rol de dispensador asignado a un punto de dispensación. Origen: necesidad, contexto 2.3.
- RF-059. El sistema debe permitir al dispensador validar el código de entrega de una cita mediante ingreso numérico o lectura de código QR. Origen: necesidad, contexto 3.7.
- RF-060. El sistema debe verificar que el código ingresado pertenezca a una cita asignada al punto del dispensador, que no se encuentre previamente usado ni anulado, y que la hora actual se encuentre dentro de la ventana de la cita. Origen: necesidad, contexto 3.7.
- RF-061. Si el paciente llega antes del inicio de la ventana, el sistema debe indicar al dispensador que el paciente debe esperar al inicio. Origen: necesidad, contexto 3.5, 3.7.
- RF-062. Si el paciente llega después de finalizar la ventana, el sistema debe indicar al dispensador que la cita expiró y mostrar las opciones de acudir a la atención presencial o iniciar una nueva solicitud. Origen: necesidad, contexto 3.5, 3.7.
- RF-063. Al validar exitosamente el código, el sistema debe registrar la hora de llegada exacta como el momento en que se valida el código. Origen: necesidad, contexto 3.7.
- RF-064. Al validar el código, el sistema debe mostrar al dispensador la información del paciente, las fórmulas, los medicamentos reservados y el resultado de la prevalidación, indicando de forma explícita que dicha prevalidación es preliminar. Origen: necesidad, contexto 3.4, 3.7.
- RF-065. El sistema debe permitir al dispensador registrar la validación oficial cerrando cada medicamento como entregado o no entregado. Origen: necesidad, contexto 3.7.
- RF-066. Si un medicamento se registra como no entregado, el sistema debe exigir la selección de un motivo de no entrega perteneciente al catálogo aprobado: afiliación inactiva, fórmula vencida o inválida, autorización no vigente, medicamento no cubierto, datos del paciente no coinciden, sin existencias pese a reserva, u otro con descripción. Origen: necesidad, contexto 3.7.
- RF-067. Al completar el cierre de la atención, el sistema debe marcar el código de entrega como usado, cerrar la cita y actualizar el estado de cada fórmula. Origen: necesidad, contexto 3.7.
- RF-068. Si existen medicamentos no entregados, el sistema debe indicar que la gestión corresponde a Disfarma y no debe crear pendientes ni seguimiento automático. Origen: necesidad, contexto 3.7, 3.10.
- RF-069. Si una fórmula crónica queda registrada como entregada, el sistema debe programar el aviso de próxima entrega según los plazos establecidos. Origen: necesidad, contexto 3.6.

### 6. Requisitos no funcionales
- RNF-015. Seguridad y control de acceso. El acceso al sistema de dispensación debe estar restringido exclusivamente a usuarios con rol activo de dispensador, validando su asignación de punto antes de permitir cualquier operación de lectura o validación de códigos. Se verifica con: prueba de control de acceso basada en roles y auditoría de sesiones. Origen: necesidad, contexto 2.3.

### 7. Reglas de negocio
- BR-022. El código de entrega es de un solo uso, es válido únicamente en el punto y ventana correspondientes, y su validación oficial en ventanilla marca el cierre de la atención sin generación de pendientes en el sistema Pharma Express. Origen: necesidad, contexto 3.5, 3.7.

### 8. Flujo principal
1. El dispensador se autentica en el sistema utilizando su usuario con rol dispensador.
2. El dispensador ingresa el código numérico o escanea el código QR de entrega presentado por el paciente.
3. El sistema verifica que el código corresponda a una cita de su punto, que esté activo y que la hora actual se encuentre dentro de la ventana de 1 hora de la cita.
4. El sistema registra la hora de llegada y muestra al dispensador los datos del paciente, las fórmulas, los medicamentos reservados y la prevalidación preliminar.
5. El dispensador realiza la validación oficial en el punto y registra para cada medicamento el estado de entregado o no entregado.
6. Si hay medicamentos no entregados, el dispensador selecciona el motivo obligatorio del catálogo aprobado.
7. El sistema guarda la validación oficial, marca el código como usado, cierra la cita y actualiza el estado de las fórmulas.
8. Si hay medicamentos no entregados, el sistema muestra la indicación de que la gestión corresponde a Disfarma sin crear pendientes.
9. Si una fórmula crónica quedó entregada, el sistema programa el aviso de próxima entrega.

### 9. Flujos alternativos y de excepción
- A1. Llegada anticipada:
  1. En el paso 3 del flujo principal, el sistema detecta que la hora actual es anterior al inicio de la ventana de la cita.
  2. El sistema indica al dispensador que el paciente debe esperar a que inicie la ventana.
  3. El dispensador espera o reintenta cuando inicie la ventana.
- E1. Cita expirada:
  1. En el paso 3 del flujo principal, el sistema detecta que la hora actual es posterior a la finalización de la ventana de la cita.
  2. El sistema indica que la cita expiró y muestra las opciones de acudir a la atención presencial o iniciar una nueva solicitud.
  3. El flujo de validación se detiene para esa cita.
- E2. Código inválido, ya usado o de otro punto:
  1. En el paso 3 del flujo principal, el sistema detecta que el código no existe, pertenece a otro punto, ya fue usado o está anulado.
  2. El sistema rechaza la validación e informa el motivo al dispensador.

### 10. Casos límite
- CL-016. Intento de uso de código fuera de ventana o en punto diferente: el sistema bloquea la validación e informa que el código no corresponde al punto o al horario vigente. Origen: necesidad, contexto 3.7.

### 11. Criterios de aceptación
- AC-027. Dado un dispensador autenticado en su punto, cuando ingresa un código válido dentro de la ventana horaria correspondiente, entonces el sistema registra la hora de llegada, muestra la prevalidación preliminar y permite registrar la validación oficial de cada medicamento. Origen: necesidad, contexto 3.7.
- AC-028. Dado un paciente que llega antes de la ventana de su cita, cuando el dispensador valida el código, entonces el sistema indica que debe esperar el inicio. Origen: necesidad, contexto 3.5, 3.7.
- AC-029. Dado un paciente que llega después de la ventana de su cita, cuando el dispensador valida el código, entonces el sistema indica que la cita expiró y presenta las opciones de atención presencial o nueva solicitud. Origen: necesidad, contexto 3.5, 3.7.
- AC-030. Dado el registro de validación oficial donde un medicamento queda no entregado, cuando el dispensador finaliza, entonces el sistema exige el motivo del catálogo aprobado y muestra que la gestión corresponde a Disfarma sin crear pendientes. Origen: necesidad, contexto 3.7, 3.10.

### 12. Dependencias
- Autenticación de dispensadores y gestión de roles.
- Puntos de dispensación y horarios configurados.
- Citas, reservas y códigos de entrega generados.
- Resultados de prevalidación preliminar.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: si la entrega queda incompleta al reclamar, la EPS debe entregar lo faltante en máximo 48 horas. Es una obligación de la EPS y de su red, no de Pharma Express. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Cita de continuidad. Origen: contexto 3.10.
- Pendientes y entrega parcial gestionada por el sistema. Origen: contexto 3.10.
- Reporte de concordancia entre prevalidación y validación oficial. Origen: contexto 3.10.
- Integración real con inventarios de Disfarma. Origen: contexto 3.8.
- Modelo de autenticación de usuarios de EPS: tema para arquitectura. Origen: RF-058.
- Mecanismo de lectura y decodificación de códigos QR: tema para arquitectura. Origen: RF-059.

### 15. Preguntas abiertas
- No hay preguntas abiertas.

### 16. Trazabilidad
- HU-008: RF-058, RF-059, RF-060, RF-061, RF-062, RF-063, RF-064, RF-065, RF-066, RF-067, RF-068, RF-069; RNF-015; BR-022; AC-027, AC-028, AC-029, AC-030; CL-016.
- RF-058 a RF-069: verificado por AC-027, AC-028, AC-029, AC-030.
- RNF-015: verificado por AC-027.
- BR-022: verificado por AC-027, AC-030.
- CL-016: verificado por AC-028, AC-029.

### 17. Historial de cambios
- Versión 1.0: creación inicial de la SPEC-006 a partir de la necesidad y contexto de atención en el punto.

## Verificación
- Completitud: cumple. Incluye autenticación, validación de códigos, control de ventana de tiempo, registro de llegada, visualización preliminar, cierre oficial con motivos aprobados, actualización de estados y manejo de no entregas sin pendientes.
- Consistencia interna: cumple. Los requisitos funcionales (RF-058 a RF-069) coinciden con el flujo principal, los flujos alternativos, los casos límite y los criterios de aceptación.
- Consistencia con el contexto: cumple. Se apega estrictamente a las secciones 2.3, 3.5, 3.7, 3.8, 3.10 y 3.11 sobre validación en punto, roles de dispensador, exclusión de gestión de pendientes y obligatoriedad de motivos.
- No ambigüedad: cumple. Los términos de tiempo, validación de códigos y motivos de no entrega están definidos sin ambigüedades.
- Verificabilidad: cumple. Cada requisito cuenta con criterios de aceptación observables en formato dado-cuando-entonces.
- Trazabilidad: cumple. Las historias de usuario, requisitos, reglas, casos límite y criterios están enlazados de forma consistente.
- No invención: cumple. No se introdujeron reglas, plazos ni cifras distintas a las aprobadas en el contexto del producto.
- Delimitación: cumple. Se delimita claramente la atención en el punto sin asumir integración real con sistemas externos de Disfarma.

## Siguiente paso
La SPEC-006 versión 1.0 está lista para revisión. Confirmen el objetivo y el alcance, las reglas de negocio, los criterios de aceptación críticos, las restricciones y lo que está fuera de alcance. Si la aprueban, queda congelada y lista para el Architecture Agent.
