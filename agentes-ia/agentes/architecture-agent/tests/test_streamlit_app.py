import json
import sys
from contextlib import nullcontext
from pathlib import Path
from types import SimpleNamespace

import pytest

import main
import streamlit_app as ui
from architecture_runner import ArchitectureRun, build_clarifications
from gemini_client import InferenceResult
from tests.test_result_handler import needs_information, ready


class FakeStreamlit:
    def __init__(self):
        self.session_state = {}
        self.pressed = set()
        self.writes = []
        self.downloads = {}
        self.uploaded = []

    def __getattr__(self, name):
        if name in {"spinner", "expander"}:
            return lambda *args, **kwargs: nullcontext()
        if name == "tabs":
            return lambda labels: self.writes.append((name, (labels,))) or [nullcontext() for _ in labels]
        if name == "file_uploader":
            return lambda *args, **kwargs: self.uploaded
        if name == "button":
            return lambda label: label in self.pressed
        if name == "text_area":
            return lambda label, key: self.session_state.setdefault(key, "")
        if name == "text_input":
            return lambda label, key, **kwargs: self.session_state.setdefault(key, "")
        if name == "checkbox":
            return lambda label, key: self.session_state.setdefault(key, False)
        if name == "download_button":
            return lambda label, **kwargs: self.downloads.update({kwargs["file_name"]: kwargs["data"]})
        return lambda *args, **kwargs: self.writes.append((name, args))


def fake_infer(responses, calls):
    def infer(context):
        calls.append(context)
        return InferenceResult(json.dumps(responses[len(calls) - 1]), 1.0, {}, "test-model")
    return infer


def test_launcher_default_and_cli(monkeypatch):
    calls = []
    monkeypatch.setattr(main.subprocess, "run", lambda args, **kwargs: calls.append((args, kwargs)))
    monkeypatch.setattr(sys, "argv", ["main.py"])
    main.main()
    args, options = calls[0]
    assert args == [sys.executable, "-m", "streamlit", "run", str(Path(main.__file__).resolve().with_name("streamlit_app.py"))]
    assert options == {"check": True}
    assert "shell" not in options
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli"])
    monkeypatch.setattr(main, "collect_files_interactively", lambda: [])
    with pytest.raises(SystemExit):
        main.main()
    assert len(calls) == 1


def test_import_and_rerun_only_buttons_infer(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto")]
    monkeypatch.setattr(ui, "st", fake)
    monkeypatch.setattr(ui, "load_dotenv", lambda: None)
    monkeypatch.setattr(ui, "ArchitectureRun", lambda files, **kwargs: ArchitectureRun(files, tmp_path, infer=fake_infer([needs_information(), ready()], calls), **kwargs))
    calls = []
    ui.app()
    assert not calls
    assert any("Contexto lossless:" in str(args) for _, args in fake.writes)
    assert any("Tokens estimados del contexto:" in str(args) for _, args in fake.writes)
    fake.session_state["deployment_input"] = "Vercel"
    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    assert len(calls) == 1
    assert "Plataforma o entorno de despliegue: Vercel" in calls[0]
    assert fake.session_state["phase"] == "NEEDS_INFORMATION"
    assert any("información adicional" in str(args) for _, args in fake.writes)
    fake.pressed = set()
    fake.session_state["clarification_1"] = "Vercel"
    ui.app()
    assert len(calls) == 1
    fake.pressed = {"Continuar análisis"}
    ui.app()
    assert len(calls) == 2
    assert "===== HUMAN_CLARIFICATIONS =====" in calls[1]
    assert "ANSWER:\nVercel" in calls[1]
    assert fake.session_state["phase"] == "READY"
    fake.pressed = set()
    ui.app()
    assert len(calls) == 2
    assert any("Monolito modular" in str(args) for _, args in fake.writes)
    assert any("Satisface el contexto" in str(args) for _, args in fake.writes)
    assert any("Despliegue conjunto" in str(args) for _, args in fake.writes)
    assert any("RECOMENDADA" in str(args) for name, args in fake.writes if name == "success")
    assert not any("Arquitectura aprobada" in str(args) for _, args in fake.writes)
    assert fake.downloads["architecture-analysis.json"] == (tmp_path / "architecture-analysis.json").read_bytes()
    assert fake.downloads["architecture-analysis.md"] == (tmp_path / "architecture-analysis.md").read_bytes()
    assert "test-gemini-secret-key" not in str(fake.writes)
    assert any("Inferencias realizadas: 2" in str(args) for _, args in fake.writes)
    with pytest.raises(ValueError, match="límite de inferencias"):
        fake.session_state["workflow"].continue_with(["otra respuesta"])


def test_rejected_never_renders_recommendation(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto")]
    monkeypatch.setattr(ui, "st", fake)
    monkeypatch.setattr(ui, "load_dotenv", lambda: None)
    bad = ready()
    bad["recommendation"]["architecture"] = "Nombre no evaluado"
    calls = []
    monkeypatch.setattr(ui, "ArchitectureRun", lambda files, **kwargs: ArchitectureRun(files, tmp_path, infer=fake_infer([bad], calls), **kwargs))
    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    assert fake.session_state["phase"] == "ERROR"
    assert fake.session_state["workflow"].run["validation_status"] == "REJECTED"
    assert not any("RECOMENDACIÓN DEL ARCHITECTURE AGENT" in str(args) for _, args in fake.writes)
    assert any("incumplió el contrato local" in str(args) for _, args in fake.writes)
    fake.pressed = set()
    ui.app()
    assert len(calls) == 1


def test_streamlit_undefined_deployment_is_preflight_without_prior_inference(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto")]
    monkeypatch.setattr(ui, "st", fake)
    monkeypatch.setattr(ui, "load_dotenv", lambda: None)
    calls = []
    monkeypatch.setattr(ui, "ArchitectureRun", lambda files, **kwargs: ArchitectureRun(files, tmp_path, infer=fake_infer([ready()], calls), **kwargs))
    ui.app()
    assert calls == []
    fake.session_state["deployment_undefined"] = True
    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    assert len(calls) == 1
    assert "NO_DEFINIDO_PROPONER_ALTERNATIVAS" in calls[0]
    assert any("Deployment: No definido" in str(args) for _, args in fake.writes)


def test_empty_answer_uses_existing_clarification_marker():
    assert "ANSWER:\nNOT_PROVIDED" in build_clarifications(needs_information()["missing_information"], [""])


def test_final_needs_information_never_calls_third_time(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto")]
    monkeypatch.setattr(ui, "st", fake)
    monkeypatch.setattr(ui, "load_dotenv", lambda: None)
    calls = []
    monkeypatch.setattr(ui, "ArchitectureRun", lambda files, **kwargs: ArchitectureRun(files, tmp_path, infer=fake_infer([needs_information(), needs_information()], calls), **kwargs))
    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    fake.pressed = {"Continuar análisis"}
    ui.app()
    assert fake.session_state["phase"] == "NEEDS_INFORMATION_FINAL"
    fake.pressed = set()
    ui.app()
    assert len(calls) == 2
    assert not any("RECOMENDACIÓN DEL ARCHITECTURE AGENT" in str(args) for _, args in fake.writes)


def test_metadata_excludes_secret_and_recommended_mark_is_exact(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    monkeypatch.setattr(ui, "st", fake)
    result = ready()
    result["alternatives"].append({**result["alternatives"][0], "name": "Monolito modular desplegado"})
    result["decision_matrix"]["evaluations"].append({
        **result["decision_matrix"]["evaluations"][0], "alternative": "Monolito modular desplegado"
    })
    workflow = ArchitectureRun([], tmp_path)
    workflow.run["error_message"] = "test-gemini-secret-key"
    workflow.run["provider"] = "gemini"
    for name in ("architecture-analysis.json", "architecture-analysis.md"):
        (tmp_path / name).write_text("archivo existente", encoding="utf-8")
    ui.show_ready(result, workflow, [])
    assert sum("RECOMENDADA" in str(args) for name, args in fake.writes if name == "success") == 1
    assert "test-gemini-secret-key" not in str(fake.writes)
    assert fake.downloads["architecture-analysis.json"] == b"archivo existente"


def test_ready_shows_structure_without_extra_inference(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    monkeypatch.setattr(ui, "st", fake)
    result = ready()
    workflow = ArchitectureRun([], tmp_path)
    for name in ("architecture-analysis.json", "architecture-analysis.md"):
        (tmp_path / name).write_text("archivo existente", encoding="utf-8")
    ui.show_ready(result, workflow, [])
    assert any("Actores externos" in str(args) for _, args in fake.writes)
    assert any("CMP-001: Reservas" in str(args) for _, args in fake.writes)
    assert any("ACT-001 → CMP-001" in str(args) for _, args in fake.writes)
    assert any("Consistencia de cupos" in str(args) for _, args in fake.writes)
    assert not any("mermaid" in str(args).lower() for _, args in fake.writes)
    assert workflow.calls == 0


def test_changed_upload_clears_prior_ready_without_inference(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    uploaded = SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto")
    fake.uploaded = [uploaded]
    monkeypatch.setattr(ui, "st", fake)
    monkeypatch.setattr(ui, "load_dotenv", lambda: None)
    calls = []
    monkeypatch.setattr(ui, "ArchitectureRun", lambda files, **kwargs: ArchitectureRun(files, tmp_path, infer=fake_infer([ready()], calls), **kwargs))
    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    assert fake.session_state["phase"] == "READY"
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto nuevo")]
    fake.pressed = set()
    ui.app()
    assert fake.session_state["phase"] == "DOCUMENTS_READY"
    assert fake.session_state["result"] is None
    assert len(calls) == 1


def test_diagrams_use_public_streamlit_api_and_current_run_downloads(tmp_path, monkeypatch):
    fake = FakeStreamlit()
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto")]
    monkeypatch.setattr(ui, "st", fake)
    monkeypatch.setattr(ui, "load_dotenv", lambda: None)
    bad = ready()
    bad["architecture_structure"]["relationships"][0]["to"] = "CMP-999"
    calls = []
    monkeypatch.setattr(ui, "ArchitectureRun", lambda files, **kwargs: ArchitectureRun(
        files, tmp_path, infer=fake_infer([ready(), bad], calls), **kwargs))

    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    assert fake.session_state["phase"] == "READY"
    workflow = fake.session_state["workflow"]
    charts = [args[0] for name, args in fake.writes if name == "mermaid_chart"]
    assert charts == [item["content"] for item in workflow.diagrams]
    for item in workflow.diagrams:
        assert fake.downloads[item["filename"]] == item["content"].encode("utf-8")
    assert len(calls) == 1

    fake.writes.clear()
    fake.downloads.clear()
    fake.uploaded = [SimpleNamespace(name="context.md", getvalue=lambda: b"Contexto nuevo")]
    fake.pressed = {"Analizar arquitectura"}
    ui.app()
    assert fake.session_state["phase"] == "ERROR"
    assert not any(name == "mermaid_chart" for name, _ in fake.writes)
    assert not any(name.endswith(".mmd") for name in fake.downloads)
    assert not list(tmp_path.glob("*.mmd"))
    assert len(calls) == 2
