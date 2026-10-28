# Architecture Decision Agent V0.1

Aplicación local que analiza archivos Markdown y produce una propuesta de arquitectura pendiente de validación humana. Hace una o dos peticiones por análisis a Gemini.

## Instalación

```sh
uv sync
```

`pyproject.toml` y `uv.lock` son la fuente principal de dependencias. `requirements.txt` se conserva para instalaciones existentes con pip.

## Configuración

Mantené `.env` en la raíz del proyecto, sin versionarlo ni copiarlo a `.venv/`. Debe definir:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

`GEMINI_MODEL` es opcional; por defecto se usa `gemini-3.5-flash-lite`. La aplicación carga `.env` al iniciar sin sobrescribir variables ya definidas en el entorno. Para el botón Run del editor, seleccioná `.venv/bin/python`; `/bin/python3` puede no tener las dependencias del proyecto.

## Uso

El agente acepta uno o más archivos Markdown. La cantidad de archivos no determina si el contexto es suficiente: un único archivo puede contener toda la información necesaria. El flujo es Markdown → preflight humano de despliegue → análisis → preguntas si falta información material → respuestas humanas → segundo análisis → resultado. Hay como máximo una ronda de aclaraciones y dos llamadas al modelo. Si aún devuelve `NEEDS_INFORMATION`, muestra las preguntas restantes y termina; el humano completa el contexto y ejecuta nuevamente.

## Interfaz gráfica

Con `.venv` activado:

```sh
python main.py
```

Streamlit presenta recomendación, justificación, alternativas, trade-offs, riesgos, ADR y trazabilidad. El despliegue se indica antes de analizar o se marca como no definido. Solo los botones **Analizar arquitectura** y **Continuar análisis** llaman a GenerateContent; las mediciones opcionales usan `count_tokens`. Las aclaraciones humanas se incorporan a la segunda y última inferencia.

## CLI

La CLI solicita una ruta por línea si no se indican archivos. Antes de inferir, pregunta por plataforma o entorno de despliegue; una respuesta vacía queda explícitamente como no definido:

```sh
python main.py --cli
```

## CLI con archivos

```sh
python main.py --cli --files proyecto.md
python main.py --cli --files contexto.md requisitos.md
python main.py --cli --files contexto.md requisitos.md flujos.md
python main.py --cli --files contexto.md --deployment Vercel
```

Para ejecutar un análisis real, desde la terminal local del proyecto:

```sh
uv run python main.py --cli --files ruta/al/contexto.md ruta/a/la/spec.md
```

Seleccioná explícitamente los Markdown aprobados pertinentes, una sola copia por ID y versión de SPEC. El programa no incorpora archivos adicionales de `data/`. No incluyas `data/Guia - Architecture Agent.pdf` como contexto del producto.

La inferencia recibe los archivos completos seleccionados, en orden, con un marcador por archivo. El Architecture Evidence Pack sigue disponible para auditoría local y no se envía al modelo. El manifiesto conserva hashes y tamaños de ambos formatos; `context_sha256` representa el texto de la última inferencia, incluidos `HUMAN_PREFLIGHT` y las aclaraciones posteriores cuando existan. `usage` agrega tokens reportados por las llamadas y `calls` separa cada una sin guardar textos humanos. El proxy local de tokens no equivale al tokenizador de Gemini. `count_tokens`, cuando responde, mide el contexto lossless y la instrucción del sistema por separado y estima cada petición; esa estimación puede no incluir el esquema Structured Output. El umbral `ARCHITECTURE_CONTEXT_TOKEN_WARNING` (35000 por defecto) solo muestra una advertencia.

La salida válida se guarda en `outputs/architecture-analysis.json` y `outputs/architecture-analysis.md`. Si Gemini devuelve JSON pero falla la validación local, la respuesta se guarda en `outputs/architecture-analysis.rejected.json`. `NEEDS_INFORMATION` contiene hasta cinco preguntas y no genera ADR. `READY` muestra la recomendación validada en terminal y genera una propuesta con `ADR-001` en estado `PROPOSED`. También incluye `quality_attributes`, `design_decisions`, `design_patterns` y `open_questions`; las listas pueden estar vacías cuando el contexto no justifica elementos. `design_patterns.conclusion` explica la selección o la ausencia de patrones. Estos bloques son propuestas pendientes de validación humana, no decisiones aprobadas. Restricciones y supuestos aún no tienen bloques independientes.

La petición a Gemini usa un esquema JSON para fijar estructura, propiedades y tipos. JSON Schema no garantiza por sí solo la igualdad dinámica entre `recommendation.architecture` y uno de los `alternatives[].name`; `result_handler` comprueba esa coincidencia exacta en READY. `HUMAN_PREFLIGHT` recoge el despliegue antes de la primera inferencia; `HUMAN_CLARIFICATIONS` recoge respuestas a `NEEDS_INFORMATION`. Una plataforma como Vercel no aprueba por sí misma framework o lenguaje.

La validación local también comprueba que el ADR nombre exactamente la recomendación y las alternativas, conserve los drivers, los trade-offs, riesgos y condiciones de revisión. Estos controles verifican consistencia estructural; la calidad de los argumentos requiere revisión humana. Los casos y la rúbrica para una comparación controlada están en `DECISION_QUALITY_EVALUATION_V1.md`.

Cada ejecución con archivos de entrada genera además `outputs/architecture-analysis.run.json`, un manifiesto separado que identifica fuentes, hashes, tamaños locales del prompt y del esquema, uso por llamada, resultado de validación y hash de salida. No almacena corpus ni respuestas humanas. El caching implícito puede aplicar según el modelo; no se configura caching explícito. [La documentación de Gemini](https://ai.google.dev/gemini-api/docs/generate-content/caching) indica que los límites estándar incluyen tokens cacheados, por lo que caching no se asume como reducción de TPM.

## Tests

```sh
uv run pytest -q
```

La suite no llama a Gemini. La integración requiere una ejecución manual con credenciales propias.

## Diagnóstico de inferencia

Los errores operacionales se muestran en terminal y se registran en `architecture-analysis.run.json` mediante `error_type`, `error_message`, `http_status`, `retry_after` y `duration_seconds` cuando corresponden. `RATE_LIMITED` significa que el proveedor devolvió HTTP 429; el detalle real y `Retry-After`, si existe, ayudan a investigar la causa. `CLIENT_TIMEOUT` significa que la aplicación dejó de esperar tras 120 segundos; no demuestra por sí solo un fallo del proveedor. `AUTHENTICATION_ERROR` corresponde a HTTP 401, `AUTHORIZATION_ERROR` a HTTP 403, `PROVIDER_HTTP_ERROR` a otros HTTP no exitosos y `NETWORK_ERROR` a fallos de conexión. `INVALID_PROVIDER_RESPONSE` indica una respuesta HTTP exitosa con formato del proveedor inválido. `OUTPUT_VALIDATION_ERROR` indica que el modelo respondió pero incumplió el contrato local; si el contenido era JSON se conserva en `architecture-analysis.rejected.json`. No hay retry automático.
