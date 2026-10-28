import hashlib
import json
import sys

import pytest

import main as app
from gemini_client import InferenceError
from test_result_handler import inference, needs_information


def run_cli(tmp_path, monkeypatch, capsys, failure, *, second_call=False):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "out"
    calls = []
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])

    def analyze(context):
        calls.append(context)
        if second_call and len(calls) == 1:
            return inference(json.dumps(needs_information()), duration=1.5, usage={"input_tokens": 3})
        raise failure

    monkeypatch.setattr(app, "analyze", analyze)
    if second_call:
        monkeypatch.setattr("builtins.input", lambda prompt: "No definido")
    with pytest.raises(SystemExit) as exit_info:
        app.main()
    assert exit_info.value.code == 1
    manifest_text = (output / "architecture-analysis.run.json").read_text()
    message = capsys.readouterr().err
    assert "test-gemini-secret-key" not in message + manifest_text
    assert "Authorization" not in message + manifest_text
    assert "GOOGLE_API_KEY" not in message + manifest_text
    return json.loads(manifest_text), message, output, calls


@pytest.mark.parametrize("status,expected", [
    (429, "RATE_LIMITED"),
    (401, "AUTHENTICATION_ERROR"),
    (403, "AUTHORIZATION_ERROR"),
    (500, "PROVIDER_HTTP_ERROR"),
])
def test_provider_errors_are_recorded(tmp_path, monkeypatch, capsys, status, expected):
    failure = InferenceError(expected, "Error seguro.", http_status=status, duration_seconds=2.25,
                             retry_after="60" if status == 429 else None, detail="Detalle seguro [REDACTED]")
    manifest, message, output, calls = run_cli(tmp_path, monkeypatch, capsys, failure)
    assert len(calls) == 1
    assert manifest["provider"] == "gemini"
    assert manifest["validation_status"] == "NO_OUTPUT"
    assert manifest["error_type"] == expected
    assert manifest["http_status"] == status
    assert manifest["duration_seconds"] == 2.25
    assert manifest["usage"] is None
    assert manifest["output_file"] is None and manifest["output_sha256"] is None
    assert "Proveedor: Gemini" in message
    assert "Detalle seguro [REDACTED]" in message + manifest["error_message"]
    assert manifest["retry_after"] == ("60" if status == 429 else None)
    assert not (output / "architecture-analysis.json").exists()


@pytest.mark.parametrize("error_type", ["CLIENT_TIMEOUT", "NETWORK_ERROR", "INVALID_PROVIDER_RESPONSE"])
def test_errors_without_http_are_recorded(tmp_path, monkeypatch, capsys, error_type):
    failure = InferenceError(error_type, "Error seguro.", duration_seconds=2.25)
    manifest, message, _, _ = run_cli(tmp_path, monkeypatch, capsys, failure)
    assert manifest["error_type"] == error_type
    assert manifest["http_status"] is None
    assert manifest["duration_seconds"] == 2.25
    if error_type == "CLIENT_TIMEOUT":
        assert "HTTP: no recibido" in message
        assert "Timeout configurado: 120 s" in message


def test_second_call_failure_keeps_first_usage_and_total_duration(tmp_path, monkeypatch, capsys):
    failure = InferenceError("RATE_LIMITED", "Límite temporal", http_status=429, duration_seconds=2.25)
    manifest, message, output, calls = run_cli(tmp_path, monkeypatch, capsys, failure, second_call=True)
    assert len(calls) == 2
    assert "===== HUMAN_CLARIFICATIONS =====" in calls[1]
    assert manifest["questions_asked"] == 1
    assert manifest["clarification_rounds"] == 1
    assert manifest["error_type"] == "RATE_LIMITED"
    assert manifest["validation_status"] == "NO_OUTPUT"
    assert manifest["duration_seconds"] == 3.75
    assert manifest["usage"] == {"input_tokens": 3}
    assert len(manifest["calls"]) == 2
    assert manifest["calls"][0]["input_tokens"] == 3
    assert "input_tokens" not in manifest["calls"][1]
    assert manifest["context_sha256"] == hashlib.sha256(calls[1].encode()).hexdigest()
    assert "No definido" not in json.dumps(manifest)
    assert "primera respuesta solicitó aclaraciones" in message
    assert not (output / "architecture-analysis.json").exists()


def test_second_call_error_without_duration_keeps_first_duration(tmp_path, monkeypatch, capsys):
    failure = InferenceError("NETWORK_ERROR", "Conexión fallida")
    manifest, _, _, calls = run_cli(tmp_path, monkeypatch, capsys, failure, second_call=True)
    assert len(calls) == 2
    assert manifest["duration_seconds"] == 1.5
    assert manifest["usage"] == {"input_tokens": 3}


def test_invalid_model_json_is_output_validation_error(tmp_path, monkeypatch):
    document = tmp_path / "context.md"
    document.write_text("Contexto", encoding="utf-8")
    output = tmp_path / "out"
    monkeypatch.setattr(sys, "argv", ["main.py", "--cli", "--files", str(document), "--deployment", "Vercel", "--output-dir", str(output)])
    monkeypatch.setattr(app, "analyze", lambda context: inference("not json", duration=1.2))
    with pytest.raises(SystemExit):
        app.main()
    manifest = json.loads((output / "architecture-analysis.run.json").read_text())
    assert manifest["error_type"] == "OUTPUT_VALIDATION_ERROR"
    assert manifest["validation_status"] == "REJECTED"
    assert manifest["duration_seconds"] == 1.2
    assert manifest["output_file"] is None
    assert not (output / "architecture-analysis.rejected.json").exists()
