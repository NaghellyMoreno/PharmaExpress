import json
import re

import pytest

from architecture_diagrams import generate_diagrams
from architecture_runner import ArchitectureRun
from gemini_client import InferenceResult
from result_handler import parse_result, render_markdown
from tests.test_result_handler import needs_information, ready
from tests.test_streamlit_app import FakeStreamlit
import streamlit_app as ui


def validated(data):
    return parse_result(json.dumps(data), sources=["context.md"])


def diagrams(data):
    result = validated(data)
    return generate_diagrams(result["architecture_structure"])


SPANISH_LABELS = (
    "Prevalidación médica", "Autorización del paciente", "Vinculación de canales",
    "Atención farmacéutica", "Notificación electrónica", "Cancelación y revocación",
    "Año, contraseña y número.", "¿El paciente está autorizado?",
)


def spanish_ready():
    data = ready()
    structure = data["architecture_structure"]
    structure["external_actors"][0]["name"] = "ÁÉÍÓÚ Ñ Ü ü ¿Quién?"
    structure["components"][0]["name"] = SPANISH_LABELS[0]
    for index, name in enumerate(SPANISH_LABELS[1:], 2):
        structure["components"].append({"id": f"CMP-{index:03d}", "name": name,
                                        "responsibilities": ["Responsabilidad de prueba"], "sources": ["context.md"]})
    structure["relationships"][0]["interaction"] = "¡Notificación válida!"
    structure["technical_flows"][0]["steps"][0]["action"] = "Año, contraseña y número."
    return data


def test_spanish_unicode_is_literal_in_mermaid_and_syntax_remains_controlled():
    data = spanish_ready()
    structure = data["architecture_structure"]
    generated, _ = diagrams(data)
    context, blocks, flow = [item["content"] for item in generated]
    for label in SPANISH_LABELS:
        assert label in context
        assert label in blocks
    assert "¡Notificación válida!" in context and "¡Notificación válida!" in blocks
    assert "ÁÉÍÓÚ Ñ Ü ü ¿Quién?" in context and "ÁÉÍÓÚ Ñ Ü ü ¿Quién?" in blocks
    assert "Año, contraseña y número." in flow
    expected = {item["id"].replace("-", "_") for item in structure["components"]}
    assert {match.removeprefix("N_") for match in re.findall(r"\bN_CMP_[0-9]+\b", blocks)} == expected
    assert blocks.count("-->|", 1) == len(structure["relationships"])
    assert "#243;" not in blocks and "#241;" not in blocks
    assert all(line.startswith(("flowchart ", "  ", "    ")) for line in blocks.splitlines())


def test_utf8_survives_source_json_file_streamlit_and_download(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("# Contexto\nPrevalidación médica y atención farmacéutica.", encoding="utf-8")
    output = tmp_path / "out"
    data = spanish_ready()
    calls = []

    def infer(context):
        calls.append(context)
        return InferenceResult(json.dumps(data, ensure_ascii=False), 0.1, {}, "test-model")

    workflow = ArchitectureRun([document], output, infer=infer)
    result = workflow.start()
    assert "Prevalidación médica" in calls[0]
    assert len(calls) == 1
    json_text = (output / "architecture-analysis.json").read_text(encoding="utf-8")
    assert json.loads(json_text) == result
    for label in SPANISH_LABELS:
        assert label in json_text
    assert "ÁÉÍÓÚ Ñ Ü ü ¿Quién?" in json_text
    fake = FakeStreamlit()
    monkeypatch.setattr(ui, "st", fake)
    ui.show_ready(result, workflow, [])
    charts = [args[0] for name, args in fake.writes if name == "mermaid_chart"]
    assert charts == [item["content"] for item in workflow.diagrams]
    for item in workflow.diagrams:
        path = output / item["filename"]
        assert path.read_text(encoding="utf-8") == item["content"]
        assert path.read_bytes().decode("utf-8") == item["content"]
        assert fake.downloads[item["filename"]] == path.read_bytes()
        assert "�" not in item["content"] and "Ã³" not in item["content"]
    assert all(label in (output / "architecture-components.mmd").read_text(encoding="utf-8") for label in SPANISH_LABELS)


def test_context_and_components_use_only_declared_nodes_and_directed_relations():
    data = ready()
    structure = data["architecture_structure"]
    structure["external_systems"].append({"id": "SYS-002", "name": "Mensajería", "kind": "REAL",
                                          "responsibility": "Transporta avisos", "sources": ["context.md"]})
    structure["components"].append({"id": "CMP-002", "name": "Avisos",
                                    "responsibilities": ["Coordina avisos"], "sources": ["context.md"]})
    structure["relationships"] += [
        {"from": "CMP-001", "to": "CMP-002", "interaction": "Solicita aviso",
         "purpose": "Comunicar reserva", "sources": ["context.md"]},
        {"from": "CMP-002", "to": "SYS-002", "interaction": "Envía aviso",
         "purpose": "Transportar mensaje", "sources": ["context.md"]},
        {"from": "ACT-001", "to": "SYS-001", "interaction": "Consulta externa",
         "purpose": "Consulta simulada", "sources": ["context.md"]},
    ]
    generated, _ = diagrams(data)
    context, blocks, flow = [item["content"] for item in generated]
    expected = {"N_ACT_001", "N_SYS_001", "N_SYS_002", "N_CMP_001", "N_CMP_002"}
    for content in (context, blocks):
        assert set(re.findall(r"\bN_(?:ACT|SYS|CMP)_[0-9]+\b", content)) == expected
        assert "N_ACT_001 -->|" in content and "| N_CMP_001" in content
        assert "N_CMP_002 -->|" in content and "| N_SYS_002" in content
        assert "N_SYS_001 -->" not in content
        assert "class N_SYS_001 simulated" in content
        assert "class N_SYS_002 real" in content
        assert 'subgraph SYSTEM["Sistema propuesto"]' in content
    assert "N_CMP_001 -->|" not in context
    assert "N_CMP_001 -->|" in blocks and "| N_CMP_002" in blocks
    assert "N_ACT_001 -->|Consulta externa" not in context
    assert "N_ACT_001 -->|Consulta externa" in blocks
    assert "STEP_1 --> STEP_2" in flow
    assert "N_CMP_001 --> N_CMP_002" not in flow


def test_untrusted_labels_cannot_inject_mermaid_syntax_or_html():
    data = ready()
    payload = '" ]\n%%{init: {securityLevel: "loose"}}%%\nclick X "javascript:alert(1)" <script> & | [ ]'
    structure = data["architecture_structure"]
    structure["components"][0]["name"] = payload
    structure["relationships"][0]["interaction"] = payload
    structure["technical_flows"][0]["name"] = payload
    structure["technical_flows"][0]["steps"][0]["action"] = payload
    generated, _ = diagrams(data)
    for diagram in generated:
        content = diagram["content"]
        assert "%%{init" not in content
        assert not any(line.lstrip().startswith("click ") for line in content.splitlines())
        assert "<script>" not in content
        assert "click X \"javascript:alert" not in content
        assert "#34;" in content
        assert "#91;" in content
        assert "#93;" in content
        assert "#60;" in content
        assert "#124;" in content
    assert generated[-1]["title"] == "Secuencia de actividades 1"


def test_missing_links_are_reported_and_persistence_stays_textual():
    data = ready()
    data["architecture_structure"]["relationships"] = []
    generated, limitations = diagrams(data)
    assert all("-->" not in item["content"] for item in generated[:2])
    assert any("vista está incompleta" in item for item in limitations)
    assert any("Persistencia" in item for item in limitations)
    assert all("Estado de reservas" not in item["content"] for item in generated)
    rendered = render_markdown(validated(data), generated, limitations)
    assert "## Diagramas arquitectónicos" in rendered
    assert "```mermaid\n" in rendered
    assert "Estado de reservas" in rendered.split("## Estructura arquitectónica", 1)[1]


def test_single_step_flow_is_omitted_with_reason():
    data = ready()
    data["architecture_structure"]["technical_flows"][0]["steps"] = [
        data["architecture_structure"]["technical_flows"][0]["steps"][0]
    ]
    generated, limitations = diagrams(data)
    assert all(not item["filename"].startswith("architecture-flow") for item in generated)
    assert any("solo tiene un paso" in item for item in limitations)


def test_only_accepted_ready_persists_diagrams_and_clears_stale_files(tmp_path):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "out"
    calls = []

    def infer_ready(_):
        calls.append(1)
        return InferenceResult(json.dumps(ready()), 1.0, {}, "test-model")

    workflow = ArchitectureRun([document], output, infer=infer_ready)
    result = workflow.start()
    assert len(calls) == 1
    assert result["status"] == "READY"
    assert len(workflow.diagrams) == 3
    for item in workflow.diagrams:
        assert (output / item["filename"]).read_text() == item["content"]
        assert item["content"].rstrip() in (output / "architecture-analysis.md").read_text()
    assert (output / "architecture-analysis.json").is_file()

    def infer_needs(_):
        return InferenceResult(json.dumps(needs_information()), 1.0, {}, "test-model")

    second = ArchitectureRun([document], output, infer=infer_needs)
    assert second.start()["status"] == "NEEDS_INFORMATION"
    assert second.diagrams == []
    assert not list(output.glob("*.mmd"))

    bad = ready()
    bad["architecture_structure"]["relationships"][0]["to"] = "CMP-999"

    def infer_bad(_):
        return InferenceResult(json.dumps(bad), 1.0, {}, "test-model")

    (output / "architecture-context.mmd").write_text("old", encoding="utf-8")
    third = ArchitectureRun([document], output, infer=infer_bad)
    with pytest.raises(ValueError, match="referencia inexistente"):
        third.start()
    assert third.run["validation_status"] == "REJECTED"
    assert third.diagrams == []
    assert not list(output.glob("*.mmd"))
