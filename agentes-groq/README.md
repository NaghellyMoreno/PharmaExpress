# Agentes de Groq — Pharma Express

Agentes de IA que usan la API de [Groq](https://console.groq.com) para apoyar el proyecto.
Cada agente es una **instrucción de sistema** (`prompt.md`) + una **configuración** (`config.json`) que se ejecutan con un script común (`agente.py`).

> En este proyecto, un "agente" es: instrucción de sistema + modelo + parámetros + script. La consola de Groq sirve para crear la llave de la API y probar prompts en el Playground; el agente vive en este repositorio.

---

## Estructura

```
agentes-groq/
├── README.md                  ← esta guía
├── agente.py                  ← script común que ejecuta cualquier agente
├── requirements.txt           ← dependencias (groq, python-dotenv)
├── .env.example               ← plantilla para la llave de la API
└── agentes/
    ├── _plantilla/            ← copia esta carpeta para crear un agente nuevo
    │   ├── config.json
    │   └── prompt.md
    └── generador-hu-invest/   ← agente 1: genera historias de usuario con INVEST
        ├── config.json
        └── prompt.md
```

El marcador `{{CONTEXTO_PROYECTO}}` dentro de un `prompt.md` se reemplaza automáticamente por el contenido de `PHARMA_EXPRESS_CONTEXTO.md` (raíz del proyecto). Así todos los agentes usan siempre el contexto actualizado del proyecto.

---

## Parte 1 — Configuración inicial (solo una vez)

### Paso 1. Crear la llave de la API
1. Entra a <https://console.groq.com> e inicia sesión.
2. Ve a **API Keys** (<https://console.groq.com/keys>) y pulsa **Create API Key**.
3. Ponle un nombre (p. ej. `pharma-express`) y **copia la llave**: solo se muestra una vez.

### Paso 2. Guardar la llave
Desde la carpeta `agentes-groq`:

```bash
cp .env.example .env
```

Abre `.env` y reemplaza `pega_aqui_tu_llave` por tu llave. El archivo `.env` está en `.gitignore`: **nunca lo subas a git ni lo compartas**.

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

Debe mostrar `generador-hu-invest`.

---

## Parte 2 — Usar el agente de historias de usuario

**Qué hace:** genera historias de usuario **desde cero** con el contexto de `PHARMA_EXPRESS_CONTEXTO.md`, en el formato del proyecto ("Yo, como / quiero / para" + "Está hecho cuando" con Dado/Cuando/Entonces), y las **autoevalúa con INVEST**. Si una historia no cumple, el agente debe corregirla antes de entregarla.

**Qué entrega:** supuestos, historias con su tabla INVEST y comentario, y una tabla resumen con el puntaje de cada historia.

### Ejemplos

Generar historias de una épica:

```bash
python agente.py generador-hu-invest "Genera 5 historias para la épica de atención asistida a adultos mayores sin celular"
```

Complementar historias existentes sin duplicarlas:

```bash
python agente.py generador-hu-invest "Genera 4 historias nuevas para la épica de canal WhatsApp, empezando en HU-31" --adjuntar ../User-Strories/UserStory.md
```

Modo interactivo (el script te pregunta la petición):

```bash
python agente.py generador-hu-invest
```

El resultado se muestra en pantalla y se guarda en `User-Strories/generadas/`. Usa `--no-guardar` si solo quieres verlo.

### Consejos para pedirle historias
- Indica **épica o tema**, **cantidad** y **número inicial** (`HU-31`).
- Si quieres un rol específico, nómbralo: *"desde el punto de vista del cuidador"*.
- Adjunta las historias existentes para que no se repitan.
- **Revisa siempre la salida**: el agente es un apoyo, no reemplaza el criterio del equipo. Verifica en particular que no haya cifras o normas inventadas.

---

## Parte 3 — Paso a paso para crear próximos agentes

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
La guía oficial de Groq ([Prompt Basics](https://console.groq.com/docs/prompting)) recomienda cinco bloques. La plantilla ya los trae:

| Bloque | Qué escribir | En la plantilla |
|---|---|---|
| **Rol** | Qué experto es el agente | `# ROL` |
| **Instrucciones** | Pasos claros y numerados | `# INSTRUCCIONES` |
| **Contexto** | Información del proyecto | `# CONTEXTO DEL PROYECTO` (`{{CONTEXTO_PROYECTO}}`) |
| **Entrada** | Lo que envía el usuario | Llega como mensaje al ejecutar el script |
| **Salida esperada** | Formato exacto + ejemplo | `# FORMATO DE SALIDA` y `# EJEMPLO` |

Buenas prácticas de la misma guía:
- Pon **las reglas críticas al inicio**: el modelo les da más peso a las primeras instrucciones.
- **Muestra un ejemplo** de la respuesta ideal en vez de describirla con muchas palabras.
- Usa **verbos concretos** ("lista", "reescribe", "clasifica") en vez de verbos vagos ("analiza").
- Di explícitamente lo que **no** debe hacer (p. ej. "no inventes cifras").

### Paso 4. Configurar `config.json`

| Campo | Qué es | Recomendación |
|---|---|---|
| `nombre`, `descripcion` | Para identificar el agente | Frase del paso 1 |
| `modelo` | ID del modelo en Groq | `openai/gpt-oss-120b` para tareas que exigen razonar; `llama-3.1-8b-instant` para tareas simples y rápidas. Revisa la [lista oficial de modelos](https://console.groq.com/docs/models) porque cambia con el tiempo. |
| `parametros.temperature` | Qué tan creativo es | `0`–`0.2` para extraer o clasificar; `0.5` para redactar; `0.8` para ideas creativas |
| `parametros.max_completion_tokens` | Límite de largo de la respuesta | Un poco más de lo que esperas recibir |
| `parametros.reasoning_effort` | Cuánto "piensa" antes de responder (`low`, `medium`, `high`) | **Solo para modelos de razonamiento** como `openai/gpt-oss-*`. **Bórralo** si usas un modelo Llama. |
| `carpeta_salida` | Dónde se guardan los resultados | Relativa a la raíz del proyecto |

Todo lo que esté en `parametros` se envía tal cual a la API, así que usa los nombres de la [referencia oficial de la API](https://console.groq.com/docs/api-reference).

### Paso 5. Probar el prompt en el Playground (recomendado)
1. Abre <https://console.groq.com/playground>.
2. Elige el mismo modelo del `config.json`.
3. Pega el `prompt.md` en el campo **System** (reemplaza `{{CONTEXTO_PROYECTO}}` por el texto de `PHARMA_EXPRESS_CONTEXTO.md`).
4. Escribe una petición de prueba en el mensaje de usuario y ajusta la temperatura.
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
- **Datos personales:** no envíes datos reales de pacientes a la API (Ley 1581 de 2012). Usa solo datos ficticios.
- **Llave de la API:** si se filtra, bórrala en <https://console.groq.com/keys> y crea otra.
- **Límites de uso:** la cuenta gratuita tiene límites de solicitudes y tokens por minuto y por día. Consúltalos en <https://console.groq.com/docs/rate-limits> y en la sección **Limits** de tu cuenta. Si aparece un error 429, espera un momento y vuelve a intentarlo.
- **Verificación:** la salida de un modelo puede contener errores. Toda cifra, norma o fuente debe verificarse antes de usarse en el proyecto.

## Referencias oficiales
- Groq. (s. f.). *Quickstart*. GroqDocs. <https://console.groq.com/docs/quickstart>
- Groq. (s. f.). *Prompt basics*. GroqDocs. <https://console.groq.com/docs/prompting>
- Groq. (s. f.). *Supported models*. GroqDocs. <https://console.groq.com/docs/models>
- Groq. (s. f.). *Reasoning*. GroqDocs. <https://console.groq.com/docs/reasoning>
- Groq. (s. f.). *API reference*. GroqDocs. <https://console.groq.com/docs/api-reference>
- Groq. (s. f.). *Rate limits*. GroqDocs. <https://console.groq.com/docs/rate-limits>
