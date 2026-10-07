# Pharma Express

Sistema multicanal de **pre-dispensación farmacéutica**. El paciente conoce, antes de desplazarse, si sus fórmulas son válidas y si sus medicamentos están disponibles. Solo recibe una cita cuando sus medicamentos ya están reservados.

## El problema

En los puntos de dispensación, las validaciones necesarias para entregar un medicamento (afiliación, vigencia de la fórmula, cobertura PBS, autorización y disponibilidad) se hacen cuando el paciente ya está en la ventanilla. Por eso, el paciente descubre las novedades tarde, después de desplazarse y esperar. En Manizales se han reportado esperas de 3 a 5 horas y cientos de usuarios con medicamentos pendientes.

Esto genera desplazamientos inútiles, congestión en los puntos, riesgo de interrumpir tratamientos crónicos y exclusión de quienes no usan tecnología.

## La propuesta

**Prevalidar y reservar antes de asignar la cita.** El paciente carga sus fórmulas, el sistema las prevalida, aparta los medicamentos y el cupo, y le asigna una ventana de una hora en el punto donde lo esperan sus medicamentos.

| | |
|---|---|
| **Lugar** | Puntos de dispensación del gestor farmacéutico Disfarma en Manizales, Caldas |
| **Población** | Afiliados de Salud Total y Sanitas, con prioridad para personas con tratamientos crónicos, adultos mayores y personas con barreras digitales |
| **Canales** | Aplicación web y bot de Telegram, ambos con el recorrido completo. La atención presencial sigue disponible fuera del sistema |

## Recorrido del paciente

1. **Acepta el tratamiento de datos.** Antes de pedir cualquier dato, el sistema muestra el aviso de privacidad. La autorización para datos de salud se pide aparte.
2. **Verifica su identidad** con la cédula y un código de un solo uso, que llega por SMS y por correo a los datos registrados en la EPS. El código dura 10 minutos y admite 3 intentos.
3. **Vincula su canal.** El chat de Telegram o el navegador queda asociado al paciente durante 3 meses. Un cuidador, tutor o facilitador comunitario puede gestionar a varios pacientes desde el mismo canal.
4. **Carga sus fórmulas y su historia clínica** en foto o PDF.
5. **Recibe la prevalidación**, que es preliminar y siempre por fórmula completa:
   1. Afiliación activa
   2. Vigencia de la fórmula
   3. Cobertura PBS de cada medicamento
   4. Autorización de cada medicamento
   5. Habilitación de entrega, solo para tratamientos crónicos
6. **Escoge su cita.** Los medicamentos y el cupo quedan reservados, nunca se supera la capacidad de una ventana y se asigna una cita por punto.
   - Tratamiento agudo: el mismo día (al menos una hora después) o el día siguiente.
   - Tratamiento crónico: solo el día siguiente.
7. **Recibe recordatorios** la noche anterior y una hora antes. En el recordatorio de una hora antes, el sistema vuelve a verificar afiliación, vigencia y autorizaciones.
8. **Recoge en el punto** con un código de entrega de un solo uso (QR y numérico). El dispensador registra la validación oficial y cierra cada medicamento como entregado o no entregado.

El paciente puede cancelar en cualquier momento. No hay reprogramación: para obtener otra cita inicia una nueva solicitud.

## Actores

| Actor | Rol |
|---|---|
| Paciente | Gestiona sus fórmulas por la web o por Telegram |
| Cuidador, tutor o facilitador | Actúa en nombre del paciente con el código que llega a los datos del paciente. El sistema no lo distingue del paciente |
| Dispensador | Personal del punto. Es el único actor con usuario y rol en el sistema |
| EPS simulada | Fuente de afiliación, contacto, vigencia, autorizaciones y habilitación de entregas crónicas |
| Inventario simulado | Existencias por medicamento y por punto |
| Telegram, SMS y correo | Servicios reales que solo transportan mensajes; no son fuente de identidad |

## Principios del producto

- **Cero sobre-reservas:** nunca existe una cita sin medicamentos reservados.
- **Privacidad por defecto:** ninguna notificación incluye nombres de medicamentos ni diagnósticos, y los enlaces al bot nunca llevan datos sensibles.
- **Resultado preliminar:** la prevalidación no reemplaza la validación oficial, que ocurre en el punto.
- **Sin trámites trasladados al usuario:** si falta una autorización, el sistema solo informa los puntos, enlaces o trámites de la EPS del paciente.
- **Inclusión:** la atención presencial sigue disponible para quien no use el sistema o no acepte el tratamiento de datos.

## Alcance

**Simulado:** EPS, inventario, puntos de dispensación (con nombres ficticios) y validación oficial.
**Real:** Telegram, envío de SMS y envío de correo. Las pruebas usan números y correos de los integrantes del equipo.

**Fuera de alcance:**

- Cita de continuidad, reprogramación y domicilio
- Pendientes y entregas parciales gestionadas por el sistema
- Trámite de autorizaciones y vigilancia automática del inventario o de las autorizaciones
- Registro de pacientes y actualización de sus datos (se hacen en la EPS)
- Aplicación móvil instalable y WhatsApp
- Integración real con EPS, MIPRES, ADRES o inventarios reales
- Facturación, prescripción o modificación de fórmulas
- Uso de datos reales de pacientes

El producto **no resuelve** el desabastecimiento, las autorizaciones, las deudas entre actores del sistema de salud ni el inventario real del gestor.

## Marco normativo

- **Ley 1581 de 2012 y Decreto 1377 de 2013:** los datos de salud son sensibles y requieren autorización explícita del titular.
- **Decreto Ley 019 de 2012, artículo 120:** prohíbe trasladar al usuario los trámites de autorización.
- **Decreto Ley 019 de 2012, artículo 131, y Resolución 1604 de 2013:** si la entrega queda incompleta, la EPS debe entregar lo faltante en máximo 48 horas. Esa es una obligación de la EPS. La espera de 48 horas que informa Pharma Express cuando no hay disponibilidad es un plazo propio para volver a validar.

## Glosario

| Término | Significado |
|---|---|
| Pre-dispensación | Prevalidación, reserva y cita antes del desplazamiento |
| Solicitud | Fórmulas y medicamentos de un paciente gestionados en una misma gestión |
| Fórmula | Prescripción con uno o más medicamentos. Es la unidad de validación: todo o nada |
| Prevalidación | Verificación preliminar; no sustituye la validación oficial |
| Ventana | Bloque de 1 hora en un punto, con capacidad limitada |
| Reserva | Existencias y cupo apartados para una cita |
| Código de entrega | Código de un solo uso, en QR y numérico, ligado a una cita |
| Vinculación | Asociación de un chat de Telegram o un navegador con un paciente después de verificar su identidad |
| PBS | Plan de Beneficios en Salud |
| MIPRES | Plataforma de prescripción de tecnologías no financiadas con la UPC |

## Equipo de Pharma Express
* **Juan Manuel** - [GitHub Juan Manuel](https://github.com/Manuel29296) 
* **Karen Moreno** - [GitHub Karen Moreno](https://github.com/NaghellyMoreno)
* **Camila Giraldo** - [GitHub Camila Giraldo](https://github.com/Camila-Giraldo) 
* **Ana Isabella Suarez** - [GitHub Isabella Suarez](https://github.com/aisc7) 

