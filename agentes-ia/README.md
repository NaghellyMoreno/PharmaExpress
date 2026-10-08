# Agentes de IA — Pharma Express

Agentes de IA que apoyan el proyecto. Cada agente es una **instrucción de sistema** (`prompt.md`) + una **configuración** (`config.json`) que se ejecutan con un script común (`agente.py`).

> En este proyecto, un "agente" es: instrucción de sistema + proveedor + modelo + parámetros + script. El agente vive en este repositorio.

Hay tres formas de ejecutar los agentes, de mejor a menor calidad:

1. **Claude Code** (Parte 3): subagentes en `.claude/agents/`. No necesitan llave de API y usan el modelo de tu plan de Claude.
2. **API gratuita en la nube** con `agente.py`: OpenRouter (modelos `:free`) por defecto, más Groq.
3. **IA local** con `agente.py` y Ollama: funciona sin internet y sin enviar datos a terceros, pero con menor calidad (ver "IA local con Ollama").

El script funciona con cualquier proveedor compatible con la API de OpenAI. Cada agente escoge su proveedor en `config.json` y puede pasar a otro proveedor si el principal falla.

---

## Qué proveedor usar

| Proveedor | ¿Gratis? | Límite que importa | Uso en este proyecto |
|---|---|---|---|
| **Claude Code** | Incluido en el plan Pro de Claude | Límites de uso del plan | **Recomendado** para SPEC e historias de usuario |
| **OpenRouter** (modelos `:free`) | Sí, sin tarjeta. Los proveedores de los modelos gratuitos pueden usar lo que envías | 20 solicitudes por minuto y 50 al día sin créditos (1.000 al día con 10 USD comprados una vez). Cada intento de respaldo cuenta. El catálogo gratuito cambia | Proveedor principal de `agente.py` |
| **Ollama** (IA local) | Sí, corre en tu equipo | Con 8 GB de RAM solo caben modelos de ~4B parámetros: lentos y menos precisos con prompts largos | Último respaldo y uso sin internet |
| **Groq** (plan gratuito) | Sí | Máximo 8.000 tokens por minuto (prompt + `max_tokens`). El Specification Agent no cabe | Generador de HU |
| **Gemini** | Sí, con pocas solicitudes al día en los modelos Flash | Cupo diario bajo | Ya no se usa por defecto |

Como los planes gratuitos pueden usar lo que envías, **nunca envíes datos reales de pacientes**. Usa solo datos ficticios.

---

## Estructura

```
agentes-ia/
├── README.md                  ← esta guía
├── agente.py                  ← punto de entrada: python agente.py ... (solo llama a motor/cli.py)
├── motor/                     ← lógica común, un módulo por responsabilidad
│   ├── cli.py                 ← argumentos y comandos; une las demás piezas
│   ├── agentes.py             ← lista y carga los agentes (config.json + prompt.md + contexto)
│   ├── proveedores.py         ← proveedores (OpenRouter, Groq, Ollama...) y sus clientes
│   ├── intentos.py            ← orden de modelos: principal + modelos_respaldo, --proveedor, --modelo
│   ├── ejecutor.py            ← llama al modelo y pasa al respaldo si falla
│   ├── mensajes.py            ← petición + archivos adjuntos
│   ├── errores.py / rutas.py  ← errores mostrados en una línea y carpetas del proyecto
│   └── salidas/               ← formas de guardar: simple.py (por defecto), spec.py (por SPEC)
│                                 y arquitectura.py (por ARQ, y escoge las SPEC de entrada)
├── requirements.txt           ← dependencias (openai, python-dotenv)
├── .env                       ← llaves de API (no se sube a git)
├── ollama/
│   ├── Modelfile              ← modelo local "pharma-qwen" con el contexto ampliado
│   └── Modelfile-arquitectura ← modelo "pharma-qwen-arq" (65.536 tokens) para el Architecture Agent
├── agentes/
│   ├── _plantilla/            ← copia esta carpeta para crear un agente nuevo
│   ├── specification-agent/   ← genera preguntas y una SPEC de una funcionalidad
│   ├── architecture-agent/    ← genera el Architecture Package (ARQ-001) desde las SPEC aprobadas
│   └── generador-hu-invest/   ← genera historias de usuario y las evalúa con INVEST
└── salidas/                   ← respuestas guardadas
    ├── specification-agent/   ← SPEC por versión y registro.md
    ├── architecture-agent/    ← ARQ-001 por versión y registro.md
    └── User-Strories/         ← backlog (UserStory.md) e historias del generador en generadas/

.claude/agents/                ← los mismos agentes como subagentes de Claude Code (raíz del proyecto)
├── specification-agent.md
├── architecture-agent.md
├── generador-hu-invest.md
└── user-story-reviewer.md
```

El marcador `{{CONTEXTO_PROYECTO}}` dentro de un `prompt.md` se reemplaza automáticamente por el contenido de `PHARMA_EXPRESS_AGENTES.md` (raíz del proyecto). Si un agente necesita otro archivo, lo indica con `archivo_contexto` en su `config.json`. El archivo se lee en cada ejecución, así que el contexto siempre está actualizado.

**Si cambias un `prompt.md`, copia el mismo cambio al subagente de `.claude/agents/`.** Los subagentes tienen las mismas reglas; solo cambia cómo leen el contexto y cómo guardan los archivos.

## Parte 1 — Configuración inicial (solo una vez)

### Paso 1. Crear la llave de la API de OpenRouter
1. Entra a <https://openrouter.ai> y crea una cuenta. No pide tarjeta.
2. En *Settings → Privacy*, permite el uso de los modelos gratuitos. Si no lo haces, los modelos `:free` responden 404 ("No endpoints found matching your data policy").
3. En *Keys* (<https://openrouter.ai/keys>), crea una llave y **cópiala**.

Si prefieres Gemini: entra a <https://aistudio.google.com/app/apikey>, crea una llave y cambia el proveedor del agente (Parte 2, "Cambiar de proveedor").

### Paso 2. Guardar la llave
Abre el archivo `.env` de la carpeta `agentes-ia` y pega tu llave en `OPENROUTER_API_KEY` (las demás van en `GROQ_API_KEY` y `GEMINI_API_KEY`; Ollama no necesita llave). Solo hace falta la llave del proveedor que uses. El archivo `.env` está en `.gitignore`: **nunca lo subas a git ni lo compartas**.

### Paso 3. Crear el entorno de Python e instalar dependencias

Necesitas Python 3.9 o superior (`python3 --version`). En macOS ya viene instalado. Si usas Anaconda y tu terminal muestra `(base)`, igual crea y activa el `.venv`: el Python de conda no tiene estas dependencias.

```bash
python3 -m venv .venv
```

```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
```

### Paso 4. Verificar

```bash
python agente.py --listar
```

Debe mostrar `architecture-agent`, `generador-hu-invest` y `specification-agent`. Para confirmar que la llave funciona y ver los modelos disponibles:

```bash
python agente.py --modelos openrouter
```

---

## Parte 2 — Usar el Specification Agent

**Qué hace:** recibe la necesidad informal de **una sola funcionalidad** y devuelve preguntas de aclaración (`OPEN-Q-001`...) y una SPEC de 17 secciones, sin decisiones técnicas. Trabaja por versiones: borradores `0.x`, candidatas `1.0`, `1.1`... y una versión aprobada y congelada.

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
- Ningún archivo se sobrescribe: si el nombre ya existe, se agrega `_2`, `_3`.
- Los borradores se conservan como evidencia del proceso.

### Comandos

1. Primera versión:

```bash
python agente.py specification-agent "Necesitamos que el paciente pueda cancelar su cita"
```

2. Responder preguntas o pedir correcciones. `--continuar` adjunta solo la última versión completa de la SPEC, así que no hace falta escribir nombres de archivo:

```bash
python agente.py specification-agent "Respuestas del equipo. OPEN-Q-001: ... OPEN-Q-002: ..." --continuar SPEC-001
```

Repite el paso 2 hasta que el agente entregue una versión Candidata sin pendientes.

3. Aprobar:

```bash
python agente.py specification-agent "El equipo aprueba la SPEC-001" --continuar SPEC-001
```

4. Cambio después de aprobar: describe el cambio y usa `--continuar SPEC-001`. El agente entrega la siguiente versión como Candidata, con el análisis de impacto.

**Numeración:** para la segunda funcionalidad y las siguientes, indica el número de SPEC y los números iniciales para no repetir identificadores. Por ejemplo: *"SPEC-002, empieza en RF-013, BR-009, AC-013. Necesitamos que..."*.

**Archivos del formato anterior:** si tienes respuestas guardadas antes de esta estructura (nombres con fecha y hora en la carpeta principal), organízalas una sola vez con:

```bash
python agente.py --organizar specification-agent
```

### Respaldo automático entre proveedores
Si un modelo responde 404 (retirado), 429 (sin cupo), 5xx (saturado) o no hay conexión, el script prueba el siguiente de `modelos_respaldo`. El Specification Agent usa este orden:

1. `google/gemma-4-31b-it:free` (OpenRouter)
2. `nvidia/nemotron-3-ultra-550b-a55b:free` (OpenRouter)
3. `openrouter/free` (OpenRouter escoge un modelo gratuito disponible)
4. `pharma-qwen` (Ollama, local)

Los modelos gratuitos de OpenRouter cambian con el tiempo. Si uno responde 404, consulta los vigentes con `python agente.py --modelos openrouter` (los gratuitos terminan en `:free`) y actualiza el `config.json`.

El archivo guardado y `registro.md` indican qué modelo respondió. **Revisa con más cuidado las versiones hechas con `pharma-qwen`**: un modelo local pequeño se equivoca más con la numeración, el origen de cada requisito y las 17 secciones.

### Escoger el proveedor en una ejecución
Sin editar `config.json`, usa `--proveedor` y, si quieres, `--modelo`. Así se usa solo ese modelo, sin respaldos:

```bash
python agente.py specification-agent "..." --continuar SPEC-002 --proveedor ollama
python agente.py specification-agent "..." --proveedor openrouter --modelo "<modelo>:free"
```

Consulta los nombres exactos con `python agente.py --modelos <proveedor>`.

### Cambiar de proveedor de forma permanente
Edita `proveedor`, `modelo` y `modelos_respaldo` en el `config.json` del agente. Un respaldo de otro proveedor se escribe como objeto y, si ese proveedor no acepta los mismos parámetros, con sus propios `parametros`:

```json
"modelos_respaldo": [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  {"proveedor": "ollama", "modelo": "pharma-qwen"}
]
```

---

## Parte 2B — Usar el Architecture Agent

**Qué hace:** recibe las SPEC aprobadas y el contexto del producto y devuelve el **Architecture Package** del sistema (`ARQ-001`): reporte de cobertura de SPEC, Architecture Drivers (`DRV-001`...), restricciones, atributos de calidad, alternativas por dimensión con su matriz de decisión, arquitectura recomendada, diagramas Mermaid por niveles C4, componentes (`COMP-001`...), integraciones, ADR (`ADR-001`...), diseño, patrones, riesgos, supuestos, preguntas técnicas (`TQ-001`...) y trazabilidad. Sigue la guía del curso "Architecture Agent en Spec-Driven Development": **la IA propone, el equipo decide**.

**Entradas automáticas:** el script adjunta la versión vigente de cada SPEC aprobada (la versión más alta y, a igual versión, el sufijo más alto: `SPEC-001_v1.3_2` antes que `SPEC-001_v1.3`) y un inventario de las SPEC que no están aprobadas. Las SPEC van sin sus secciones de proceso (análisis, preguntas, trazabilidad interna, historial y verificación), lo que ahorra unos 4.000 tokens; los requisitos, reglas, flujos, casos límite, criterios de aceptación y decisiones del equipo se conservan. Ignora las SPEC de `specs_ignoradas` en el `config.json` (hoy, `SPEC-901`, que es de prueba).

**Arquitectura parcial:** las decisiones globales pueden basarse en la sección 3 del contexto; los componentes y las integraciones detalladas solo se definen para funcionalidades con SPEC aprobada. Las demás áreas quedan como "módulo previsto, pendiente de SPEC" y el reporte de cobertura propone la necesidad de cada SPEC faltante para el Specification Agent. Cuando se aprueban SPEC nuevas, la arquitectura se amplía con una nueva versión.

**Versiones:** igual que la SPEC. Borradores `0.x` mientras haya preguntas técnicas críticas, candidata `1.0` y aprobada y congelada. Después de aprobar, cada ampliación sube a `1.1`, `1.2`... Los ADR quedan "Propuesto" hasta que el equipo aprueba el paquete; un ADR aceptado no se edita: se reemplaza con uno nuevo. Las respuestas a las TQ se registran en la propia TQ y los ADR las citan como evidencia.

```
salidas/architecture-agent/
├── aprobadas/                 ← solo versiones aprobadas y congeladas (entrada del Planning Agent)
├── borradores/
│   └── ARQ-001/               ← borradores y candidatas
├── sin-clasificar/            ← respuestas sin encabezado de ARQ
└── registro.md
```

### Comandos

1. Primera versión:

```bash
python agente.py architecture-agent "Diseñar la arquitectura inicial de Pharma Express"
```

2. Responder preguntas técnicas o pedir correcciones:

```bash
python agente.py architecture-agent "Respuestas del equipo. TQ-001: ... TQ-002: ..." --continuar ARQ-001
```

3. Aprobar:

```bash
python agente.py architecture-agent "El equipo aprueba la ARQ-001" --continuar ARQ-001
```

4. Ampliar después de aprobar una SPEC nueva:

```bash
python agente.py architecture-agent "Ampliar con la SPEC-004 aprobada" --continuar ARQ-001
```

### Con la IA local (Ollama)

La petición ronda los 20.000 tokens y la respuesta puede pasar de 20.000, así que no cabe en los 32.768 de `pharma-qwen`. Este agente usa su propio modelo local, `pharma-qwen-arq`, con 65.536 tokens de contexto. Créalo una sola vez, después de los pasos de "IA local con Ollama":

```bash
ollama create pharma-qwen-arq -f ollama/Modelfile-arquitectura
```

Y ejecútalo con:

```bash
python agente.py architecture-agent "Diseñar la arquitectura inicial de Pharma Express" --proveedor ollama
```

- **Tiempo:** en un equipo de 8 GB, leer la petición toma unos 5 minutos y el modelo escribe unos 13 tokens por segundo, así que una versión completa puede tardar entre 30 y 60 minutos. El script espera hasta 2 horas y no reintenta.
- **Sin razonamiento:** el `config.json` envía `reasoning_effort: "none"` a Ollama. Si no, qwen gasta miles de tokens "pensando" antes de responder, y no caben.
- **Memoria:** con el motor MLX de Ollama, la memoria crece con los tokens que se usan: se midieron 5,25 GB con 25.000 tokens. Cierra las aplicaciones pesadas. Al continuar ARQ-001 también se adjunta la versión anterior del paquete y la petición crece; si el equipo se queda sin memoria, haz las iteraciones con Claude Code u OpenRouter.
- **Calidad:** un modelo de 4B parámetros se equivoca más con la numeración, las matrices y la trazabilidad. Úsalo para borradores y revisa con más cuidado lo que produce; no apruebes una arquitectura sin revisarla.
- Si la respuesta se corta (`_INCOMPLETA`), sube `max_tokens` del respaldo `pharma-qwen-arq` en el `config.json`, sin pasar de unos 40.000.

---

## IA local con Ollama

Sirve para trabajar sin internet, sin cupos y sin enviar datos a terceros. Con 8 GB de RAM el modelo recomendado es `qwen3.5:4b` (unos 3,4 GB). Un modelo de este tamaño tiene un puntaje muy inferior a los modelos en la nube, así que úsalo como respaldo o para borradores, no para aprobar SPEC.

### Instalar (solo una vez)
1. Descarga Ollama desde <https://ollama.com/download> e instálalo. Debe quedar abierto (ícono en la barra de menú).
2. Desde la carpeta `agentes-ia`, descarga el modelo y crea `pharma-qwen`:

```bash
ollama pull qwen3.5:4b
ollama create pharma-qwen -f ollama/Modelfile
```

El `Modelfile` amplía el contexto a 32.768 tokens. Sin ese paso, Ollama usa un contexto corto y **recorta en silencio** el prompt del Specification Agent, que necesita unos 20.000 tokens cuando lleva una SPEC adjunta.

### Usar

```bash
python agente.py specification-agent "Necesitamos que..." --proveedor ollama
```

- La primera respuesta tarda más porque Ollama carga el modelo en memoria. Una SPEC completa puede tardar varios minutos.
- Cierra otras aplicaciones pesadas mientras corre: el modelo y el contexto usan buena parte de los 8 GB.
- Si el equipo tiene más memoria, puedes cambiar `FROM` en el `Modelfile` por un modelo más grande y volver a ejecutar `ollama create`.

---

## Parte 3 — Usar los agentes con Claude Code (plan Pro de Claude)

Si tienes el plan Pro de Claude, también puedes ejecutar los agentes con Claude Code, que está incluido en ese plan y no necesita llave de API. El uso se descuenta de los límites de tu plan Pro. Es la opción con mejor calidad y el respaldo cuando las API gratuitas no responden.

Los subagentes están en `.claude/agents/` (raíz del proyecto):

- `specification-agent.md`: mismas reglas, convenciones y formato que `agentes/specification-agent/prompt.md`. Lee `PHARMA_EXPRESS_AGENTES.md` por su cuenta y guarda cada versión con la misma estructura de carpetas de la Parte 2.
- `architecture-agent.md`: mismas reglas, convenciones y formato que `agentes/architecture-agent/prompt.md`. Busca por su cuenta las SPEC aprobadas vigentes y guarda cada versión con la estructura de la Parte 2B.
- `generador-hu-invest.md`: mismas reglas que `agentes/generador-hu-invest/prompt.md`. Guarda en `agentes-ia/salidas/User-Strories/generadas/`.
- `user-story-reviewer.md`: revisa y corrige historias de usuario existentes.

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

Para la arquitectura:
   *"Usa el agente architecture-agent para diseñar la arquitectura inicial"*
   *"Usa el agente architecture-agent. Continuar ARQ-001. Respuestas del equipo: TQ-001: ..."*
   *"Usa el agente architecture-agent. Continuar ARQ-001. El equipo aprueba la arquitectura."*

Para historias de usuario:
   *"Usa el agente generador-hu-invest: genera 5 historias para la épica de cancelación de citas, empieza en HU-10"*

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
| `proveedor` | Dónde corre el modelo: `openrouter`, `groq`, `gemini` u `ollama` (local) | `openrouter` |
| `modelo` | ID del modelo en ese proveedor | `google/gemma-4-31b-it:free`. Consulta los disponibles con `python agente.py --modelos <proveedor>` |
| `organizacion_salida` | Opcional. `"spec"` guarda por SPEC y estado y habilita `--continuar` | Solo para agentes que producen SPEC con el encabezado `# SPEC-00x. Nombre - Versión X.Y` |
| `modelos_respaldo` | Opcional. Modelos que se prueban, en orden, si el principal está saturado (5xx), sin cupo (429) o sin conexión | Otros modelos del mismo proveedor y, al final, `{"proveedor": "ollama", "modelo": "pharma-qwen"}` |
| `parametros.temperature` | Qué tan creativo es | `0`–`0.2` para extraer o clasificar; `0.5` para redactar; `0.8` para ideas creativas |
| `parametros.max_tokens` | Límite de largo de la respuesta | Un poco más de lo que esperas recibir |
| `archivo_contexto` | Opcional. Archivo que reemplaza `{{CONTEXTO_PROYECTO}}` | Omítelo para usar `PHARMA_EXPRESS_AGENTES.md`. Relativo a la raíz del proyecto. No se envía a la API |
| `carpeta_salida` | Dónde se guardan los resultados | Relativa a la raíz del proyecto |

Todo lo que esté en `parametros` se envía tal cual a la API del proveedor. Si un proveedor rechaza un parámetro, bórralo del `config.json`.

### Paso 5. Probar el prompt en el playground del proveedor (recomendado)
1. Abre el playground de tu proveedor (en OpenRouter, el chat de <https://openrouter.ai/chat>; en Gemini, <https://aistudio.google.com>).
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

## Cuidados importantes
- **Datos personales:** no envíes datos reales de pacientes a ninguna API (Ley 1581 de 2012). Usa solo datos ficticios. Los planes gratuitos pueden usar lo que envías para entrenar o mejorar sus modelos.
- **Llaves de API:** si una se filtra, bórrala en la consola del proveedor y crea otra.
- **Límites de uso:** cada plan gratuito tiene límites por minuto y por día, y pueden cambiar. Consúltalos en la consola de tu proveedor. El script traduce los errores más comunes:
  - **413:** la solicitud es demasiado grande para el plan (pasa en Groq gratuito con el Specification Agent).
  - **429:** alcanzaste un límite de uso; espera un momento o hasta el día siguiente.
  - **503:** el modelo está saturado en ese momento; suele ser temporal.
  - Ante un 404, un 429, un 5xx o un error de conexión, el script prueba los `modelos_respaldo` del `config.json`, aunque sean de otro proveedor.
  - **404:** el modelo no existe o fue retirado en ese proveedor, o (en OpenRouter) la configuración de privacidad bloquea los modelos gratuitos; revisa con `--modelos`.
- **IA local lenta:** con Ollama el script espera hasta 2 horas por respuesta y no reintenta, porque reintentar repite todo el trabajo. Si se agota el tiempo, muestra "Se agotó el tiempo de espera".
- **Respuesta cortada:** si el script avisa que la respuesta se cortó, sube `max_tokens` en el `config.json`.
- **Verificación:** la salida de un modelo puede contener errores. Toda cifra, norma o fuente debe verificarse antes de usarse en el proyecto.

## Referencias oficiales
- Google. (s. f.). *Gemini API: compatibilidad con OpenAI*. <https://ai.google.dev/gemini-api/docs/openai>
- Google. (s. f.). *Gemini API: rate limits*. <https://ai.google.dev/gemini-api/docs/rate-limits>
- Groq. (s. f.). *Rate limits*. GroqDocs. <https://console.groq.com/docs/rate-limits>
- OpenRouter. (s. f.). *Limits*. <https://openrouter.ai/docs/api-reference/limits>
- Ollama. (s. f.). *Documentation*. <https://docs.ollama.com>
- Anthropic. (s. f.). *Claude Code: subagentes*. <https://code.claude.com/docs/en/sub-agents>