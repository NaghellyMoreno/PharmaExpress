import os
import time
from dataclasses import dataclass

import httpx
from google import genai
from google.genai import errors, types

from architecture_prompt import SYSTEM_PROMPT


DEFAULT_MODEL = "gemini-3.5-flash-lite"


def _object(properties):
    return {"type": "object", "properties": properties, "required": list(properties), "additionalProperties": False}


def _list(items, **limits):
    return {"type": "array", "items": items, **limits}


_STRING = {"type": "string"}
_STRINGS = _list(_STRING)
_QUESTION = _object({"question": _STRING, "reason": _STRING, "decision_impact": _STRING})
_DRIVER = _object({"name": _STRING, "evidence": _list(_object({"source": _STRING, "detail": _STRING})), "impact": _STRING})
_ALTERNATIVE = _object({"name": _STRING, "advantages": _STRINGS, "disadvantages": _STRINGS, "risks": _STRINGS, "fit": _STRING})
_RECOMMENDATION = _object({"architecture": _STRING, "justification": _STRINGS, "accepted_tradeoffs": _STRINGS})
_CRITERION = _object({"id": _STRING, "name": _STRING, "reason": _STRING,
                      "evidence": _list(_object({"source": _STRING, "detail": _STRING}))})
_ASSESSMENT = _object({"criterion_id": _STRING,
                       "assessment": {"type": "string", "enum": ["FAVORABLE", "NEUTRAL", "UNFAVORABLE"]},
                       "reason": _STRING})
_EVALUATION = _object({"alternative": _STRING, "assessments": _list(_ASSESSMENT)})
_DECISION_MATRIX = _object({"criteria": _list(_CRITERION), "evaluations": _list(_EVALUATION)})
_ADR = _object({"status": {"type": "string", "enum": ["PROPOSED"]}, "context": _STRING, "drivers": _STRINGS,
                "alternatives": _STRINGS, "decision": _STRING, "justification": _STRINGS,
                "consequences": _STRINGS, "risks": _STRINGS, "conditions_to_review": _STRINGS})
_ACTOR = _object({"id": _STRING, "name": _STRING, "responsibility": _STRING, "sources": _STRINGS})
_EXTERNAL_SYSTEM = _object({"id": _STRING, "name": _STRING,
                            "kind": {"type": "string", "enum": ["REAL", "SIMULATED"]},
                            "responsibility": _STRING, "sources": _STRINGS})
_COMPONENT = _object({"id": _STRING, "name": _STRING, "responsibilities": _STRINGS, "sources": _STRINGS})
_RELATIONSHIP = _object({"from": _STRING, "to": _STRING, "interaction": _STRING,
                         "purpose": _STRING, "sources": _STRINGS})
_PERSISTENCE = _object({"name": _STRING, "responsibility": _STRING,
                        "data_concerns": _STRINGS, "sources": _STRINGS})
_FLOW_STEP = _object({"order": {"type": "integer"}, "participant": _STRING, "action": _STRING})
_TECHNICAL_FLOW = _object({"name": _STRING, "steps": _list(_FLOW_STEP), "sources": _STRINGS})
_ARCHITECTURE_STRUCTURE = _object({
    "external_actors": _list(_ACTOR),
    "external_systems": _list(_EXTERNAL_SYSTEM),
    "components": _list(_COMPONENT),
    "relationships": _list(_RELATIONSHIP),
    "persistence": _list(_PERSISTENCE),
    "technical_flows": _list(_TECHNICAL_FLOW),
})
_EVIDENCE = _object({"source": _STRING, "detail": _STRING})
_QUALITY_ATTRIBUTE = _object({
    "id": _STRING, "name": _STRING, "need": _STRING, "architectural_relevance": _STRING,
    "impact": _STRING, "proposed_mechanisms": _STRINGS, "evidence": _list(_EVIDENCE),
    "validation_conditions": _STRINGS, "driver_names": _STRINGS,
})
_DESIGN_DECISION = _object({
    "id": _STRING, "title": _STRING, "problem": _STRING, "component_ids": _STRINGS,
    "alternatives": _STRINGS, "proposed_decision": _STRING, "justification": _STRING,
    "advantages": _STRINGS, "tradeoffs": _STRINGS, "evidence": _list(_EVIDENCE),
    "status": {"type": "string", "enum": ["PROPOSED"]},
})
_DESIGN_PATTERN = _object({
    "id": _STRING, "name": _STRING, "problem": _STRING, "evidence": _list(_EVIDENCE),
    "component_ids": _STRINGS, "justification": _STRING, "without_pattern": _STRING,
    "added_complexity": _STRING, "risks": _STRINGS,
    "status": {"type": "string", "enum": ["PROPOSED"]},
})
_OPEN_QUESTION = _object({
    "id": _STRING, "question": _STRING, "reason": _STRING, "impact": _STRING,
    "affected_component_ids": _STRINGS, "information_needed": _STRING,
    "resolve_by": _STRING, "evidence": _list(_EVIDENCE),
})
RESPONSE_SCHEMA = _object({
    "status": {"type": "string", "enum": ["NEEDS_INFORMATION", "READY"]},
    "missing_information": _list(_QUESTION, maxItems=5),
    "architecture_drivers": _list(_DRIVER),
    "alternatives": _list(_ALTERNATIVE, maxItems=3),
    "recommendation": {"anyOf": [_RECOMMENDATION, {"type": "null"}]},
    "decision_matrix": {"anyOf": [_DECISION_MATRIX, {"type": "null"}]},
    "risks": _STRINGS,
    "review_conditions": _STRINGS,
    "adr": {"anyOf": [_ADR, {"type": "null"}]},
    "architecture_structure": {"anyOf": [_ARCHITECTURE_STRUCTURE, {"type": "null"}]},
    "quality_attributes": {"anyOf": [_list(_QUALITY_ATTRIBUTE), {"type": "null"}]},
    "design_decisions": {"anyOf": [_list(_DESIGN_DECISION), {"type": "null"}]},
    "design_patterns": {"anyOf": [_object({"items": _list(_DESIGN_PATTERN), "conclusion": _STRING}), {"type": "null"}]},
    "open_questions": {"anyOf": [_list(_OPEN_QUESTION), {"type": "null"}]},
})


@dataclass(frozen=True)
class InferenceResult:
    content: str
    duration_seconds: float
    usage: dict[str, int]
    model: str


class InferenceError(ValueError):
    def __init__(self, error_type, message, *, http_status=None, duration_seconds=None, retry_after=None, detail=None):
        super().__init__(message)
        self.error_type = error_type
        self.http_status = http_status
        self.duration_seconds = duration_seconds
        self.retry_after = retry_after
        self.detail = detail


def _safe_detail(value, api_key):
    text = " ".join(str(value).split())
    return text.replace(api_key, "[REDACTED]")[:500]


def count_input_tokens(context, *, include_system=True):
    """Best-effort provider count; failure never prevents an inference."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        with genai.Client(api_key=api_key, http_options=types.HttpOptions(timeout=10_000,
                retry_options=types.HttpRetryOptions(attempts=1))) as client:
            kwargs = {"model": os.getenv("GEMINI_MODEL") or DEFAULT_MODEL, "contents": context}
            if include_system:
                kwargs["config"] = types.CountTokensConfig(system_instruction=SYSTEM_PROMPT)
            response = client.models.count_tokens(**kwargs)
        return response.total_tokens if isinstance(response.total_tokens, int) else None
    except Exception:
        # Token counting is observational; a provider or SDK failure must not
        # prevent the existing GenerateContent path.
        return None


def analyze(context):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Falta variable de entorno: GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL") or DEFAULT_MODEL
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        thinking_config=types.ThinkingConfig(thinking_level="medium"),
        response_mime_type="application/json",
        response_json_schema=RESPONSE_SCHEMA,
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
    )
    with genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(
            timeout=120_000,
            retry_options=types.HttpRetryOptions(attempts=1),
        ),
    ) as client:
        started = time.monotonic()
        try:
            response = client.models.generate_content(model=model, contents=context, config=config)
        except errors.APIError as exc:
            duration = round(time.monotonic() - started, 2)
            status = exc.code
            category = {429: "RATE_LIMITED", 401: "AUTHENTICATION_ERROR", 403: "AUTHORIZATION_ERROR"}.get(status, "PROVIDER_HTTP_ERROR")
            retry_after = None
            if status == 429 and exc.response is not None:
                value = exc.response.headers.get("Retry-After")
                if value is not None:
                    retry_after = _safe_detail(value, api_key)
            raise InferenceError(category, "El proveedor devolvió un error API.", http_status=status,
                                 duration_seconds=duration, retry_after=retry_after,
                                 detail=_safe_detail(exc.message or str(exc), api_key)) from exc
        except httpx.TimeoutException as exc:
            raise InferenceError("CLIENT_TIMEOUT", "La solicitud superó el timeout local de 120 segundos.",
                                 duration_seconds=round(time.monotonic() - started, 2),
                                 detail=_safe_detail(exc, api_key)) from exc
        except httpx.RequestError as exc:
            raise InferenceError("NETWORK_ERROR", "No se pudo establecer/completar la conexión con el proveedor.",
                                 duration_seconds=round(time.monotonic() - started, 2),
                                 detail=_safe_detail(exc, api_key)) from exc
        duration = round(time.monotonic() - started, 2)

    content = getattr(response, "text", None) if response is not None else None
    if not isinstance(content, str) or not content.strip():
        raise InferenceError("INVALID_PROVIDER_RESPONSE", "Gemini devolvió una respuesta vacía o inválida.",
                             duration_seconds=duration)
    usage = {}
    if response.usage_metadata is not None:
        for source, target in (
            ("prompt_token_count", "input_tokens"),
            ("candidates_token_count", "output_tokens"),
            ("thoughts_token_count", "thought_tokens"),
            ("total_token_count", "total_tokens"),
        ):
            value = getattr(response.usage_metadata, source, None)
            if value is not None:
                usage[target] = value
    return InferenceResult(content, duration, usage, model)
