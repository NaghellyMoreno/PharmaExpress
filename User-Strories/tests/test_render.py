from reviewer.models import StoryGeneration
from reviewer.render import render_generation


def test_render_generation_includes_rationale_and_evidence():
    """Verifica que el Markdown incluya justificación y trazabilidad."""
    result = StoryGeneration(
        project_summary="Resumen.",
        stories=[{
            "id": "HU-01",
            "title": "Consultar",
            "story": "Como persona quiero consultar información para conocerla.",
            "rationale": "El contexto lo solicita.",
            "evidence": [{"source": "contexto.md", "excerpt": "consultar información"}],
            "acceptance_criteria": [],
            "business_rules": [],
            "dependencies": [],
            "pending_decisions": [],
        }],
        uncovered_context=[],
        global_pending_decisions=[],
    )

    markdown = render_generation(result)

    assert "# Backlog de historias de usuario" in markdown
    assert "### Por qué se generó" in markdown
    assert "contexto.md" in markdown
