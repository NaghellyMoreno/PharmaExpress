"""Renderiza el backlog generado a Markdown."""

from __future__ import annotations

from .models import StoryGeneration


def _bullets(items: list[str], empty: str) -> str:
    """Convierte una lista de textos en viñetas o muestra un mensaje si está vacía."""
    return "\n".join(f"- {item}" for item in items) if items else f"- {empty}"


def render_generation(result: StoryGeneration) -> str:
    """Genera un documento Markdown con historias y su trazabilidad."""
    lines = ["# Backlog de historias de usuario", "", result.project_summary]

    for generated in result.stories:
        lines += ["", f"## {generated.id} — {generated.title}", "", generated.story]
        lines += ["", "### Por qué se generó", "", generated.rationale]
        lines += ["", "### Evidencia de contexto", ""]
        lines += [f"- **{item.source}:** {item.excerpt}" for item in generated.evidence]
        lines += ["", "### Criterios de aceptación", ""]
        if generated.acceptance_criteria:
            for criterion in generated.acceptance_criteria:
                lines += [
                    f"**{criterion.id}**",
                    f"- Dado {criterion.given}",
                    f"- cuando {criterion.when}",
                    f"- entonces {criterion.then}",
                    "",
                ]
        else:
            lines.append("- No se pudieron derivar criterios verificables del contexto.")

        lines += ["", "### Reglas de negocio", ""]
        if generated.business_rules:
            lines += [
                f"- {rule.rule} (Fuente: {rule.evidence.source}: {rule.evidence.excerpt})"
                for rule in generated.business_rules
            ]
        else:
            lines.append("- No se identificaron reglas explícitas.")

        lines += ["", "### Dependencias", ""]
        if generated.dependencies:
            lines += [
                f"- **{dependency.name}:** {dependency.reason} "
                f"(Fuente: {dependency.evidence.source}: {dependency.evidence.excerpt})"
                for dependency in generated.dependencies
            ]
        else:
            lines.append("- No se identificaron dependencias explícitas.")

        lines += ["", "### Decisiones pendientes", ""]
        lines.append(_bullets(generated.pending_decisions, "Ninguna identificada."))

    lines += ["", "## Contexto sin convertir en historia", ""]
    lines.append(_bullets(result.uncovered_context, "Ninguno identificado."))
    lines += ["", "## Decisiones pendientes globales", ""]
    lines.append(_bullets(result.global_pending_decisions, "Ninguna identificada."))
    return "\n".join(lines).strip() + "\n"
