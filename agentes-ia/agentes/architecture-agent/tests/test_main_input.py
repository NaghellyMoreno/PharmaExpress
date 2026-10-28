import builtins
import hashlib
import json
import sys

import pytest

import main as app
from test_result_handler import inference, needs_information, ready


def test_ready_first_call_has_no_clarifications(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "out"
    calls = []
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    monkeypatch.setattr(builtins, "input", lambda prompt: pytest.fail("No debe preguntar"))
    monkeypatch.setattr(app, "analyze", lambda context: calls.append(context) or inference(json.dumps(ready()), duration=1.25, usage={"input_tokens": 10, "total_tokens": 12}))
    app.main()
    manifest = json.loads((output / "architecture-analysis.run.json").read_text())
    assert len(calls) == 1
    assert (manifest["clarification_rounds"], manifest["questions_asked"]) == (0, 0)
    assert manifest["provider"] == "gemini"
    assert manifest["model"] == "gemini-3.5-flash-lite"
    assert manifest["duration_seconds"] == 1.25
    assert manifest["usage"] == {"input_tokens": 10, "total_tokens": 12}
    assert manifest["context_sha256"] == hashlib.sha256(calls[0].encode()).hexdigest()
    assert manifest["validation_status"] == "ACCEPTED"
    assert manifest["calls"] == [{"round": 1, "purpose": "INITIAL_ANALYSIS", "model": "gemini-3.5-flash-lite", "duration_seconds": 1.25, "input_tokens": 10, "total_tokens": 12}]
    assert "===== HUMAN_PREFLIGHT =====" in calls[0]


def test_cli_prompts_for_deployment_before_first_inference(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    calls = []
    prompts = []
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--output-dir", str(tmp_path / "out")])
    monkeypatch.setattr(builtins, "input", lambda prompt: prompts.append(prompt) or "")
    monkeypatch.setattr(app, "analyze", lambda context: calls.append(context) or inference(json.dumps(ready())))
    app.main()
    assert len(prompts) == 1 and "Plataforma o entorno de despliegue" in prompts[0]
    assert len(calls) == 1
    assert "===== HUMAN_PREFLIGHT =====" in calls[0]
    assert "NO_DEFINIDO_PROPONER_ALTERNATIVAS" in calls[0]


@pytest.mark.parametrize("final_status,answers", [
    ("READY", ["No definida", "Solo simulados"]),
    ("NEEDS_INFORMATION", ["No definida", "Solo simulados"]),
    ("NEEDS_INFORMATION", ["", "Solo simulados"]),
])
def test_one_clarification_round(tmp_path, monkeypatch, capsys, final_status, answers):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "out"
    first = needs_information()
    first["missing_information"].append({"question": "¿Integración real comprometida?", "reason": "No consta", "decision_impact": "Cambia límites"})
    final = ready() if final_status == "READY" else needs_information()
    calls = []
    responses = iter(answers)
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    monkeypatch.setattr(builtins, "input", lambda prompt: next(responses))
    monkeypatch.setattr(app, "analyze", lambda context: calls.append(context) or inference(
        json.dumps(first if len(calls) == 1 else final),
        duration=1.25 if len(calls) == 1 else 2.5,
        usage={"input_tokens": 3, "total_tokens": 4} if len(calls) == 1 else {"output_tokens": 5, "total_tokens": 6},
    ))
    app.main()
    manifest_text = (output / "architecture-analysis.run.json").read_text()
    manifest = json.loads(manifest_text)
    assert len(calls) == 2
    assert calls[1].startswith(calls[0] + "\n\n===== HUMAN_CLARIFICATIONS =====")
    assert "ANSWER:\n" + (answers[0] or "NOT_PROVIDED") in calls[1]
    assert "ANSWER:\nSolo simulados" in calls[1]
    assert (manifest["clarification_rounds"], manifest["questions_asked"]) == (1, 2)
    assert manifest["context_sha256"] == hashlib.sha256(calls[1].encode()).hexdigest()
    assert manifest["duration_seconds"] == 3.75
    assert manifest["usage"] == {"input_tokens": 3, "output_tokens": 5, "total_tokens": 10}
    assert "thought_tokens" not in manifest["usage"]
    assert manifest["validation_status"] == "ACCEPTED"
    assert "Solo simulados" not in manifest_text
    assert json.loads((output / "architecture-analysis.json").read_text())["status"] == final_status
    if final_status == "NEEDS_INFORMATION":
        assert "No existe información suficiente" in capsys.readouterr().out


def test_human_clarification_is_valid_evidence_source(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "out"
    final = ready()
    final["architecture_drivers"][0]["evidence"][0]["source"] = "HUMAN_CLARIFICATIONS"
    calls = []
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    monkeypatch.setattr(builtins, "input", lambda prompt: "Restricción aprobada")
    monkeypatch.setattr(app, "analyze", lambda context: calls.append(context) or inference(json.dumps(needs_information() if len(calls) == 1 else final)))
    app.main()
    assert len(calls) == 2
    assert json.loads((output / "architecture-analysis.json").read_text())["status"] == "READY"


def test_cli_files_do_not_prompt(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(tmp_path / "out")])
    monkeypatch.setattr(builtins, "input", lambda prompt: pytest.fail("CLI no debe preguntar"))
    monkeypatch.setattr(app, "analyze", lambda context: (_ for _ in ()).throw(RuntimeError(context)))
    with pytest.raises(RuntimeError, match="SOURCE: context.md"):
        app.main()


def test_interactive_files_reach_existing_flow(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    answers = iter([str(document), ""])
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--deployment", "Vercel"])
    monkeypatch.setattr(builtins, "input", lambda prompt: next(answers))
    monkeypatch.setattr(app, "analyze", lambda context: (_ for _ in ()).throw(RuntimeError(context)))
    with pytest.raises(RuntimeError, match="SOURCE: context.md"):
        app.main()


def test_interactive_input_does_not_load_neighboring_markdown(tmp_path, monkeypatch):
    selected = tmp_path / "test-context.md"
    selected.write_text("Contenido seleccionado", encoding="utf-8")
    neighbor = tmp_path / "other.md"
    neighbor.write_text("Contenido ajeno", encoding="utf-8")
    answers = iter([str(selected), ""])
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--deployment", "Vercel"])
    monkeypatch.setattr(builtins, "input", lambda prompt: next(answers))

    def inspect_context(context):
        assert "===== SOURCE: test-context.md =====" in context
        assert "SOURCE: test-context.md" in context
        assert "Contenido seleccionado" in context
        assert "other.md" not in context
        assert "Contenido ajeno" not in context
        raise RuntimeError("Contexto inspeccionado sin llamar a Gemini")

    monkeypatch.setattr(app, "analyze", inspect_context)
    with pytest.raises(RuntimeError, match="Contexto inspeccionado"):
        app.main()


def test_missing_path_reprompts_same_position(tmp_path, monkeypatch, capsys):
    document = tmp_path / "valid.md"
    document.write_text("Contexto", encoding="utf-8")
    prompts = []
    answers = iter([str(tmp_path / "missing.md"), str(document), ""])
    monkeypatch.setattr(builtins, "input", lambda prompt: prompts.append(prompt) or next(answers))
    assert app.collect_files_interactively() == [str(document)]
    assert prompts[:2] == ["Archivo 1: ", "Archivo 1: "]
    assert f"Archivo no encontrado: {tmp_path / 'missing.md'}" in capsys.readouterr().out


def test_non_markdown_reprompts(tmp_path, monkeypatch, capsys):
    document = tmp_path / "notes.txt"
    document.write_text("Contexto", encoding="utf-8")
    answers = iter([str(document), ""])
    monkeypatch.setattr(builtins, "input", lambda prompt: next(answers))
    assert app.collect_files_interactively() == []
    assert f"Se esperaba un archivo Markdown: {document}" in capsys.readouterr().out


def test_empty_input_exits_without_model(monkeypatch, capsys):
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli"])
    monkeypatch.setattr(builtins, "input", lambda prompt: "")
    monkeypatch.setattr(app, "analyze", lambda context: pytest.fail("No debe llamar al modelo"))
    with pytest.raises(SystemExit) as exc:
        app.main()
    assert exc.value.code == 1
    assert "No se proporcionaron archivos de contexto" in capsys.readouterr().err


def test_path_with_spaces_is_preserved(tmp_path, monkeypatch):
    document = tmp_path / "soft 3" / "context file.md"
    document.parent.mkdir()
    document.write_text("Contexto", encoding="utf-8")
    answers = iter([f"  {document}  ", ""])
    monkeypatch.setattr(builtins, "input", lambda prompt: next(answers))
    assert app.collect_files_interactively() == [str(document)]


def test_duplicate_path_is_added_once(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    answers = iter([str(document), str(document), ""])
    monkeypatch.setattr(builtins, "input", lambda prompt: next(answers))
    assert app.collect_files_interactively() == [str(document)]


def test_ready_prints_only_validated_recommendation(tmp_path, monkeypatch, capsys):
    document = tmp_path / "context.md"
    document.write_text("Despliegue definido", encoding="utf-8")
    output = tmp_path / "out"
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    monkeypatch.setattr(app, "analyze", lambda context: inference(json.dumps(ready())))
    app.main()
    printed = capsys.readouterr().out
    assert "Monolito modular" in printed
    assert "Satisface el contexto" in printed
    assert "Despliegue conjunto" in printed
    assert "PROPOSED — pendiente aprobación humana" in printed
    assert str(output / "architecture-analysis.json") in printed


def test_duplicate_spec_stops_before_inference(tmp_path, monkeypatch, capsys):
    files = [tmp_path / name for name in ("SPEC-001_v1.3.md", "SPEC-001_v1.3_2.md")]
    for path in files:
        path.write_text("# SPEC-001. Caso - Versión 1.3", encoding="utf-8")
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", *(str(path) for path in files), "--deployment", "Vercel", "--output-dir", str(tmp_path / "out")])
    monkeypatch.setattr(app, "analyze", lambda context: pytest.fail("No debe inferir con duplicados"))
    with pytest.raises(SystemExit):
        app.main()
    assert "Seleccione una única fuente canónica" in capsys.readouterr().err


def test_final_needs_information_has_no_recommendation(tmp_path, monkeypatch, capsys):
    document = tmp_path / "context.md"
    document.write_text("Contexto sin despliegue", encoding="utf-8")
    output = tmp_path / "out"
    calls = []
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    monkeypatch.setattr(builtins, "input", lambda prompt: "NO_DEFINIDO_PROPONER_ALTERNATIVAS")
    monkeypatch.setattr(app, "analyze", lambda context: calls.append(context) or inference(json.dumps(needs_information())))
    app.main()
    printed = capsys.readouterr().out
    assert len(calls) == 2
    assert "HUMAN_CLARIFICATIONS" in calls[1]
    assert "NO_DEFINIDO_PROPONER_ALTERNATIVAS" in calls[1]
    assert "No existe información suficiente" in printed
    assert "Recomendación del Architecture Agent" not in printed
    assert json.loads((output / "architecture-analysis.json").read_text())["recommendation"] is None


def test_undefined_deployment_clarification_can_reach_ready(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto sin despliegue", encoding="utf-8")
    calls = []
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(tmp_path / "out")])
    monkeypatch.setattr(builtins, "input", lambda prompt: "NO_DEFINIDO_PROPONER_ALTERNATIVAS")
    monkeypatch.setattr(app, "analyze", lambda context: calls.append(context) or inference(json.dumps(needs_information() if len(calls) == 1 else ready())))
    app.main()
    assert len(calls) == 2
    assert "ANSWER:\nNO_DEFINIDO_PROPONER_ALTERNATIVAS" in calls[1]
    assert json.loads((tmp_path / "out" / "architecture-analysis.json").read_text())["status"] == "READY"
