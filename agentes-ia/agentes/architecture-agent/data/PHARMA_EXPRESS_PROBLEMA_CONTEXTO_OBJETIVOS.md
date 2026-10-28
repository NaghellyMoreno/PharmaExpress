# Pharma Express - Problema, contexto y objetivos

Versión: 1
Estado: Aprobado
Equipo: Karen, Isabella, Juan Manuel y Camila
Fuentes: PHARMA_EXPRESS_CONTEXTO.md y PHARMA_EXPRESS_SPEC.md versión 1

# 1. Problema

## 1.1. Problema central

En los puntos de dispensación de medicamentos de Manizales, buena parte de las validaciones necesarias para entregar un medicamento ocurre cuando el paciente ya está en la ventanilla. Esas validaciones son:

- la afiliación y el estado del usuario en la EPS;
- la vigencia y validez de la fórmula;
- las autorizaciones;
- la cobertura en el Plan de Beneficios en Salud (PBS);
- la disponibilidad del medicamento.

El personal consulta plataformas distintas según la EPS y el gestor farmacéutico. Como el paciente no conoce esos resultados con anticipación, puede descubrir después de una espera prolongada que su solicitud tiene una novedad, que falta una autorización o que el medicamento no está disponible.

## 1.2. Causa que aborda el proyecto

La causa de interés es el momento y el lugar de la validación. Las verificaciones se hacen de forma fragmentada y tardía, en la ventanilla, y no antes de que el paciente se desplace. Por eso la condición de dispensabilidad se conoce tarde. Si una fórmula no cumple la vigencia o tiene otra novedad, la persona puede necesitar una nueva valoración o un trámite adicional después de haber invertido tiempo y dinero en el desplazamiento.

## 1.3. Consecuencias

- Pérdida de tiempo y de recursos por desplazamientos improductivos.
- Esperas prolongadas y congestión en los puntos.
- Descubrimiento tardío de fórmulas inválidas, autorizaciones pendientes o falta de disponibilidad.
- Riesgo de discontinuidad en los tratamientos, en especial para quienes reclaman medicamentos de forma recurrente.
- Exclusión digital, si la solución dependiera únicamente de una aplicación.

## 1.4. Evidencia

- Colombia, 2024 a 2025: las tutelas en salud pasaron de más de 265.000 en 2024 a cerca de 312.500 en 2025, un aumento cercano al 17,92 %. Entre el 36 % y el 37 % se relacionarían con entrega tardía o incompleta de medicamentos e insumos. Fuente: Defensoría del Pueblo, 23 de abril de 2026.
- Colombia, 2025: la Superintendencia Nacional de Salud habría recibido 2.048.435 quejas. El principal motivo fue la negación de entrega de tecnologías o servicios ya autorizados, con 374.393 casos. Fuente: referencia sectorial compilada por el equipo.
- Manizales, enero de 2025: una mesa de trabajo reportó cerca de 74.000 medicamentos pendientes en los dispensarios de la ciudad y esperas de 3 a 4 horas. Fuente: Defensoría del Pueblo, 29 de enero de 2025.
- Manizales, noviembre de 2025: una inspección en la sede de la calle 62 encontró 1.210 pendientes, medicamentos en estanterías que no llegaron a los pacientes y filas de 4 a 5 horas. Fuente: La Patria, 18 de noviembre de 2025.
- Manizales, junio de 2026: en la sede Centro se reportaron esperas superiores a 3 y 4 horas, caída del sistema, negación de productos que estaban en el dispensario y 689 usuarios con medicamentos pendientes. Fuente: Secretaría de Salud de Manizales, 12 de junio de 2026.

Las cifras se conservan como las documentó el equipo. Antes de una entrega académica final deben contrastarse con cada fuente.

## 1.5. Brecha frente a las soluciones existentes

Otros gestores farmacéuticos ya ofrecen mecanismos de turno o agenda:

- Colsubsidio permite elegir fecha y lugar y recibir confirmación.
- Cafam ofrece preagendamiento adjuntando la autorización o la orden médica vigente.
- Audifarma ofrece turno virtual para avanzar en la espera.

Estos mecanismos agendan, pero no garantizan que el usuario conozca antes de desplazarse el resultado preliminar de las validaciones, ni que el medicamento esté reservado para su cita.

## 1.6. Lo que el problema no incluye

El problema convive con otras causas de demora: conectividad, disponibilidad de personal, gestión de inventario, deudas entre actores del sistema de salud y desabastecimiento de medicamentos. Esas causas existen, pero no son el objeto de Pharma Express. El foco es la falta de información anticipada y la validación tardía en la ventanilla.

## 1.7. Pregunta problema

¿Cómo puede un sistema multicanal de pre-dispensación permitir a los usuarios de puntos de dispensación en Manizales conocer, antes de desplazarse, la validez preliminar de su solicitud y la disponibilidad de sus medicamentos, de forma accesible también para personas con barreras de uso de tecnología?

# 2. Contexto

## 2.1. Contexto académico

Pharma Express es el Proyecto 1 de la asignatura Ingeniería de Software End-to-End. Lo desarrolla un equipo de cuatro personas en aproximadamente ocho semanas. El principio de trabajo es que la inteligencia artificial propone, una persona del equipo decide y el equipo valida. El resultado debe poder demostrarse con evidencia y con validación humana.

## 2.2. Contexto geográfico e institucional

- Lugar: Manizales, Caldas.
- Gestor farmacéutico: Disfarma, que opera los puntos de dispensación.
- EPS de referencia: Salud Total y Sanitas.
- El equipo trabaja desde afuera y no tiene acceso a los sistemas ni a la información interna de Disfarma. Por eso, la EPS, el inventario y la validación oficial se simulan en el prototipo.

## 2.3. Población

- Afiliados de Salud Total y Sanitas atendidos por Disfarma en Manizales.
- Se prioriza a personas con tratamientos crónicos, adultos mayores y personas con barreras digitales.
- Manizales tiene cerca de 90.000 personas mayores, alrededor del 20 % de su población, con una proyección del 24 % para 2030. Fuente: Fundación Luker, 2024.
- En Colombia, más de 2,8 millones de adultos mayores tienen dificultades para hacer trámites digitales, y cerca de 1,8 millones viven en hogares con pobreza digital. Fuente: Yahoo Noticias, 2026. Esto justifica mantener apoyo de cuidadores y facilitadores y la atención presencial.
- El proyecto aún no ha documentado una cifra de uso de Telegram en la población objetivo.

## 2.4. Contexto del ecosistema de salud

- La interoperabilidad del ciclo de dispensación en Colombia está en construcción.
- Los medicamentos financiados con la Unidad de Pago por Capitación (UPC) están en transición hacia el Resumen Digital de Atención (RDA).
- MIPRES se mantiene para las tecnologías no financiadas con la UPC.
- Se anticipa una obligación futura de reportar las transacciones de dispensación en tiempo real.

## 2.5. Contexto normativo

- Ley 1581 de 2012 y Decreto 1377 de 2013: protección de datos personales. Los datos de salud son datos sensibles y requieren autorización explícita del titular.
- Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013: las EPS deben entregar los medicamentos de forma completa e inmediata. Si la entrega queda incompleta, deben entregar lo faltante en máximo 48 horas, en el lugar de residencia o trabajo del afiliado si este lo autoriza. Es una obligación de la EPS y de su red.
- Decreto Ley 019 de 2012, artículo 120: prohíbe trasladar al usuario trámites para obtener autorizaciones.
- La vigencia de las fórmulas la determina la EPS según la normativa vigente. No se usa como verdad la regla histórica de 30 días.
- WCAG 2.1 nivel AA y la Resolución 1519 de 2020 de MinTIC: referencias voluntarias de accesibilidad.

## 2.6. Producto propuesto

Pharma Express es un sistema multicanal de pre-dispensación farmacéutica:

- Canales: una aplicación web y un bot de Telegram. La atención presencial sigue disponible.
- Qué hace: permite al paciente, o a quien lo apoya, conocer antes de desplazarse la validez preliminar de sus fórmulas y la disponibilidad de sus medicamentos.
- Cuándo hay cita: solo cuando los medicamentos quedan reservados.
- Diferenciador: la prevalidación anticipada más la reserva del medicamento antes de asignar la cita.
- Entregable: un prototipo funcional con sistemas externos simulados.
- Qué no promete: resolver el abastecimiento ni las autorizaciones. Busca reducir la incertidumbre y el costo de enterarse tarde.

# 3. Objetivos

## 3.1. Objetivo general

Diseñar, desarrollar y evaluar, con sistemas externos simulados, un prototipo funcional de pre-dispensación farmacéutica que opere por aplicación web y por Telegram, con apoyo de cuidadores y facilitadores comunitarios. El prototipo debe permitir al paciente conocer antes de desplazarse la validez preliminar de sus fórmulas y la disponibilidad de sus medicamentos, y recibir una cita solo cuando los medicamentos estén reservados. El propósito es reducir el tiempo de espera y los desplazamientos innecesarios frente a una línea base del proceso presencial en Manizales.

## 3.2. Objetivos específicos

1. Caracterizar el proceso de dispensación desde la perspectiva del usuario y construir una línea base externa con tiempos de permanencia y causas de espera o rechazo. La línea base se construirá con observación no participante fuera de los puntos, encuesta de salida, condiciones publicadas por las EPS, informes de entes de control y respuestas a derechos de petición.
2. Definir y verificar, con casos de prueba documentados, las reglas de prevalidación de afiliación, vigencia de la fórmula, cobertura PBS, autorización y habilitación de entrega para tratamientos crónicos, sobre datos simulados. La prevalidación será preliminar y no sustituirá la validación oficial.
3. Implementar inventario por punto, reserva temporal y agenda por ventanas de una hora. Solo debe existir cita con medicamento reservado, sin sobre-reservas, respetando la capacidad y liberando las reservas al cancelar o expirar.
4. Cuando no haya disponibilidad, informar al usuario que debe esperar 48 horas para volver a validar y enviarle un recordatorio único en ese momento.
5. Implementar Telegram mediante un bot conectado a la Bot API oficial, con consentimiento, verificación de identidad independiente del perfil de Telegram y minimización de datos sensibles. El bot solo se comunicará con el usuario después de que este inicie la interacción.
6. Permitir que cuidadores, tutores y facilitadores comunitarios gestionen en nombre del paciente, incluso desde dispositivos compartidos, con una ruta alterna cuando la identidad no pueda verificarse. La atención presencial seguirá disponible.
7. Permitir al personal dispensador validar el código de entrega, registrar la validación oficial y cerrar la entrega de cada medicamento, con trazabilidad.
8. Incorporar la protección de datos personales y sensibles desde el diseño, y los criterios de accesibilidad WCAG 2.1 nivel AA como referencia voluntaria.
9. Evaluar el prototipo frente a la línea base mediante:
   - tiempo estimado de espera;
   - desplazamientos evitados;
   - porcentaje de novedades detectadas antes del desplazamiento;
   - tasa de éxito por tarea;
   - cero sobre-reservas en pruebas de concurrencia;
   - resolución correcta de los escenarios de cuidador, facilitador, dispositivo compartido y cambio del medio de contacto.

# 4. Fuentes

- Defensoría del Pueblo. (2025, 29 de enero). Mesa de trabajo en Manizales para garantizar entrega oportuna de medicamentos a afiliados de EPS Sanitas. https://www.defensoria.gov.co/-/defensor%C3%ADa-lidera-mesa-de-trabajo-en-manizales-para-garantizar-entrega-oportuna-de-medicamentos-a-afiliados-de-eps-sanitas
- Defensoría del Pueblo. (2026, 23 de abril). Tutelas para invocar la protección del derecho a la salud tuvieron un aumento cercano al 18 %. https://www.defensoria.gov.co/web/guest/-/tutelas-para-invocar-la-proteccion-del-derecho-a-la-salud
- Secretaría de Salud de Manizales. (2026, 12 de junio). Seguimiento a entrega de medicamentos de las EPS. https://centrodeinformacion.manizales.gov.co/secretaria-de-salud-de-manizales-mantiene-seguimiento-a-entrega-de-medicamentos-de-las-eps-por-una-atencion-digna-y-oportuna/
- Rojas, E. R. (2025, 18 de noviembre). Disfarma bajo la lupa. La Patria. https://www.lapatria.com/salud/disfarma-bajo-la-lupa-usuarios-sufren-largas-filas-y-problemas-en-el-servicio-de-medicamentos
- Rojas, E. R. (2026, 10 de junio). Crisis en Disfarma. La Patria. https://www.lapatria.com/salud/crisis-en-disfarma-usuarios-de-esta-eps-enfrentan-largas-filas-y-falta-de-medicamentos-en
- Fundación Luker. (2024). Economía plateada. https://fundacionluker.org.co/wp-content/uploads/2024/04/desarrollo-02-economia-plateada-buenas-practicas-funluker.pdf
- Adultos mayores y brecha digital. (2026, 24 de febrero). Yahoo Noticias. https://es-us.noticias.yahoo.com/adultos-mayores-brecha-digital-gu%C3%ADa-224825871.html
- Audifarma. (s.f.). Solicita tu turno virtual y ahorra tiempo. https://audifarma.com.co/blog/audifarma-a-tu-lado/solicita-tu-turno-virtual-y-ahorra-tiempo
- Ley Estatutaria 1581 de 2012. https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981
- Decreto 1377 de 2013. https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646
- Ministerio de Salud y Protección Social. (2013). Resolución 1604 de 2013.
- RDA de dispensación de medicamentos en Colombia. (2026, 20 de mayo). Consultorsalud. https://consultorsalud.com/rda-de-dispensacion-de-medicamentos-en-colombia/
- World Wide Web Consortium. (2018). WCAG 2.1. https://www.w3.org/TR/WCAG21/
