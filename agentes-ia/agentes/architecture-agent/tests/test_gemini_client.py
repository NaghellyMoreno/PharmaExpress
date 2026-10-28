import httpx
import pytest
from google.genai import errors, types

import gemini_client as client
from architecture_prompt import SYSTEM_PROMPT


def response(text="{}", usage=None):
    candidates = [] if text is None else [types.Candidate(content=types.Content(parts=[types.Part(text=text)]))]
    return types.GenerateContentResponse(candidates=candidates, usage_metadata=usage)


def fake_client(monkeypatch, result=None, failure=None):
    captured = {"calls": 0}

    class Models:
        def generate_content(self, **kwargs):
            captured["calls"] += 1
            captured["request"] = kwargs
            if failure is not None:
                raise failure
            return result

    class Client:
        def __init__(self, **kwargs):
            captured["client"] = kwargs
            self.models = Models()

        def __enter__(self):
            return self

        def __exit__(self, *_):
            pass

    monkeypatch.setattr(client.genai, "Client", Client)
    return captured


def test_success_uses_public_generate_content_configuration(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    monkeypatch.delenv("GEMINI_MODEL", raising=False)
    captured = fake_client(monkeypatch, response())
    result = client.analyze("===== SOURCE: context.md =====\n\nContexto")

    assert result.content == "{}"
    assert result.model == client.DEFAULT_MODEL == "gemini-3.5-flash-lite"
    assert result.duration_seconds >= 0
    assert result.usage == {}
    assert captured["calls"] == 1
    assert captured["client"]["api_key"] == "test-gemini-secret-key"
    options = captured["client"]["http_options"]
    assert options.timeout == 120_000  # HttpOptions.timeout is milliseconds: 120 seconds.
    assert options.retry_options.attempts == 1  # Total attempts, including the first.
    assert captured["request"]["model"] == client.DEFAULT_MODEL
    assert captured["request"]["contents"] == "===== SOURCE: context.md =====\n\nContexto"
    config = captured["request"]["config"]
    assert config.system_instruction == SYSTEM_PROMPT
    assert config.thinking_config.thinking_level == types.ThinkingLevel.MEDIUM
    assert not {"temperature", "top_p", "top_k", "candidate_count"} & config.model_fields_set
    assert config.response_mime_type == "application/json"
    assert config.response_json_schema == client.RESPONSE_SCHEMA
    assert config.automatic_function_calling.disable is True
    assert "automatic_function_calling" in config.model_fields_set
    assert "response_schema" not in config.model_fields_set


def test_count_input_tokens_uses_public_sdk_method_without_inference(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    captured = {"generation_calls": 0}

    class Models:
        def count_tokens(self, **kwargs):
            captured["request"] = kwargs
            return types.CountTokensResponse(total_tokens=42)

        def generate_content(self, **kwargs):
            captured["generation_calls"] += 1
            pytest.fail("No debe inferir para medir tokens")

    class Client:
        def __init__(self, **kwargs):
            self.models = Models()

        def __enter__(self):
            return self

        def __exit__(self, *_):
            pass

    monkeypatch.setattr(client.genai, "Client", Client)
    assert client.count_input_tokens("Pack compilado") == 42
    assert captured["request"]["contents"] == "Pack compilado"
    assert captured["request"]["config"].system_instruction == SYSTEM_PROMPT
    assert captured["generation_calls"] == 0
    assert client.count_input_tokens("Solo contexto", include_system=False) == 42
    assert captured["request"]["contents"] == "Solo contexto"
    assert "config" not in captured["request"]


def test_count_input_tokens_failure_is_optional(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")

    class Client:
        def __init__(self, **kwargs):
            raise RuntimeError("Conteo no disponible")

    monkeypatch.setattr(client.genai, "Client", Client)
    assert client.count_input_tokens("Contexto") is None


def test_prompt_requires_exact_recommendation_identity():
    assert "recommendation.architecture DEBE ser una copia textual EXACTA" in SYSTEM_PROMPT
    assert "alternatives[].name" in SYSTEM_PROMPT
    assert "No reformules ese nombre" in SYSTEM_PROMPT


def test_structured_schema_excludes_observed_invalid_shapes():
    schema = client.RESPONSE_SCHEMA
    recommendation = schema["properties"]["recommendation"]["anyOf"][0]
    adr = schema["properties"]["adr"]["anyOf"][0]
    assert recommendation["required"] == ["architecture", "justification", "accepted_tradeoffs"]
    assert recommendation["additionalProperties"] is False
    assert "accepted_trade-offs" not in recommendation["properties"]
    assert recommendation["properties"]["justification"]["type"] == "array"
    assert recommendation["properties"]["accepted_tradeoffs"]["type"] == "array"
    assert adr["properties"]["justification"]["type"] == "array"
    assert schema["properties"]["missing_information"]["maxItems"] == 5
    assert schema["properties"]["alternatives"]["maxItems"] == 3


def test_vercel_clarification_is_sent_with_stack_guardrail(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    captured = fake_client(monkeypatch, response())
    context = "===== SOURCE: requirements.md =====\n\nFramework: no especificado.\n\n===== HUMAN_CLARIFICATIONS =====\n\nPlataforma de despliegue: Vercel"
    client.analyze(context)
    request = captured["request"]
    assert request["contents"] == context
    instruction = request["config"].system_instruction
    assert "RESTRICCIÓN DE PLATAFORMA != DECISIÓN DE STACK" in instruction
    assert "Next.js App Router" in instruction
    assert "nunca como requisito confirmado" in instruction
    assert "primera respuesta NEEDS_INFORMATION reúne en una misma ronda" in instruction


def test_missing_api_key_does_not_create_client(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    captured = fake_client(monkeypatch, response())
    with pytest.raises(ValueError, match="GEMINI_API_KEY"):
        client.analyze("context")
    assert "client" not in captured


def test_model_override_is_used(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    monkeypatch.setenv("GEMINI_MODEL", "configured-model")
    captured = fake_client(monkeypatch, response())
    result = client.analyze("context")
    assert result.model == captured["request"]["model"] == "configured-model"


@pytest.mark.parametrize("code,expected", [
    (429, "RATE_LIMITED"),
    (401, "AUTHENTICATION_ERROR"),
    (403, "AUTHORIZATION_ERROR"),
    (500, "PROVIDER_HTTP_ERROR"),
])
def test_api_errors(monkeypatch, capsys, code, expected):
    secret = "test-gemini-secret-key"
    monkeypatch.setenv("GEMINI_API_KEY", secret)
    request = httpx.Request("POST", "https://example.invalid")
    http_response = httpx.Response(code, request=request, headers={"Retry-After": "60"})
    failure = errors.APIError(code, {"message": "provider detail " + secret}, response=http_response)
    fake_client(monkeypatch, failure=failure)
    with pytest.raises(client.InferenceError) as caught:
        client.analyze("context")
    error = caught.value
    assert error.error_type == expected
    assert error.http_status == code
    assert error.retry_after == ("60" if code == 429 else None)
    assert "[REDACTED]" in error.detail
    assert secret not in str(error) + error.detail + repr(error.__dict__)
    output = capsys.readouterr()
    assert secret not in output.out + output.err


@pytest.mark.parametrize("failure,expected", [
    (httpx.ReadTimeout("test-gemini-secret-key"), "CLIENT_TIMEOUT"),
    (httpx.ConnectError("test-gemini-secret-key"), "NETWORK_ERROR"),
])
def test_transport_errors(monkeypatch, capsys, failure, expected):
    secret = "test-gemini-secret-key"
    monkeypatch.setenv("GEMINI_API_KEY", secret)
    fake_client(monkeypatch, failure=failure)
    with pytest.raises(client.InferenceError) as caught:
        client.analyze("context")
    error = caught.value
    assert error.error_type == expected
    assert error.http_status is None
    assert secret not in str(error) + error.detail + repr(error.__dict__)
    assert "[REDACTED]" in error.detail
    output = capsys.readouterr()
    assert secret not in output.out + output.err


@pytest.mark.parametrize("empty_response", [None, response(None), response(""), response("   ")])
def test_empty_provider_response(monkeypatch, empty_response):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    fake_client(monkeypatch, result=empty_response)
    with pytest.raises(client.InferenceError) as caught:
        client.analyze("context")
    assert caught.value.error_type == "INVALID_PROVIDER_RESPONSE"


def test_usage_metadata_only_records_present_values(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    usage = types.GenerateContentResponseUsageMetadata(
        prompt_token_count=10, candidates_token_count=4, thoughts_token_count=2, total_token_count=16
    )
    fake_client(monkeypatch, response("{}", usage))
    assert client.analyze("context").usage == {
        "input_tokens": 10, "output_tokens": 4, "thought_tokens": 2, "total_tokens": 16
    }
    fake_client(monkeypatch, response("{}", types.GenerateContentResponseUsageMetadata(prompt_token_count=3)))
    assert client.analyze("context").usage == {"input_tokens": 3}


def test_duration_uses_monotonic_clock(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    fake_client(monkeypatch, response())
    ticks = iter((12.25, 13.75))
    monkeypatch.setattr(client.time, "monotonic", lambda: next(ticks))
    assert client.analyze("context").duration_seconds == 1.5


def test_unexpected_error_is_not_misclassified(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-secret-key")
    fake_client(monkeypatch, failure=RuntimeError("programming failure"))
    with pytest.raises(RuntimeError, match="programming failure"):
        client.analyze("context")
