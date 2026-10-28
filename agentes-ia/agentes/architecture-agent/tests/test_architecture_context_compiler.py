import hashlib
import json
from pathlib import Path

import pytest

from architecture_context_compiler import _sections, compile_context
from architecture_runner import ArchitectureRun
from context_loader import load_context
from gemini_client import InferenceResult
from tests.test_result_handler import needs_information, ready
from result_handler import parse_result


def test_selected_sources_and_primary_needs_are_preserved(tmp_path):
    selected = tmp_path / "primary-needs.md"
    selected.write_text("## Necesidades No Funcionales\nCero sobre-reservas.", encoding="utf-8")
    (tmp_path / "unselected.md").write_text("Información ajena", encoding="utf-8")
    pack = compile_context(load_context([selected]))
    assert "primary-needs.md" in pack
    assert "Cero sobre-reservas." in pack
    assert "unselected.md" not in pack
    assert "Información ajena" not in pack


def test_relevant_evidence_and_unverified_history_are_preserved(tmp_path):
    document = tmp_path / "SPEC-001.md"
    document.write_text(
        "# SPEC-001 - Versión 1\nEstado: Aprobada y congelada\n"
        "### Requisitos no funcionales\nRNF-001. Consistencia de reservas.\n"
        "### Restricciones\nPlataforma aprobada: Vercel.\n"
        "### Dependencias\nIntegración con EPS simulada.\n"
        "### Casos límite\nCL-001. Dos reservas concurrentes no pueden exceder el cupo.\n"
        "### Criterios de aceptación\nAC-001. El sistema rechaza el segundo intento concurrente.\n"
        "### Fuera de alcance\nNo se enviarán diagnósticos clínicos.\n"
        "### Historial de cambios\nVersión 0.1: texto administrativo antiguo.\n",
        encoding="utf-8",
    )
    pack = compile_context(load_context([document]))
    for phrase in ("Aprobada y congelada", "RNF-001", "Vercel", "EPS simulada", "CL-001", "AC-001", "diagnósticos clínicos"):
        assert phrase in pack
    assert "texto administrativo antiguo" in pack


def test_flow_document_preserves_approval_metadata_and_critical_cases(tmp_path):
    document = tmp_path / "flows.md"
    document.write_text(
        "# Producto - Flujos del producto\nVersión: 1\nEstado: Aprobado\n"
        "## Reserva\n1. El usuario abre la pantalla.\n2. Dos solicitudes concurrentes no pueden exceder el cupo.\n",
        encoding="utf-8",
    )
    pack = compile_context(load_context([document]))
    assert "Versión: 1" in pack
    assert "Estado: Aprobado" in pack
    assert "Dos solicitudes concurrentes" in pack
    assert "El usuario abre la pantalla." in pack


def test_distinct_sources_remain_separate_even_when_wording_matches(tmp_path):
    first = tmp_path / "primary-needs.md"
    second = tmp_path / "requirements.md"
    third = tmp_path / "other.md"
    first.write_text("## Restricciones\nLa plataforma es Vercel.", encoding="utf-8")
    second.write_text("## Restricciones\nLa plataforma es Vercel.", encoding="utf-8")
    third.write_text("## Restricciones\nLa plataforma es local.", encoding="utf-8")
    pack = compile_context(load_context([first, second, third]))
    assert pack.count("La plataforma es Vercel.") == 2
    assert "SOURCE: primary-needs.md | HEADING: Restricciones" in pack
    assert "SOURCE: requirements.md | HEADING: Restricciones" in pack
    assert "La plataforma es local." in pack


def test_literal_duplicate_within_one_source_retains_both_headings(tmp_path):
    document = tmp_path / "requirements.md"
    document.write_text("## Regla A\nMismo texto.\n## Regla B\nMismo texto.", encoding="utf-8")
    pack = compile_context(load_context([document]))
    assert pack.count("Mismo texto.") == 1
    assert "SOURCE: requirements.md | HEADING: Regla A" in pack
    assert "SOURCE: requirements.md | HEADING: Regla B" in pack


def test_second_inference_uses_identical_pack_and_original_sources(tmp_path):
    document = tmp_path / "primary-needs.md"
    document.write_text("## Restricciones\nPlataforma pendiente.", encoding="utf-8")
    calls = []
    responses = [needs_information(), ready("primary-needs.md")]
    responses[1]["architecture_drivers"][0]["evidence"][0]["source"] = "HUMAN_CLARIFICATIONS"

    def fake_infer(context):
        calls.append(context)
        return InferenceResult(json.dumps(responses[len(calls) - 1]), 1.0, {}, "test-model")

    workflow = ArchitectureRun([document], tmp_path / "out", infer=fake_infer)
    workflow.start()
    workflow.continue_with(["Vercel"])
    assert len(calls) == 2
    assert calls[0] == workflow.lossless_context
    assert calls[1].startswith(calls[0] + "\n\n===== HUMAN_CLARIFICATIONS =====")
    assert workflow.run["input_sources"] == ["primary-needs.md"]
    assert workflow.run["lossless_context_sha256"] == hashlib.sha256(calls[0].encode()).hexdigest()
    assert workflow.run["context_sha256"] == hashlib.sha256(calls[1].encode()).hexdigest()
    assert "ARCHITECTURE_EVIDENCE_PACK" not in workflow.run["input_sources"]
    assert workflow.run["compiled_input_tokens"] is None  # No provider call in tests.


def test_token_warning_does_not_remove_evidence(tmp_path, monkeypatch):
    document = tmp_path / "primary-needs.md"
    document.write_text("## Restricciones\nPlataforma pendiente.", encoding="utf-8")
    monkeypatch.setenv("ARCHITECTURE_CONTEXT_TOKEN_WARNING", "1")
    workflow = ArchitectureRun([document], tmp_path / "out", infer=lambda _: None)
    workflow.prepare()
    assert workflow.run["context_token_warning"] is True
    assert "Plataforma pendiente." in workflow.compiled_context


def test_real_pharma_corpus_preserves_architectural_evidence():
    files = [Path(__file__).resolve().parents[1] / "data" / name for name in (
        "PHARMA_EXPRESS_AGENTES.md", "PHARMA_EXPRESS_FLUJOS.md",
        "PHARMA_EXPRESS_PROBLEMA_CONTEXTO_OBJETIVOS.md", "SPEC-001_v1.3_2.md",
        "SPEC-003_v1.0.md", "primary-needs.md",
    )]
    raw = load_context(files)
    pack = compile_context(raw)
    for evidence in (
        "RNF-001", "RNF-002", "RNF-003", "CL-003", "DEC-005",
        "Concurrencia y Cero Sobre-reservas", "Trabajos Asíncronos Programados",
        "Pasarelas Reales de Mensajería", "MIPRES", "Ley 1581", "WCAG",
        "una hora antes", "Fuera de alcance",
    ):
        assert evidence.lower() in pack.lower()
    for path in files:
        assert path.name in pack
    # Every non-empty source section survives verbatim; no vocabulary decides
    # which functional statement is sent to the model.
    for path in files:
        for heading, body in _sections(path.read_text(encoding="utf-8")):
            assert f"SOURCE: {path.name} | HEADING: {heading}\n" in pack
            assert body.strip() in pack
    assert "Activa --> Revocada: desvinculación o revocación" in pack
    assert "Vencida --> Revocada: desvinculación o revocación" in pack
    assert "SOURCE: PHARMA_EXPRESS_FLUJOS.md | HEADING: 7. Canal asistido y vinculación de canales" in pack
    assert "Escoger paciente antes de cada gestión" in pack


def test_vocabulary_change_cannot_remove_functional_rule(tmp_path):
    document = tmp_path / "flows.md"
    rule = "Cuando el usuario deja de autorizar el canal, este deja inmediatamente de poder recibir comunicaciones."
    document.write_text("## Flujo principal\n" + rule, encoding="utf-8")
    pack = compile_context(load_context([document]))
    assert rule in pack


def test_evidence_pack_is_not_allowed_source():
    response = ready()
    response["architecture_drivers"][0]["evidence"][0]["source"] = "ARCHITECTURE_EVIDENCE_PACK"
    with pytest.raises(ValueError, match="fuente ajena"):
        parse_result(json.dumps(response), sources=["primary-needs.md"])
