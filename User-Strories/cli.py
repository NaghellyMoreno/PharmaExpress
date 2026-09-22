"""CLI para generar historias de usuario desde una carpeta de contexto."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from dotenv import load_dotenv

from reviewer.engine import DEFAULT_CONTEXT_DIR, StoryGenerator
from reviewer.render import render_generation

DEFAULT_OUTPUT_DIR = Path("output")


def _write_output(text: str, filename: str) -> None:
    """Guarda el resultado en la carpeta fija `output` y crea la carpeta si falta."""
    requested_path = Path(filename)
    if requested_path.parent != Path("."):
        raise ValueError("--output solo acepta un nombre de archivo; se guarda dentro de output.")

    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = DEFAULT_OUTPUT_DIR / requested_path.name
    output_path.write_text(text, encoding="utf-8")
    print(f"Resultado guardado en: {output_path}")


def command_generate(args: argparse.Namespace) -> None:
    """Genera la cantidad solicitada de historias y guarda el documento en `output`."""
    generator = StoryGenerator(model=args.model)
    result = generator.generate_stories(context_dir=args.context_dir, count=args.count)
    output = (
        json.dumps(result.model_dump(), ensure_ascii=False, indent=2)
        if args.json
        else render_generation(result)
    )
    default_filename = "historias_generadas.json" if args.json else "historias_generadas.md"
    _write_output(output, args.output or default_filename)


def build_parser() -> argparse.ArgumentParser:
    """Configura el comando y los argumentos públicos de la aplicación."""
    parser = argparse.ArgumentParser(
        description="Generador de historias de usuario desde contexto de proyecto."
    )
    parser.add_argument(
        "--model", help="Modelo de Gemini. Usa GEMINI_MODEL o el modelo Flash por defecto."
    )
    sub = parser.add_subparsers(dest="command", required=True)
    generate = sub.add_parser("generate", help="Generar historias desde la carpeta de contexto.")
    generate.add_argument(
        "--context-dir",
        default=str(DEFAULT_CONTEXT_DIR),
        help="Carpeta con las fuentes del proyecto.",
    )
    generate.add_argument(
        "--count",
        type=int,
        default=20,
        help="Cantidad exacta de historias a generar. Predeterminado: 20.",
    )
    generate.add_argument(
        "--output",
        help="Nombre del archivo .md o .json dentro de la carpeta output.",
    )
    generate.add_argument("--json", action="store_true", help="Emitir JSON.")
    generate.set_defaults(func=command_generate)
    return parser


def main() -> None:
    """Carga la configuración de entorno, procesa argumentos y ejecuta el comando."""
    load_dotenv()
    args = build_parser().parse_args()
    if args.count < 1:
        raise SystemExit("--count debe ser un entero mayor que cero.")
    args.func(args)


if __name__ == "__main__":
    main()
