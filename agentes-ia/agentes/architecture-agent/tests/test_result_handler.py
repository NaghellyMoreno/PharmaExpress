import json
import hashlib
import sys
from datetime import datetime

import pytest

import main as app
from gemini_client import InferenceResult
from result_handler import parse_result, render_markdown


def inference(content, *, duration=1.0, usage=None, model="gemini-3.5-flash-lite"):
    return InferenceResult(content, duration, usage if usage is not None else {}, model)


def needs_information():
    return {
        "status": "NEEDS_INFORMATION",
        "missing_information": [{"question": "¿Despliegue independiente?", "reason": "Afecta límites", "decision_impact": "Cambia la separación"}],
        "architecture_drivers": [], "alternatives": [], "recommendation": None,
        "risks": [], "review_conditions": [], "adr": None, "architecture_structure": None, "decision_matrix": None,
        "quality_attributes": None, "design_decisions": None, "design_patterns": None, "open_questions": None,
    }


def ready(source="context.md"):
    data = {
        "status": "READY", "missing_information": [],
        "architecture_drivers": [{"name": "Equipo pequeño", "evidence": [{"source": "context.md", "detail": "Sección Equipo: dos personas"}], "impact": "Reduce complejidad operativa"}],
        "alternatives": [{"name": "Monolito modular", "advantages": ["Simple"], "disadvantages": ["Despliegue conjunto"], "risks": ["Acoplamiento"], "fit": "Adecuado"}],
        "recommendation": {"architecture": "Monolito modular", "justification": ["Satisface el contexto"], "accepted_tradeoffs": ["Despliegue conjunto"]},
        "decision_matrix": {
            "criteria": [{"id": "CRIT-001", "name": "Complejidad operativa", "reason": "Equipo pequeño",
                          "evidence": [{"source": "context.md", "detail": "Sección Equipo: dos personas"}]}],
            "evaluations": [{"alternative": "Monolito modular", "assessments": [
                {"criterion_id": "CRIT-001", "assessment": "FAVORABLE", "reason": "Una unidad de despliegue reduce operación"}]}],
        },
        "risks": ["Acoplamiento"], "review_conditions": ["Crece el equipo"],
        "adr": {"status": "PROPOSED", "context": "Proyecto pequeño", "drivers": ["Equipo pequeño"], "alternatives": ["Monolito modular"], "decision": "Monolito modular", "justification": ["Simple"], "consequences": ["Despliegue conjunto"], "risks": ["Acoplamiento"], "conditions_to_review": ["Crece el equipo"]},
        "architecture_structure": {
            "external_actors": [{"id": "ACT-001", "name": "Usuario", "responsibility": "Solicita una reserva", "sources": ["context.md"]}],
            "external_systems": [{"id": "SYS-001", "name": "Inventario simulado", "kind": "SIMULATED", "responsibility": "Informa disponibilidad simulada", "sources": ["context.md"]}],
            "components": [{"id": "CMP-001", "name": "Reservas", "responsibilities": ["Coordinar solicitudes de reserva"], "sources": ["context.md"]}],
            "relationships": [{"from": "ACT-001", "to": "CMP-001", "interaction": "Solicitud de reserva", "purpose": "Iniciar la reserva", "sources": ["context.md"]}],
            "persistence": [{"name": "Estado de reservas", "responsibility": "Conservar reservas", "data_concerns": ["Consistencia de cupos"], "sources": ["context.md"]}],
            "technical_flows": [{"name": "Reserva", "steps": [{"order": 1, "participant": "ACT-001", "action": "Solicita reserva"}, {"order": 2, "participant": "CMP-001", "action": "Coordina reserva"}], "sources": ["context.md"]}],
        },
        "quality_attributes": [{"id": "QA-001", "name": "Mantenibilidad", "need": "Equipo pequeño",
                                "architectural_relevance": "Limitar coordinación", "impact": "Favorece módulos claros",
                                "proposed_mechanisms": ["Límites de responsabilidad"],
                                "evidence": [{"source": source, "detail": "Dos personas"}],
                                "validation_conditions": ["Revisar límites con el equipo"], "driver_names": ["Equipo pequeño"]}],
        "design_decisions": [{"id": "DD-001", "title": "Coordinación de reservas", "problem": "Organizar la coordinación interna",
                              "component_ids": ["CMP-001"], "alternatives": ["Responsabilidad concentrada", "Responsabilidad dispersa"],
                              "proposed_decision": "Concentrar coordinación en Reservas", "justification": "Mantiene un dueño claro",
                              "advantages": ["Menor dispersión"], "tradeoffs": ["Acoplamiento interno"],
                              "evidence": [{"source": source, "detail": "Solicitudes de reserva"}], "status": "PROPOSED"}],
        "design_patterns": {"items": [], "conclusion": "No hay variación o incompatibilidad que justifique un patrón adicional."},
        "open_questions": [{"id": "TQ-001", "question": "¿Cómo se verificará la consistencia de cupos?",
                            "reason": "Falta validar el mecanismo", "impact": "Puede afectar el diseño de Reservas",
                            "affected_component_ids": ["CMP-001"], "information_needed": "Prueba de concurrencia",
                            "resolve_by": "Diseño detallado", "evidence": [{"source": source, "detail": "Consistencia de cupos"}]}],
    }
    data["architecture_drivers"][0]["evidence"][0]["source"] = source
    data["decision_matrix"]["criteria"][0]["evidence"][0]["source"] = source
    for items in data["architecture_structure"].values():
        for item in items:
            item["sources"] = [source]
    return data


def test_needs_information():
    result = parse_result(json.dumps(needs_information()))
    rendered = render_markdown(result)
    assert "NEEDS_INFORMATION" in rendered
    assert "¿Despliegue independiente?" in rendered
    assert "ADR" not in rendered


def test_rejects_more_than_five_questions():
    data = needs_information()
    data["missing_information"] *= 6
    with pytest.raises(ValueError, match="Preguntas inválidas"):
        parse_result(json.dumps(data))


def test_ready():
    result = parse_result(json.dumps(ready()), sources=["context.md"])
    rendered = render_markdown(result)
    assert "HUMAN VALIDATION REQUIRED" in rendered
    assert "context.md: Sección Equipo" in rendered
    assert "ADR-001" in rendered
    assert rendered.index("## Recomendación del Architecture Agent") < rendered.index("## Drivers")
    assert "Arquitectura propuesta: Monolito modular" in rendered
    assert "PROPUESTA DE IA — requiere decisión humana" in rendered
    assert "## Estructura arquitectónica" in rendered
    assert "SYS-001: Inventario simulado (SIMULATED)" in rendered
    assert "CMP-001: Reservas" in rendered
    assert "ACT-001 → CMP-001" in rendered
    assert "Consistencia de cupos" in rendered
    assert "2. CMP-001: Coordina reserva" in rendered


def test_real_recommendation_alternative_identity_mismatch_and_match():
    data = ready()
    names = [
        "Monolito modular full-stack en Vercel",
        "Monolito modular con API separada en contenedores",
        "Arquitectura de microservicios",
    ]
    data["alternatives"] = [{**data["alternatives"][0], "name": name} for name in names]
    data["decision_matrix"]["evaluations"] = [
        {"alternative": name, "assessments": [{"criterion_id": "CRIT-001", "assessment": "FAVORABLE", "reason": "Comparación simulada"}]}
        for name in names
    ]
    data["recommendation"]["architecture"] = "Monolito modular full-stack desplegado en Vercel"
    with pytest.raises(ValueError, match=r"recommendation\.architecture debe coincidir exactamente con alternatives\[\]\.name"):
        parse_result(json.dumps(data), sources=["context.md"])

    data["recommendation"]["architecture"] = names[0]
    data["adr"]["decision"] = names[0]
    data["adr"]["alternatives"] = names
    assert parse_result(json.dumps(data), sources=["context.md"])["status"] == "READY"


@pytest.mark.parametrize("field,value", [
    ("justification", "Satisface el contexto"),
    ("accepted_tradeoffs", "Despliegue conjunto"),
])
def test_rejects_real_recommendation_scalar_variants(field, value):
    data = ready()
    data["recommendation"][field] = value
    with pytest.raises(ValueError, match="recomendación válida"):
        parse_result(json.dumps(data), sources=["context.md"])


def test_rejects_real_accepted_tradeoffs_alias():
    data = ready()
    data["recommendation"]["accepted_trade-offs"] = data["recommendation"].pop("accepted_tradeoffs")
    with pytest.raises(ValueError, match="recomendación válida"):
        parse_result(json.dumps(data), sources=["context.md"])


def test_rejects_real_adr_justification_scalar():
    data = ready()
    data["adr"]["justification"] = "Simple"
    with pytest.raises(ValueError, match="ADR propuesto válido"):
        parse_result(json.dumps(data), sources=["context.md"])


@pytest.mark.parametrize("change", [
    lambda data: data.pop("architecture_drivers"),
    lambda data: data.update(architecture_drivers=[]),
    lambda data: data.update(architecture_drivers="driver"),
    lambda data: data["architecture_drivers"][0].update(evidence=[]),
    lambda data: data["architecture_drivers"][0]["evidence"][0].pop("source"),
    lambda data: data["architecture_drivers"][0]["evidence"][0].update(source=" "),
    lambda data: data["architecture_drivers"][0]["evidence"][0].pop("detail"),
    lambda data: data["architecture_drivers"][0]["evidence"][0].update(detail=" "),
    lambda data: data["architecture_drivers"][0].pop("impact"),
    lambda data: data["architecture_drivers"][0].update(impact=" "),
    lambda data: data["architecture_drivers"][0].pop("name"),
])
def test_rejects_invalid_drivers(change):
    data = ready()
    change(data)
    with pytest.raises(ValueError):
        parse_result(json.dumps(data), sources=["context.md"])


def test_rejects_evidence_from_another_document():
    data = ready()
    data["architecture_drivers"][0]["evidence"][0]["source"] = "unknown.md"
    with pytest.raises(ValueError, match="fuente ajena"):
        parse_result(json.dumps(data), sources=["context.md"])


def test_main_preserves_parseable_rejected_response(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "output"
    data = ready()
    data["architecture_drivers"][0]["evidence"][0]["source"] = "inventado.md"
    monkeypatch.setattr(app, "analyze", lambda context: inference(json.dumps(data)))
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    with pytest.raises(SystemExit):
        app.main()
    rejected = output / "architecture-analysis.rejected.json"
    assert json.loads(rejected.read_text(encoding="utf-8")) == data
    assert not (output / "architecture-analysis.json").exists()
    manifest_text = (output / "architecture-analysis.run.json").read_text(encoding="utf-8")
    manifest = json.loads(manifest_text)
    assert manifest["validation_status"] == "REJECTED"
    assert manifest["error_type"] == "OUTPUT_VALIDATION_ERROR"
    assert manifest["error_message"] == "Driver con fuente ajena a los documentos entregados."
    assert manifest["validation_error"] == "Driver con fuente ajena a los documentos entregados."
    assert manifest["output_file"] == rejected.name
    assert manifest["output_sha256"] == hashlib.sha256(rejected.read_bytes()).hexdigest()
    assert "test-gemini-secret-key" not in manifest_text + rejected.read_text(encoding="utf-8")


def test_main_writes_accepted_manifest_for_only_selected_source(tmp_path, monkeypatch):
    document = tmp_path / "test-context.md"
    document.write_text("Contexto seleccionado", encoding="utf-8")
    (tmp_path / "neighbor.md").write_text("Contexto ajeno", encoding="utf-8")
    output = tmp_path / "output"
    data = ready(document.name)
    captured = {}

    def fake_analyze(context):
        captured["context"] = context
        return inference(json.dumps(data), model="test-gemini-model")

    monkeypatch.setattr(app, "analyze", fake_analyze)
    monkeypatch.setenv("GEMINI_MODEL", "test-gemini-model")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    app.main()

    manifest_text = (output / "architecture-analysis.run.json").read_text(encoding="utf-8")
    manifest = json.loads(manifest_text)
    result = output / "architecture-analysis.json"
    assert manifest["input_sources"] == ["test-context.md"]
    assert manifest["input_count"] == 1
    assert "===== SOURCE: test-context.md =====" in captured["context"]
    assert "SOURCE: test-context.md" in captured["context"]
    assert "Contexto seleccionado" in captured["context"]
    assert manifest["context_sha256"] == hashlib.sha256(captured["context"].encode("utf-8")).hexdigest()
    assert manifest["system_prompt_sha256"] == hashlib.sha256(app.SYSTEM_PROMPT.encode("utf-8")).hexdigest()
    assert manifest["model"] == "test-gemini-model"
    assert manifest["provider"] == "gemini"
    assert manifest["validation_status"] == "ACCEPTED"
    assert manifest["validation_error"] is None
    assert manifest["output_file"] == result.name
    assert manifest["output_sha256"] == hashlib.sha256(result.read_bytes()).hexdigest()
    assert datetime.fromisoformat(manifest["started_at"]).tzinfo is not None
    assert datetime.fromisoformat(manifest["finished_at"]).tzinfo is not None
    assert "test-gemini-secret-key" not in manifest_text + result.read_text(encoding="utf-8")


def test_main_records_no_output_when_analyze_fails(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "output"

    def fail_analyze(context):
        raise ValueError("Fallo de conexión simulado")

    monkeypatch.setattr(app, "analyze", fail_analyze)
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    with pytest.raises(SystemExit):
        app.main()

    manifest = json.loads((output / "architecture-analysis.run.json").read_text(encoding="utf-8"))
    assert manifest["validation_status"] == "NO_OUTPUT"
    assert manifest["error_type"] is None
    assert manifest["output_file"] is None
    assert manifest["output_sha256"] is None
    assert not (output / "architecture-analysis.json").exists()


def test_invalid_json():
    with pytest.raises(ValueError, match="JSON válido"):
        parse_result("{invalid")


def test_ready_without_recommendation():
    data = ready()
    data["recommendation"] = None
    with pytest.raises(ValueError, match="recomendación"):
        parse_result(json.dumps(data))


def test_needs_information_with_recommendation():
    data = needs_information()
    data["recommendation"] = ready()["recommendation"]
    with pytest.raises(ValueError, match="no puede contener propuesta"):
        parse_result(json.dumps(data))
