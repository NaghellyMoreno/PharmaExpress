"""Motor de generación de historias de usuario usando Gemini."""

from __future__ import annotations

import base64
import os
from pathlib import Path

from google import genai
from google.genai import types

from .loaders import SourceDocument, load_sources
from .models import StoryGeneration
from .prompts import SYSTEM_PROMPT


DEFAULT_CONTEXT_DIR = Path(__file__).resolve().parent.parent / "input" / "contexto"
SUPPORTED_CONTEXT_SUFFIXES = {
    ".txt", ".md", ".csv", ".docx", ".pdf", ".excalidraw", ".png", ".jpg", ".jpeg", ".webp",
}


class StoryGenerator:
    """Genera un backlog trazable a las fuentes de contexto."""

    def __init__(self, model: str | None = None):
        """Inicializa el cliente de Gemini usando la clave y el modelo configurados."""
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("No se encontró GEMINI_API_KEY. Definila en el archivo .env.")
        self.client = genai.Client(api_key=api_key)
        self.model = model or os.environ.get("GEMINI_MODEL") or "gemini-2.5-flash"

    @staticmethod
    def _source_pack(sources: list[SourceDocument]) -> tuple[str, list[types.Part]]:
        """Convierte texto e imágenes de las fuentes al formato multimodal de Gemini."""
        text_chunks: list[str] = []
        image_parts: list[types.Part] = []
        for source in sources:
            if source.text.strip():
                text_chunks.append(f"\n===== FUENTE: {source.name} =====\n{source.text.strip()}\n")
            for mime, encoded in source.images:
                image_parts.append(
                    types.Part.from_bytes(data=base64.b64decode(encoded), mime_type=mime)
                )
        return "\n".join(text_chunks), image_parts

    @staticmethod
    def context_paths(context_dir: str | Path = DEFAULT_CONTEXT_DIR) -> list[str]:
        """Obtiene fuentes soportadas de la carpeta de contexto indicada."""
        directory = Path(context_dir)
        if not directory.is_dir():
            raise FileNotFoundError(f"No existe la carpeta de contexto: {directory}")
        paths = sorted(
            path for path in directory.rglob("*")
            if path.is_file() and path.suffix.lower() in SUPPORTED_CONTEXT_SUFFIXES
        )
        if not paths:
            raise RuntimeError(f"La carpeta de contexto no contiene archivos soportados: {directory}")
        return [str(path) for path in paths]

    def generate_stories(
        self,
        context_dir: str | Path = DEFAULT_CONTEXT_DIR,
        count: int = 20,
    ) -> StoryGeneration:
        """Genera exactamente `count` historias usando solo una carpeta de contexto."""
        if count < 1:
            raise ValueError("count debe ser un entero mayor que cero.")
        sources = load_sources(self.context_paths(context_dir))
        context_text, image_parts = self._source_pack(sources)
        prompt = f"""
TAREA: generar el backlog de historias de usuario del proyecto.

FUENTES DEL PROYECTO
{context_text or "Las fuentes solo contienen información visual; analizala como contexto."}

INSTRUCCIONES DE SALIDA
- Generá exactamente {count} historias. No incluyas historias adicionales.
- Generá únicamente historias respaldadas por estas fuentes.
- Incluí rationale y evidencia por cada historia para explicar por qué se creó.
- No evalúes ni califiques historias existentes: esta tarea es de generación.
- Si una necesidad explícita no tiene actor, necesidad o valor suficientemente claro,
  no inventes los faltantes; registrala en uncovered_context o como decisión pendiente.
"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=[prompt, *image_parts],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=StoryGeneration,
            ),
        )
        result = getattr(response, "parsed", None)
        if not isinstance(result, StoryGeneration):
            raise RuntimeError("El modelo no devolvió historias estructuradas válidas.")
        if len(result.stories) != count:
            raise RuntimeError(
                f"El modelo devolvió {len(result.stories)} historias; se solicitaron {count}."
            )
        return result
