# Pharma Express - Flujos del producto

Versión: 1
Estado: Aprobado
Documento complementario de PHARMA_EXPRESS_SPEC.md. Si hay diferencias, prevalece la especificación.

## Resumen

Pharma Express permite que el paciente, o quien lo apoya, verifique antes de ir al punto si sus fórmulas cumplen los requisitos y si los medicamentos están disponibles. Solo entrega una cita cuando los medicamentos quedan reservados.

- Canales: aplicación web y bot de Telegram, ambos con el flujo completo. La atención presencial sigue disponible.
- Identidad: cédula y código enviado por SMS al celular registrado en la EPS y, si existe, al correo. No hay cuentas de pacientes.
- Canal asistido: un cuidador, tutor o facilitador usa la web o Telegram con el código del paciente.
- Prevalidación: por fórmula, en este orden: afiliación, vigencia, PBS, autorización y, si es crónica, habilitación de entrega. Cada fórmula es todo o nada.
- Agenda: ventanas de 1 hora. Agudo: hoy o mañana. Crónico: solo mañana.
- Recordatorios: la noche anterior (19:00 a 21:00) y una hora antes, con una nueva prevalidación.
- En el punto: el dispensador valida el código y cierra cada medicamento. Las novedades se gestionan con Disfarma.
- Fuera de alcance: cita de continuidad, pendientes, entrega parcial, reprogramación, reporte de concordancia, SUS y domicilio.

## 1. Flujo general

```mermaid
flowchart TD
    A["Inicio en web o Telegram"] --> B["Aviso de privacidad"]
    B --> C{"¿Acepta el tratamiento de datos?"}
    C -- No --> P["Atención presencial, sin registro"]
    C -- Sí --> D["Ingresa cédula y código"]
    D --> E{"¿Identidad verificada?"}
    E -- No --> R["Ruta alterna: nuevo código, orientación EPS o presencial"]
    R --> D
    E -- Sí --> F["Escoge paciente si hay varios vinculados"]
    F --> G{"¿Autoriza datos de salud?"}
    G -- No --> P
    G -- Sí --> H["Carga fórmulas e historia clínica"]
    H --> I["Prevalidación por fórmula"]
    I --> J{"¿Hay fórmulas aptas?"}
    J -- No --> K["Fin del flujo digital con motivos y siguiente paso"]
    J -- Sí --> L{"¿Hay existencias en algún punto?"}
    L -- No --> M["Esperar 48 horas y recordatorio único"]
    L -- Sí --> N["Escoge punto y ventana"]
    N --> O["Confirmación atómica, reserva y código"]
    O --> Q["Recordatorios y nueva prevalidación una hora antes"]
    Q --> S["Atención en el punto y cierre por medicamento"]
    S --> T{"¿Fórmula crónica entregada?"}
    T -- Sí --> U["Aviso 2 días antes de la próxima entrega"]
    T -- No --> V["Fin"]
```

## 2. Consentimiento e identidad

```mermaid
flowchart TD
    A["Aviso de privacidad"] --> B["Declaración: soy el titular o actúo con su autorización"]
    B --> C{"¿Acepta?"}
    C -- No --> P["Atención presencial, sin registro"]
    C -- Sí --> D["Registrar titular o tercero, fecha y canal"]
    D --> E["Ingresar cédula"]
    E --> F{"¿Existe en la EPS simulada y tiene celular o correo?"}
    F -- No --> G["Orientar hacia la EPS y atención presencial"]
    F -- Sí --> H["Enviar código por SMS y por correo si existe"]
    H --> I["Ingresar código"]
    I --> J{"¿Correcto, antes de 10 minutos y en máximo 3 intentos?"}
    J -- Sí --> K["Identidad verificada y canal vinculado"]
    J -- No --> L["Ruta alterna: nuevo código, orientación EPS o presencial"]
    L --> E
    K --> M{"¿Autoriza datos de salud?"}
    M -- No --> P
    M -- Sí --> N["Continuar a carga de documentos"]
```

## 3. Prevalidación por fórmula

```mermaid
flowchart TD
    A["Documentos cargados"] --> B{"¿Se obtienen los datos del documento?"}
    B -- No --> B2["Pedir cargar de nuevo; si persiste, fórmula no apta y orientar a presencial"]
    B -- Sí --> C{"¿Afiliación activa?"}
    C -- No --> X["Se detiene toda la solicitud y se orienta hacia la EPS"]
    C -- Sí --> D{"¿Fórmula vigente?"}
    D -- No --> N1["No apta: requiere nueva valoración médica"]
    D -- Sí --> E{"¿Todos los medicamentos PBS o autorizados?"}
    E -- No --> N2["No apta: mostrar puntos, enlaces o trámites de la EPS"]
    E -- Sí --> F{"¿Diagnóstico en catálogo de crónicos?"}
    F -- No --> G["Fórmula aguda: apta"]
    F -- Sí --> H{"¿Fecha habilitada de entrega igual o anterior a mañana?"}
    H -- No --> N3["No apta: informar fecha habilitada"]
    H -- Sí --> I["Fórmula crónica: apta"]
    G --> J["Resultado preliminar por fórmula"]
    I --> J
    N1 --> J
    N2 --> J
    N3 --> J
    J --> K{"¿Al menos una fórmula apta?"}
    K -- Sí --> L["Continuar a disponibilidad solo con las aptas"]
    K -- No --> M["Fin del flujo digital con motivos"]
```

## 4. Disponibilidad, reserva y agenda

```mermaid
flowchart TD
    A["Fórmulas aptas"] --> B{"¿Cada medicamento tiene existencias en algún punto?"}
    B -- No --> C["Esa fórmula no se agenda: esperar 48 horas y recordatorio único"]
    B -- Sí --> D{"¿Todos en el mismo punto?"}
    D -- Sí --> E["Una cita"]
    D -- No --> F["Una cita por cada punto"]
    E --> G{"¿La cita incluye un crónico?"}
    F --> G
    G -- Sí --> H["Solo ventanas de mañana"]
    G -- No --> I["Ventanas de hoy, desde una hora después, o de mañana"]
    H --> J{"¿Hay ventanas con cupo?"}
    I --> J
    J -- No --> C
    J -- Sí --> K["Escoger ventana en cada punto"]
    K --> L["Confirmar"]
    L --> M{"¿Existencias y cupo siguen libres para todas las citas de la fórmula?"}
    M -- No --> N["Informar y mostrar opciones actualizadas"]
    N --> K
    M -- Sí --> O["Reservar, emitir código QR y numérico por cita y notificar"]
```

Cancelación y expiración:

```mermaid
flowchart TD
    A["Cita cancelada o ventana terminada sin código validado"] --> B["Anular código y liberar existencias y cupo"]
    B --> C{"¿Ya se entregó otro medicamento de la misma fórmula?"}
    C -- Sí --> D["Medicamento perdido; fórmula cerrada; notificar"]
    C -- No --> E["Fórmula liberada; puede iniciar una nueva solicitud"]
```

## 5. Recordatorios y notificaciones

```mermaid
flowchart TD
    A["Cita confirmada"] --> B["Confirmación por todos los medios"]
    B --> C{"¿Cita de mañana agendada antes de las 21:00?"}
    C -- Sí --> D["Recordatorio entre 19:00 y 21:00 del día anterior"]
    C -- No --> E["Sin recordatorio nocturno"]
    D --> F["Una hora antes: nueva prevalidación"]
    E --> F
    F --> G{"¿Cambió afiliación, vigencia o autorización?"}
    G -- No --> H["Recordatorio: informa y ofrece cancelar"]
    G -- Sí --> I["Cancelar cita, liberar, fórmula no apta y notificar motivo y siguiente paso"]
```

Medios de notificación: notificación de la web si hay navegador vinculado, Telegram si hay chat vinculado, SMS al celular registrado y correo si existe. Ninguna notificación incluye medicamentos ni diagnósticos.

Otros avisos:

- Sin disponibilidad: un recordatorio único a las 48 horas para volver a validar.
- Crónico entregado: aviso 2 días antes de la siguiente fecha habilitada.
- El sistema no avisa cuando llega un medicamento ni cuando la EPS autoriza.

## 6. Atención en el punto

```mermaid
flowchart TD
    A["Paciente presenta código QR o numérico"] --> B["Dispensador autenticado lo valida"]
    B --> C{"¿Código de este punto, sin usar ni anular?"}
    C -- No --> D["Rechazar e informar el motivo"]
    C -- Sí --> E{"¿Hora actual dentro de la ventana?"}
    E -- Antes --> F["Esperar el inicio de la ventana"]
    E -- Después --> G["Cita expirada: atención presencial o nueva solicitud"]
    E -- Dentro --> H["Registrar llegada y mostrar prevalidación preliminar"]
    H --> I["Validación oficial"]
    I --> J["Cerrar cada medicamento: entregado o no entregado con motivo"]
    J --> K{"¿Algún medicamento no entregado?"}
    K -- Sí --> L["Indicar que la gestión corresponde a Disfarma"]
    K -- No --> M["Código usado y cita cerrada"]
    L --> M
    M --> N{"¿Fórmula crónica entregada?"}
    N -- Sí --> O["Programar aviso de próxima entrega"]
    N -- No --> P["Fin"]
```

Motivos de no entrega: afiliación inactiva; fórmula vencida o inválida; autorización no vigente; medicamento no cubierto; datos del paciente no coinciden; sin existencias pese a reserva; otro, con descripción.

## 7. Canal asistido y vinculación de canales

```mermaid
flowchart TD
    A["Cuidador o facilitador abre web o Telegram"] --> B["Acepta como tercero"]
    B --> C["Ingresa la cédula del paciente"]
    C --> D["El código llega al celular o correo del paciente o de su tutor"]
    D --> E["Ingresa el código"]
    E --> F["Canal vinculado al paciente"]
    F --> G{"¿Agregar otro paciente?"}
    G -- Sí --> C
    G -- No --> H["Escoger paciente antes de cada gestión"]
    H --> I{"¿Vinculación con más de 3 meses?"}
    I -- Sí --> J["Pedir un nuevo código"]
    J --> E
    I -- No --> K["Gestionar normalmente"]
```

## 8. Estados

Fórmula:

```mermaid
stateDiagram-v2
    [*] --> Cargada
    Cargada --> Apta: prevalidación correcta
    Cargada --> NoApta: falla una verificación
    Apta --> SinDisponibilidad: sin existencias
    Apta --> Agendada: usuario confirma
    Agendada --> NoApta: cambio de estado una hora antes
    Agendada --> Entregada: todo entregado
    Agendada --> CerradaConNoEntregados: no entregado en el punto o perdido
    Agendada --> Liberada: cancelada o expirada sin entregas
    NoApta --> [*]
    SinDisponibilidad --> [*]
    Entregada --> [*]
    CerradaConNoEntregados --> [*]
    Liberada --> [*]
    state "No apta" as NoApta
    state "Sin disponibilidad" as SinDisponibilidad
    state "Cerrada con medicamentos no entregados" as CerradaConNoEntregados
```

Cita:

```mermaid
stateDiagram-v2
    [*] --> Reservada
    Reservada --> Cumplida: dispensador valida el código
    Cumplida --> Cerrada: cierre por medicamento
    Reservada --> Cancelada: usuario, revocación o cambio de estado
    Reservada --> Expirada: termina la ventana
    Cerrada --> [*]
    Cancelada --> [*]
    Expirada --> [*]
```

Vinculación de canal:

```mermaid
stateDiagram-v2
    [*] --> Activa: identidad verificada
    Activa --> Vencida: 3 meses
    Vencida --> Activa: nuevo código
    Activa --> Revocada: desvinculación o revocación
    Vencida --> Revocada: desvinculación o revocación
    Revocada --> [*]
```

## 9. Reglas derivadas aprobadas

El equipo las aprobó. En la especificación son DEC-37 a DEC-47.

1. DEC-37. Agudo el mismo día: solo ventanas que inicien al menos una hora después de agendar, para que haya recordatorio de una hora antes.
2. DEC-38. Sin recordatorio nocturno si la cita se agenda después de las 21:00 del día anterior.
3. DEC-39. Un cambio de estado detectado una hora antes cancela la cita y deja la fórmula no apta.
4. DEC-40. Un medicamento no PBS continúa solo si está autorizado.
5. DEC-41. Agudo o crónico según un catálogo configurable de diagnósticos crónicos.
6. DEC-42. Documento ilegible o sin coincidencia: cargar de nuevo; si persiste, no apta y atención presencial.
7. DEC-43. Una cita por punto; si incluye un crónico, solo mañana; las citas de una fórmula se confirman todas o ninguna.
8. DEC-44. La pérdida solo aplica si ya se entregó parte de la fórmula; una nueva cita requiere una nueva solicitud.
9. DEC-45. Cierre por medicamento y remisión a Disfarma cuando hay no entregados.
10. DEC-46. Una vinculación vencida no recibe notificaciones por ese canal; SMS y correo continúan.
11. DEC-47. Sin ventanas con cupo en los días permitidos se trata como sin disponibilidad.
