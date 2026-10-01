# SPEC-001: Prevalidación de Solicitud y Disponibilidad

- **Versión:** v0.1
- **Estado:** Borrador
- **Fecha:** 2023-10-25 *(fecha estándar o actual)*
- **Autor (agente):** Specification Agent
- **Responsable humano de aprobación:** Equipo de Producto / Pharma Express

---

## 1. Objetivo

Permitir que el paciente conozca antes de desplazarse al punto de dispensación la validez preliminar de su solicitud y la disponibilidad de sus medicamentos a través de los canales digitales (aplicación web y bot de Telegram). `[CONFIRMADO]`

## 2. Contexto

- **Contexto del negocio:** En los puntos de dispensación tradicionales, las validaciones ocurren cuando el paciente ya está en la ventanilla, generando esperas de 3 a 5 horas y desplazamientos inútiles. Pharma Express busca evitar esto mediante la prevalidación anticipada y la reserva del medicamento antes de asignar la cita. `[CONFIRMADO]`
- **Documentos o decisiones previas relacionadas:** Sección 2.1, 2.2, 3.4 y 3.5 del Contexto Aprobado de Pharma Express. `[CONFIRMADO]`
- **Glosario relevante:**
  - **Pre-dispensación:** Gestión previa a la entrega: prevalidación, reserva y cita antes del desplazamiento. `[CONFIRMADO]`
  - **Solicitud:** Conjunto de fórmulas y medicamentos de un mismo paciente gestionados en una misma gestión. `[CONFIRMADO]`
  - **Fórmula:** Prescripción con uno o más medicamentos. Es la unidad de validación y es todo o nada. `[CONFIRMADO]`
  - **Prevalidación:** Verificación preliminar de afiliación, vigencia, cobertura PBS, autorización y, si la fórmula es crónica, habilitación de entrega. No sustituye la validación oficial. `[CONFIRMADO]`
  - **Reserva:** Existencias y cupo apartados para una cita. `[CONFIRMADO]`

## 3. Alcance

- **Incluido:**
  - Carga de fórmulas e historia clínica en foto o PDF por la web o Telegram. `[CONFIRMADO]`
  - Proceso ordenado de prevalidación (Afiliación, Vigencia de la fórmula, Cobertura PBS, Autorización y Habilitación de entrega para crónicos). `[CONFIRMADO]`
  - Verificación de disponibilidad de existencias y cupos en las ventanas de los puntos de dispensación. `[CONFIRMADO]`
  - Presentación de los resultados de la prevalidación como preliminares, advirtiendo que la validación oficial ocurre en el punto. `[CONFIRMADO]`
- **Excluido:** ver sección 14 (Fuera de alcance)

## 4. Actores

- **Paciente:** Afiliado que gestiona sus fórmulas por la web o por Telegram. Incluye a cuidadores, tutores o facilitadores comunitarios que operan en su nombre. `[CONFIRMADO]`
- **EPS simulada:** Fuente de afiliación, datos de contacto, vigencia de fórmulas, autorizaciones y habilitación de entregas crónicas. `[CONFIRMADO]`
- **Inventario simulado:** Fuente de existencias por medicamento y por punto. `[CONFIRMADO]`

## 5. Requisitos funcionales

- **RF-001** `[CONFIRMADO]`: El sistema debe permitir al paciente cargar sus fórmulas y su historia clínica en formato de foto o PDF mediante la aplicación web o el bot de Telegram.
- **RF-002** `[CONFIRMADO]`: El sistema debe ejecutar la prevalidación siguiendo estrictamente el orden: 1. Afiliación activa, 2. Vigencia de la fórmula, 3. Cobertura PBS de cada medicamento, 4. Autorización de cada medicamento, y 5. Habilitación de entrega (solo para fórmulas crónicas).
- **RF-003** `[CONFIRMADO]`: El sistema debe verificar la disponibilidad de los medicamentos en el inventario simulado y la existencia de ventanas con cupo en los puntos de dispensación.
- **RF-004** `[CONFIRMADO]`: El sistema debe presentar todos los resultados de la prevalidación acompañados del aviso explícito de que se trata de un resultado preliminar y que la validación oficial ocurre en el punto.

## 6. Requisitos no funcionales

- **RNF-001** `[PENDIENTE]`: [Operación] debe [condición de calidad medible] bajo [condiciones de carga o contexto].
  - Estado: `OPEN-Q-001`

## 7. Reglas de negocio

- **BR-001** `[CONFIRMADO]`: Si de un documento no se obtienen los datos (ilegible, incompleto, sin diagnóstico o sin coincidencia con la EPS simulada), se pide cargarlo de nuevo; si el problema persiste, la fórmula queda no apta y se orienta a la atención presencial.
- **BR-002** `[CONFIRMADO]`: Cada fórmula es todo o nada: si un medicamento no cumple, toda la fórmula queda no apta. Las fórmulas separadas son independientes.
- **BR-003** `[CONFIRMADO]`: La prevalidación de afiliación se verifica una vez por solicitud. Si la afiliación está inactiva, se detiene toda la solicitud y se orienta hacia la EPS.
- **BR-004** `[CONFIRMADO]`: Si falta la autorización de un medicamento consultada en la EPS simulada, el sistema solo muestra los puntos, enlaces o trámites de autorización de la EPS del paciente, sin tramitar autorizaciones ni vigilar su estado.

### 7.1. Estados y transiciones (si aplica)

- **Estados posibles:** Documento Cargado → Prevalidación en Proceso → [Apta / No Apta]
- **Estados terminales:** Fórmula Apta (lista para agendamiento), Fórmula No Apta (orientada a EPS/presencial).
- **Transiciones:**
  - Documento Cargado → Prevalidación en Proceso
    - Actor que la provoca: Paciente / Sistema
    - Condiciones: Carga exitosa de documentos legibles y vinculación activa.

## 8. Flujos principales

- **FP-001: Consulta de validez preliminar y disponibilidad**
  - Actor: Paciente
  - Precondiciones: Identidad verificada, canal vinculado y consentimiento de datos aceptado.
  - Pasos:
    1. El paciente carga las fórmulas e historia clínica por la web o Telegram.
    2. El sistema evalúa la legibilidad y los datos frente a la EPS simulada.
    3. El sistema ejecuta secuencialmente la prevalidación (Afiliación, Vigencia, Cobertura PBS, Autorización y Habilitación de entrega).
    4. El sistema consulta el inventario simulado para verificar la disponibilidad de los medicamentos.
    5. El sistema muestra el resultado preliminar de la validez de la solicitud y la disponibilidad de los medicamentos junto con las opciones de agendamiento si aplica.
  - Resultado esperado: El paciente conoce la validez preliminar y disponibilidad antes de desplazarse.

## 9. Flujos alternativos y excepciones

- **FA-001 (alternativa - Documento ilegible):** Si el documento no es legible o está incompleto → El sistema solicita cargarlo nuevamente. Si el problema persiste, la fórmula se marca como no apta y se orienta a la atención presencial. `[CONFIRMADO]`
- **FE-001 (excepción - Afiliación inactiva):** Si la afiliación está inactiva → El sistema detiene toda la solicitud y orienta al paciente hacia la EPS. `[CONFIRMADO]`
- **FE-002 (excepción - Medicamento no apto):** Si un medicamento de la fórmula no cumple con los criterios → Toda la fórmula queda no apta (regla de todo o nada). `[CONFIRMADO]`

## 10. Casos límite

- **CL-001:** Fórmulas con medicamentos mixtos (agudos y crónicos dentro de la misma solicitud).
  - ¿Requiere especificación explícita? Sí `[CONFIRMADO]`
  - Comportamiento esperado: Cada fórmula se evalúa según su tipo; las crónicas exigen además la validación de la fecha habilitada de entrega. `[CONFIRMADO]`

## 11. Criterios de aceptación

- **AC-001** (cubre RF-001 / BR-001)
  - **Dado** que el paciente se encuentra vinculado en la web o Telegram
  - **Cuando** carga la foto o PDF de su fórmula e historia clínica
  - **Entonces** el sistema procesa el documento y, si es ilegible o incompleto, solicita una nueva carga.
- **AC-002** (cubre RF-002 / BR-003)
  - **Dado** que se ha iniciado una solicitud con documentos legibles
  - **Cuando** el sistema ejecuta la prevalidación
  - **Entonces** verifica primero la afiliación activa y detiene el proceso orientando a la EPS si esta se encuentra inactiva.
- **AC-003** (cubre RF-003 / RF-004)
  - **Dado** que la prevalidación de la fórmula es exitosa
  - **Cuando** el sistema verifica el inventario simulado
  - **Entonces** muestra la disponibilidad de los medicamentos y la validez preliminar con el aviso de que la validación oficial ocurre en el punto.

## 12. Dependencias

- Módulo de Identidad y Consentimiento (para la vinculación previa del canal). `[CONFIRMADO]`
- Servicios simulados de la EPS e Inventario. `[CONFIRMADO]`

## 13. Restricciones

- Los datos de salud son sensibles y requieren autorización explícita del titular (Ley 1581 de 2012 y Decreto 1377 de 2013). `[CONFIRMADO]`
- El sistema no realiza validación oficial ni sustituye los procesos presenciales obligatorios del punto de dispensación. `[CONFIRMADO]`

## 14. Fuera de alcance

- Validación oficial en el punto (ocurre exclusivamente por el dispensador). `[CONFIRMADO]`
- Trámite de autorizaciones o vigilancia de su estado por parte del sistema. `[CONFIRMADO]`
- Modificación o prescripción de fórmulas. `[CONFIRMADO]`
- Integración real con sistemas de la EPS o inventarios reales. `[CONFIRMADO]`

## 15. Preguntas abiertas

- **OPEN-Q-001:** ¿Cuáles serán los tiempos máximos de respuesta esperados para el procesamiento de archivos cargados (foto/PDF) en los canales digitales?
  - Estado: Pendiente
  - Responsable: Equipo Técnico / Arquitectura
  - Impacto si no se responde: Imposibilidad de medir el RNF de desempeño de carga.
  - Respuesta: —

## 16. Trazabilidad

- **REQ-001** → SPEC-001 → RF-001 / BR-001 → AC-001
- **REQ-002** → SPEC-001 → RF-002 / BR-002 / BR-003 → AC-002
- **REQ-003** → SPEC-001 → RF-003 / RF-004 → AC-003

## 17. Historial de cambios

- **v0.1** (2023-10-25): Borrador inicial generado por el Specification Agent basado en el Contexto Aprobado.

---

## Control de aprobación

- [ ] Objetivo y alcance revisados
- [ ] Reglas de negocio aprobadas
- [ ] Criterios de aceptación críticos aprobados
- [ ] Restricciones con impacto contractual, económico, legal, de seguridad o de UX aprobadas
- [ ] Sin preguntas abiertas críticas
- **Aprobado por:** [Pendiente]
- **Fecha de aprobación:** [Pendiente]
- **Estado final:** Borrador