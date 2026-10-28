import html
import json
import re

from architecture_diagrams import generate_diagrams


def _object(value, fields):
    return isinstance(value, dict) and all(field in value for field in fields)


def _strings(value):
    return isinstance(value, list) and all(isinstance(item, str) for item in value)


def _exact(value, fields):
    return isinstance(value, dict) and set(value) == set(fields)


def _nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def _sourced(value, fields, sources):
    return (_exact(value, fields) and _strings(value["sources"]) and bool(value["sources"])
            and all(_nonempty(source) and (sources is None or source in sources) for source in value["sources"]))


def _validate_structure(structure, sources):
    fields = ("external_actors", "external_systems", "components", "relationships", "persistence", "technical_flows")
    if not _exact(structure, fields) or any(not isinstance(structure[key], list) for key in fields):
        raise ValueError("Estructura arquitectónica inválida.")
    identifiers = set()
    for key, prefix, shape in (
        ("external_actors", "ACT", ("id", "name", "responsibility", "sources")),
        ("external_systems", "SYS", ("id", "name", "kind", "responsibility", "sources")),
        ("components", "CMP", ("id", "name", "responsibilities", "sources")),
    ):
        for item in structure[key]:
            if (not _sourced(item, shape, sources) or not isinstance(item["id"], str)
                    or re.fullmatch(rf"{prefix}-[0-9]{{3,}}", item["id"]) is None
                    or item["id"] in identifiers or not _nonempty(item["name"])):
                raise ValueError("Elemento arquitectónico con ID, campos o fuentes inválidos.")
            identifiers.add(item["id"])
            if key == "components":
                if not _strings(item["responsibilities"]) or not item["responsibilities"] or not all(map(_nonempty, item["responsibilities"])):
                    raise ValueError("Componente sin responsabilidades válidas.")
            elif not _nonempty(item["responsibility"]):
                raise ValueError("Responsabilidad arquitectónica inválida.")
            if key == "external_systems" and (not isinstance(item["kind"], str) or item["kind"] not in {"REAL", "SIMULATED"}):
                raise ValueError("Sistema externo sin tipo REAL/SIMULATED válido.")
    if not structure["components"]:
        raise ValueError("READY requiere componentes arquitectónicos.")
    for item in structure["relationships"]:
        if (not _sourced(item, ("from", "to", "interaction", "purpose", "sources"), sources)
                or not isinstance(item["from"], str) or not isinstance(item["to"], str)
                or item["from"] not in identifiers or item["to"] not in identifiers
                or not _nonempty(item["interaction"]) or not _nonempty(item["purpose"])):
            raise ValueError("Relación arquitectónica inválida o con referencia inexistente.")
    for item in structure["persistence"]:
        if (not _sourced(item, ("name", "responsibility", "data_concerns", "sources"), sources)
                or not _nonempty(item["name"]) or not _nonempty(item["responsibility"])
                or not _strings(item["data_concerns"]) or not item["data_concerns"]
                or not all(map(_nonempty, item["data_concerns"]))):
            raise ValueError("Necesidad de persistencia inválida.")
    for item in structure["technical_flows"]:
        if (not _sourced(item, ("name", "steps", "sources"), sources)
                or not _nonempty(item["name"]) or not isinstance(item["steps"], list) or not item["steps"]):
            raise ValueError("Flujo técnico inválido.")
        for order, step in enumerate(item["steps"], 1):
            if (not _exact(step, ("order", "participant", "action")) or type(step["order"]) is not int
                    or step["order"] != order or not isinstance(step["participant"], str)
                    or step["participant"] not in identifiers
                    or not _nonempty(step["action"])):
                raise ValueError("Paso de flujo inválido o con participante inexistente.")


def _validate_matrix(matrix, alternatives, sources):
    if (not _exact(matrix, ("criteria", "evaluations"))
            or not isinstance(matrix["criteria"], list) or not matrix["criteria"]
            or not isinstance(matrix["evaluations"], list)):
        raise ValueError("Matriz de decisión inválida.")
    criterion_ids = set()
    for criterion in matrix["criteria"]:
        if (not _exact(criterion, ("id", "name", "reason", "evidence"))
                or not isinstance(criterion["id"], str)
                or re.fullmatch(r"CRIT-[0-9]{3,}", criterion["id"]) is None
                or criterion["id"] in criterion_ids
                or not _nonempty(criterion["name"]) or not _nonempty(criterion["reason"])
                or not isinstance(criterion["evidence"], list) or not criterion["evidence"]):
            raise ValueError("Criterio de decisión inválido.")
        criterion_ids.add(criterion["id"])
        for evidence in criterion["evidence"]:
            if (not _exact(evidence, ("source", "detail"))
                    or not _nonempty(evidence["source"]) or not _nonempty(evidence["detail"])
                    or (sources is not None and evidence["source"] not in sources)):
                raise ValueError("Criterio sin evidencia o con fuente inválida.")
    names = [option["name"] for option in alternatives]
    if len(names) != len(set(names)) or len(matrix["evaluations"]) != len(names):
        raise ValueError("Matriz sin una evaluación por alternativa distinta.")
    evaluated = set()
    for evaluation in matrix["evaluations"]:
        if (not _exact(evaluation, ("alternative", "assessments"))
                or not isinstance(evaluation["alternative"], str)
                or evaluation["alternative"] not in names
                or evaluation["alternative"] in evaluated
                or not isinstance(evaluation["assessments"], list)
                or len(evaluation["assessments"]) != len(criterion_ids)):
            raise ValueError("Evaluación de alternativa inválida u omitida.")
        evaluated.add(evaluation["alternative"])
        assessed = set()
        for item in evaluation["assessments"]:
            if (not _exact(item, ("criterion_id", "assessment", "reason"))
                    or not isinstance(item["criterion_id"], str)
                    or item["criterion_id"] not in criterion_ids
                    or item["criterion_id"] in assessed
                    or not isinstance(item["assessment"], str)
                    or item["assessment"] not in {"FAVORABLE", "NEUTRAL", "UNFAVORABLE"}
                    or not _nonempty(item["reason"])):
                raise ValueError("Valoración de criterio inválida.")
            assessed.add(item["criterion_id"])
        if assessed != criterion_ids:
            raise ValueError("Evaluación con criterios omitidos.")
    if evaluated != set(names):
        raise ValueError("Matriz con alternativas omitidas.")


def _evidence(items, sources, required=True):
    return (isinstance(items, list) and (bool(items) or not required)
            and all(_exact(item, ("source", "detail")) and _nonempty(item["source"])
                    and _nonempty(item["detail"])
                    and (sources is None or item["source"] in sources) for item in items))


def _references(items, allowed):
    return _strings(items) and len(items) == len(set(items)) and all(item in allowed for item in items)


def _clean_strings(items):
    return _strings(items) and all(map(_nonempty, items))


def _validated_items(items, prefix, fields, sources, components, drivers=None):
    if not isinstance(items, list):
        raise ValueError(f"{prefix}: se requiere una lista.")
    ids = set()
    for item in items:
        if not _exact(item, fields) or not isinstance(item["id"], str) or re.fullmatch(rf"{prefix}-[0-9]{{3,}}", item["id"]) is None or item["id"] in ids:
            raise ValueError(f"{prefix}: estructura o ID inválido.")
        ids.add(item["id"])
        if not _evidence(item["evidence"], sources, required=prefix != "TQ"):
            raise ValueError(f"{prefix}: evidencia inválida.")
        if prefix == "QA":
            scalar = ("name", "need", "architectural_relevance", "impact")
            if (not all(_nonempty(item[key]) for key in scalar)
                    or not _clean_strings(item["proposed_mechanisms"])
                    or not _clean_strings(item["validation_conditions"])
                    or not item["validation_conditions"]
                    or not _references(item["driver_names"], drivers)):
                raise ValueError("QA: atributo inválido o driver inexistente.")
        elif prefix == "DD":
            scalar = ("title", "problem", "proposed_decision", "justification")
            if (not all(_nonempty(item[key]) for key in scalar)
                    or not _references(item["component_ids"], components)
                    or not item["component_ids"] or not _clean_strings(item["alternatives"])
                    or not item["alternatives"]
                    or not _clean_strings(item["advantages"]) or not _clean_strings(item["tradeoffs"])
                    or item["status"] != "PROPOSED"):
                raise ValueError("DD: decisión de diseño inválida.")
        elif prefix == "PAT":
            scalar = ("name", "problem", "justification", "without_pattern", "added_complexity")
            if (not all(_nonempty(item[key]) for key in scalar)
                    or not _references(item["component_ids"], components)
                    or not item["component_ids"] or not _clean_strings(item["risks"])
                    or item["status"] != "PROPOSED"):
                raise ValueError("PAT: patrón sin problema, justificación o componente válido.")
        else:
            scalar = ("question", "reason", "impact", "information_needed", "resolve_by")
            if (not all(_nonempty(item[key]) for key in scalar)
                    or not _references(item["affected_component_ids"], components)):
                raise ValueError("TQ: pregunta técnica inválida.")


def parse_result(raw, sources=None):
    try:
        data = json.loads(raw)
    except (ValueError, TypeError) as exc:
        raise ValueError("El modelo no devolvió JSON válido.") from exc
    fields = ("status", "missing_information", "architecture_drivers", "alternatives", "recommendation", "decision_matrix", "risks", "review_conditions", "adr", "architecture_structure", "quality_attributes", "design_decisions", "design_patterns", "open_questions")
    if not _exact(data, fields) or data["status"] not in {"NEEDS_INFORMATION", "READY"}:
        raise ValueError("Resultado sin estructura o status válido.")
    if not all(isinstance(data[key], list) for key in ("missing_information", "architecture_drivers", "alternatives")) or not all(_strings(data[key]) for key in ("risks", "review_conditions")):
        raise ValueError("Listas inválidas en el resultado.")
    if data["status"] == "NEEDS_INFORMATION":
        questions = data["missing_information"]
        if not 1 <= len(questions) <= 5 or any(not _object(item, ("question", "reason", "decision_impact")) or any(not isinstance(item[key], str) or not item[key].strip() for key in ("question", "reason", "decision_impact")) for item in questions):
            raise ValueError("Preguntas inválidas para NEEDS_INFORMATION.")
        if any(data[key] is not None for key in ("recommendation", "decision_matrix", "adr", "architecture_structure", "quality_attributes", "design_decisions", "design_patterns", "open_questions")) or any(data[key] for key in ("architecture_drivers", "alternatives", "risks", "review_conditions")):
            raise ValueError("NEEDS_INFORMATION no puede contener propuesta.")
    else:
        if data["missing_information"] or not data["architecture_drivers"] or not 1 <= len(data["alternatives"]) <= 3:
            raise ValueError("READY requiere drivers y entre una y tres alternativas.")
        for driver in data["architecture_drivers"]:
            if not _object(driver, ("name", "evidence", "impact")) or not isinstance(driver["evidence"], list) or not driver["evidence"] or any(not _object(e, ("source", "detail")) or not all(isinstance(e[k], str) and e[k].strip() for k in ("source", "detail")) for e in driver["evidence"]):
                raise ValueError("Driver sin evidencia válida.")
            if not all(isinstance(driver[k], str) and driver[k].strip() for k in ("name", "impact")):
                raise ValueError("Driver inválido.")
            if sources is not None and any(e["source"] not in sources for e in driver["evidence"]):
                raise ValueError("Driver con fuente ajena a los documentos entregados.")
        for option in data["alternatives"]:
            if (not _object(option, ("name", "advantages", "disadvantages", "risks", "fit"))
                    or not all(_nonempty(option[k]) for k in ("name", "fit"))
                    or not all(_clean_strings(option[k]) for k in ("advantages", "disadvantages", "risks"))
                    or not option["advantages"] or not option["disadvantages"]):
                raise ValueError("Alternativa inválida.")
        rec = data["recommendation"]
        if (not _object(rec, ("architecture", "justification", "accepted_tradeoffs"))
                or not _clean_strings(rec["justification"]) or not rec["justification"]
                or not _clean_strings(rec["accepted_tradeoffs"]) or not rec["accepted_tradeoffs"]):
            raise ValueError("READY requiere una recomendación válida.")
        if rec["architecture"] not in [a["name"] for a in data["alternatives"]]:
            raise ValueError("recommendation.architecture debe coincidir exactamente con alternatives[].name.")
        _validate_matrix(data["decision_matrix"], data["alternatives"], sources)
        adr = data["adr"]
        adr_lists = ("drivers", "alternatives", "justification", "consequences", "risks", "conditions_to_review")
        if (not _object(adr, ("status", "context", "decision", *adr_lists))
                or adr["status"] != "PROPOSED"
                or not all(_nonempty(adr[k]) for k in ("context", "decision"))
                or not all(_clean_strings(adr[k]) for k in adr_lists)):
            raise ValueError("READY requiere un ADR propuesto válido.")
        if (adr["decision"] != rec["architecture"]
                or set(adr["drivers"]) != {item["name"] for item in data["architecture_drivers"]}
                or set(adr["alternatives"]) != {item["name"] for item in data["alternatives"]}
                or not set(rec["accepted_tradeoffs"]).issubset(adr["consequences"])
                or not set(data["risks"]).issubset(adr["risks"])
                or not set(data["review_conditions"]).issubset(adr["conditions_to_review"])):
            raise ValueError("ADR inconsistente con drivers, alternativas, recomendación o consecuencias.")
        _validate_structure(data["architecture_structure"], sources)
        components = {item["id"] for item in data["architecture_structure"]["components"]}
        drivers = {item["name"] for item in data["architecture_drivers"]}
        _validated_items(data["quality_attributes"], "QA", ("id", "name", "need", "architectural_relevance", "impact", "proposed_mechanisms", "evidence", "validation_conditions", "driver_names"), sources, components, drivers)
        _validated_items(data["design_decisions"], "DD", ("id", "title", "problem", "component_ids", "alternatives", "proposed_decision", "justification", "advantages", "tradeoffs", "evidence", "status"), sources, components)
        patterns = data["design_patterns"]
        if not _exact(patterns, ("items", "conclusion")) or not _nonempty(patterns["conclusion"]):
            raise ValueError("Patrones: conclusión obligatoria.")
        _validated_items(patterns["items"], "PAT", ("id", "name", "problem", "evidence", "component_ids", "justification", "without_pattern", "added_complexity", "risks", "status"), sources, components)
        _validated_items(data["open_questions"], "TQ", ("id", "question", "reason", "impact", "affected_component_ids", "information_needed", "resolve_by", "evidence"), sources, components)
        blocking = {item["question"].strip().casefold() for item in data["missing_information"]}
        if any(item["question"].strip().casefold() in blocking for item in data["open_questions"]):
            raise ValueError("Pregunta técnica duplicada como bloqueante.")
    return data


def _bullets(items):
    return "\n".join(f"- {item}" for item in items) or "- Ninguno identificado"


def _matrix_cell(value):
    return html.escape(" ".join(value.split()), quote=True).replace("|", "&#124;")


def _matrix_markdown(matrix, alternatives, recommendation):
    names = [option["name"] for option in alternatives]
    lookup = {item["alternative"]: {assessment["criterion_id"]: assessment
                                     for assessment in item["assessments"]}
              for item in matrix["evaluations"]}
    headers = [_matrix_cell(name) + (" (propuesta)" if name == recommendation else "") for name in names]
    lines = ["## Matriz de decisión arquitectónica", "",
             "| Criterio | " + " | ".join(headers) + " |",
             "| --- | " + " | ".join("---" for _ in names) + " |"]
    for criterion in matrix["criteria"]:
        cells = []
        for name in names:
            item = lookup[name][criterion["id"]]
            cells.append(f'**{item["assessment"]}** — {_matrix_cell(item["reason"])}')
        lines.append("| " + _matrix_cell(f'{criterion["id"]}: {criterion["name"]}') + " | " + " | ".join(cells) + " |")
    lines += ["", "### Criterios y evidencia", ""]
    for criterion in matrix["criteria"]:
        lines += [f'#### {_matrix_cell(criterion["id"] + ": " + criterion["name"])}', "",
                  _matrix_cell(criterion["reason"]), ""]
        for evidence in criterion["evidence"]:
            lines.append(f'- {_matrix_cell(evidence["source"])}: {_matrix_cell(evidence["detail"])}')
        lines.append("")
    return lines


def _structure_markdown(structure):
    lines = ["## Estructura arquitectónica", ""]
    sections = (
        ("Actores externos", "external_actors"), ("Sistemas externos", "external_systems"),
        ("Componentes y responsabilidades", "components"), ("Relaciones", "relationships"),
        ("Persistencia", "persistence"), ("Flujos técnicos", "technical_flows"),
    )
    for title, key in sections:
        lines += [f"### {title}", ""]
        if not structure[key]:
            lines += ["- Ninguno identificado", ""]
            continue
        for item in structure[key]:
            if key in {"external_actors", "external_systems"}:
                kind = f" ({item['kind']})" if key == "external_systems" else ""
                lines += [f"- {item['id']}: {item['name']}{kind} — {item['responsibility']}"]
            elif key == "components":
                lines += [f"- {item['id']}: {item['name']}"]
                lines += [f"  - {responsibility}" for responsibility in item["responsibilities"]]
            elif key == "relationships":
                lines += [f"- {item['from']} → {item['to']}: {item['interaction']} — {item['purpose']}"]
            elif key == "persistence":
                lines += [f"- {item['name']}: {item['responsibility']}"]
                lines += [f"  - {concern}" for concern in item["data_concerns"]]
            else:
                lines += [f"- {item['name']}"]
                lines += [f"  {step['order']}. {step['participant']}: {step['action']}" for step in item["steps"]]
            lines += [f"  Fuentes: {', '.join(item['sources'])}"]
        lines += [""]
    return lines


def render_markdown(data, diagrams=None, diagram_limitations=None):
    lines = ["# Architecture Analysis", ""]
    if data["status"] == "NEEDS_INFORMATION":
        lines += ["Status: NEEDS_INFORMATION", "", "## Información necesaria", ""]
        for index, item in enumerate(data["missing_information"], 1):
            lines += [f"{index}. {item['question']}", f"   - Razón: {item['reason']}", f"   - Impacto en la decisión: {item['decision_impact']}"]
        return "\n".join(lines) + "\n"
    rec, adr = data["recommendation"], data["adr"]
    lines += ["## Recomendación del Architecture Agent", "", f"Arquitectura propuesta: {rec['architecture']}", "", "Justificación:", _bullets(rec["justification"]), "", "Trade-offs:", _bullets(rec["accepted_tradeoffs"]), "", "Estado: PROPUESTA DE IA — requiere decisión humana y validación del equipo.", "", "Status: PROPOSED - HUMAN VALIDATION REQUIRED", "", "## Drivers", ""]
    for driver in data["architecture_drivers"]:
        lines += [f"### {driver['name']}", "", f"Impacto: {driver['impact']}", "", _bullets([f"{e['source']}: {e['detail']}" for e in driver["evidence"]]), ""]
    lines += ["## Alternatives", ""]
    for option in data["alternatives"]:
        lines += [f"### {option['name']}", "", f"Adecuación: {option['fit']}", "", "Ventajas:", _bullets(option["advantages"]), "", "Desventajas:", _bullets(option["disadvantages"]), "", "Riesgos:", _bullets(option["risks"]), ""]
    lines += _matrix_markdown(data["decision_matrix"], data["alternatives"], rec["architecture"])
    lines += _structure_markdown(data["architecture_structure"])
    lines += ["## Atributos de calidad", ""]
    for item in data["quality_attributes"]:
        lines += [f"### {item['id']}: {item['name']}", "", f"Necesidad: {item['need']}",
                  f"Relevancia arquitectónica: {item['architectural_relevance']}", f"Impacto: {item['impact']}",
                  "Mecanismos propuestos:", _bullets(item["proposed_mechanisms"]),
                  "Evidencia:", _bullets([f"{e['source']}: {e['detail']}" for e in item["evidence"]]),
                  "Condiciones de validación:", _bullets(item["validation_conditions"]), ""]
    if not data["quality_attributes"]:
        lines += ["- Ninguno sustentado por el contexto", ""]
    lines += ["## Decisiones de diseño", ""]
    for item in data["design_decisions"]:
        lines += [f"### {item['id']}: {item['title']} — {item['status']}", "", f"Problema: {item['problem']}",
                  f"Componentes: {', '.join(item['component_ids'])}", "Alternativas:", _bullets(item["alternatives"]),
                  f"Decisión propuesta: {item['proposed_decision']}", f"Justificación: {item['justification']}",
                  "Ventajas:", _bullets(item["advantages"]), "Consecuencias y trade-offs:", _bullets(item["tradeoffs"]),
                  "Fuentes:", _bullets([f"{e['source']}: {e['detail']}" for e in item["evidence"]]), ""]
    if not data["design_decisions"]:
        lines += ["- Ninguna decisión de diseño justificada", ""]
    lines += ["## Patrones justificados", ""]
    for item in data["design_patterns"]["items"]:
        lines += [f"### {item['id']}: {item['name']} — {item['status']}", "", f"Problema: {item['problem']}",
                  f"Componentes: {', '.join(item['component_ids'])}", f"Razón de uso: {item['justification']}",
                  f"Alternativa sin patrón: {item['without_pattern']}",
                  f"Costo de complejidad: {item['added_complexity']}", "Riesgos y límites:", _bullets(item["risks"]),
                  "Evidencia del problema:", _bullets([f"{e['source']}: {e['detail']}" for e in item["evidence"]]), ""]
    lines += [f"Conclusión: {data['design_patterns']['conclusion']}", "", "## Preguntas técnicas abiertas", ""]
    for item in data["open_questions"]:
        lines += [f"### {item['id']}: {item['question']}", "", f"Motivo: {item['reason']}",
                  f"Impacto: {item['impact']}", f"Información necesaria: {item['information_needed']}",
                  f"Resolver antes de: {item['resolve_by']}",
                  f"Componentes afectados: {', '.join(item['affected_component_ids']) or 'Ninguno identificado'}",
                  "Fuentes:", _bullets([f"{e['source']}: {e['detail']}" for e in item["evidence"]]), ""]
    if not data["open_questions"]:
        lines += ["- Ninguna pregunta técnica abierta justificada", ""]
    if diagrams is None or diagram_limitations is None:
        diagrams, diagram_limitations = generate_diagrams(data["architecture_structure"])
    lines += ["## Diagramas arquitectónicos", ""]
    for diagram in diagrams:
        lines += [f"### {diagram['title']}", "", "```mermaid", diagram["content"].rstrip("\n"), "```", ""]
    if diagram_limitations:
        lines += ["### Límites de los diagramas", "", _bullets(diagram_limitations), ""]
    lines += ["## Risks", "", _bullets(data["risks"]), "", "## Conditions to review", "", _bullets(data["review_conditions"]), "", "## ADR Draft", "", "# ADR-001", "", "- Estado: PROPOSED", "", "## Contexto", "", adr["context"], ""]
    for title, key in (("Drivers", "drivers"), ("Alternativas", "alternatives")):
        lines += [f"## {title}", "", _bullets(adr[key]), ""]
    lines += ["## Decisión propuesta", "", adr["decision"], ""]
    for title, key in (("Justificación", "justification"), ("Consecuencias", "consequences"), ("Riesgos", "risks"), ("Condiciones para revisar la decisión", "conditions_to_review")):
        lines += [f"## {title}", "", _bullets(adr[key]), ""]
    return "\n".join(lines)
