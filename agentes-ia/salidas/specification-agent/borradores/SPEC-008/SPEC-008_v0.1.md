<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:57
Petición: Datos simulados, parámetros y catálogos. La EPS simulada provee por paciente cédula, EPS, estado de afiliación, celular registrado y correo registrado si existe; por fórmula provee vigencia, estado de autorización por medicamento y, si es crónica, la fecha habilitada de la próxima entrega. Existe un catálogo simulado de cobertura PBS y un catálogo configurable de diagnósticos crónicos. Cada punto ficticio tiene horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Por cada EPS existe contenido configurable con puntos, enlaces o trámites de autorización y orientación para actualizar datos. Existe el catálogo de motivos de no entrega aprobado. Los datos de prueba usan solo números y correos de los integrantes del equipo, con su consentimiento, y ningún dato de pacientes reales; las vigencias de las fórmulas de prueba están entre 8 y 9 meses después de la consulta médica. Los cambios de estado en la EPS simulada deben poder provocarse durante las pruebas. El sistema registra los eventos necesarios para las métricas de evaluación. EPIC-007.
-->

# SPEC-008. Datos simulados, parámetros y catálogos - Versión 0.1

Estado: Borrador
Modo: Inicial
Necesidad original: "Datos simulados, parámetros y catálogos. La EPS simulada provee por paciente cédula, EPS, estado de afiliación, celular registrado y correo registrado si existe; por fórmula provee vigencia, estado de autorización por medicamento y, si es crónica, la fecha habilitada de la próxima entrega. Existe un catálogo simulado de cobertura PBS y un catálogo configurable de diagnósticos crónicos. Cada punto ficticio tiene horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Por cada EPS existe contenido configurable con puntos, enlaces o trámites de autorización y orientación para actualizar datos. Existe el catálogo de motivos de no entrega aprobado. Los datos de prueba usan solo números y correos de los integrantes del equipo, con su consentimiento, y ningún dato de pacientes reales; las vigencias de las fórmulas de prueba están entre 8 y 9 meses después de la consulta médica. Los cambios de estado en la EPS simulada deben poder provocarse durante las pruebas. El sistema registra los eventos necesarios para las métricas de evaluación."
Épica: EPIC-007

## Análisis
- Objetivo: definir la estructura y el comportamiento de los datos simulados, parámetros y catálogos que alimentan el funcionamiento de Pharma Express durante la operación y las pruebas.
- Alcance inicial: datos de paciente y fórmula de la EPS simulada, catálogo de cobertura PBS, catálogo de diagnósticos crónicos, configuración de puntos de dispensación, contenido de EPS, catálogo de motivos de no entrega, datos de prueba restringidos, provocación de cambios de estado y registro de eventos para métricas.
- Actores: paciente, dispensador, EPS simulada, inventario simulado.
- Contexto aplicable: 2.3, 3.4, 3.5, 3.7, 3.8, 3.10, 3.11.

## Modelo de dominio
- EPS simulada: fuente de datos de paciente y fórmula. Origen: contexto 2.3.
- Paciente: entidad con cédula, EPS, estado de afiliación, celular registrado y correo registrado (si existe). Origen: necesidad y contexto 3.2.
- Fórmula: entidad con vigencia, estado de autorización por medicamento y fecha habilitada de próxima entrega (si es crónica). Origen: necesidad y contexto 3.4.
- Catálogo de cobertura PBS: fuente de verificación de cobertura por medicamento. Origen: necesidad y contexto 3.4.
- Catálogo de diagnósticos crónicos: catálogo configurable que define qué diagnósticos corresponden a tratamientos crónicos. Origen: necesidad y contexto 3.4.
- Punto de dispensación: entidad ficticia con horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento configurables. Origen: necesidad y contexto 3.5, 3.8.
- Contenido de EPS: información configurable de puntos, enlaces, trámites de autorización y orientación para actualizar datos. Origen: necesidad y contexto 3.4, 3.8.
- Catálogo de motivos de no entrega: listado de razones oficiales para no entregar un medicamento en el punto. Origen: necesidad y contexto 3.7.
- Datos de prueba: conjuntos de números y correos de los integrantes del equipo con su consentimiento. Origen: necesidad y contexto 3.2, 3.8.
- Registro de eventos: eventos almacenados para métricas de evaluación. Origen: necesidad y contexto 3.10.

## Contradicciones detectadas
- Ninguna.

## Análisis de impacto
No aplica.

## Preguntas de aclaración
- OPEN-Q-001. ¿Cómo deben provocarse los cambios de estado en la EPS simulada durante las pruebas (por ejemplo, mediante una interfaz de administración interna, un archivo de configuración o comandos específicos)?
  Por qué importa: define el mecanismo operativo para simular modificaciones en la afiliación, vigencia o autorizaciones de prueba.
  Crítica: sí
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. ¿Qué eventos específicos y métricas de evaluación debe registrar el sistema, teniendo en cuenta que la medición SUS y las metas de desempeño están fuera de alcance (contexto 3.10)?
  Por qué importa: delimita qué datos se guardan para evaluación sin contradecir las exclusiones del proyecto.
  Crítica: sí
  Propuesta del agente: el sistema registra eventos transaccionales básicos como marcas de tiempo de prevalidación, reservas, citas agendadas y validaciones en el punto, sin incluir mediciones de satisfacción SUS.
  Estado: Pendiente
  Responsable: equipo

## Especificación

### 1. Objetivo
Establecer los parámetros, catálogos, datos simulados y mecanismos de prueba necesarios para el funcionamiento y validación del sistema Pharma Express.

### 2. Contexto
El sistema opera utilizando datos simulados para la EPS, el inventario, los puntos de dispensación y la validación oficial. Los puntos tienen nombres ficticios y sus horarios, ventanas, capacidad e inventario son configurables. Los datos de prueba se restringen a los integrantes del equipo con su consentimiento.
Decisiones del equipo:
- Ninguna hasta el momento.

### 3. Alcance
- Provisión de datos de paciente y fórmula por la EPS simulada.
- Consulta de catálogos de cobertura PBS y diagnósticos crónicos.
- Configuración de horario, ventanas, capacidad e inventario de los puntos ficticios.
- Contenido configurable por EPS para autorizaciones y actualización de datos.
- Uso exclusivo de datos de prueba del equipo y control de vigencias.
- Mecanismo para provocar cambios de estado en la EPS simulada durante las pruebas.
- Registro de eventos para métricas de evaluación.

### 4. Actores e historias de usuario
Actores: paciente, dispensador, EPS simulada, inventario simulado.
- HU-010. Como administrador de pruebas, quiero configurar y modificar los datos simulados de la EPS, inventario y puntos, para verificar el comportamiento del sistema bajo diferentes escenarios.

### 5. Requisitos funcionales
- RF-075. El sistema debe consultar a la EPS simulada los datos del paciente que incluyan cédula, EPS, estado de afiliación, celular registrado y correo registrado si existe. Origen: necesidad y contexto 3.2.
- RF-076. El sistema debe consultar a la EPS simulada los datos de la fórmula que incluyan vigencia, estado de autorización por medicamento y, si es crónica, la fecha habilitada de la próxima entrega. Origen: necesidad y contexto 3.4.
- RF-077. El sistema debe verificar la cobertura PBS de cada medicamento utilizando un catálogo simulado. Origen: necesidad y contexto 3.4.
- RF-078. El sistema debe clasificar el tratamiento como agudo o crónico consultando un catálogo configurable de diagnósticos crónicos. Origen: necesidad y contexto 3.4.
- RF-079. El sistema debe permitir configurar para cada punto ficticio su horario, ventanas de 1 hora, capacidad por ventana e inventario por medicamento. Origen: necesidad y contexto 3.5, 3.8.
- RF-080. El sistema debe proveer contenido configurable por cada EPS con puntos, enlaces o trámites de autorización y orientación para actualizar datos. Origen: necesidad y contexto 3.4, 3.8.
- RF-081. El sistema debe utilizar el catálogo aprobado de motivos de no entrega para el registro en el punto. Origen: necesidad y contexto 3.7.
- RF-082. El sistema debe permitir provocar cambios de estado en la EPS simulada durante las pruebas. Origen: necesidad. Pendiente de OPEN-Q-001.
- RF-083. El sistema debe registrar los eventos necesarios para las métricas de evaluación. Origen: necesidad. Pendiente de OPEN-Q-002.

### 6. Requisitos no funcionales
- RNF-017. Privacidad y datos de prueba. Los datos de prueba deben usar exclusivamente números y teléfonos de los integrantes del equipo con su consentimiento, prohibiendo el uso de datos de pacientes reales. Origen: necesidad y contexto 3.2. Se verifica con: auditoría de los datos de prueba y registros del sistema.

### 7. Reglas de negocio
- BR-025. Las vigencias de las fórmulas de prueba deben estar comprendidas estrictamente entre 8 y 9 meses después de la consulta médica. Origen: necesidad y contexto 3.4.

### 8. Flujo principal
1. El sistema recibe una solicitud de consulta sobre un paciente o fórmula.
2. El sistema consulta los datos correspondientes en la EPS simulada, catálogos configurados o inventario simulado.
3. El sistema aplica las reglas de negocio y catálogos para la prevalidación o gestión.
4. El sistema registra los eventos correspondientes para métricas de evaluación.

### 9. Flujos alternativos y de excepción
- A1. Cambio de estado en pruebas: el usuario con rol de prueba provoca un cambio en la EPS simulada (como inhabilitar afiliación o cambiar autorización) y el sistema refleja dicho cambio en la siguiente consulta.
- E1. Datos de prueba no autorizados: si se intenta registrar un número o correo ajeno al equipo, el sistema rechaza la operación o el uso de dichos datos.

### 10. Casos límite
- CL-019. Fórmula con vigencia fuera del rango de prueba: si una fórmula de prueba tiene una vigencia distinta al rango de 8 a 9 meses posteriores a la consulta, el sistema la trata según las reglas de vigencia configuradas. Origen: necesidad y contexto 3.4.

### 11. Criterios de aceptación
- AC-034. Dado un paciente registrado con datos de prueba del equipo, cuando el sistema consulta la EPS simulada, entonces retorna correctamente cédula, EPS, estado de afiliación, celular y correo si existe.
- AC-035. Dada una fórmula de prueba con fecha de consulta, cuando se verifica su vigencia, entonces el sistema valida que se encuentre entre 8 y 9 meses después de la consulta. Origen: BR-025.

### 12. Dependencias
- EPS simulada.
- Inventario simulado.
- Catálogos configurables de diagnósticos, cobertura PBS y motivos de no entrega.

### 13. Restricciones
- Equipo de cuatro personas y aproximadamente 8 semanas. Origen: contexto 3.9.
- El equipo no tiene acceso a los sistemas de Disfarma y trabaja desde afuera. Origen: contexto 3.9.
- Ley 1581 de 2012 y Decreto 1377 de 2013: los datos de salud son sensibles y requieren autorización explícita del titular. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: obligación de la EPS de entregar lo faltante en 48 horas. Origen: contexto 3.11.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites de autorización. Origen: contexto 3.11.

### 14. Fuera de alcance
- Medición SUS y metas de desempeño. Origen: contexto 3.10.
- Integración real con EPS, MIPRES, ADRES o inventarios reales. Origen: contexto 3.10.
- Uso de datos reales de pacientes. Origen: contexto 3.10.

### 15. Preguntas abiertas
- OPEN-Q-001: Pendiente.
- OPEN-Q-002: Pendiente.

### 16. Trazabilidad
- HU-010: RF-075, RF-076, RF-077, RF-078, RF-079, RF-080, RF-081, RF-082, RF-083, RNF-017, BR-025; AC-034, AC-035; CL-019.
- RF-075: verificado por AC-034.
- BR-025: verificado por AC-035.
- RNF-017: verificado por auditoría de datos.

### 17. Historial de cambios
- Versión 0.1: creación inicial a partir de la necesidad y del contexto.

## Verificación
- Completitud: cumple. Se especificaron los datos de EPS, catálogos, puntos, parámetros, datos de prueba y registro de eventos.
- Consistencia interna: cumple. Los requisitos de datos y catálogos coinciden con las descripciones del dominio.
- Consistencia con el contexto: cumple. Se alinea con las secciones 2.3, 3.4, 3.5, 3.7, 3.8 y 3.10.
- No ambigüedad: cumple. Los componentes simulados y configurables están claramente delimitados.
- Verificabilidad: cumple. Los criterios de aceptación cubren los datos de prueba y las vigencias.
- Trazabilidad: cumple. Todos los elementos derivan de la necesidad y del contexto.
- No invención: cumple. No se inventaron reglas ajenas al contexto ni a la necesidad descrita.
- Delimitación: cumple. Se excluyen expresamente la integración real y las mediciones SUS.

## Siguiente paso
Respondan las preguntas abiertas y ejecuten de nuevo el agente con --continuar SPEC-008.
