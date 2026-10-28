"""Deterministic Mermaid views of a validated architecture_structure."""


def _label(value):
    # Keep printable Unicode in quoted labels. Escape ASCII Mermaid syntax so
    # model text cannot close a label, add a directive or create an edge.
    safe_ascii = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,?!-:()/"
    return "".join(char if char.isprintable() and (ord(char) > 127 or char in safe_ascii)
                   else f"#{ord(char)};" for char in " ".join(value.split()))


def _node_id(identifier):
    return "N_" + identifier.replace("-", "_")


def _nodes(structure):
    lines = ['  subgraph SYSTEM["Sistema propuesto"]']
    for component in structure["components"]:
        lines.append(f'    {_node_id(component["id"])}["{_label(component["id"] + ": " + component["name"])}"]')
    lines.append("  end")
    for actor in structure["external_actors"]:
        lines.append(f'  {_node_id(actor["id"])}["{_label(actor["id"] + ": " + actor["name"])}"]')
    for system in structure["external_systems"]:
        title = f'{system["id"]}: {system["name"]} ({system["kind"]})'
        lines.append(f'  {_node_id(system["id"])}["{_label(title)}"]')
        lines.append(f'  class {_node_id(system["id"])} {system["kind"].lower()};')
    lines += ["  classDef real fill:#e2f3ff,stroke:#17608c;", "  classDef simulated fill:#fff1d6,stroke:#986000;"]
    return lines


def _edge(relationship, *, context):
    description = relationship["interaction"]
    if context:
        description += " — fuentes: " + ", ".join(relationship["sources"])
    else:
        description += " — " + relationship["purpose"]
    return f'  {_node_id(relationship["from"])} -->|{_label(description)}| {_node_id(relationship["to"])}'


def _flow(flow):
    lines = ["flowchart TD"]
    for step in flow["steps"]:
        label = f'{step["order"]}. {step["participant"]}: {step["action"]}'
        lines.append(f'  STEP_{step["order"]}["{_label(label)}"]')
    for first, second in zip(flow["steps"], flow["steps"][1:]):
        lines.append(f'  STEP_{first["order"]} --> STEP_{second["order"]}')
    return "\n".join(lines) + "\n"


def generate_diagrams(structure):
    """Return diagrams and limitations. Caller must pass a locally validated structure."""
    diagrams = []
    limitations = []
    ids = {item["id"] for key in ("external_actors", "external_systems", "components")
           for item in structure[key]}
    component_ids = {item["id"] for item in structure["components"]}
    external_ids = {item["id"] for key in ("external_actors", "external_systems")
                    for item in structure[key]}
    if external_ids:
        relations = [item for item in structure["relationships"]
                     if (item["from"] in external_ids and item["to"] in component_ids)
                     or (item["from"] in component_ids and item["to"] in external_ids)]
        lines = ["flowchart LR", *_nodes(structure), *(_edge(item, context=True) for item in relations)]
        diagrams.append({"filename": "architecture-context.mmd", "title": "Diagrama de contexto",
                         "content": "\n".join(lines) + "\n"})
        connected = {endpoint for item in relations for endpoint in (item["from"], item["to"])}
        isolated = sorted(external_ids - connected)
        if isolated:
            limitations.append("Contexto: elementos externos sin relación explícita: " + ", ".join(isolated) + ".")
        if not relations:
            limitations.append("Contexto: no hay relaciones externas; la vista está incompleta.")
    else:
        limitations.append("Contexto: no hay actores ni sistemas externos declarados; se omite el diagrama.")
    lines = ["flowchart LR", *_nodes(structure),
             *(_edge(item, context=False) for item in structure["relationships"])]
    diagrams.append({"filename": "architecture-components.mmd", "title": "Diagrama de componentes/bloques",
                     "content": "\n".join(lines) + "\n"})
    connected = {endpoint for item in structure["relationships"] for endpoint in (item["from"], item["to"])}
    isolated = sorted(ids - connected)
    if isolated:
        limitations.append("Componentes: elementos sin relación explícita: " + ", ".join(isolated) + ".")
    if structure["persistence"]:
        limitations.append("Persistencia: se describe en texto; el contrato no vincula estas necesidades con componentes.")
    for index, flow in enumerate(structure["technical_flows"], 1):
        if len(flow["steps"]) < 2:
            limitations.append(f'Flujo {index}: solo tiene un paso; no se genera secuencia de actividades.')
            continue
        diagrams.append({"filename": f"architecture-flow-{index:03d}.mmd",
                         "title": f"Secuencia de actividades {index}", "content": _flow(flow)})
    return diagrams, limitations
