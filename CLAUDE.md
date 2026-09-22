# CLAUDE.md — Proyecto Pharma Express

## 1. Qué es el proyecto
**Pharma Express** es un proyecto académico con enfoque en **experiencia de usuario (UX)**, contextualizado en **Colombia** y en particular en **Manizales, Caldas**. Busca reducir las largas esperas en los **puntos de dispensación de Disfarma**.

## 2. Problema
En los puntos de dispensación de Disfarma los usuarios esperan horas porque todas las validaciones se hacen **solo en ventanilla**, por parte del personal, y en **plataformas distintas según la EPS**:
- Afiliación a la EPS y estado del usuario (activo, suspendido, etc.).
- Vigencia y validez de la fórmula médica y de las autorizaciones.
- Cobertura dentro del PBS (Plan de Beneficios en Salud).
- Disponibilidad del medicamento.

El usuario **no conoce el resultado de estas validaciones antes de llegar**, por lo que puede hacer la fila y salir sin medicamento.

## 3. Solución propuesta
Un software de **pre-dispensación** compuesto por:
- **App** para que el usuario valide su caso, **agende con un día de anticipación** y **reserve sus medicamentos**.
- **Integración con WhatsApp** como canal principal de acceso.
- **Alternativa para personas que no usan celular o WhatsApp** (por edad o nivel de escolaridad), p. ej. canal asistido, llamada, punto de atención o acompañante/cuidador.

**Entregable:** un **prototipo funcional** de pre-dispensación con **sistemas externos simulados** (EPS, autorizaciones, inventario, etc.).

## 4. Restricciones clave (respetar siempre)
- **El equipo NO tiene acceso directo a Disfarma.** Todo se hace desde afuera: no asumir APIs, datos internos, entrevistas con directivos ni integraciones reales.
- Los sistemas externos (EPS, ADRES, inventarios, autorizaciones) se **simulan** con datos ficticios o mocks.
- **Nada de ideas inalcanzables**: proponer solo lo que un equipo estudiantil puede construir y demostrar en un semestre.
- No usar datos personales reales de pacientes.

## 5. Cómo sustentar la información
- Todo argumento sobre el problema debe apoyarse en **fuentes verificables**:
  - **Literatura blanca:** artículos científicos, estudios académicos, informes oficiales (Supersalud, Minsalud, Defensoría del Pueblo, DANE).
  - **Literatura gris:** quejas y reclamos, tutelas, derechos de petición, noticias de medios, informes de veedurías.
- Priorizar fuentes **recientes** y de **Colombia/Caldas/Manizales**.
- **Nunca inventar** cifras, citas, fallos ni referencias. Si algo no se puede verificar, decirlo explícitamente.
- Incluir enlace o referencia completa de cada fuente (preferiblemente en formato APA 7).

## 6. Estilo de respuesta
- Responder en **español**.
- Mantener el foco en la **experiencia del usuario**: usuarios reales (adultos mayores, pacientes crónicos, cuidadores, personas con baja alfabetización digital).
- Considerar el marco colombiano: EPS, PBS, régimen contributivo y subsidiado, Ley Estatutaria de Salud (Ley 1751 de 2015), protección de datos (Ley 1581 de 2012).
- Ser concreto y práctico; cuando se propongan funcionalidades, indicar cómo se simularían en el prototipo.

## 7. Qué evitar
- Soluciones que dependan exclusivamente del smartphone.
- Afirmaciones sin fuente sobre tiempos de espera, quejas o cifras.
- Alcances desproporcionados (hardware costoso, IA compleja sin necesidad, despliegues masivos).