"""Streamlit presentation for the validated Architecture Agent workflow."""

import tempfile
import hashlib
from pathlib import Path

import streamlit as st
from dotenv import load_dotenv

from architecture_runner import ArchitectureRun, estimate_tokens, token_warning_limit
from context_loader import load_context
from gemini_client import InferenceError


def show_items(items):
    for item in items:
        st.write(f"- {item}")


def show_questions(questions):
    st.info("Architecture Agent necesita información adicional antes de cerrar la propuesta.")
    for index, item in enumerate(questions, 1):
        st.subheader(f"Pregunta {index}: {item['question']}")
        st.write(f"Por qué importa: {item['reason']}")
        st.write(f"Impacto en la decisión: {item['decision_impact']}")
        st.text_area("Respuesta", key=f"clarification_{index}")


def show_structure(structure):
    for title, key in (("Actores externos", "external_actors"), ("Sistemas externos", "external_systems"),
                       ("Componentes y responsabilidades", "components"), ("Relaciones", "relationships"),
                       ("Persistencia", "persistence"), ("Flujos técnicos", "technical_flows")):
        st.subheader(title)
        if not structure[key]:
            st.write("Ninguno identificado")
        for item in structure[key]:
            if key in {"external_actors", "external_systems"}:
                st.write(f"{item['id']}: {item['name']}" + (f" ({item['kind']})" if key == "external_systems" else ""))
                st.write(item["responsibility"])
            elif key == "components":
                st.write(f"{item['id']}: {item['name']}")
                show_items(item["responsibilities"])
            elif key == "relationships":
                st.write(f"{item['from']} → {item['to']}: {item['interaction']} — {item['purpose']}")
            elif key == "persistence":
                st.write(f"{item['name']}: {item['responsibility']}")
                show_items(item["data_concerns"])
            else:
                st.write(item["name"])
                for step in item["steps"]:
                    st.write(f"{step['order']}. {step['participant']}: {step['action']}")
            st.caption(f"Fuentes: {', '.join(item['sources'])}")


def show_decision_matrix(result):
    matrix = result["decision_matrix"]
    names = [option["name"] for option in result["alternatives"]]
    assessments = {evaluation["alternative"]: {item["criterion_id"]: item
                                                for item in evaluation["assessments"]}
                   for evaluation in matrix["evaluations"]}
    markers = {"FAVORABLE": "🟢 FAVORABLE", "NEUTRAL": "⚪ NEUTRAL", "UNFAVORABLE": "🔴 UNFAVORABLE"}
    st.info("PROPUESTA DE IA — pendiente decisión y validación del equipo.")
    st.write(f"Arquitectura recomendada: {result['recommendation']['architecture']}")
    rows = []
    for criterion in matrix["criteria"]:
        row = {"Criterio": f"{criterion['id']}: {criterion['name']}"}
        for name in names:
            label = name + (" (PROPUESTA)" if name == result["recommendation"]["architecture"] else "")
            row[label] = markers[assessments[name][criterion["id"]]["assessment"]]
        rows.append(row)
    st.table(rows)
    for criterion in matrix["criteria"]:
        with st.expander(f"{criterion['id']}: {criterion['name']}"):
            st.write(f"Por qué importa: {criterion['reason']}")
            st.write("Evidencia:")
            for item in criterion["evidence"]:
                st.write(f"{item['source']}: {item['detail']}")
            for name in names:
                item = assessments[name][criterion["id"]]
                st.write(f"{name}: {markers[item['assessment']]} — {item['reason']}")


def show_ready(result, workflow, clarifications):
    st.success("Architecture Agent completó el análisis.")
    st.subheader("RECOMENDACIÓN DEL ARCHITECTURE AGENT")
    recommendation = result["recommendation"]
    adr = result["adr"]
    st.write(recommendation["architecture"])
    st.write(f"Estado ADR: {adr['status']}")
    st.info("PROPUESTAS DEL AGENTE — PENDIENTES DE VALIDACIÓN HUMANA")
    tabs = st.tabs(["Resumen", "Drivers", "Alternativas", "Matriz de decisión", "Estructura", "Diagramas", "Riesgos", "ADR", "Trazabilidad", "JSON", "Atributos de calidad", "Decisiones de diseño", "Patrones justificados", "Preguntas técnicas abiertas"])
    with tabs[0]:
        st.subheader("Arquitectura recomendada")
        st.write(recommendation["architecture"])
        st.subheader("¿Por qué esta arquitectura?")
        show_items(recommendation["justification"])
        st.subheader("Trade-offs aceptados")
        st.caption("Compromisos de la propuesta")
        show_items(recommendation["accepted_tradeoffs"])
        st.subheader("Condiciones para revisar la decisión")
        show_items(result["review_conditions"])
        st.write(f"Estado ADR: {adr['status']}")
        if clarifications:
            st.subheader("Aclaraciones del equipo")
            for question, answer in clarifications:
                if answer.strip():
                    st.write(f"{question}: {answer}")
    with tabs[1]:
        for driver in result["architecture_drivers"]:
            st.subheader(driver["name"])
            st.write(f"Impacto: {driver['impact']}")
            with st.expander("Evidencia"):
                for evidence in driver["evidence"]:
                    st.write(f"{evidence['source']}: {evidence['detail']}")
    with tabs[2]:
        for option in result["alternatives"]:
            st.subheader(option["name"])
            if option["name"] == recommendation["architecture"]:
                st.success("RECOMENDADA")
            st.write(f"Adecuación: {option['fit']}")
            for title, field in (("Ventajas", "advantages"), ("Desventajas", "disadvantages"), ("Riesgos", "risks")):
                st.write(title)
                show_items(option[field])
    with tabs[3]:
        show_decision_matrix(result)
    with tabs[4]:
        show_structure(result["architecture_structure"])
    with tabs[5]:
        for diagram in workflow.diagrams:
            st.subheader(diagram["title"])
            st.mermaid_chart(diagram["content"])
            st.download_button(f"Descargar {diagram['filename']}", data=diagram["content"].encode("utf-8"),
                               file_name=diagram["filename"], mime="text/plain")
        if workflow.diagram_limitations:
            st.subheader("Límites de los diagramas")
            show_items(workflow.diagram_limitations)
        if result["architecture_structure"]["persistence"]:
            st.subheader("Persistencia (necesidades textuales)")
            for item in result["architecture_structure"]["persistence"]:
                st.write(f"{item['name']}: {item['responsibility']}")
                show_items(item["data_concerns"])
    with tabs[6]:
        st.subheader("Riesgos actuales")
        show_items(result["risks"])
        st.subheader("Condiciones para revisar la decisión")
        show_items(result["review_conditions"])
    with tabs[7]:
        st.info("Este ADR es una propuesta generada por IA.")
        st.write(f"Estado: {adr['status']}")
        for title, field in (("Contexto", "context"), ("Drivers", "drivers"), ("Alternativas", "alternatives"),
                             ("Decisión propuesta", "decision"), ("Justificación", "justification"),
                             ("Consecuencias", "consequences"), ("Riesgos", "risks"),
                             ("Condiciones para revisar", "conditions_to_review")):
            st.subheader(title)
            if isinstance(adr[field], list):
                show_items(adr[field])
            else:
                st.write(adr[field])
    with tabs[10]:
        for item in result["quality_attributes"]:
            st.subheader(f"{item['id']}: {item['name']}")
            for label, field in (("Necesidad", "need"), ("Relevancia", "architectural_relevance"), ("Impacto", "impact")):
                st.write(f"{label}: {item[field]}")
            st.write("Mecanismos propuestos")
            show_items(item["proposed_mechanisms"])
            st.write("Evidencia")
            show_items([f"{e['source']}: {e['detail']}" for e in item["evidence"]])
            st.write("Condiciones de validación")
            show_items(item["validation_conditions"])
        if not result["quality_attributes"]:
            st.write("Ninguno sustentado por el contexto")
    with tabs[11]:
        for item in result["design_decisions"]:
            st.subheader(f"{item['id']}: {item['title']} — {item['status']}")
            for label, field in (("Problema", "problem"), ("Decisión propuesta", "proposed_decision"), ("Justificación", "justification")):
                st.write(f"{label}: {item[field]}")
            st.write(f"Componentes: {', '.join(item['component_ids'])}")
            for label, field in (("Alternativas", "alternatives"), ("Ventajas", "advantages"), ("Consecuencias y trade-offs", "tradeoffs")):
                st.write(label)
                show_items(item[field])
            show_items([f"{e['source']}: {e['detail']}" for e in item["evidence"]])
        if not result["design_decisions"]:
            st.write("Ninguna decisión de diseño justificada")
    with tabs[12]:
        for item in result["design_patterns"]["items"]:
            st.subheader(f"{item['id']}: {item['name']} — {item['status']}")
            for label, field in (("Problema", "problem"), ("Razón de uso", "justification"), ("Alternativa sin patrón", "without_pattern"), ("Complejidad adicional", "added_complexity")):
                st.write(f"{label}: {item[field]}")
            st.write(f"Componentes: {', '.join(item['component_ids'])}")
            show_items(item["risks"])
            show_items([f"{e['source']}: {e['detail']}" for e in item["evidence"]])
        st.write(f"Conclusión: {result['design_patterns']['conclusion']}")
    with tabs[13]:
        for item in result["open_questions"]:
            st.subheader(f"{item['id']}: {item['question']}")
            for label, field in (("Motivo", "reason"), ("Impacto", "impact"), ("Información necesaria", "information_needed"), ("Resolver antes de", "resolve_by")):
                st.write(f"{label}: {item[field]}")
            st.write(f"Componentes afectados: {', '.join(item['affected_component_ids']) or 'Ninguno identificado'}")
            show_items([f"{e['source']}: {e['detail']}" for e in item["evidence"]])
        if not result["open_questions"]:
            st.write("Ninguna pregunta técnica abierta justificada")
    with tabs[8]:
        for driver in result["architecture_drivers"]:
            for evidence in driver["evidence"]:
                st.write(f"{driver['name']} → {evidence['source']} → {evidence['detail']} → {driver['impact']}")
    with tabs[9]:
        st.json(result)
        with st.expander("Metadata de ejecución"):
            run = workflow.run
            st.json({key: run[key] for key in ("provider", "model", "usage", "duration_seconds", "clarification_rounds", "questions_asked")})
    st.subheader("Archivos generados")
    for filename, mime in (("architecture-analysis.json", "application/json"), ("architecture-analysis.md", "text/markdown")):
        path = workflow.output / filename
        st.write(str(path))
        st.download_button(f"Descargar {filename}", data=path.read_bytes(), file_name=filename, mime=mime)
    st.write(str(workflow.output / "architecture-analysis.run.json"))


def _start(uploaded, deployment):
    if not uploaded:
        raise ValueError("Debe cargar al menos un archivo Markdown.")
    names = [Path(item.name).name for item in uploaded]
    if len(names) != len(set(names)) or any(name in {"", ".", ".."} or Path(name).suffix.lower() not in {".md", ".markdown"} for name in names):
        raise ValueError("Cargue archivos Markdown con nombres distintos.")
    with tempfile.TemporaryDirectory() as folder:
        files = []
        for item, name in zip(uploaded, names, strict=True):
            path = Path(folder) / name
            path.write_bytes(item.getvalue())
            files.append(path)
        workflow = ArchitectureRun(files, deployment=deployment)
        st.session_state["workflow"] = workflow
        result = workflow.start()
    return workflow, result


def _preview(uploaded):
    names = [Path(item.name).name for item in uploaded]
    if len(names) != len(set(names)):
        raise ValueError("Cargue archivos Markdown con nombres distintos.")
    with tempfile.TemporaryDirectory() as folder:
        files = []
        for item, name in zip(uploaded, names, strict=True):
            path = Path(folder) / name
            path.write_bytes(item.getvalue())
            files.append(path)
        raw = load_context(files)
    return {"sources": names, "raw_size": len(raw.encode("utf-8")),
            "estimated_tokens": estimate_tokens(raw)}


def show_usage(workflow):
    run = workflow.run
    st.write(f"Inferencias realizadas: {len(run['calls'])}")
    for call in run["calls"]:
        st.write(f"Input tokens llamada {call['round']}: {call.get('input_tokens', 'No disponible')}")
    st.write(f"Input tokens totales: {(run['usage'] or {}).get('input_tokens', 'No disponible')}")


def _show_error(workflow, exc):
    if workflow is not None and workflow.run["error_type"] == "OUTPUT_VALIDATION_ERROR":
        st.error(f"Gemini respondió pero la salida incumplió el contrato local. {exc}")
    elif isinstance(exc, InferenceError):
        st.error(f"Error de proveedor: {exc.error_type}")
    else:
        st.error(f"No se pudo completar el análisis: {exc}")


def app():
    load_dotenv()
    st.title("Architecture Agent")
    st.write("De SPEC aprobada a arquitectura técnica justificable")
    st.info("IA propone → humana decide → equipo valida.")
    uploaded = st.file_uploader("Documentos Markdown", type=["md", "markdown"], accept_multiple_files=True)
    if uploaded:
        st.write("Documentos cargados:")
        show_items([Path(item.name).name for item in uploaded])
    state = st.session_state
    state.setdefault("phase", "IDLE")
    fingerprint = tuple((Path(item.name).name, hashlib.sha256(item.getvalue()).hexdigest()) for item in uploaded or [])
    if state.get("upload_fingerprint") != fingerprint:
        state["upload_fingerprint"] = fingerprint
        state["phase"] = "DOCUMENTS_READY" if uploaded else "IDLE"
        state["workflow"] = None
        state["result"] = None
        state["clarifications"] = []
        state["deployment_input"] = ""
        state["deployment_undefined"] = False
        try:
            state["preview"] = _preview(uploaded) if uploaded else None
        except (ValueError, OSError) as exc:
            state["preview"] = None
            st.error(f"No se pudo preparar el contexto: {exc}")
        for key in list(state):
            if key.startswith("clarification_"):
                del state[key]
    if state["phase"] == "IDLE" and uploaded:
        state["phase"] = "DOCUMENTS_READY"
    if state.get("preview"):
        preview = state["preview"]
        st.write(f"Fuentes seleccionadas: {len(preview['sources'])}")
        st.write(f"Contexto lossless: {preview['raw_size']} bytes")
        st.write(f"Tokens estimados del contexto: ~{preview['estimated_tokens']} (proxy local)")
        if preview["estimated_tokens"] > token_warning_limit():
            st.warning("El contexto lossless supera el presupuesto recomendado.")
    deployment_undefined = st.checkbox("No está definido; quiero que Architecture Agent recomiende alternativas.", key="deployment_undefined")
    deployment_input = st.text_input("Plataforma o entorno de despliegue", key="deployment_input", disabled=deployment_undefined) or ""
    deployment = "" if deployment_undefined else deployment_input
    st.write(f"Deployment: {deployment.strip() or 'No definido'}")
    if st.button("Analizar arquitectura"):
        for key in list(state):
            if key.startswith("clarification_"):
                del state[key]
        state["phase"] = "ANALYZING"
        state["workflow"] = None
        state["result"] = None
        state["clarifications"] = []
        try:
            with st.spinner("Analizando arquitectura..."):
                workflow, result = _start(uploaded, deployment)
            state["workflow"] = workflow
            state["result"] = result
            state["phase"] = result["status"]
        except (ValueError, OSError, InferenceError) as exc:
            state["phase"] = "ERROR"
            _show_error(state.get("workflow"), exc)
    if state["phase"] == "NEEDS_INFORMATION":
        workflow = state["workflow"]
        show_questions(workflow.questions)
        if st.button("Continuar análisis"):
            answers = [state.get(f"clarification_{index}", "") for index in range(1, len(workflow.questions) + 1)]
            state["clarifications"] = [(item["question"], answer) for item, answer in zip(workflow.questions, answers, strict=True)]
            state["phase"] = "ANALYZING_CLARIFICATIONS"
            try:
                with st.spinner("Analizando aclaraciones..."):
                    result = workflow.continue_with(answers)
                state["result"] = result
                state["phase"] = result["status"] if result["status"] == "READY" else "NEEDS_INFORMATION_FINAL"
            except (ValueError, OSError, InferenceError) as exc:
                state["phase"] = "ERROR"
                _show_error(workflow, exc)
    if state["phase"] == "NEEDS_INFORMATION_FINAL":
        st.warning("No existe información suficiente para emitir una recomendación arquitectónica final.")
        for item in state["result"]["missing_information"]:
            st.write(f"{item['question']} — {item['reason']} — {item['decision_impact']}")
    if state["phase"] == "READY":
        show_ready(state["result"], state["workflow"], state.get("clarifications", []))
    if state.get("workflow") is not None and state["phase"] in {"READY", "NEEDS_INFORMATION", "NEEDS_INFORMATION_FINAL"}:
        run = state["workflow"].run
        if run["lossless_context_tokens"] is not None:
            st.write(f"Tokens medidos del contexto lossless: {run['lossless_context_tokens']}")
        show_usage(state["workflow"])
    if state["phase"] == "ERROR" and state.get("workflow") is not None:
        error_type = state["workflow"].run["error_type"]
        if error_type == "OUTPUT_VALIDATION_ERROR":
            st.error("Gemini respondió pero la salida incumplió el contrato local.")
        elif error_type:
            st.error(f"Error de proveedor: {error_type}")


if __name__ == "__main__":
    app()
