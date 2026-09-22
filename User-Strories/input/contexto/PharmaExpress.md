# PharmaExpress – Plataforma de Dispensación Proactiva de Medicamentos

## Visión del Proyecto

Crear un **prototipo de aplicación móvil/web** que transforme la experiencia de dispensación de medicamentos en Colombia, pasando de un modelo reactivo y fragmentado a uno **proactivo, sin papeles y centrado en el usuario**.

### Problema Central

En Colombia, el acceso efectivo a medicamentos se ve severamente limitado por un modelo de dispensación farmacéutica esencialmente fragmentado y reactivo, que traslada al paciente la carga de garantizar su propio tratamiento. El usuario debe acudir físicamente a los puntos de atención portando fórmulas médicas, autorizaciones, documentos de identidad y copagos, para someterse a validaciones manuales en el momento, las cuales revelan frecuentemente desabastecimientos no gestionados proactivamente.

### Enfoque del MVP

- **Experiencia del usuario:** Menos filas, menos papeles, más certeza de recibir medicamentos a tiempo.
- **Alcance:** Prototipo funcional en 2 meses con 4 personas.
- **Tecnología:** App móvil/web + backend con datos simulados.

---

## Alcance del MVP

### Lo que SÍ incluye

1. **Registro de usuario**
   - Cédula, nombre, EPS (seleccionable de una lista simulada)
   - Datos de contacto (teléfono, email, dirección)

2. **Solicitud de turno para dispensación**
   - El usuario ingresa su cédula y EPS
   - Pre-validación simulada:
     - Fórmula vigente (≤ 30 días)
     - Afiliación activa
     - Medicamentos disponibles en inventario simulado

3. **Visualización de medicamentos entregables**
   - Lista de medicamentos que puede reclamar hoy
   - Información clara: nombre, concentración, cantidad, punto de recogida

4. **Notificación de pedido listo**
   - Notificación cuando el pedido está preparado
   - Se indica ventanilla o punto de recogida

5. **Recogida express**
   - El usuario muestra código QR o número de orden + cédula
   - Confirmación de entrega (panel mínimo del dispensador)

6. **Historial de dispensaciones**
   - Pedidos anteriores, fechas y estados

7. **Gestión básica de pendientes** (si da tiempo)
   - Información de causa del pendiente (desabastecimiento simulado)
   - Fecha estimada de solución (≤ 48 horas)

### Lo que NO incluye (por ahora)

- Dashboard completo del dispensador con gestión de inventario avanzado
- Integración real con sistemas de EPS, MIPRES o ADRES (todo simulado)
- Módulo de cobros, facturación o reporte contable
- Logística compleja de domicilio

## Flujos de Usuario

### Caso de Uso 1: Solicitar Turno para Dispensación

**Actor:** Usuario afiliado

**Precondición:** Usuario registrado en la app

**Flujo Principal:**
1. Usuario abre la app e ingresa cédula + EPS
2. Sistema valida (mock):
   - Afiliación activa
   - Fórmula vigente (≤ 30 días)
   - Medicamentos disponibles
3. Sistema muestra lista de medicamentos entregables
4. Usuario confirma solicitud de turno
5. Sistema crea orden con estado "pendiente"
6. Usuario ve estado de su orden en tiempo real

**Flujo Alternativo (fórmula no vigente):**
- Sistema informa: "Su fórmula tiene más de 30 días. Debe consultar a su médico"

**Flujo Alternativo (medicamento no disponible):**
- Sistema informa causa y fecha estimada de solución

---

### Caso de Uso 2: Recibir Notificación de Pedido Listo

**Actor:** Usuario, Sistema

**Precondición:** Orden en estado "pendiente" o "en_preparacion"

**Flujo Principal:**
1. Dispensador marca la orden como "lista" en panel mínimo
2. Sistema envía notificación al usuario (push o en la app)
3. Usuario recibe: "Tu pedido está listo. Ventanilla 3. Código: ABC123"
4. Estado de orden cambia a "listo"

---

### Caso de Uso 3: Recoger Medicamento

**Actor:** Usuario, Dispensador

**Precondición:** Orden en estado "listo"

**Flujo Principal:**
1. Usuario llega al punto y muestra código QR o número de orden
2. Dispensador escanea/ingresa código
3. Sistema valida que la orden esté "lista"
4. Dispensador confirma entrega
5. Sistema actualiza orden a "entregado"
6. Sistema descuenta del inventario simulado
7. Usuario recibe confirmación en la app
8. Registro se guarda en HistorialDispensacion

---

### Caso de Uso 4: Gestionar Pendiente (Opcional)

**Actor:** Usuario, Sistema

**Precondición:** Medicamento no disponible en inventario

**Flujo Principal:**
1. Sistema detecta que medicamento no está disponible
2. Orden se marca como "pendiente_no_disponible"
3. Usuario ve en la app:
   - "Medicamento X no disponible"
   - Causa: desabastecimiento
   - Fecha estimada: [48 horas]
4. Sistema registra pendiente con causa y fecha límite
5. Cuando el medicamento llega, sistema notifica al usuario

---

## Tecnologías Recomendadas

### Frontend (App del Paciente)

**Opción A: Flutter**
- Ventajas: iOS + Android con un solo código, buen rendimiento
- Desventajas: Requiere configuración de entornos móviles

**Opción B: React + PWA**
- Ventajas: Más rápido de desarrollar, accesible desde cualquier dispositivo
- Desventajas: Menos "nativo" en experiencia

**Recomendación:** React + PWA para este MVP (2 meses)

### Backend

**Node.js con Express**
- Lenguaje: JavaScript/TypeScript
- Autenticación: JWT
- Documentación: Swagger/OpenAPI
- Ventajas: Curva de aprendizaje suave, gran ecosistema

**Python con FastAPI**
- Lenguaje: Python
- Autenticación: JWT
- Documentación: Swagger automático
- Ventajas: Tipado, validación automática, rápido desarrollo

**Recomendación:** Node.js con Express (si el equipo conoce JavaScript)

### Base de Datos

- **PostgreSQL:** Datos transaccionales (usuarios, órdenes, inventario)
- **Redis (opcional):** Cache, sesiones, colas de notificaciones

### Notificaciones

- **Firebase Cloud Messaging:** Push notifications reales
- **Simulación:** Logs en consola o emails simulados para el MVP

### Panel Mínimo del Dispensador

- Web simple con React o formulario básico en el backend
- Funcionalidades:
  - Ver lista de órdenes pendientes
  - Marcar orden como "lista"
  - Confirmar entrega (escanear QR o ingresar código)

---

## Riesgos y Mitigación

### Riesgo 1: Complejidad subestimada
**Mitigación:** Empezar con el flujo más simple posible (registro → turno → recogida), dejar funcionalidades "nice to have" para después.

### Riesgo 2: Datos simulados poco realistas
**Mitigación:** Basar los datos en la conversación con el dispensador de Supía (fórmulas, concentraciones, PBS vs no PBS).

### Riesgo 3: Tiempo insuficiente para pruebas
**Mitigación:** Iniciar pruebas desde la semana 5 con compañeros de clase como usuarios simulados.

### Riesgo 4: Integración entre componentes
**Mitigación:** Definir contratos de API claramente desde la semana 1, usar Swagger como fuente de verdad.


