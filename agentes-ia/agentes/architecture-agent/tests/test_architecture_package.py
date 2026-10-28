import json

import pytest

import streamlit_app as ui
from architecture_runner import ArchitectureRun
from gemini_client import RESPONSE_SCHEMA
from result_handler import parse_result, render_markdown
from tests.test_result_handler import needs_information, ready
from tests.test_streamlit_app import FakeStreamlit


def validated(data):
    return parse_result(json.dumps(data), sources=["context.md"])


def pattern():
    return {"id": "PAT-001", "name": "Strategy", "problem": "Dos reglas intercambiables confirmadas",
            "evidence": [{"source": "context.md", "detail": "Dos reglas de asignación"}],
            "component_ids": ["CMP-001"], "justification": "Permite elegir la regla vigente",
            "without_pattern": "Condicional dentro de Reservas", "added_complexity": "Una interfaz y dos implementaciones",
            "risks": ["Más piezas internas"], "status": "PROPOSED"}


def test_ready_contract_and_no_pattern_are_valid():
    result = validated(ready())
    assert result["quality_attributes"][0]["driver_names"] == ["Equipo pequeño"]
    assert result["design_decisions"][0]["status"] == "PROPOSED"
    assert result["design_patterns"]["items"] == []
    assert result["design_patterns"]["conclusion"]
    assert result["open_questions"][0]["affected_component_ids"] == ["CMP-001"]
    for field in ("quality_attributes", "design_decisions", "design_patterns", "open_questions"):
        assert field in RESPONSE_SCHEMA["required"]


@pytest.mark.parametrize("field", ["quality_attributes", "design_decisions", "open_questions"])
def test_new_blocks_reject_unknown_sources(field):
    data = ready()
    data[field][0]["evidence"][0]["source"] = "other.md"
    with pytest.raises(ValueError):
        validated(data)


@pytest.mark.parametrize("field", ["design_decisions", "open_questions"])
def test_new_blocks_reject_missing_component(field):
    data = ready()
    key = "component_ids" if field == "design_decisions" else "affected_component_ids"
    data[field][0][key] = ["CMP-999"]
    with pytest.raises(ValueError):
        validated(data)


def test_quality_attribute_rejects_missing_driver():
    data = ready()
    data["quality_attributes"][0]["driver_names"] = ["No declarado"]
    with pytest.raises(ValueError):
        validated(data)


def test_design_decision_cannot_be_approved_automatically():
    data = ready()
    data["design_decisions"][0]["status"] = "APPROVED"
    with pytest.raises(ValueError):
        validated(data)


def test_pattern_requires_problem_justification_and_existing_component():
    data = ready()
    data["design_patterns"]["items"] = [pattern()]
    assert validated(data)["design_patterns"]["items"][0]["status"] == "PROPOSED"
    for field, value in (("problem", ""), ("justification", " "), ("component_ids", ["CMP-999"])):
        invalid = ready()
        invalid["design_patterns"]["items"] = [{**pattern(), field: value}]
        with pytest.raises(ValueError):
            validated(invalid)


def test_pattern_requires_explicit_without_pattern_and_conclusion():
    data = ready()
    data["design_patterns"]["items"] = [pattern()]
    data["design_patterns"]["items"][0]["without_pattern"] = ""
    with pytest.raises(ValueError):
        validated(data)
    data = ready()
    data["design_patterns"]["conclusion"] = ""
    with pytest.raises(ValueError):
        validated(data)


def test_unique_ids_and_exact_fields():
    data = ready()
    data["quality_attributes"].append(data["quality_attributes"][0].copy())
    with pytest.raises(ValueError):
        validated(data)
    data = ready()
    data["design_decisions"][0]["unexpected"] = "extra"
    with pytest.raises(ValueError):
        validated(data)


def test_nonblocking_questions_ready_and_blocking_questions_needs_information():
    assert validated(ready())["open_questions"]
    blocked = validated(needs_information())
    assert blocked["status"] == "NEEDS_INFORMATION"
    assert blocked["open_questions"] is None
    invalid = needs_information()
    invalid["design_decisions"] = []
    with pytest.raises(ValueError):
        validated(invalid)


@pytest.mark.parametrize("case,expected", [
    ("complete", "READY"),
    ("insufficient", "NEEDS_INFORMATION"),
    ("contradictory", "NEEDS_INFORMATION"),
])
def test_context_cases_keep_blocking_questions_out_of_ready(case, expected):
    data = ready() if case == "complete" else needs_information()
    if case == "contradictory":
        data["missing_information"] = [{
            "question": "¿Cuál de las dos restricciones de despliegue aprobadas prevalece?",
            "reason": "Dos fuentes aprobadas exigen entornos incompatibles",
            "decision_impact": "Cambia la viabilidad de la arquitectura",
        }]
    result = validated(data)
    assert result["status"] == expected
    assert (result["open_questions"] is None) == (expected == "NEEDS_INFORMATION")


def test_markdown_contains_all_new_sections():
    rendered = render_markdown(validated(ready()))
    for section in ("## Atributos de calidad", "## Decisiones de diseño", "## Patrones justificados", "## Preguntas técnicas abiertas"):
        assert section in rendered
    assert "Alternativa sin patrón" not in rendered
    assert "No hay variación o incompatibilidad" in rendered
    data = ready()
    data["design_patterns"]["items"] = [pattern()]
    assert "Alternativa sin patrón: Condicional dentro de Reservas" in render_markdown(validated(data))


def test_streamlit_renders_validated_json_without_inference(tmp_path, monkeypatch):
    result = validated(ready())
    fake = FakeStreamlit()
    monkeypatch.setattr(ui, "st", fake)
    workflow = ArchitectureRun([], tmp_path)
    for name in ("architecture-analysis.json", "architecture-analysis.md"):
        (tmp_path / name).write_text("artefacto", encoding="utf-8")
    ui.show_ready(result, workflow, [])
    writes = str(fake.writes)
    assert "PROPUESTAS DEL AGENTE — PENDIENTES DE VALIDACIÓN HUMANA" in writes
    assert "QA-001: Mantenibilidad" in writes
    assert "DD-001: Coordinación de reservas" in writes
    assert "No hay variación o incompatibilidad" in writes
    assert "TQ-001: ¿Cómo se verificará" in writes
    assert workflow.calls == 0
