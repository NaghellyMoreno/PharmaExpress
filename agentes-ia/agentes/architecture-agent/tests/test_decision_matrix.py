import copy
import json

import pytest

import streamlit_app as ui
from architecture_runner import ArchitectureRun
from architecture_prompt import SYSTEM_PROMPT
from gemini_client import InferenceResult, RESPONSE_SCHEMA
from result_handler import parse_result, render_markdown
from tests.test_result_handler import needs_information, ready
from tests.test_streamlit_app import FakeStreamlit


def validated(data, sources=("context.md",)):
    return parse_result(json.dumps(data), sources=sources)


def compared():
    data = ready()
    data["alternatives"].append({"name": "Servicios separados", "advantages": ["Despliegue independiente"],
                                 "disadvantages": ["Más operación"], "risks": ["Coordinación"], "fit": "Posible"})
    data["decision_matrix"]["evaluations"].append({"alternative": "Servicios separados", "assessments": [
        {"criterion_id": "CRIT-001", "assessment": "UNFAVORABLE", "reason": "Aumenta la operación del equipo"}]})
    data["adr"]["alternatives"].append("Servicios separados")
    return data


def test_ready_matrix_is_qualitative_complete_and_adr_proposed():
    data = validated(compared())
    assert data["decision_matrix"]["evaluations"][0]["alternative"] == data["recommendation"]["architecture"]
    assert {item["alternative"] for item in data["decision_matrix"]["evaluations"]} == {item["name"] for item in data["alternatives"]}
    assert data["adr"]["status"] == "PROPOSED"
    schema = RESPONSE_SCHEMA["properties"]["decision_matrix"]["anyOf"][0]
    assert schema["additionalProperties"] is False
    assessment = schema["properties"]["evaluations"]["items"]["properties"]["assessments"]["items"]
    assert assessment["properties"]["assessment"]["enum"] == ["FAVORABLE", "NEUTRAL", "UNFAVORABLE"]
    assert "score" not in assessment["properties"] and "weight" not in schema["properties"]
    assert "no incluyas números, pesos, rankings" in SYSTEM_PROMPT
    assert "adr.decision deben nombrar exactamente la misma alternativa" in SYSTEM_PROMPT


def test_needs_information_requires_null_matrix():
    assert validated(needs_information())["decision_matrix"] is None
    data = needs_information()
    data["decision_matrix"] = ready()["decision_matrix"]
    with pytest.raises(ValueError, match="no puede contener propuesta"):
        validated(data)


@pytest.mark.parametrize("change", [
    lambda d: d["criteria"][0].update(evidence=[]),
    lambda d: d["criteria"][0]["evidence"][0].update(source="inventado.md"),
    lambda d: d["criteria"][0]["evidence"][0].update(source="ARCHITECTURE_EVIDENCE_PACK"),
    lambda d: d["criteria"][0].update(name=" "),
    lambda d: d["criteria"][0].update(reason=" "),
    lambda d: d["criteria"].append(copy.deepcopy(d["criteria"][0])),
    lambda d: d["criteria"][0].update(id="BAD-001"),
    lambda d: d["evaluations"][0].update(alternative="No evaluada"),
    lambda d: d["evaluations"].pop(),
    lambda d: d["evaluations"].append(copy.deepcopy(d["evaluations"][0])),
    lambda d: d["evaluations"][0]["assessments"].clear(),
    lambda d: d["evaluations"][0]["assessments"].append(copy.deepcopy(d["evaluations"][0]["assessments"][0])),
    lambda d: d["evaluations"][0]["assessments"][0].update(criterion_id="CRIT-999"),
    lambda d: d["evaluations"][0]["assessments"][0].update(assessment="ALTO"),
    lambda d: d["evaluations"][0]["assessments"][0].update(reason=" "),
    lambda d: d["evaluations"][0]["assessments"][0].update(score=5),
    lambda d: d.update(weights={"CRIT-001": 10}),
])
def test_invalid_matrix_is_rejected(change):
    data = compared()
    change(data["decision_matrix"])
    with pytest.raises(ValueError):
        validated(data)


def test_each_alternative_must_cover_same_criteria_without_repetition():
    data = compared()
    matrix = data["decision_matrix"]
    matrix["criteria"].append({"id": "CRIT-002", "name": "Consistencia", "reason": "Evitar sobre reservas",
                               "evidence": [{"source": "context.md", "detail": "No sobre reservar"}]})
    for evaluation in matrix["evaluations"]:
        evaluation["assessments"].append({"criterion_id": "CRIT-002", "assessment": "NEUTRAL",
                                          "reason": "Exige diseño de concurrencia"})
    assert validated(data)["status"] == "READY"
    matrix["evaluations"][1]["assessments"][1]["criterion_id"] = "CRIT-001"
    with pytest.raises(ValueError):
        validated(data)


def test_human_source_is_allowed_only_when_present():
    data = ready()
    data["decision_matrix"]["criteria"][0]["evidence"][0]["source"] = "HUMAN_PREFLIGHT"
    with pytest.raises(ValueError):
        validated(data)
    assert validated(data, ("context.md", "HUMAN_PREFLIGHT"))["status"] == "READY"


def test_markdown_uses_validated_json_and_escapes_table_delimiters():
    data = compared()
    data["decision_matrix"]["evaluations"][0]["assessments"][0]["reason"] = "Menos operación | sin garantía"
    rendered = render_markdown(validated(data))
    section = rendered.split("## Matriz de decisión arquitectónica", 1)[1].split("## Estructura arquitectónica", 1)[0]
    assert "| Criterio | Monolito modular (propuesta) | Servicios separados |" in section
    assert "**FAVORABLE** — Menos operación &#124; sin garantía" in section
    assert "**UNFAVORABLE** — Aumenta la operación del equipo" in section
    assert "context.md: Sección Equipo: dos personas" in section


def test_simulated_run_persists_and_streamlit_displays_same_matrix(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto simulado", encoding="utf-8")
    output = tmp_path / "out"
    calls = []
    payload = compared()

    def infer(context):
        calls.append(context)
        return InferenceResult(json.dumps(payload), 1.0, {"input_tokens": 7}, "test-model")

    workflow = ArchitectureRun([document], output, infer=infer)
    result = workflow.start()
    saved = json.loads((output / "architecture-analysis.json").read_text())
    assert saved["decision_matrix"] == result["decision_matrix"]
    assert "## Matriz de decisión arquitectónica" in (output / "architecture-analysis.md").read_text()
    assert len(calls) == 1
    fake = FakeStreamlit()
    monkeypatch.setattr(ui, "st", fake)
    ui.show_ready(result, workflow, [])
    labels = [args[0] for name, args in fake.writes if name == "tabs"]
    assert "Matriz de decisión" in labels[0]
    tables = [args[0] for name, args in fake.writes if name == "table"]
    assert tables[0][0]["Monolito modular (PROPUESTA)"] == "🟢 FAVORABLE"
    assert tables[0][0]["Servicios separados"] == "🔴 UNFAVORABLE"
    assert any("context.md: Sección Equipo: dos personas" in str(args) for _, args in fake.writes)
    assert any("PROPUESTA DE IA — pendiente decisión y validación del equipo." in str(args) for _, args in fake.writes)
    assert len(calls) == 1
