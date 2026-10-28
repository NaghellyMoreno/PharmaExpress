import copy
import json

import pytest

from architecture_prompt import SYSTEM_PROMPT
from gemini_client import RESPONSE_SCHEMA
from result_handler import parse_result, render_markdown
from tests.test_result_handler import needs_information, ready


def validate(data):
    return parse_result(json.dumps(data), sources=["context.md"])


def test_structure_schema_is_explicit_and_nullable_only_for_missing_information():
    schema = RESPONSE_SCHEMA["properties"]["architecture_structure"]["anyOf"]
    structure = schema[0]
    assert schema[1] == {"type": "null"}
    assert structure["additionalProperties"] is False
    assert set(structure["required"]) == {
        "external_actors", "external_systems", "components", "relationships", "persistence", "technical_flows"
    }
    system = structure["properties"]["external_systems"]["items"]
    assert system["properties"]["kind"]["enum"] == ["REAL", "SIMULATED"]
    assert "diagrams" not in RESPONSE_SCHEMA["properties"]


def test_ready_requires_structure_and_missing_information_rejects_it():
    data = ready()
    data.pop("architecture_structure")
    with pytest.raises(ValueError):
        validate(data)
    data = needs_information()
    data["architecture_structure"] = ready()["architecture_structure"]
    with pytest.raises(ValueError, match="no puede contener propuesta"):
        validate(data)


@pytest.mark.parametrize("change", [
    lambda s: s["components"].append(copy.deepcopy(s["components"][0])),
    lambda s: s["external_systems"][0].update(id="CMP-001"),
    lambda s: s["components"][0].update(responsibilities=[]),
    lambda s: s["components"][0].update(responsibilities=[" "]),
    lambda s: s["external_systems"][0].update(kind="UNKNOWN"),
    lambda s: s["external_systems"][0].update(kind=[]),
    lambda s: s["components"][0].update(sources=["ARCHITECTURE_EVIDENCE_PACK"]),
    lambda s: s["relationships"][0].update(sources=["LOSSLESS_CONTEXT"]),
    lambda s: s["relationships"][0].update(to="CMP-999"),
    lambda s: s["technical_flows"][0]["steps"][0].update(participant="SYS-999"),
    lambda s: s["technical_flows"][0]["steps"][1].update(order=3),
    lambda s: s["technical_flows"][0]["steps"][0].update(order=True),
    lambda s: s["technical_flows"][0].update(steps=[]),
    lambda s: s["persistence"][0].update(data_concerns=[]),
    lambda s: s["components"][0].update(technology="PostgreSQL"),
    lambda s: s.update(diagrams=[]),
])
def test_rejects_invalid_structure(change):
    data = ready()
    change(data["architecture_structure"])
    with pytest.raises(ValueError):
        validate(data)


def test_empty_unsubstantiated_categories_are_valid_and_rendered_without_invention():
    data = ready()
    structure = data["architecture_structure"]
    for key in ("external_actors", "external_systems", "relationships", "persistence", "technical_flows"):
        structure[key] = []
    result = validate(data)
    rendered = render_markdown(result)
    assert "Ninguno identificado" in rendered
    assert "### Diagrama de contexto" not in rendered
    assert "### Diagrama de componentes/bloques" in rendered
    assert "-->" not in rendered.split("## Diagramas arquitectónicos", 1)[1].split("## Risks", 1)[0]


def test_real_external_system_is_distinct_from_simulated():
    data = ready()
    data["architecture_structure"]["external_systems"].append({
        "id": "SYS-002", "name": "Servicio de mensajería", "kind": "REAL",
        "responsibility": "Transporta mensajes", "sources": ["context.md"],
    })
    rendered = render_markdown(validate(data))
    assert "Inventario simulado (SIMULATED)" in rendered
    assert "Servicio de mensajería (REAL)" in rendered


def test_human_source_requires_run_permission():
    data = ready()
    data["architecture_structure"]["components"][0]["sources"] = ["HUMAN_PREFLIGHT"]
    with pytest.raises(ValueError):
        validate(data)
    assert parse_result(json.dumps(data), sources=["context.md", "HUMAN_PREFLIGHT"])["status"] == "READY"


def test_prompt_keeps_technology_as_proposal_and_real_simulated_distinct():
    assert "no selecciones PostgreSQL" in SYSTEM_PROMPT
    assert "REAL o SIMULATED" in SYSTEM_PROMPT
    assert "No conviertas Telegram ID en identidad" in SYSTEM_PROMPT
    assert "No inventes mecanismos de locking" in SYSTEM_PROMPT
