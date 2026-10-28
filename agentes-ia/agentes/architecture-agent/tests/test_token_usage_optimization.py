import hashlib
import json
from pathlib import Path

from architecture_runner import ArchitectureRun, UNDEFINED_DEPLOYMENT, build_preflight
from context_loader import load_context
from gemini_client import InferenceResult
from tests.test_result_handler import needs_information, ready


def test_lossless_runtime_context_is_exactly_selected_documents(tmp_path):
    first = tmp_path / "primary-needs.md"
    second = tmp_path / "flows.md"
    first.write_text("## Necesidades\nRegla sin palabra clave.\n### Estado\nActiva --> Revocada", encoding="utf-8")
    second.write_text("# Flujos\nPaso uno.\nPaso dos.", encoding="utf-8")
    (tmp_path / "neighbor.md").write_text("No seleccionada", encoding="utf-8")
    workflow = ArchitectureRun([first, second], tmp_path / "out", infer=lambda _: None)
    workflow.prepare()
    assert workflow.lossless_context == load_context([first, second])
    assert workflow.context == workflow.lossless_context
    assert workflow.context.count("===== SOURCE:") == 2
    assert "[EV-" not in workflow.context
    assert "HEADING:" not in workflow.context
    assert "No seleccionada" not in workflow.context
    assert "Activa --> Revocada" in workflow.context
    assert workflow.run["lossless_context_sha256"] == hashlib.sha256(workflow.context.encode()).hexdigest()


def test_preflight_vercel_is_available_on_first_call_without_local_stack_inference(tmp_path):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    result = ready()
    result["architecture_drivers"][0]["evidence"][0]["source"] = "HUMAN_PREFLIGHT"
    calls = []

    def infer(context):
        calls.append(context)
        return InferenceResult(json.dumps(result), 1.0, {"input_tokens": 20}, "test-model")

    workflow = ArchitectureRun([document], tmp_path / "out", infer=infer, deployment="Vercel")
    workflow.prepare()
    assert calls == []
    workflow.start()
    assert len(calls) == 1
    assert calls[0].startswith(workflow.lossless_context)
    assert "===== HUMAN_PREFLIGHT =====" in calls[0]
    assert "Plataforma o entorno de despliegue: Vercel" in calls[0]
    assert "Next.js" not in calls[0] and "React" not in calls[0]
    assert workflow.run["calls"][0]["input_tokens"] == 20


def test_undefined_preflight_is_explicit_and_not_a_provider_choice():
    assert UNDEFINED_DEPLOYMENT in build_preflight("")
    assert UNDEFINED_DEPLOYMENT in build_preflight("No definido")
    assert UNDEFINED_DEPLOYMENT in build_preflight("No está definido")
    assert "Vercel" not in build_preflight("")


def test_second_call_reuses_lossless_context_and_aggregates_usage(tmp_path):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    initial = needs_information()
    final = ready()
    final["architecture_drivers"][0]["evidence"][0]["source"] = "HUMAN_CLARIFICATIONS"
    calls = []
    usages = [
        {"input_tokens": 10, "total_tokens": 11},
        {"input_tokens": 12, "output_tokens": 3, "thought_tokens": 2, "total_tokens": 17},
    ]

    def infer(context):
        calls.append(context)
        return InferenceResult(json.dumps(initial if len(calls) == 1 else final), 1.25, usages[len(calls) - 1], "test-model")

    workflow = ArchitectureRun([document], tmp_path / "out", infer=infer, deployment="Vercel")
    workflow.start()
    workflow.continue_with(["Solo simulados"])
    assert len(calls) == 2
    assert calls[1].startswith(calls[0] + "\n\n===== HUMAN_CLARIFICATIONS =====")
    assert calls[0].count("===== HUMAN_PREFLIGHT =====") == calls[1].count("===== HUMAN_PREFLIGHT =====") == 1
    assert workflow.run["calls"][0]["purpose"] == "INITIAL_ANALYSIS"
    assert workflow.run["calls"][1]["purpose"] == "ANALYSIS_AFTER_CLARIFICATIONS"
    assert "output_tokens" not in workflow.run["calls"][0]
    for key, total in workflow.run["usage"].items():
        assert sum(call.get(key, 0) for call in workflow.run["calls"]) == total
    assert workflow.run["duration_seconds"] == 2.5
    assert workflow.run["context_sha256"] == hashlib.sha256(calls[1].encode()).hexdigest()
    manifest = (tmp_path / "out" / "architecture-analysis.run.json").read_text(encoding="utf-8")
    assert "Vercel" not in manifest
    assert "Solo simulados" not in manifest
    assert "Contexto" not in manifest
    assert "GEMINI_API_KEY" not in manifest
    assert "test-gemini-secret-key" not in manifest


def test_real_six_file_context_keeps_each_complete_selected_source():
    files = [Path(__file__).resolve().parents[1] / "data" / name for name in (
        "PHARMA_EXPRESS_AGENTES.md", "PHARMA_EXPRESS_FLUJOS.md",
        "PHARMA_EXPRESS_PROBLEMA_CONTEXTO_OBJETIVOS.md", "SPEC-001_v1.3_2.md",
        "SPEC-003_v1.0.md", "primary-needs.md",
    )]
    context = load_context(files)
    for file in files:
        assert file.read_text(encoding="utf-8") in context
        assert context.count(f"===== SOURCE: {file.name} =====") == 1
    assert context.count("===== SOURCE:") == 6
