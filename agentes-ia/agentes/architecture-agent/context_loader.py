from pathlib import Path
import re


SPEC_HEADING = re.compile(r"^#\s+(SPEC-\d+)\b[^\n]*?\s+-\s+Versi[oó]n\s+(\d+(?:\.\d+)*)\b", re.IGNORECASE | re.MULTILINE)


def load_context(files):
    if not files:
        raise ValueError("Debe indicar al menos un archivo Markdown.")
    names = [Path(filename).name for filename in files]
    if len(names) != len(set(names)):
        raise ValueError("Los archivos de entrada deben tener nombres distintos.")
    sections = []
    specs = set()
    for filename in files:
        path = Path(filename)
        if path.suffix.lower() not in {".md", ".markdown"}:
            raise ValueError(f"No es un archivo Markdown: {filename}")
        if not path.is_file():
            raise ValueError(f"Archivo inexistente o no regular: {filename}")
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as exc:
            raise ValueError(f"No se puede leer como texto UTF-8: {filename}") from exc
        if not content.strip():
            raise ValueError(f"Archivo vacío: {filename}")
        match = SPEC_HEADING.search(content)
        if match:
            key = (match.group(1).upper(), match.group(2))
            if key in specs:
                raise ValueError(f"Se detectaron varias fuentes para {key[0]} versión {key[1]}. Seleccione una única fuente canónica.")
            specs.add(key)
        sections.append(f"===== SOURCE: {path.name} =====\n\n{content}")
    return "\n\n".join(sections)
