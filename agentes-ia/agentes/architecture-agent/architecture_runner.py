"""Shared two-inference workflow for CLI and Streamlit."""

import hashlib
import json
import os
from datetime import datetime
from pathlib import Path

from context_loader import load_context
from architecture_context_compiler import compile_context
from architecture_diagrams import generate_diagrams
from gemini_client import DEFAULT_MODEL, RESPONSE_SCHEMA, SYSTEM_PROMPT, InferenceError, analyze, count_input_tokens
from result_handler import parse_result, render_markdown


def build_clarifications(questions, answers):
    return "\n\n===== HUMAN_CLARIFICATIONS =====\n\n" + "\n\n".join(
        f"QUESTION:\n{item['question']}\n\nANSWER:\n{answer if answer.strip() else 'NOT_PROVIDED'}"
        for item, answer in zip(questions, answers, strict=True)
    )


UNDEFINED_DEPLOYMENT = "NO_DEFINIDO_PROPONER_ALTERNATIVAS"


def build_preflight(deployment):
    value = " ".join(deployment.split())
    if not value or value.casefold() in {
        "no definido", "no definida", "no está definido", "no está definida",
        "sin definir", "aún no definido", "todavía no definido", UNDEFINED_DEPLOYMENT.casefold(),
    }:
        value = UNDEFINED_DEPLOYMENT
    return "\n\n===== HUMAN_PREFLIGHT =====\n\nPlataforma o entorno de despliegue: " + value


def estimate_tokens(text):
    """Local comparison proxy, not a Gemini token count."""
    import re
    return len(re.findall(r"\w+|[^\w\s]", text))


def token_warning_limit():
    value = os.getenv("ARCHITECTURE_CONTEXT_TOKEN_WARNING", "35000")
    try:
        limit = int(value)
    except ValueError as exc:
        raise ValueError("ARCHITECTURE_CONTEXT_TOKEN_WARNING debe ser un entero positivo.") from exc
    if limit <= 0:
        raise ValueError("ARCHITECTURE_CONTEXT_TOKEN_WARNING debe ser un entero positivo.")
    return limit


class ArchitectureRun:
    def __init__(self, files, output_dir="outputs", *, infer=None, deployment=None):
        self.files = list(files)
        self.sources = [Path(filename).name for filename in self.files]
        self.output = Path(output_dir)
        self.infer = infer or analyze
        self.context = None
        self.lossless_context = None
        self.compiled_context = None
        self.preflight = build_preflight(deployment) if deployment is not None else ""
        self.result = None
        self.questions = []
        self.calls = 0
        self.diagrams = []
        self.diagram_limitations = []
        schema_text = json.dumps(RESPONSE_SCHEMA, ensure_ascii=False, separators=(",", ":"))
        self.run = {
            "started_at": datetime.now().astimezone().isoformat(),
            "input_sources": self.sources,
            "input_count": len(self.sources),
            "context_sha256": None,
            "raw_context_sha256": None,
            "compiled_context_sha256": None,
            "lossless_context_sha256": None,
            "raw_context_size": None,
            "compiled_context_size": None,
            "lossless_context_size": None,
            "lossless_context_tokens": None,
            "estimated_lossless_tokens": None,
            "compiled_input_tokens": None,
            "estimated_compiled_tokens": None,
            "context_token_warning": False,
            "system_prompt_sha256": hashlib.sha256(SYSTEM_PROMPT.encode("utf-8")).hexdigest(),
            "system_prompt_bytes": len(SYSTEM_PROMPT.encode("utf-8")),
            "system_prompt_characters": len(SYSTEM_PROMPT),
            "system_prompt_proxy_tokens": estimate_tokens(SYSTEM_PROMPT),
            "system_prompt_tokens": None,
            "schema_bytes": len(schema_text.encode("utf-8")),
            "schema_characters": len(schema_text),
            "schema_proxy_tokens": estimate_tokens(schema_text),
            "provider": "gemini",
            "model": os.getenv("GEMINI_MODEL") or DEFAULT_MODEL,
            "usage": None,
            "calls": [],
            "output_file": None,
            "output_sha256": None,
            "validation_status": "NO_OUTPUT",
            "validation_error": None,
            "error_type": None,
            "error_message": None,
            "http_status": None,
            "retry_after": None,
            "duration_seconds": None,
            "clarification_rounds": 0,
            "questions_asked": 0,
        }

    def _manifest(self):
        self.run["finished_at"] = datetime.now().astimezone().isoformat()
        self.output.mkdir(parents=True, exist_ok=True)
        (self.output / "architecture-analysis.run.json").write_text(
            json.dumps(self.run, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

    def _call(self):
        if self.calls >= 2:
            raise ValueError("Se alcanzó el máximo de dos inferencias.")
        if self.calls == 0 and self.output.exists():
            for path in (self.output / "architecture-context.mmd", self.output / "architecture-components.mmd",
                         *self.output.glob("architecture-flow-*.mmd")):
                path.unlink(missing_ok=True)
        self.calls += 1
        self.run["context_sha256"] = hashlib.sha256(self.context.encode("utf-8")).hexdigest()
        call = {"round": self.calls,
                "purpose": "INITIAL_ANALYSIS" if self.calls == 1 else "ANALYSIS_AFTER_CLARIFICATIONS",
                "model": self.run["model"]}
        if self.infer is analyze:
            counted = count_input_tokens(self.context)
            if counted is not None:
                call["counted_input_tokens"] = counted
        self.run["calls"].append(call)
        try:
            inference = self.infer(self.context)
        except InferenceError as exc:
            if exc.duration_seconds is not None:
                call["duration_seconds"] = exc.duration_seconds
                self.run["duration_seconds"] = round((self.run["duration_seconds"] or 0) + exc.duration_seconds, 2)
            self.run.update(error_type=exc.error_type, error_message=f"{exc}: {exc.detail}" if exc.detail else str(exc),
                            http_status=exc.http_status, retry_after=exc.retry_after)
            self._manifest()
            raise
        except (ValueError, OSError):
            self._manifest()
            raise
        self.run["model"] = inference.model
        call["model"] = inference.model
        call["duration_seconds"] = inference.duration_seconds
        self.run["duration_seconds"] = round((self.run["duration_seconds"] or 0) + inference.duration_seconds, 2)
        for key, value in inference.usage.items():
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                call[key] = value
                if self.run["usage"] is None:
                    self.run["usage"] = {}
                self.run["usage"][key] = self.run["usage"].get(key, 0) + value
        raw = inference.content
        try:
            allowed_sources = [*self.sources]
            if self.preflight:
                allowed_sources.append("HUMAN_PREFLIGHT")
            if self.calls == 2:
                allowed_sources.append("HUMAN_CLARIFICATIONS")
            result = parse_result(raw, sources=allowed_sources)
        except ValueError as exc:
            self.run.update(error_type="OUTPUT_VALIDATION_ERROR", error_message=str(exc),
                            validation_error=str(exc), validation_status="REJECTED")
            try:
                rejected = json.loads(raw)
            except (ValueError, TypeError):
                pass
            else:
                self.output.mkdir(parents=True, exist_ok=True)
                path = self.output / "architecture-analysis.rejected.json"
                path.write_text(json.dumps(rejected, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                self.run["output_file"] = path.name
                self.run["output_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
            self._manifest()
            raise
        self.result = result
        if result["status"] == "NEEDS_INFORMATION" and self.calls == 1:
            self.questions = result["missing_information"]
            self.run["clarification_rounds"] = 1
            return result
        self.output.mkdir(parents=True, exist_ok=True)
        path = self.output / "architecture-analysis.json"
        path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if result["status"] == "READY":
            self.diagrams, self.diagram_limitations = generate_diagrams(result["architecture_structure"])
            for diagram in self.diagrams:
                (self.output / diagram["filename"]).write_text(diagram["content"], encoding="utf-8")
        (self.output / "architecture-analysis.md").write_text(
            render_markdown(result, self.diagrams, self.diagram_limitations), encoding="utf-8")
        self.run.update(output_file=path.name, output_sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                        validation_status="ACCEPTED")
        self._manifest()
        return result

    def prepare(self):
        if self.compiled_context is not None:
            return
        if self.calls:
            raise ValueError("El análisis ya comenzó.")
        try:
            raw = load_context(self.files)
            self.lossless_context = raw
            self.compiled_context = compile_context(raw)
            self.context = self.lossless_context + self.preflight
            self.run["raw_context_sha256"] = hashlib.sha256(raw.encode("utf-8")).hexdigest()
            self.run["compiled_context_sha256"] = hashlib.sha256(self.compiled_context.encode("utf-8")).hexdigest()
            self.run["lossless_context_sha256"] = self.run["raw_context_sha256"]
            self.run["raw_context_size"] = len(raw.encode("utf-8"))
            self.run["compiled_context_size"] = len(self.compiled_context.encode("utf-8"))
            self.run["lossless_context_size"] = self.run["raw_context_size"]
            self.run["estimated_compiled_tokens"] = estimate_tokens(self.compiled_context)
            self.run["estimated_lossless_tokens"] = estimate_tokens(self.lossless_context)
            if self.infer is analyze:
                self.run["lossless_context_tokens"] = count_input_tokens(self.lossless_context, include_system=False)
                self.run["system_prompt_tokens"] = count_input_tokens(SYSTEM_PROMPT, include_system=False)
            size = self.run["lossless_context_tokens"] or self.run["estimated_lossless_tokens"]
            self.run["context_token_warning"] = size > token_warning_limit()
        except (ValueError, OSError):
            self._manifest()
            raise

    def set_preflight(self, deployment):
        if self.calls:
            raise ValueError("El análisis ya comenzó.")
        self.preflight = build_preflight(deployment)
        if self.lossless_context is not None:
            self.context = self.lossless_context + self.preflight

    def start(self):
        if self.calls:
            raise ValueError("El análisis ya comenzó.")
        self.prepare()
        return self._call()

    def continue_with(self, answers):
        if self.calls != 1 or not self.questions:
            raise ValueError("No hay aclaraciones pendientes o ya se alcanzó el límite de inferencias.")
        if len(answers) != len(self.questions):
            raise ValueError("Debe responder cada pregunta pendiente.")
        self.run["questions_asked"] = len(self.questions)
        self.context = self.lossless_context + self.preflight + build_clarifications(self.questions, answers)
        return self._call()
