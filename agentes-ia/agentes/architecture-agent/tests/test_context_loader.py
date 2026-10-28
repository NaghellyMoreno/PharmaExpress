import pytest

from context_loader import load_context


def test_loads_multiple_files_with_sources(tmp_path):
    first = tmp_path / "context.md"
    second = tmp_path / "flows.md"
    first.write_text("Problema", encoding="utf-8")
    second.write_text("Flujo", encoding="utf-8")
    context = load_context([first, second])
    assert "===== SOURCE: context.md =====" in context
    assert "===== SOURCE: flows.md =====" in context
    assert "Problema" in context and "Flujo" in context


def test_missing_file_is_clear(tmp_path):
    with pytest.raises(ValueError, match="Archivo inexistente"):
        load_context([tmp_path / "missing.md"])


def test_relative_path_uses_basename(tmp_path, monkeypatch):
    document = tmp_path / "primary-needs-v2.md"
    document.write_text("Necesidades", encoding="utf-8")
    monkeypatch.chdir(tmp_path)
    assert "===== SOURCE: primary-needs-v2.md =====" in load_context(["../" + tmp_path.name + "/primary-needs-v2.md"])


def test_absolute_path_uses_basename(tmp_path):
    document = tmp_path / "requirements.md"
    document.write_text("Requisitos", encoding="utf-8")
    assert "===== SOURCE: requirements.md =====" in load_context([str(document)])


def test_duplicate_basenames_are_rejected(tmp_path):
    first = tmp_path / "a" / "requirements.md"
    second = tmp_path / "b" / "requirements.md"
    first.parent.mkdir()
    second.parent.mkdir()
    first.write_text("Uno", encoding="utf-8")
    second.write_text("Dos", encoding="utf-8")
    with pytest.raises(ValueError, match="nombres distintos"):
        load_context([first, second])


def test_duplicate_spec_version_is_rejected(tmp_path):
    files = [tmp_path / name for name in ("SPEC-001_v1.3.md", "SPEC-001_v1.3_2.md")]
    for path in files:
        path.write_text("# SPEC-001. Cancelación - Versión 1.3\nEstado: Aprobada y congelada", encoding="utf-8")
    with pytest.raises(ValueError, match="SPEC-001 versión 1.3"):
        load_context(files)


def test_distinct_spec_versions_preserve_sources(tmp_path):
    files = [tmp_path / name for name in ("one.md", "two.md")]
    for version, path in zip(("1.2", "1.3"), files):
        path.write_text(f"# SPEC-001. Cancelación - Versión {version}", encoding="utf-8")
    context = load_context(files)
    assert all(f"SOURCE: {path.name}" in context for path in files)
