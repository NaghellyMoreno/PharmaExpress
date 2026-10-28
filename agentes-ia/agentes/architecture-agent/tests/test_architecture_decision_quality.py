import json
from pathlib import Path

import pytest

from architecture_prompt import SYSTEM_PROMPT
from result_handler import parse_result
from tests.test_result_handler import ready


CASES = json.loads((Path(__file__).parent / "fixtures" / "decision_quality_cases_v1.json").read_text(encoding="utf-8"))


def validated(data):
    return parse_result(json.dumps(data), sources=["context.md"])


def test_evaluation_cases_cover_required_contexts_without_project_name_answers():
    assert {case["id"] for case in CASES} == set("ABCDEFGH")
    assert all(case["document"] and case["preflight"] and case["review_focus"] for case in CASES)
    assert {case["expected_status"] for case in CASES} == {"READY", "NEEDS_INFORMATION"}
    assert all("Pharma Express" not in case["document"] for case in CASES)


@pytest.mark.parametrize("change", [
    lambda data: data["recommendation"].update(justification=[]),
    lambda data: data["recommendation"].update(accepted_tradeoffs=[]),
    lambda data: data["alternatives"][0].update(advantages=[]),
    lambda data: data["alternatives"][0].update(disadvantages=[]),
])
def test_ready_requires_argument_and_balanced_alternative_fields(change):
    data = ready()
    change(data)
    with pytest.raises(ValueError):
        validated(data)


@pytest.mark.parametrize("change", [
    lambda data: data["adr"].update(decision="Otra arquitectura"),
    lambda data: data["adr"].update(drivers=[]),
    lambda data: data["adr"].update(alternatives=[]),
    lambda data: data["adr"].update(consequences=[]),
    lambda data: data["adr"].update(risks=[]),
    lambda data: data["adr"].update(conditions_to_review=[]),
])
def test_adr_preserves_exact_recommendation_evidence_and_tradeoffs(change):
    data = ready()
    change(data)
    with pytest.raises(ValueError, match="ADR inconsistente"):
        validated(data)


def test_ready_keeps_valid_cross_artifact_links():
    data = validated(ready())
    assert data["adr"]["decision"] == data["recommendation"]["architecture"]
    assert set(data["recommendation"]["accepted_tradeoffs"]) <= set(data["adr"]["consequences"])
    assert set(data["risks"]) <= set(data["adr"]["risks"])
    assert set(data["review_conditions"]) <= set(data["adr"]["conditions_to_review"])


def test_prompt_requires_single_call_self_review_without_private_reasoning():
    assert "dentro de esta misma inferencia" in SYSTEM_PROMPT
    assert "no incluyas razonamiento privado" in SYSTEM_PROMPT
    assert "restricciones aprobadas obligatorias" in SYSTEM_PROMPT
