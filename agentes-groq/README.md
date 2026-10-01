# Agentes de IA — Pharma Express

Agentes de IA que apoyan el proyecto. Cada agente es una **instrucción de sistema** (`prompt.md`) + una **configuración** (`config.json`) que se ejecutan con un script común (`agente.py`).

> En este proyecto, un "agente" es: instrucción de sistema + proveedor + modelo + parámetros + script. El agente vive en este repositorio.

El script funciona con cualquier proveedor compatible con la API de OpenAI. Hoy admite **Mistral**, **Gemini**, **Groq** y **OpenRouter**. Cada agente escoge su proveedor en `config.json`. La carpeta conserva el nombre `agentes-groq` para no romper rutas.

---

## Qué proveedor usar

| Proveedor | ¿Gratis? | Límite que importa para el Specification Agent | Recomendación |
|---|---|---|---|
| **Mistral** (plan Experiment) | Sí, sin tarjeta. Pide verificar el celular y aceptar que usen tus datos para entrenamiento | Margen amplio por solicitud y por mes. Los límites exactos aparecen en la consola de tu cuenta | **Recomendado.** Es el que trae configurado el agente |
| **Gemini** (Google AI Studio) | Sí, sin tarjeta. Google puede usar los datos del plan gratuito para mejorar sus productos | Margen amplio por solicitud, pero pocas solicitudes al día en los modelos Flash. Los límites exactos aparecen en AI Studio | Alternativa si Mistral falla |
| **Groq** (plan gratuito) | Sí | Rechaza cualquier solicitud de más de 8.000 tokens (prompt + `max_tokens`). El Specification Agent no cabe | Solo para agentes con prompts cortos |
| **OpenRouter** (modelos `:free`) | Sí | Pocas solicitudes al día sin créditos | Respaldo |

Como los planes gratuitos pueden usar lo que envías, **nunca envíes datos reales de pacientes**. Usa solo datos ficticios.

---

## Estructura

```
agentes-groq/
├── README.md                  ← esta guía
├── agente.py                  ← script común que ejecuta cualquier agente
├── requirements.txt           ← dependencias (openai, python-dotenv)
├── .env.example               ← plantilla para las llaves de API
└── agentes/
    ├── _plantilla/            ← copia esta carpeta para crear un agente nuevo
    │   ├── config.json
    │   └── prompt.md
    └── specification-agent/   ← genera preguntas y una SPEC de una funcionalidad
        ├── config.json
        └── prompt.md
```

El marcador `{{CONTEXTO_PROYECTO}}` dentro de un `prompt.md` se reemplaza automáticamente por el contenido de `PHARMA_EXPRESS_AGENTES.md` (raíz del proyecto). Si un agente necesita otro archivo, lo indica con `archivo_contexto` en su `config.json`. El archivo se lee en cada ejecución, así que el contexto siempre está actualizado.

---

## Parte 1 — Configuración inicial (solo una vez)

### Paso 1. Crear la llave de la API de Mistral
1. Entra a <https://console.mistral.ai> y crea una cuenta.
2. Verifica tu número de celular y escoge el plan gratuito **Experiment**.
3. Crea una llave de API y **cópiala**.

Si prefieres Gemini: entra a <https://aistudio.google.com/app/apikey>, crea una llave y cambia el proveedor del agente (Parte 2, "Cambiar de proveedor").

### Paso 2. Guardar la llave
Desde la carpeta `agentes-groq`:

```bash
cp .env.example .env
```

Abre `.env` y pega tu llave en `MISTRAL_API_KEY`. Solo hace falta la llave del proveedor que uses. El archivo `.env` está en `.gitignore`: **nunca lo subas a git ni lo compartas**.

### Paso 3. Crear el entorno de Python e instalar dependencias

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

Debe mostrar `specification-agent`. Para confirmar que la llave funciona y ver los modelos disponibles:

```bash
python agente.py --modelos mistral
```

---

## Parte 2 — Usar el Specification Agent

**Qué hace:** recibe la necesidad informal de **una sola funcionalidad** y devuelve preguntas de aclaración (`OPEN-Q-001`...) y una SPEC de 17 secciones, sin decisiones técnicas. Trabaja por versiones: borrador `0.x`, candidata `1.0` con solicitud de aprobación, y aprobada y congelada.

**Requisito:** el archivo `PHARMA_EXPRESS_AGENTES.md` en la raíz del proyecto.

Cada ejecución es independiente: el agente itera recibiendo como adjunto su salida anterior.

1. Primera versión (modo inicial):

```bash
python agente.py specification-agent "Necesitamos que el paciente pueda cancelar su cita"
```

2. Siguiente versión (modo iteración). Responde las preguntas en la petición y adjunta la salida anterior:

```bash
python agente.py specification-agent "Respuestas del equipo. OPEN-Q-001: ... OPEN-Q-002: ..." --adjuntar salidas/specification-agent/<archivo-anterior>.md
```

Repite el paso 2 hasta que el agente entregue la versión 1.0 con la solicitud de aprobación.

3. Aprobación:

```bash
python agente.py specification-agent "El equipo aprueba la SPEC-001 versión 1.0" --adjuntar salidas/specification-agent/<archivo-version-1.0>.md
```

4. Cambio después de aprobar: describe el cambio en la petición y adjunta la versión aprobada. El agente entrega la versión 1.1 con el análisis de impacto.

**Numeración:** para la segunda funcionalidad y las siguientes, indica el número de SPEC y los números iniciales para no repetir identificadores. Por ejemplo: *"SPEC-002, empieza en RF-015, BR-010, AC-020. Necesitamos que..."*.

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

El agente está en `.claude/agents/specification-agent.md` (raíz del proyecto). Tiene las mismas reglas, convenciones y formato de salida que `agentes/specification-agent/prompt.md`. La diferencia es que lee `PHARMA_EXPRESS_AGENTES.md` por su cuenta y guarda cada versión en `agentes-groq/salidas/specification-agent/`.

### Instalar Claude Code (solo una vez)
Sigue la guía oficial: <https://code.claude.com/docs/en/overview>. Al iniciar sesión, entra con tu cuenta del plan Pro, no con una llave de la consola de API.

### Usarlo
Desde la raíz del proyecto, abre Claude Code con `claude` y escríbele:

1. Primera versión:
   *"Usa el agente specification-agent con esta necesidad: Necesitamos que el paciente pueda cancelar su cita"*
2. Siguiente versión:
   *"Usa el agente specification-agent. Respuestas del equipo: OPEN-Q-001: ... OPEN-Q-002: ... SPEC anterior: agentes-groq/salidas/specification-agent/SPEC-001_v0.1.md"*
3. Aprobación:
   *"Usa el agente specification-agent. El equipo aprueba la SPEC de agentes-groq/salidas/specification-agent/SPEC-001_v1.0.md"*

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

## Cuidados importantes
- **Datos personales:** no envíes datos reales de pacientes a ninguna API (Ley 1581 de 2012). Usa solo datos ficticios. Los planes gratuitos pueden usar lo que envías para entrenar o mejorar sus modelos.
- **Llaves de API:** si una se filtra, bórrala en la consola del proveedor y crea otra.
- **Límites de uso:** cada plan gratuito tiene límites por minuto y por día, y pueden cambiar. Consúltalos en la consola de tu proveedor. El script traduce los errores más comunes:
  - **413:** la solicitud es demasiado grande para el plan (pasa en Groq gratuito con el Specification Agent).
  - **429:** alcanzaste un límite de uso; espera un momento o hasta el día siguiente.
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