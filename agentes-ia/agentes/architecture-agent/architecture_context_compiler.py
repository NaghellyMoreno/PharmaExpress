"""Deterministic extraction of selected Markdown evidence for architecture analysis."""

import re


COMPILER_VERSION = "2"
SOURCE = re.compile(r"(?:^|\n\n)===== SOURCE: ([^\n]+) =====\n\n")
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.MULTILINE)


def _sections(content):
    matches = list(HEADING.finditer(content))
    if not matches:
        return [("Documento", content)]
    result = []
    if content[:matches[0].start()].strip():
        result.append(("Metadatos", content[:matches[0].start()]))
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(content)
        body = content[match.end():end].strip()
        if body:
            result.append((match.group(2), body))
    return result


def _category(heading):
    name = heading.lower()
    for pattern, category in (
        (r"preguntas abiertas", "Open Questions"),
        (r"fuera de alcance|exclusion", "Out of Scope"),
        (r"restric|normativ", "Constraints"),
        (r"dependenc|integraci[oó]n|sistemas externos", "Integrations"),
        (r"no funcional|calidad|concurr|seguridad|privacidad", "Quality Evidence"),
        (r"operativ|trazabilidad|observabilidad", "Operational Requirements"),
        (r"decis|reglas derivadas aprobadas", "Approved Decisions"),
        (r"flujo|casos l[ií]mite|criterios? de aceptaci[oó]n", "Critical Flows / Edge Cases"),
    ):
        if re.search(pattern, name):
            return category
    return "Architectural Requirements"


def compile_context(raw_context):
    """Use only SOURCE blocks from load_context; retain original text and source names."""
    matches = list(SOURCE.finditer(raw_context))
    if not matches or raw_context[:matches[0].start()].strip():
        raise ValueError("El contexto no contiene fuentes SOURCE válidas.")
    sources = []
    entries = {}
    for index, match in enumerate(matches):
        source = match.group(1)
        sources.append(source)
        end = matches[index + 1].start() if index + 1 < len(matches) else len(raw_context)
        content = raw_context[match.end():end].strip()
        for heading, body in _sections(content):
            title = re.sub(r"^\d+(?:\.\d+)*\.\s*", "", heading).strip()
            category = _category(title)
            original = body.strip()
            if not original:
                continue
            # Different files remain separate even when their wording matches.
            # Within one file, only whitespace-normalized literal identity merges.
            key = (source, " ".join(original.split()))
            if key not in entries:
                entries[key] = {"content": original, "category": category, "sources": []}
            provenance = (source, heading)
            if provenance not in entries[key]["sources"]:
                entries[key]["sources"].append(provenance)
    groups = {}
    for entry in entries.values():
        groups.setdefault(entry["category"], []).append(entry)
    lines = ["# ARCHITECTURE EVIDENCE PACK", "", "## Sources"]
    lines.extend(f"- {source}" for source in sources)
    number = 0
    for category in ("Approved Decisions", "Architectural Requirements", "Constraints", "Quality Evidence",
                     "Integrations", "Operational Requirements", "Critical Flows / Edge Cases", "Out of Scope", "Open Questions"):
        if category not in groups:
            continue
        lines.extend(["", f"## {category}"])
        for entry in groups[category]:
            number += 1
            lines.extend(["", f"[EV-{number:03d}]"])
            lines.extend(f"SOURCE: {source} | HEADING: {heading}" for source, heading in entry["sources"])
            lines.extend(["CONTENT:", entry["content"]])
    return "\n".join(lines) + "\n"
