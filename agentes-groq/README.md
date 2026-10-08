# Agentes de IA — Pharma Express

Agentes de IA que apoyan el proyecto. Cada agente es una **instrucción de sistema** (`prompt.md`) + una **configuración** (`config.json`) que se ejecutan con un script común (`agente.py`).

> En este proyecto, un "agente" es: instrucción de sistema + proveedor + modelo + parámetros + script. El agente vive en este repositorio.

El script funciona con cualquier proveedor compatible con la API de OpenAI. Hoy admite **Mistral**, **Gemini**, **Groq** y **OpenRouter**. Cada agente escoge su proveedor en `config.json`. La carpeta conserva el nombre `agentes-groq` para no romper rutas.

---

## Qué proveedor usar

| Proveedor | ¿Gratis? | Límite que importa para estos agentes | Recomendación |
|---|---|---|---|
| **Gemini** (Google AI Studio) | Sí, sin tarjeta. Google puede usar los datos del plan gratuito para mejorar sus productos | Margen amplio por solicitud, pero pocas solicitudes al día en los modelos Flash. Los límites exactos aparecen en AI Studio | Es el que traen configurado los dos agentes (`gemini-3.5-flash-lite`) |
| **Mistral** (plan Experiment) | Sí, sin tarjeta. Pide verificar el celular y aceptar que usen tus datos para entrenamiento | Margen amplio por solicitud y por mes. Los límites exactos aparecen en la consola de tu cuenta | Alternativa si Gemini falla o agota cupo |
| **Groq** (plan gratuito) | Sí | Rechaza cualquier solicitud de más de 8.000 tokens (prompt + `max_tokens`). Los agentes no caben | Solo para agentes con prompts cortos |
| **OpenRouter** (modelos `:free`) | Sí | Pocas solicitudes al día sin créditos | Respaldo |

Como los planes gratuitos pueden usar lo que envías, **nunca envíes datos reales de pacientes**. Usa solo datos ficticios.

---

## Estructura

```
agentes-groq/
├── README.md                  ← esta guía
├── agente.py                  ← punto de entrada: agencia, contexto, API, flujo interactivo, guardado
├── requirements.txt           ← dependencias (openai, python-dotenv)
├── .env                       ← llaves de API (está en .gitignore: nunca se sube)
├── agentes/
│   ├── _plantilla/            ← copia esta carpeta para crear un agente nuevo
│   │   ├── config.json
│   │   └── prompt.md
│   ├── specification-agent/   ← necesidad → preguntas OPEN-Q y SPEC de 17 secciones
│   │   ├── config.json
│   │   └── prompt.md
│   └── architecture-agent/    ← SPECs aprobadas → preguntas ARCH-Q y ARQ (arquitectura + ADR)
│       ├── config.json
│       └── prompt.md
└── salidas/
    ├── specification-agent/   ← SPECs por estado (borradores/, aprobadas/, registro.md)
    └── architecture-agent/    ← ARQs por estado (analisis/, borradores/, aprobadas/, registro.md)
```

El marcador `{{CONTEXTO_PROYECTO}}` dentro de un `prompt.md` se reemplaza automáticamente por el contenido de `PHARMA_EXPRESS_AGENTES.md` (raíz del proyecto). Si un agente necesita otro archivo, lo indica con `archivo_contexto` en su `config.json`. El archivo se lee en cada ejecución, así que el contexto siempre está actualizado.

### Diseño del núcleo

Hay un solo script (`agente.py`) con toda la lógica común y los puntos de extensión claros:

- **Proveedores:** el catálogo `PROVEEDORES` define la base URL y la variable de la llave de cada proveedor. Un proveedor nuevo se agrega como una línea ahí, sin tocar nada más.
- **Agentes:** cada agente es solo `prompt.md` + `config.json` dentro de `agentes/`. El script carga el prompt, reemplaza `{{CONTEXTO_PROYECTO}}` con el contexto y usa `parametros` tal cual en la API.
- **Modelos de respaldo:** `modelos_respaldo` en el `config.json` se prueban en orden ante errores 429 (cupo agotado) y 500, 502, 503, 504 (saturado o caído).
- **Guardado por documento:** con `organizacion_salida: "spec"` el script lee el encabezado `# PREFIJO-00x. Nombre - Versión X.Y` que escribe el agente y organiza el archivo por estado: `analisis/`, `borradores/`, `aprobadas/` o `sin-clasificar/`. `--continuar` usa la última versión completa guardada; una respuesta cortada se marca `_INCOMPLETA` y nunca se reutiliza; una versión aprobada y congelada no se duplica.
- **Flujo interactivo:** con `interactivo: true` y terminal, el script hace las preguntas una a una (`>`, Open `-Q` o `ARCH-Q`), imprime un resumen en vez del markdown (`--imprimir` para verlo) y ofrece aprobar con `[S/n]`. Sin terminal, hace una sola llamada con las preguntas dentro de la respuesta.

## Parte 1 — Configuración inicial (solo una vez)

### Paso 1. Crear la llave de la API de Gemini
1. Entra a <https://aistudio.google.com/app/apikey> y crea una cuenta (gratis, sin tarjeta).
2. Crea una llave de API y **cópiala**.

Los dos agentes traen configurado `gemini-3.5-flash-lite`. Si prefieres Mistral, crea la llave en <https://console.mistral.ai> (plan **Experiment**), cambia `proveedor` y `modelo` en los dos `config.json` (Parte 2, "Cambiar de proveedor").

### Paso 2. Guardar la llave
Desde la carpeta `agentes-groq`, crea el archivo `.env`:

```bash
echo 'GEMINI_API_KEY=tu_llave_aqui' > .env
```

Solo hace falta la llave del proveedor que uses. El archivo `.env` está en `.gitignore`: **nunca lo subas a git ni lo compartas**.

### Paso 3. Crear el entorno de Python e instalar dependencias

```bash
python3 -m venv ../venv
```

```bash
source ../venv/bin/activate
```

```bash
pip install -r requirements.txt
```

### Paso 4. Verificar

```bash
python agente.py --listar
```

Debe mostrar `specification-agent` y `architecture-agent`. Para confirmar que la llave funciona y ver los modelos disponibles:

```bash
python agente.py --modelos gemini
```

---

## Parte 2 — Usar el Specification Agent

**Qué hace:** recibe la necesidad informal de **una sola funcionalidad** y devuelve preguntas de aclaración (`OPEN-Q-001`..., incluida la de la épica) y una SPEC de 17 secciones, sin decisiones técnicas. Trabaja por versiones: borradores `0.x`, candidatas `1.0`, `1.1`... y una versión aprobada y congelada.

**Requisito:** el archivo `PHARMA_EXPRESS_AGENTES.md` en la raíz del proyecto.

### Dónde quedan los archivos

El script organiza cada respuesta según la SPEC y su estado, leyendo el encabezado que escribe el agente:

```
salidas/specification-agent/
├── aprobadas/                 ← solo versiones aprobadas y congeladas (entrada del Architecture Agent)
│   └── SPEC-001_v1.3.md
├── borradores/
│   └── SPEC-001/              ← borradores y candidatas de cada SPEC
│       ├── SPEC-001_v0.1.md
│       ├── SPEC-001_v1.0.md
│       └── SPEC-001_v1.3_INCOMPLETA.md
├── sin-clasificar/            ← respuestas sin encabezado de SPEC (por ejemplo, una propuesta de división)
└── registro.md                ← una línea por ejecución: fecha, SPEC, versión, estado, modelo y petición
```

- Si la respuesta se corta, se guarda con `_INCOMPLETA` y nunca se usa como adjunto.
- Ningún borrador se sobrescribe: si el nombre ya existe, se agrega `_2`, `_3`.
- Una versión aprobada y congelada **nunca** se duplica: si ya está en `aprobadas/`, el script avisa y no guarda.
- Los borradores se conservan como evidencia del proceso.

### Flujo interactivo (con terminal)

1. Pega solo la necesidad:

```bash
python agente.py specification-agent "Necesitamos que el paciente pueda cancelar su cita"
```

El agente hace sus preguntas **una a una** en la terminal, con el símbolo `>`:

- escribe la respuesta y pulsa Enter;
- pulsa Enter en blanco para dejar esa pregunta pendiente;
- escribe `salir` o pulsa `Ctrl+C` para terminar: lo que falte queda pendiente y se guarda el borrador.

2. Con tus respuestas, el agente genera la SPEC en una segunda llamada. La terminal **no imprime el markdown**: solo el resumen (id, nombre, versión, estado, épica, conteos, preguntas pendientes y ruta). Para ver la SPEC completa, agrega `--imprimir`.

3. Si respondiste todo sin vacíos y el agente entrega una Candidata sin pendientes, el script pregunta:

```text
¿Apruebas y congelas la SPEC-001 versión 1.0? [S/n]
```

- `S` o Enter: se reescribe `Estado: Aprobada y congelada` y el archivo queda en `aprobadas/`, **sin llamadas extra a la API**.
- `n`: se guarda como Candidata en `borradores/` y queda lista para iterar.

4. Si quedó algo pendiente (blanco o `salir`), se guarda como Borrador `0.x` y sigues con el flujo por mensajes de abajo.

Sin terminal (por ejemplo en un pipe o en un script), o cuando usas `--continuar`, el script hace **una sola llamada** como antes: las preguntas vienen dentro de la propia respuesta.

### Flujo por mensajes (`--continuar`)

1. Responder preguntas o pedir correcciones. `--continuar` adjunta solo la última versión completa de la SPEC, así que no hace falta escribir nombres de archivo:

```bash
python agente.py specification-agent "Respuestas del equipo. OPEN-Q-001: ... OPEN-Q-002: ..." --continuar SPEC-001
```

Repite el paso 1 hasta que el agente entregue una versión Candidata sin pendientes.

2. Aprobar:

```bash
python agente.py specification-agent "El equipo aprueba la SPEC-001" --continuar SPEC-001
```

3. Cambio después de aprobar: describe el cambio y usa `--continuar SPEC-001`. El agente entrega la siguiente versión como Candidata, con el análisis de impacto.

**Numeración:** no hace falta indicar nada: en la primera versión el script calcula **solo** el siguiente número de SPEC y los números iniciales (HU, RF, RNF, BR, CL, AC) a partir de lo que ya está guardado, se lo avisa al agente con una línea `Numeración:` y se lo pasa en el mensaje. Si quieres forzar otros números, escríbelos tú al inicio del mensaje (*"SPEC-003, empieza en RF-020. Necesitamos que..."*) y el script no los toca. En iteraciones (`--continuar`) la numeración sigue la de la versión adjunta.

**Épica:** agrupa funcionalidades relacionadas (el Architecture Agent recibe varias SPECs de una misma épica). Pegas solo la necesidad: si no traes la épica, el agente la **pide como `OPEN-Q-`** y la decides tú respondiendo con el `EPIC-00x` de tu catálogo de agrupación (el encabezado queda `Épica: pendiente` hasta que respondas). Para saltarte la pregunta, indícala en el mensaje: *"EPIC-002. Necesitamos que..."*.

**Temas para arquitectura:** cuando la SPEC detecta un tema técnico que no le corresponde resolver (tecnología, dónde vive un cálculo, integraciones), lo escribe en la sección 14 con la etiqueta `tema para arquitectura. Origen: RF-00x`. Es el insumo que puede leer el Architecture Agent además de la SPEC misma.

**Archivos del formato anterior:** si tienes respuestas guardadas antes de esta estructura (nombres con fecha y hora en la carpeta principal), organízalas una sola vez con:

```bash
python agente.py --organizar specification-agent
```

### Cambiar de proveedor
Edita `agentes/specification-agent/config.json`. Por ejemplo, para Gemini:

```json
"proveedor": "gemini",
"modelo": "<nombre de un modelo Flash>",
```

Consulta los nombres exactos con `python agente.py --modelos gemini` y agrega `GEMINI_API_KEY` en `.env`. Todo lo demás del `config.json` queda igual.

---

## Parte 3 — Usar el Specification Agent con Claude Code (plan Pro de Claude)

Si tienes el plan Pro de Claude, también puedes ejecutar el agente con Claude Code, que está incluido en ese plan y no necesita llave de API. El uso se descuenta de los límites de tu plan Pro.

El agente está en `.claude/agents/specification-agent.md` (raíz del proyecto). Tiene las mismas reglas, convenciones y formato de salida que `agentes/specification-agent/prompt.md`. La diferencia es que lee `PHARMA_EXPRESS_AGENTES.md` por su cuenta y guarda cada versión con la misma estructura de carpetas de la Parte 2.

### Instalar Claude Code (solo una vez)
Sigue la guía oficial: <https://code.claude.com/docs/en/overview>. Al iniciar sesión, entra con tu cuenta del plan Pro, no con una llave de la consola de API.

### Usarlo
Desde la raíz del proyecto, abre Claude Code con `claude` y escríbele:

1. Primera versión:
   *"Usa el agente specification-agent con esta necesidad: Necesitamos que el paciente pueda cancelar su cita"*
2. Siguiente versión:
   *"Usa el agente specification-agent. Continuar SPEC-001. Respuestas del equipo: OPEN-Q-001: ... OPEN-Q-002: ..."*
3. Aprobación:
   *"Usa el agente specification-agent. Continuar SPEC-001. El equipo aprueba la SPEC."*

Cada vez, el agente guarda un archivo nuevo y te muestra en la conversación las preguntas abiertas pendientes.

---

## Parte 4 — Paso a paso para crear próximos agentes

### Paso 1. Definir el agente en una frase
Escribe: *"Este agente recibe ___ y devuelve ___ para ___"*.
Ejemplo: *"Recibe una historia de usuario y devuelve casos de prueba para validarla en el prototipo."*
Si necesitas más de una frase, probablemente son dos agentes.

### Paso 2. Copiar la plantilla
El nombre de la carpeta es el nombre del agente (minúsculas y guiones):

```bash
cp -r agentes/_plantilla agentes/nombre-del-agente
```

### Paso 3. Escribir el `prompt.md`
Una buena instrucción de sistema tiene cinco bloques. La plantilla ya los trae:

| Bloque | Qué escribir | En la plantilla |
|---|---|---|
| **Rol** | Qué experto es el agente | `# ROL` |
| **Instrucciones** | Pasos claros y numerados | `# INSTRUCCIONES` |
| **Contexto** | Información del proyecto | `# CONTEXTO DEL PROYECTO` (`{{CONTEXTO_PROYECTO}}`) |
| **Entrada** | Lo que envía el usuario | Llega como mensaje al ejecutar el script |
| **Salida esperada** | Formato exacto + ejemplo | `# FORMATO DE SALIDA` y `# EJEMPLO` |

Buenas prácticas:
- Pon **las reglas críticas al inicio**: el modelo les da más peso a las primeras instrucciones.
- **Muestra un ejemplo** de la respuesta ideal en vez de describirla con muchas palabras.
- Usa **verbos concretos** ("lista", "reescribe", "clasifica") en vez de verbos vagos ("analiza").
- Di explícitamente lo que **no** debe hacer (p. ej. "no inventes cifras").

### Paso 4. Configurar `config.json`

| Campo | Qué es | Recomendación |
|---|---|---|
| `nombre`, `descripcion` | Para identificar el agente | Frase del paso 1 |
| `proveedor` | Dónde corre el modelo: `mistral`, `gemini`, `groq` u `openrouter` | `mistral` |
| `modelo` | ID del modelo en ese proveedor | `mistral-large-latest`. Consulta los disponibles con `python agente.py --modelos <proveedor>` |
| `organizacion_salida` | Opcional. `"spec"` guarda por SPEC y estado y habilita `--continuar` | Solo para agentes que producen SPEC con el encabezado `# SPEC-00x. Nombre - Versión X.Y` |
| `prefijo_documento` | Opcional. Prefijo del ID en el encabezado (`SPEC` → `SPEC-001`) | Omítelo para `SPEC`; escríbelo si el agente produce documentos con otro prefijo |
| `numeracion_solo_documento` | Opcional. `true` para que la numeración automática indique solo el siguiente número de documento (por ejemplo, `ARQ-002`), sin el "empieza en..." de elementos | `true` en el Architecture Agent, porque los ARQ citan elementos calificados (`SPEC-001/RF-005`) y no los numeran como propios |
| `interactivo` | Opcional. `true` hace las preguntas una a una en la terminal, imprime un resumen en vez del markdown y ofrece aprobar con `[S/n]` cuando no quedan vacíos | `true` solo si el agente trabaja con `organizacion_salida: spec`; omítelo para agentes que responden de corrido |
| `modelos_respaldo` | Opcional. Modelos que se prueban, en orden, si el principal está saturado (error 503) o sin cupo (error 429) | Otros modelos del mismo proveedor |
| `parametros.temperature` | Qué tan creativo es | `0`–`0.2` para extraer o clasificar; `0.5` para redactar; `0.8` para ideas creativas |
| `parametros.max_tokens` | Límite de largo de la respuesta | Un poco más de lo que esperas recibir |
| `archivo_contexto` | Opcional. Archivo que reemplaza `{{CONTEXTO_PROYECTO}}` | Omítelo para usar `PHARMA_EXPRESS_AGENTES.md`. Relativo a la raíz del proyecto. No se envía a la API |
| `carpeta_salida` | Dónde se guardan los resultados | Relativa a la raíz del proyecto |

Todo lo que esté en `parametros` se envía tal cual a la API del proveedor. Si un proveedor rechaza un parámetro, bórralo del `config.json`.

### Paso 5. Probar el prompt en el playground del proveedor (recomendado)
1. Abre el playground de tu proveedor (en Mistral, dentro de <https://console.mistral.ai>; en Gemini, <https://aistudio.google.com>).
2. Elige el mismo modelo del `config.json`.
3. Pega el `prompt.md` como instrucción de sistema (reemplaza `{{CONTEXTO_PROYECTO}}` por el texto de `PHARMA_EXPRESS_AGENTES.md`).
4. Escribe una petición de prueba y ajusta la temperatura.
5. Ajusta el prompt hasta que la respuesta tenga el formato esperado y copia los cambios al `prompt.md`.

### Paso 6. Ejecutar desde el script

```bash
python agente.py nombre-del-agente "tu petición de prueba"
```

### Paso 7. Probar con casos variados
Ejecuta al menos 3 peticiones distintas: una normal, una ambigua y una que deba rechazar o advertir (p. ej. algo fuera del alcance del prototipo). Si falla, corrige el `prompt.md`, no el script.

### Paso 8. Guardar en git
Haz commit de la carpeta nueva del agente (sin el `.env`). Así el equipo puede usarlo y ver cómo cambia el prompt con el tiempo.

---

## Parte 5 — Usar el Architecture Agent

**Qué hace:** recibe una o varias SPEC **aprobadas y congeladas** y devuelve preguntas de análisis arquitectónico (`ARCH-Q-001`...) y una propuesta de arquitectura justificable: Architecture Drivers, restricciones, atributos de calidad, alternativas comparadas con matriz de decisión, arquitectura seleccionada, diagrama conceptual, componentes y responsabilidades, integraciones, ADR, patrones con problema real, riesgos, supuestos y trazabilidad. No escribe código de producción ni toma decisiones humanas: propone y documenta para que el equipo decida.

**Entrada:** SPECs aprobadas. Se las pasas sin escribir nombres de archivo, de dos formas:
- `--aprobada SPEC-001 SPEC-002` → adjunta la última versión aprobada y completa de esas SPECs (busca en `salidas/*/aprobadas/` de cualquier agente).
- `--epica EPIC-001` → adjunta todas las SPECs aprobadas de esa épica (la épica decide el equipo y queda en la línea `Épica:` del encabezado de cada SPEC).

El agente además lee de cada SPEC la sección 13 (restricciones 3.9 y 3.11 del contexto) y los temas "para arquitectura" de la sección 14. Siempre cita los elementos con su identificador calificado (`SPEC-001/RF-005`, `SPEC-002/BR-003`), porque la numeración se repite entre SPECs.

### Dónde quedan los archivos

```
salidas/architecture-agent/
├── analisis/                  ← estudios de análisis con preguntas ARCH-Q pendientes (entrada del --continuar)
│   ├── ARQ-001/
│   │   └── ARQ-001_v0.1.md
│   └── ARQ-002/
├── borradores/                ← propuestas aún no aprobadas
│   └── ARQ-001/
│       └── ARQ-001_v1.0.md
├── aprobadas/                 ← solo ARQs aprobadas y congeladas (entrada del Planning Agent)
│   └── ARQ-001_v1.0.md
└── registro.md                ← una línea por ejecución
```

Los estados y la ruta se deciden solos leyendo el encabezado que escribe el agente:
- `Estado: Análisis` → `analisis/ARQ-00x/`.
- Borrador o Candidata → `borradores/ARQ-00x/`.
- `Estado: Aprobada y congelada` → `aprobadas/`, sin duplicados.

### Flujo interactivo (con terminal)

1. Elige las SPECs de entrada y ejecuta:

```bash
python agente.py architecture-agent "Analiza la arquitectura" --aprobada SPEC-001 SPEC-002
```

o agrupadas por épica:

```bash
python agente.py architecture-agent "Analiza la arquitectura" --epica EPIC-001
```

2. Primera llamada: el agente hace sus preguntas de análisis **una a una** con el símbolo `>`:
   - escribe la respuesta y pulsa Enter;
   - pulsa Enter en blanco para dejar esa pregunta pendiente;
   - escribe `salir` o pulsa `Ctrl+C` para terminar: lo que falte queda pendiente.
3. Segunda llamada: con tus respuestas genera la **propuesta completa** (Architecture Package). La terminal no imprime el markdown, solo el resumen (id, versión, estado, preguntas pendientes y ruta). Úsalo con `--imprimir` para ver el documento completo.
4. Si respondiste todo sin vacíos y el agente entrega una Candidata sin pendientes, el script pregunta:

```text
¿Apruebas y congelas la ARQ-001 versión 1.0? [S/n]
```

- `S` o Enter: queda `Estado: Aprobada y congelada` y se guarda en `aprobadas/`, sin llamadas extra a la API.
- `n`: se guarda como Candidata en `borradores/` y queda lista para iterar.

### Flujo por mensajes (sin terminal o con `--continuar`)

Sin terminal (pipe o script) el script hace **una sola llamada**: el agente primero entrega el **estudio de análisis** (`Estado: Análisis`, guardado en `analisis/ARQ-00x/`) y **no propone todavía**. Luego:

1. Responde las preguntas de análisis. `--continuar` adjunta la última versión guardada:

```bash
python agente.py architecture-agent "Respuestas del equipo. ARCH-Q-001: ... ARCH-Q-002: ..." --continuar ARQ-001
```

Repite hasta tener una Candidata sin pendientes.

2. Aprobar (si no usaste `[S/n]`):

```bash
python agente.py architecture-agent "El equipo aprueba la ARQ-001" --continuar ARQ-001
```

3. Cambio después de aprobar: describe el cambio con `--continuar ARQ-001`. El agente entrega la siguiente versión como Candidata, con análisis de impacto.

**Numeración:** automática. El script calcula el siguiente número de ARQ (ARQ-002, ARQ-003...) a partir de lo guardado y lo inyecta al agente aunque lleves SPECs adjuntas. Si escribes tú el número, usas `--continuar`, o adjuntas un documento `ARQ-00x`, el script no la toca.

### Cómo revisar una propuesta

La propuesta se defiende sola: cada decisión tiene alternativas comparadas (matriz con pesos justificados), un ADR y su trazabilidad `SPEC-00x/RF-00x → Driver → ADR → COMP`. Revisa al menos:
- que los drivers nazcan de las SPECs y no de "modas" (si el agente agregó un driver que ninguna SPEC pide, debe haberlo consultado antes, no silenciosamente);
- que las restricciones 3.9 (equipo de cuatro personas, 8 semanas) y 3.11 (normativa) estén consideradas;
- que el Mermaid aparezca solo en el diagrama conceptual;
- que la fila de Implementación/TEST de la trazabilidad quede "pendiente de Planning/QA" (no la invente).

---

## Parte 6 — Flujo completo: los dos agentes en conjunto

Secuencia Spec-Driven: **HUMANO → Specification Agent → SPEC → Architecture Agent → ARQ → (Planning Agent → Coding Agent → QA Agent)**. El Architecture Agent entra solo cuando la SPEC está **aprobada y congelada**.

### Paso a paso con los comandos

| Etapa | Comando | Decides tú | Resultado |
|---|---|---|---|
| 1. Necesidad | `python agente.py specification-agent "Necesitamos que el paciente pueda cancelar su cita"` | Preguntas `OPEN-Q` (una a una con `>`) | Borrador 0.x de la SPEC |
| 2. Responder pendientes | `python agente.py specification-agent "Respuestas del equipo. OPEN-Q-001: ..." --continuar SPEC-001` | Repites hasta Candidata sin pendientes | Candidata 1.0 |
| 3. Congelar | `[S/n]` en terminal, o `... "El equipo aprueba la SPEC-001" --continuar SPEC-001` | Decides aprobar | `SPEC-001_v1.0` en `aprobadas/` |
| 4. Arquitectura (sola SPEC) | `python agente.py architecture-agent "Analiza la arquitectura" --aprobada SPEC-001` | Preguntas `ARCH-Q` | `ARQ-00x` análisis / propuesta |
| 4b. Arquitectura (épica) | `python agente.py architecture-agent "Analiza la arquitectura" --epica EPIC-001` | Igual; el agente recibe juntas las SPECs de la misma épica | Propuesta que integra varias SPECs |
| 5. Responder `ARCH-Q` | `python agente.py architecture-agent "Respuestas del equipo. ARCH-Q-001: ..." --continuar ARQ-001` | Respuestas de arquitectura | Candidata 1.0 de la ARQ |
| 6. Congelar | `[S/n]`, o `... "El equipo aprueba la ARQ-001" --continuar ARQ-001` | Decides aprobar la arquitectura | `ARQ-001_v1.0` en `aprobadas/` |

### Reglas que se mantienen en las dos etapas
- **La IA propone, una persona decide, el equipo valida.** Ningún agente convierte sus propuestas en decisiones: apruebas tú, en la terminal o con `--continuar`.
- **La épica la decide el equipo**, no el agente. El Specification Agent la pregunta (`OPEN-Q-...`); el Architecture Agent la recibe por `--epica`.
- **Los temas técnicos quedan marcados, no resueltos**: la sección 14 de una SPEC etiqueta los temas de construcción con "tema para arquitectura. Origen: RF-00x"; son insumo adicional para el Architecture Agent.
- **La SPEC se congela antes de la arquitectura.** Nunca corras el Architecture Agent con borradores: la entrada son solo SPECs aprobadas.
- **Salidas como evidencia**: todo el historial (borradores, análisis, aprobadas y `registro.md`) queda guardado para explicar por qué existe cada decisión.

### Ejemplo de recorrido real (lo que dejó la Fase C)
- SPEC-001 (aviso de privacidad y consentimiento, EPIC-001) y SPEC-002 (identificadores de Telegram, EPIC-002) quedaron aprobadas en `salidas/specification-agent/aprobadas/`.
- Con `--aprobada SPEC-001 SPEC-002` el Architecture Agent produjo el análisis `ARQ-001` (`analisis/ARQ-001/ARQ-001_v0.1.md`), luego la propuesta Candidata `ARQ-001 v1.0` y su versión aprobada en `salidas/architecture-agent/aprobadas/ARQ-001_v1.0.md` (monolito modular con adaptadores de canal y PostgreSQL local, decidido por el equipo).
- Con `--epica EPIC-002` produjo el análisis `ARQ-002`.

---

## Cuidados importantes
- **Datos personales:** no envíes datos reales de pacientes a ninguna API (Ley 1581 de 2012). Usa solo datos ficticios. Los planes gratuitos pueden usar lo que envías para entrenar o mejorar sus modelos.
- **Llaves de API:** si una se filtra, bórrala en la consola del proveedor y crea otra.
- **Límites de uso:** cada plan gratuito tiene límites por minuto y por día, y pueden cambiar. Consúltalos en la consola de tu proveedor. El script traduce los errores más comunes:
  - **413:** la solicitud es demasiado grande para el plan (pasa en Groq gratuito con el Specification Agent).
  - **429:** alcanzaste un límite de uso; espera un momento o hasta el día siguiente.
  - **503:** el modelo está saturado en ese momento; suele ser temporal.
  - Ante un 429 o un 503, el script prueba solo los `modelos_respaldo` del `config.json`.
  - **404:** el nombre del modelo no existe en ese proveedor; revisa con `--modelos`.
- **Respuesta cortada:** si el script avisa que la respuesta se cortó, sube `max_tokens` en el `config.json`.
- **Verificación:** la salida de un modelo puede contener errores. Toda cifra, norma o fuente debe verificarse antes de usarse en el proyecto.

## Referencias oficiales
- Mistral AI. (s. f.). *Documentation*. <https://docs.mistral.ai>
- Google. (s. f.). *Gemini API: compatibilidad con OpenAI*. <https://ai.google.dev/gemini-api/docs/openai>
- Google. (s. f.). *Gemini API: rate limits*. <https://ai.google.dev/gemini-api/docs/rate-limits>
- Groq. (s. f.). *Rate limits*. GroqDocs. <https://console.groq.com/docs/rate-limits>
- OpenRouter. (s. f.). *Limits*. <https://openrouter.ai/docs/api-reference/limits>
- Anthropic. (s. f.). *Claude Code: subagentes*. <https://code.claude.com/docs/en/sub-agents>