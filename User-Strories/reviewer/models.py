"""Modelos Pydantic para la generación de historias de usuario."""

from __future__ import annotations

from pydantic import BaseModel, Field


class Evidence(BaseModel):
    """Referencia al contexto que respalda una parte de la historia."""

    source: str = Field(description="Nombre del archivo de contexto.")
    excerpt: str = Field(description="Fragmento breve que justifica la historia.")


class AcceptanceCriterion(BaseModel):
    """Criterio verificable derivado del contexto."""

    id: str
    given: str
    when: str
    then: str


class BusinessRule(BaseModel):
    rule: str
    evidence: Evidence


class Dependency(BaseModel):
    name: str
    reason: str
    evidence: Evidence


class GeneratedStory(BaseModel):
    """Historia generada y trazable a una fuente del proyecto."""

    id: str = Field(description="Identificador consecutivo generado, por ejemplo HU-01.")
    title: str
    story: str = Field(description="Historia en formato Como / quiero / para.")
    rationale: str = Field(
        description="Por qué se generó esta historia a partir del contexto disponible."
    )
    evidence: list[Evidence] = Field(min_length=1)
    acceptance_criteria: list[AcceptanceCriterion]
    business_rules: list[BusinessRule]
    dependencies: list[Dependency]
    pending_decisions: list[str] = Field(
        description="Decisiones no resueltas por el contexto; no son requisitos inventados."
    )


class StoryGeneration(BaseModel):
    """Backlog generado exclusivamente desde las fuentes de contexto."""

    project_summary: str
    stories: list[GeneratedStory]
    uncovered_context: list[str] = Field(
        description="Necesidades explícitas que no pudieron convertirse en historia por falta de detalle."
    )
    global_pending_decisions: list[str]
