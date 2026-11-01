<!--
Agente: Specification Agent
Proveedor: gemini
Modelo: gemini-3.5-flash-lite
Fecha: 2026-10-29 17:54
Petición: Carga de documentos y prevalidación. Con la autorización de datos de salud, el usuario carga las fórmulas y la historia clínica en foto o PDF por la web o por Telegram. Una solicitud admite varias fórmulas del mismo paciente y de los documentos se obtienen los medicamentos de cada fórmula y el diagnóstico. La prevalidación verifica en orden: afiliación activa una vez por solicitud; vigencia de cada fórmula con el dato de la EPS simulada; cobertura PBS de cada medicamento; autorización de cada medicamento en la EPS simulada; y, solo para fórmulas crónicas, que la fecha habilitada de la próxima entrega sea igual o anterior a la fecha de la cita posible. Cada fórmula es todo o nada; si un medicamento falla, la fórmula completa queda no apta, y las fórmulas separadas son independientes. El tratamiento se clasifica como agudo o crónico según un catálogo configurable de diagnósticos crónicos. Se muestra el resultado preliminar por fórmula con motivo y siguiente paso, y se indica que la validación oficial ocurre en el punto. Si no hay ninguna fórmula apta, termina el flujo digital. EPIC-003.
-->

# Preguntas de aclaración

- OPEN-Q-001. Cuando un documento es ilegible, incompleto, no trae diagnóstico o no coincide con la EPS simulada, el contexto 3.4 indica que se pide cargarlo de nuevo y, si el problema persiste, la fórmula queda no apta y se orienta a la atención presencial. ¿Cuál es el número exacto de intentos permitidos para volver a cargar el documento antes de declarar la fórmula no apta?
  Por qué importa: define el flujo alternativo y el criterio de aceptación para documentos ilegibles o incompletos.
  Crítica: sí
  Propuesta del agente: permitir hasta tres intentos de carga por documento antes de marcar la fórmula como no apta.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-002. Si una solicitud incluye varias fórmulas y una de ellas queda no apta por un documento ilegible después de agotar los intentos, ¿las demás fórmulas aptas pueden continuar con el agendamiento o se detiene la solicitud completa?
  Por qué importa: el contexto 3.4 señala que las fórmulas separadas son independientes, pero es necesario confirmar si un error de carga en un documento bloquea toda la solicitud o solo la fórmula afectada.
  Crítica: sí
  Propuesta del agente: las fórmulas separadas son independientes; las fórmulas aptas continúan su proceso mientras la fórmula con el documento no apto se detiene y orienta a la atención presencial.
  Estado: Pendiente
  Responsable: equipo
- OPEN-Q-003. ¿Qué canales específicos (web, Telegram o ambos) deben mostrar la interfaz para cargar fotos o archivos PDF de fórmulas y la historia clínica?
  Por qué importa: define la cobertura de los canales para los requisitos funcionales de carga de documentos.
  Crítica: no
  Propuesta del agente: la carga de documentos debe estar disponible tanto en la aplicación web como en el bot de Telegram, conforme al contexto 3.1.
  Estado: Pendiente
  Responsable: equipo
