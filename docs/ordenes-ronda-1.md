# Órdenes para la ronda 1 (alcance DEC-P01: prevalidación en web y Telegram)

Fecha: 2026-10-31 · Se ejecutan desde la raíz del repositorio, en este orden.

**Estado al 2026-11-01:** pasos 1 a 4 hechos: SPEC-003 v1.12, SPEC-008 v1.9 y SPEC-002 v1.11 aprobadas y congeladas (DEC-P58). No vuelvas a ejecutarlos. Paso 5 hecho: ARQ-005 v1.0 aprobada y congelada (DEC-P62). Paso 6: ronda 1 escrita y ajustada en `docs/mvp.md` (16 `Debe` en Requisitos y Corte técnico); falta que una persona revise las observaciones y apruebe. Usa los subagentes de Claude Code para los modos MVP: con `agente.py`, el modelo de respaldo `flash-lite` ignoró el modo. En consolas Windows, define `PYTHONUTF8=1` antes de usar los scripts de Python. Revisa con un diff el texto que deja el comando de aprobación: el agente puede alterarlo.

Cada SPEC nueva pasa por S1 y la aprueba una persona antes de que Arquitectura la use.
Insumos comunes: `docs/decisiones.md` (DEC-P01 a DEC-P12), `qa/revision/revision-transversal-20261031.md` (hallazgos T-xxx) y `docs/investigacion/formulacion-medicamentos-colombia.md`.

## Paso 0 · Resuelto

- PREG-006 respondida como DEC-P13: día siguiente a la prevalidación, saltando domingos y festivos de Colombia.

## Paso 1 · Especificaciones: SPEC-003 v1.1 (prevalidación)

```bash
python3 agentes-ia/agente.py specification-agent "Actualiza la SPEC-003 a la versión 1.1 en estado Candidata. Aplica como decisiones del equipo DEC-P02 (modificada), DEC-P03, DEC-P04, DEC-P05, DEC-P07, DEC-P08, DEC-P09, DEC-P10, DEC-P11 DEC-P12 y DEC-P13 del archivo docs/decisiones.md (DEC-P13 fija la fecha de la cita posible para crónicas: el día siguiente a la prevalidación, saltando domingos y festivos de Colombia; añade casos límite para sábado, víspera de festivo y festivo en lunes). Cítalas con su id global DEC-Pxx. Resuelve los hallazgos T-001, T-002, T-003, T-004, T-005, T-007, T-008, T-009, T-010 y T-011 de la revisión transversal adjunta: (1) regla por medicamento: PBS apto sin autorización, no PBS apto solo si está autorizado; (2) identificación de la fórmula por su número y significado de coincide con la EPS simulada según DEC-P08; (3) tabla motivo → siguiente paso tomada del contexto 3.4; (4) una historia clínica por solicitud y diagnóstico por fórmula según DEC-P09; (5) requisito nuevo de confirmación del OCR: la persona solo confirma o rechaza y el rechazo cuenta como intento (DEC-P04, DEC-P07); (6) un AC Dado/Cuando/Entonces por cada criterio y resultado (afiliación inactiva, vigencia vencida, no PBS sin autorización, no PBS autorizado, PBS sin autorización, clasificación aguda y crónica, ninguna fórmula apta, aviso de resultado preliminar); (7) AC-004 termina en el resultado preliminar, no en el agendamiento. Las fórmulas manuscritas se tratan como fuera de alcance con mensaje propio. Deja como tema para arquitectura los límites de tamaño y la retención de documentos si no los decide el contexto. No inventes reglas: lo que falte va como OPEN-Q." --continuar SPEC-003 --adjuntar docs/decisiones.md qa/revision/revision-transversal-20261031.md docs/investigacion/formulacion-medicamentos-colombia.md docs/preguntas/PREG-006.md
```

## Paso 2 · Especificaciones: SPEC-008 v1.1 (EPS simulada y catálogos)

```bash
python3 agentes-ia/agente.py specification-agent "Actualiza la SPEC-008 a la versión 1.1 en estado Candidata. Aplica DEC-P05, DEC-P08, DEC-P09, DEC-P11, DEC-P12 y DEC-P13 de docs/decisiones.md; por DEC-P13 añade un catálogo configurable de festivos de Colombia por año. Resuelve T-002, T-006, T-034, T-035, T-036 y T-037 de la revisión transversal: (1) la fórmula de la EPS simulada se identifica con un número de 20 dígitos tipo MIPRES y guarda paciente, fecha, diagnóstico CIE-10, medicamentos, vigencia, si cada medicamento es PBS y su estado de autorización, y la fecha habilitada para crónicas; (2) la vigencia se evalúa como fecha de vigencia de la EPS ≥ fecha de prevalidación; el rango de 8 a 9 meses es solo una regla de los datos de prueba; (3) elimina el rol administrador de pruebas: el cambio de datos simulados es un mecanismo de prueba para arquitectura, no un actor; (4) reescribe E1 sin registrar pacientes; (5) un AC por cada RF. Marca las partes de puntos, ventanas, inventario, motivos de no entrega y métricas de agendamiento como fuera del alcance de DEC-P01, sin borrarlas." --continuar SPEC-008 --adjuntar docs/decisiones.md qa/revision/revision-transversal-20261031.md docs/investigacion/formulacion-medicamentos-colombia.md
```

## Paso 3 · Especificaciones: SPEC-002 v1.2 (vinculación y Mini App)

```bash
python3 agentes-ia/agente.py specification-agent "Actualiza la SPEC-002 a la versión 1.2 en estado Candidata. Aplica DEC-P01 y DEC-P10 de docs/decisiones.md: la web es adaptable y sin instalación, y en Telegram la carga de documentos, la confirmación y los resultados se hacen en la Mini App, mientras el chat solo lleva avisos con plantilla fija; una foto enviada al chat no se procesa. Resuelve T-017 (vigencia de la vinculación de 3 meses calendario), T-026 (relación entre la política del bot y el aviso de SPEC-001), T-027 (qué identifica al paciente en pantalla sin datos sensibles) y T-028. Marca agendamiento, citas y código de entrega de RF-011 y RF-018 como dependientes del agendamiento en evaluación." --continuar SPEC-002 --adjuntar docs/decisiones.md qa/revision/revision-transversal-20261031.md
```

## Paso 4 · S1 y aprobación humana

```text
Usa el subagente qa-s1-revisor-spec para revisar la última versión de SPEC-003 (y luego SPEC-008 y SPEC-002) contra docs/mvp.md, docs/decisiones.md y qa/revision/revision-transversal-20261031.md.
```

Con veredicto APTA o APTA_CON_RESERVAS, se aprueba cada una:

```bash
python3 agentes-ia/agente.py specification-agent "El equipo aprueba la SPEC-003" --continuar SPEC-003
python3 qa/scripts/marcar.py hash prevalidacion
```

(Igual para SPEC-008 → `datos_simulados` y SPEC-002 → `telegram`.)

## Paso 5 · Arquitectura: ARQ de prevalidación + Mini App

```bash
python3 agentes-ia/agente.py architecture-agent "Analiza la arquitectura de la prevalidación en web y Telegram (Mini App) para el MVP DEC-P01, usando el stack aprobado y sus enmiendas. Debe decidir con ADR: dónde corre el OCR y cómo se procesa un documento; almacenamiento, cifrado y retención de fotos y PDF (T-010, T-041); EPS simulada y mecanismo para cambiar sus datos en pruebas; validación de initData de la Mini App y vinculación del chat (T-040: el identificador del chat se guarda como destino, no como identidad); límite de frecuencia de códigos sin contradecir DEC-01 de SPEC-001 (T-023); módulos y sus fronteras (T-042). ARQ-003 y ARQ-004 quedan obsoletas (T-039)." --aprobada SPEC-001 SPEC-002 SPEC-003 SPEC-008 --adjuntar docs/arquitectura/propuesta-tecnologica.md docs/decisiones.md qa/revision/revision-transversal-20261031.md
```

## Paso 6 · Negociación del MVP (ronda 1)

Con las SPEC aprobadas y la ARQ aprobada, se ejecutan «priorizar MVP» y «cortar MVP» como indica `docs/DECISIONES-PENDIENTES.md`, sección 3, y una persona aprueba con `marcar.py mvp --estado aprobado`.
