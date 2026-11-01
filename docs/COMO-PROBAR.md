# Cómo probar los agentes y correr la secuencia

Hay tres niveles de prueba. Empieza por el 1, que no gasta llamadas de IA.

## 1. Prueba mecánica (sin IA, segundos)

Comprueba sintaxis, frontmatter de agentes y skills, secciones de `docs/mvp.md`,
`pipeline.json`, el lint y las 12 transiciones del orquestador:

```bash
python3 qa/scripts/probar_todo.py --verbose
```

Debe terminar con `8/8 pruebas pasaron` y código de salida 0.

Pruebas sueltas:

```bash
python3 qa/scripts/lint_spec.py PHARMA_EXPRESS_SPEC-1.md
python3 qa/scripts/lint_spec.py --strict agentes-ia/salidas/specification-agent/aprobadas/
python3 qa/scripts/guardian.py revisar   # trampas en código de producción
python3 orquestador.py
python3 orquestador.py --check   # código 1 mientras haya una puerta humana pendiente
```

## 2. Probar cada agente

### 2.1 Agentes base con el runner de Python

Solo `specification-agent` y `architecture-agent` corren con `agente.py`. Necesitan
una llave en `.env` (ver `.env.example`) y conexión a Internet.

```bash
python3 agentes-ia/agente.py --listar
python3 agentes-ia/agente.py --modelos gemini
```

Modo normal (SPEC):

```bash
python3 agentes-ia/agente.py specification-agent \
  "Necesitamos que el paciente pueda cancelar su reserva"
```

Modo MVP (los dos agentes, en orden):

```bash
# 1. Especificaciones prioriza
python3 agentes-ia/agente.py specification-agent "priorizar MVP" \
  --adjuntar docs/mvp.md primary-needs-v2.md \
  agentes-ia/salidas/specification-agent/borradores/SPEC-001/SPEC-001_v1.0.md

# 2. Arquitectura corta
python3 agentes-ia/agente.py architecture-agent "cortar MVP" \
  --adjuntar docs/mvp.md docs/arquitectura/propuesta-tecnologica.md
```

Si el agente devuelve el texto en pantalla, cópialo a la sección correspondiente de
`docs/mvp.md`. El runner de Python no escribe en archivos arbitrarios del repo.

### 2.2 Subagentes S1–R2 con Claude Code

Estos subagentes viven en `.claude/agents/` y los ejecuta Claude Code. En este
equipo hay que tener Claude Code instalado y autenticado (`claude`). Desde la raíz:

```text
Usa el subagente qa-s1-revisor-spec para revisar agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.1.md contra docs/mvp.md.

Usa el subagente qa-s2-disenador-casos con agentes-ia/salidas/specification-agent/aprobadas/SPEC-001_v1.1.md y docs/mvp.md.

Usa el subagente qa-s3-generador-pruebas con los TC de qa/casos/ y los oráculos aprobados.

Usa el subagente backend-servicios-api para implementar el módulo identidad.

Usa el subagente ejecutor-corrector para dejar en verde el módulo identidad.

Usa el subagente qa-r1-humo contra el entorno de prueba.

Usa el subagente qa-r2-triage con el hallazgo de qa/humo/RUN-humo-<fecha>.md.
```

Cada subagente tiene sus entradas y salidas en el frontmatter y en el cuerpo del
archivo. El mapa completo está en `.claude/LEEME-agentes.md`.

## 3. Correr la secuencia

El orquestador **no ejecuta agentes**: aplica el orden y las puertas humanas, y te
dice qué toca. La secuencia real es:

```text
Especificaciones (priorizar MVP)
  → Arquitectura (cortar MVP)
  → persona aprueba docs/mvp.md
  → S1 → S2 → persona aprueba oráculos → S3
  → B1/B4 → B2/B3 → R1 → R2 (opcional)
  → persona aprueba la entrega
```

Después de cada paso, marca el resultado y consulta el siguiente:

```bash
python3 qa/scripts/marcar.py mostrar
python3 orquestador.py
```

### 3.1 Comandos para avanzar el estado

```bash
# Puerta humana del MVP
python3 qa/scripts/marcar.py mvp --estado aprobado --aprobado-por "Nombre Apellido"

# Módulo: registrar y avanzar
python3 qa/scripts/marcar.py modulo identidad --spec aprobada
python3 qa/scripts/marcar.py modulo identidad --revision APTA
python3 qa/scripts/marcar.py modulo identidad --oraculos aprobados
python3 qa/scripts/marcar.py modulo identidad --pruebas rojas
python3 qa/scripts/marcar.py modulo identidad --implementacion verde
python3 qa/scripts/marcar.py modulo identidad --humo verde

# Bucles y escalamientos
python3 qa/scripts/marcar.py iteracion identidad
python3 qa/scripts/marcar.py escalar identidad "3 intentos sin progreso"
python3 qa/scripts/marcar.py resolver-escalado identidad
```

Valores válidos:

| Campo | Valores |
|---|---|
| `--spec` | `pendiente`, `borrador`, `candidata`, `aprobada` |
| `--revision` | `pendiente`, `APTA`, `APTA_CON_RESERVAS`, `NO_APTA` |
| `--oraculos` | `pendiente`, `aprobados` |
| `--pruebas` | `pendiente`, `rojas`, `verdes` |
| `--implementacion` | `pendiente`, `en_curso`, `verde` |
| `--humo` | `pendiente`, `en_curso`, `verde`, `fallido` |

### 3.2 Ensayo completo sin tocar el pipeline real

Copia el pipeline a un archivo temporal y recorre todas las transiciones:

```bash
DEMO="$(mktemp -d)/pipeline.json"
cp pipeline.json "$DEMO"

python3 qa/scripts/marcar.py --archivo "$DEMO" mvp --estado aprobado --aprobado-por "Demo"
python3 qa/scripts/marcar.py --archivo "$DEMO" modulo identidad --spec aprobada
python3 qa/scripts/marcar.py --archivo "$DEMO" modulo identidad --revision APTA
python3 qa/scripts/marcar.py --archivo "$DEMO" modulo identidad --oraculos aprobados
python3 qa/scripts/marcar.py --archivo "$DEMO" modulo identidad --pruebas rojas
python3 qa/scripts/marcar.py --archivo "$DEMO" modulo identidad --implementacion verde
python3 qa/scripts/marcar.py --archivo "$DEMO" modulo identidad --humo verde
python3 orquestador.py --archivo "$DEMO"
```

La última salida debe proponer `entrega`.

## 4. Qué no es automático

- No hay un runner que encadene los 11 agentes de punta a punta: S1–R2 son
  subagentes de Claude Code y hay puertas humanas en medio.
- El orquestador solo habilita el siguiente paso; no decide alcance ni escribe código.
- El runner de Python solo ejecuta los dos agentes base y no puede editar `docs/mvp.md`.
- Para una corrida realmente automática haría falta invocar Claude Code en modo
  headless (`claude -p`) o montar una API propia. No está implementado.
