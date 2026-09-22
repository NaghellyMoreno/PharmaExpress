# Generador de Historias de Usuario

Herramienta que genera un backlog de historias de usuario a partir de los documentos ubicados en `input/contexto`.

Cada historia incluye su justificación (por qué se generó), evidencia textual de las fuentes, criterios de aceptación, reglas de negocio, dependencias y decisiones pendientes. No revisa ni valida historias existentes.

## Instalación

Requiere Python 3.10+ y una clave de Gemini.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Creá `.env` con:

```env
GEMINI_API_KEY=mi_clave
GEMINI_MODEL=gemini-2.5-flash
```

## Generar historias

Agregá o actualizá las fuentes del proyecto en `input/contexto` y ejecutá:

```bash
python cli.py generate
```

La carpeta se recorre de forma recursiva y admite `.txt`, `.md`, `.csv`, `.docx`, `.pdf`, `.excalidraw`, `.png`, `.jpg`, `.jpeg` y `.webp`.

Por defecto genera 20 historias y guarda `output/historias_generadas.md`. Para elegir otra cantidad o nombre de archivo (siempre dentro de `output`):

```bash
python cli.py generate --count 10 --output backlog.md
```

Para usar otra carpeta de fuentes:

```bash
python cli.py generate --context-dir ruta/a/contexto
```

Para obtener JSON estructurado:

```bash
python cli.py generate --json
```

## Pruebas

```bash
python -m pytest
```

## Privacidad

No envíes datos clínicos reales, identificadores personales reales ni secretos a la API.
