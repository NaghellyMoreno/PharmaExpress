"""Pruebas del generador sin consumir la API real."""

import base64

import pytest

from reviewer.engine import StoryGenerator
from reviewer.loaders import SourceDocument
from reviewer.models import StoryGeneration


@pytest.fixture
def gemini_env(monkeypatch):
    """Configura una clave simulada para instanciar el generador en pruebas."""
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")


def test_generator_fails_when_gemini_key_missing(monkeypatch):
    """Verifica el error claro cuando no existe una clave de Gemini."""
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    with pytest.raises(RuntimeError, match="GEMINI_API_KEY"):
        StoryGenerator()


def test_source_pack_keeps_base64_image_bytes(gemini_env):
    """Verifica que las imágenes se conserven como bytes para el modelo."""
    generator = StoryGenerator()
    payload = base64.b64encode(b"fake-image-bytes").decode("ascii")
    text, parts = generator._source_pack([
        SourceDocument(name="mock.png", images=[("image/png", payload)])
    ])

    assert text == ""
    assert parts[0].inline_data.data == b"fake-image-bytes"


def test_context_paths_reads_supported_files_only(tmp_path):
    """Verifica que la carpeta de contexto ignore formatos no soportados."""
    (tmp_path / "context.md").write_text("contexto", encoding="utf-8")
    (tmp_path / "ignore.exe").write_text("binario", encoding="utf-8")
    nested = tmp_path / "nested"
    nested.mkdir()
    (nested / "diagram.excalidraw").write_text('{"elements": []}', encoding="utf-8")

    paths = StoryGenerator.context_paths(tmp_path)

    assert paths == [str(tmp_path / "context.md"), str(nested / "diagram.excalidraw")]


def test_generate_stories_accepts_structured_response(gemini_env, monkeypatch, tmp_path):
    """Verifica que el motor acepte una respuesta con la cantidad solicitada."""
    context_file = tmp_path / "context.md"
    context_file.write_text("La persona afiliada consulta fórmulas.", encoding="utf-8")
    expected = StoryGeneration(
        project_summary="Proyecto de consulta de fórmulas.",
        stories=[{
            "id": "HU-01",
            "title": "Consultar fórmulas",
            "story": "Como persona afiliada quiero consultar mis fórmulas para conocerlas.",
            "rationale": "La consulta aparece explícitamente en el contexto.",
            "evidence": [{"source": "context.md", "excerpt": "consulta fórmulas"}],
            "acceptance_criteria": [],
            "business_rules": [],
            "dependencies": [],
            "pending_decisions": [],
        }],
        uncovered_context=[],
        global_pending_decisions=[],
    )

    class FakeClient:
        class models:
            @staticmethod
            def generate_content(*args, **kwargs):
                """Devuelve una respuesta simulada sin invocar la API externa."""
                return type("Response", (), {"parsed": expected})()

    monkeypatch.setattr("reviewer.engine.genai.Client", lambda api_key=None: FakeClient())
    result = StoryGenerator().generate_stories(tmp_path, count=1)

    assert result == expected
