# Decisiones pendientes (puerta humana)

> **Actualización 2026-10-31 (19:20):** las decisiones ya tomadas están en `docs/decisiones.md` (DEC-P01 a DEC-P12) y los pasos siguientes en `docs/ordenes-ronda-1.md`. Queda pendiente PREG-006 y la decisión sobre el agendamiento.

Fecha: 2026-10-31 · Origen: reorganización del pipeline tras la revisión del plan.
Todo lo marcado **PROPUESTA** es una sugerencia; ningún agente lo toma como decisión.

Mientras no se resuelva la sección 1, `python3 orquestador.py` se queda en la puerta del MVP. Es lo correcto.

---

## 1. Alcance del MVP (la decisión que desbloquea todo)

### Decidido (DEC-P01, persona, 2026-10-31)

**La prevalidación completa entra al MVP, en la web (PWA móvil) y en Telegram.** Eso arrastra como dependencias:

| Entra | SPEC | Por qué |
|---|---|---|
| Identidad, consentimiento y autorización de datos de salud | SPEC-001 (aprobada) | Sin autorización separada no se cargan documentos (SPEC-001/AC-005). |
| EPS simulada y catálogos (PBS, crónicos) | SPEC-008, solo esa parte | Los 5 pasos de la prevalidación consultan la EPS simulada. |
| Carga de documentos y prevalidación | SPEC-003, completa | Lo pedido: carga, OCR, clasificación, 5 verificaciones, varias fórmulas, reintento. |
| Vinculación del canal Telegram | SPEC-002, solo vinculación y reglas del canal | Telegram exige verificar identidad con cédula + código (REQ-009). |

**Supuesto:** «app móvil» es la PWA instalable del stack aprobado (React + Vite), no una app nativa. Si se refieren a una app nativa, díganlo, porque cambia el stack.

### Aún por decidir: el agendamiento (SPEC-004)

Datos para decidir:
- **Sin agendamiento,** el flujo digital termina en el resultado preliminar por fórmula. La demo no llega a «reservar» ni a «dispensar», y el criterio de terminado del plan (§9: AC-36 de concurrencia, QR, humo de punta a punta) habría que reescribirlo.
- **No hay retrabajo si entra después:** la prevalidación va antes del agendamiento, así que lo que se construya ahora sirve igual. Lo único que cambia es la fecha del paso 5 para crónicas (PREG-006).
- **Con agendamiento** entra la parte más riesgosa del proyecto: la transacción de reserva y la concurrencia (AC-36), que el plan dice que nunca se recorta. Si entra, conviene empezarla pronto.
- **PROPUESTA:** construir primero la prevalidación en la web y fijar un punto de decisión cuando esté en verde. Si para entonces queda al menos un tercio del tiempo, sumar el agendamiento mínimo (ventanas + reserva + AC-36, sin QR ni dispensación). Si no, cerrar el MVP en la prevalidación y reescribir el §9.

### Contexto anterior (antes de DEC-P01)

**Situación.** `docs/mvp.md` tiene unos 20 requisitos «Debe» y solo SPEC-001 está aprobada. SPEC-002 a SPEC-008 existen como **Candidatas** (`agentes-ia/salidas/specification-agent/borradores/`), pero ninguna pasó por S1 ni por aprobación. Con ese alcance, QA y construcción no pueden avanzar más allá de `identidad`.

| SPEC | Tema | Estado |
|---|---|---|
| SPEC-001 | Consentimiento, identidad y derechos | Aprobada v1.1, S1 `APTA` |
| SPEC-002 | Canales, vinculación y multicanal | Candidata v1.1 |
| SPEC-003 | Carga de documentos y prevalidación | Candidata v1.0 |
| SPEC-004 | Disponibilidad, reserva y agenda (AC-36) | Candidata v1.0 |
| SPEC-005 | Notificaciones y recordatorios | Candidata v1.0 |
| SPEC-006 | Atención en el punto y cierre de entrega | Candidata v1.0 |
| SPEC-007 | Canal asistido (cuidadores) | Candidata v1.0 |
| SPEC-008 | Datos simulados, parámetros y catálogos | Candidata v1.0 |

**Opciones:**

- **A. Núcleo vertical (PROPUESTA).** El flujo prevalidar → reservar → dispensar con lo mínimo de cada parte:
  `identidad` (SPEC-001) · `reservas` con AC-36 (SPEC-004) · código de entrega y cierre en el punto (SPEC-006, parte mínima) · EPS e inventario simulados (SPEC-008, parte mínima) · prevalidación mínima (SPEC-003: afiliación + vigencia con la EPS simulada; OCR local con confirmación solo si alcanza el tiempo) · notificaciones solo con la regla de contenido sin datos de salud y proveedor simulado (SPEC-005, parte mínima) · Telegram solo para avisos con plantilla fija (SPEC-002, parte mínima).
  *Aplazar:* SPEC-007, espera de 48 h, recordatorios del día anterior, aviso de próxima fecha, re-verificación 1 h antes (o simularla con reloj adelantado).
  *Costo:* hay que dividir SPEC-002/003/005/006/008 en «parte MVP» y «resto».
- **B. Solo identidad + reservas.** Lo más seguro en tiempo, pero no demuestra «dispensar» ni el canal Telegram (incumple el criterio de terminado §9 del plan).
- **C. Mantener todo como «Debe».** No cabe; el plan pide recortar en ese caso.

**Qué decidir:** la opción y, para cada SPEC que entre, si va completa o «parte mínima».

## 2. Preguntas abiertas que bloquean `identidad`

| PREG | Pregunta | PROPUESTA de respuesta | Quién actúa después |
|---|---|---|---|
| PREG-003 | ¿La prueba «límite inferior» de TC-006 contradice CL-003? | Sí. Según CL-003 y PREG-001, emitido 09:59:00 e ingresado 10:00:00 es **válido**. Corregir el caso a «emitido 09:50:00, ingresado 10:00:00 → rechazado». | S2 ajusta TC-006 → S3 la prueba |
| PREG-004 | ¿Con qué firma se verifica AC-003 sin estado global? | `esCodigoVigente(codigo, contextoVigente)`: el dominio sigue puro y el servicio guarda el último código. | S3 ajusta la prueba |
| PREG-005 | ¿Dónde registra la prueba de TC-005 la autorización? | La prueba debe llamar a un método de registro entre las dos aserciones (p. ej. `registrarAutorizacion(solicitudId)`). El nombre lo fija el equipo. | S3 ajusta la prueba |
| PREG-006 | Sin agendamiento, ¿contra qué fecha se verifica la «fecha habilitada» de una crónica? | La fecha más temprana que permite la regla del tratamiento (crónica: día siguiente), calculada sin reservar. | Especificaciones (nota en SPEC-003) → S2 |
| PREG-007 | En Telegram, ¿por dónde viajan la fórmula, la confirmación del OCR y el resultado? | Mini App de Telegram: un botón del bot abre la PWA; el chat solo lleva avisos con plantilla. Probar pronto la cámara dentro de Telegram. | Persona → B2/B3 |
| PREG-002 | AC de REQ-009 (identidad no derivada del canal) | Mantener la propuesta de `mvp.md` y escribirla en SPEC-002 si entra al MVP. | Especificaciones |

Escribe tu respuesta en la sección «Respuesta del equipo» de cada `docs/preguntas/PREG-00x.md`.

Además, S2 debe añadir un TC nuevo (hallazgo H-010 del incidente): «un código de 6 dígitos distinto del emitido, dentro de la vigencia, no verifica la identidad».

## 3. Orden de trabajo después de decidir

```bash
# 1) S1 revisa cada SPEC candidata que entra (como se hizo con SPEC-001) y Especificaciones la corrige.
#    Aprobar y congelar:
python3 agentes-ia/agente.py specification-agent "El equipo aprueba la SPEC-004" --continuar SPEC-004

# 2) Ronda 1 de negociación (usa las observaciones REV-001…REV-010 de docs/mvp.md):
python3 agentes-ia/agente.py specification-agent "priorizar MVP" --adjuntar docs/mvp.md primary-needs-v2.md agentes-ia/salidas/specification-agent/aprobadas/*.md
python3 agentes-ia/agente.py architecture-agent "cortar MVP" --adjuntar docs/mvp.md docs/arquitectura/propuesta-tecnologica.md
#    El runner de Python devuelve la sección; pégala en docs/mvp.md (o usa los agentes desde Claude Code, que la escriben).

# 3) Registrar módulos y aprobar el MVP (escribe también la cabecera de docs/mvp.md):
python3 qa/scripts/marcar.py modulo reservas --spec-id SPEC-004
python3 qa/scripts/marcar.py hash reservas
python3 qa/scripts/marcar.py mvp --estado aprobado --aprobado-por "Tu nombre"

# 4) Seguir con el pipeline (ahora con guardián):
python3 orquestador.py
python3 qa/scripts/runner.py --seguir --backend claude
```

## 4. Lo que quedó listo en la reorganización

- **Trampas revertidas.** Los cambios que escribían valores de prueba en `identidad` se revirtieron; la evidencia está en `qa/incidentes/`. El código v0 se rehace (ver `INC-20261031-001-identidad-v0.md`).
- **Una sola fuente de verdad.** El orquestador lee la puerta del MVP en `docs/mvp.md`, la SPEC aprobada en `aprobadas/`, el veredicto de S1 en `qa/revision/` y el hash de cada SPEC. `pipeline.json` ya no puede abrir una puerta que los archivos tienen cerrada.
- **Guardián mecánico** (`qa/scripts/guardian.py`), integrado al runner:
  - bloquea cambios a pruebas, `qa/` y SPEC aprobadas durante los pasos B;
  - detecta valores de prueba en producción, `catch` vacíos, comentarios «para que pase» y `skip`/`only`;
  - verifica que las pruebas «rojas» fallen por aserción y no porque no compilan.
- **Runner:**
  - pasa el modelo de cada subagente desde `.env`;
  - no corre los pasos B con OpenCode sin modelo configurado;
  - trata «usage limit» o «Error:» como fallo;
  - lee el veredicto de S1 desde la línea «Veredicto:».
- **`apps/api` ejecutable:** `package.json`, `tsconfig`, Jest (proyectos `unidad` e `integracion`) y `docker-compose.yml` en la raíz.
- **Limpieza:**
  - las SPEC aprobadas tienen una sola ubicación, `aprobadas/`;
  - las PREG tienen títulos concretos;
  - el agente de Arquitectura sube de modelo (`gemini-3.5-flash`; confirma en AI Studio si hay un Pro disponible para la categoría «fuerte»);
  - `.gitignore` y `core.fileMode=false` quitan el ruido de Windows.

## 5. Pendiente en tu computadora

1. `cd apps/api && npm install`. No se pudo instalar desde la revisión (sin acceso a npm), así que la suite aún no se ha ejecutado con Jest real.
2. Docker Desktop para las pruebas de integración y concurrencia (Testcontainers).
3. Hacer commit de la reorganización: `git add -A && git commit -m "Reorganización del pipeline: guardián, fuente única de verdad, andamiaje api"`.
