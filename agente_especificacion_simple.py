from pathlib import Path
import os
import re

from dotenv import load_dotenv
from google import genai
from google.genai import types

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise SystemExit("Falta GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=api_key)

MODELO = "gemini-3.5-flash-lite"
MAX_RONDAS = 3

REGLAS = """
Eres un Agente Analista de Especificaciones experto y un auditor estricto. 
Tu objetivo es evaluar una NUEVA NECESIDAD basándote ESTRICTAMENTE en el CONTEXTO APROBADO y las ESPECIFICACIONES PREVIAS (MEMORIA).

REGLAS FUNDAMENTALES:
- El CONTEXTO APROBADO es la verdad absoluta. 
- Si la NUEVA NECESIDAD pide algo que el contexto dice que está fuera de alcance, prohibido o altera el orden lógico/secuencia del flujo, ES UNA CONTRADICCIÓN y no puedes asumirla como válida.
- No inventes reglas, asumas arquitecturas, ni tomes decisiones de negocio por tu cuenta.
""".strip()


def leer_archivo(ruta):
    """Lee el contenido de un archivo local (falla con un error claro si no existe)."""
    return Path(ruta).read_text(encoding="utf-8")


def guardar_documento(contenido, ruta_salida):
    """Guarda el documento final generado en un archivo Markdown."""
    Path(ruta_salida).write_text(contenido, encoding="utf-8")
    print(f"✅ Documento generado y guardado en: {ruta_salida}")


def leer_memoria(ruta):
    """Lee el archivo de memoria. Si no existe, devuelve un texto vacío."""
    if Path(ruta).exists():
        return Path(ruta).read_text(encoding="utf-8")
    return ""


def actualizar_memoria(ruta, nueva_spec):
    """Añade la nueva especificación al final del archivo de memoria, si fue exitosa."""
    if "🛑 Especificación Bloqueada" not in nueva_spec and "❌ Especificación Rechazada" not in nueva_spec:
        with open(ruta, "a", encoding="utf-8") as f:
            f.write(f"\n\n---\n\n{nueva_spec}")
        print(f"🧠 Memoria actualizada. La especificación se guardó en el histórico.")


def consultar_modelo(instrucciones, prompt):
    """Llama a la API de Gemini con las instrucciones y el prompt dados."""
    response = client.models.generate_content(
        model=MODELO,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=instrucciones,
        ),
    )
    if not response.text:
        raise RuntimeError("El modelo devolvió una respuesta vacía.")
    return response.text


def pedir_necesidad_consola():
    """Permite al usuario ingresar la necesidad por consola (soporta múltiples líneas)."""
    print("\n📝 Escribe la nueva necesidad a evaluar.")
    print("   (Puedes usar varias líneas. Presiona Enter 2 veces seguidas para terminar):")
    lineas = []
    while True:
        linea = input("> ")
        if not linea:
            break
        lineas.append(linea)
    return "\n".join(lineas).strip()


def responder_preguntas(preguntas, historial):
    """Muestra las preguntas del agente y recoge las respuestas del usuario."""
    print(
        f"\n❓ El agente necesita aclarar {len(preguntas)} punto(s). Enter en blanco = dejar pendiente.\n")
    for p in preguntas:
        print(p)
        respuesta = input("Respuesta > ").strip(
        ) or "SIN RESPUESTA (queda pendiente)"
        historial += f"- {p}\n  Respuesta: {respuesta}\n"
        print()
    return historial


def pedir_preguntas(instrucciones, contexto, memoria, necesidad, historial):
    """Fase 1: Auditoría obligatoria para la consola."""
    prompt = f"""=== CONTEXTO APROBADO ===
{contexto}

=== ESPECIFICACIONES PREVIAS (MEMORIA) ===
{memoria or '(Ninguna)'}

=== NUEVA NECESIDAD ===
{necesidad}

=== HISTORIAL DE PREGUNTAS Y RESPUESTAS DEL EQUIPO ===
{historial or '(ninguno)'}

TAREA DE AUDITORÍA:
Compara la NUEVA NECESIDAD contra el CONTEXTO APROBADO y la MEMORIA. Busca tres tipos de problema:
- Contradicción: la necesidad plantea un flujo, orden o regla distinta o contradictoria con el contexto
  (ej. agendar prevalidando la vigencia al tiempo).
- Vacío: falta una decisión que la especificación necesitaría y que no está en el contexto ni en el historial
  (todo número, plazo, límite, política de retención, manejo de error o estado).
- Solape: la necesidad repite o choca con una especificación de la MEMORIA.

REGLAS ABSOLUTAS:
1. Si encuentras cualquiera de los tres problemas, DEBES OBLIGATORIAMENTE generar una pregunta para la consola.
2. TIENES PROHIBIDO guardar tus dudas para la redacción final o escribir explicaciones largas.
3. TIENES PROHIBIDO proponer que se asuma algo o completar un vacío por tu cuenta.
4. El HISTORIAL es solo de consulta: úsalo para NO repetir un tema que el equipo ya trató. Nunca copies, cites
   ni devuelvas texto del HISTORIAL (ni sus respuestas, ni sus marcas).
5. Que un problema ya esté tratado en el HISTORIAL no te exime de buscar los demás.
   Responde únicamente SIN_PREGUNTAS cuando no quede ningún otro problema de los tres tipos.
6. Máximo 7 preguntas, ordenadas de mayor a menor impacto.

FORMATO ESTRICTO DE SALIDA (texto plano, en español de Colombia):
- Cada línea de tu respuesta debe empezar con "Q: " y contener UNA pregunta nueva, completa y terminada en "?".
- Cada pregunta debe describir un problema concreto de la NUEVA NECESIDAD; no puede ser una palabra suelta,
  una letra, una etiqueta ni un estado.
- No escribas nada más: ni títulos, ni numeración, ni comentarios, ni letras separadas por espacios.
Ejemplos del formato:
Q: [Contradicción] La necesidad solicita X, pero el contexto establece Y. ¿Cómo debemos proceder?
Q: [Vacío] Falta definir X. ¿Cuál es la decisión?
Q: [Solape] La necesidad repite o choca con Z de la especificación previa. ¿Cómo debemos proceder?
Q: [Aclaración] La necesidad menciona X, pero no está claro si debe cumplir con Y. ¿Debe cumplirlo?

Si no hay preguntas, responde únicamente la palabra: SIN_PREGUNTAS"""

    texto = consultar_modelo(instrucciones, prompt)
    preguntas = []

    # Captura cualquier pregunta que empiece con Q: o contenga el tipo de duda
    for linea in texto.splitlines():
        linea_clean = linea.strip()
        if "Q:" in linea_clean or "[Contradic" in linea_clean or "[Vac" in linea_clean:
            # Limpiamos viñetas extra si el modelo las pone
            linea_clean = re.sub(r"^[\*\-\d\.\s]+", "", linea_clean)
            if linea_clean and not linea_clean.startswith("SIN_PREGUNTAS"):
                preguntas.append(linea_clean)

    return preguntas


def redactar_documento_final(instrucciones, contexto, memoria, necesidad, plantilla, historial):
    """Fase 2: Redacta la SPEC, la bloquea (si no hay respuesta), o la rechaza (si el usuario lo ordenó)."""
    prompt = f"""=== CONTEXTO APROBADO ===
{contexto}

=== ESPECIFICACIONES PREVIAS (MEMORIA) ===
{memoria or '(Ninguna)'}

=== NUEVA NECESIDAD ===
{necesidad}

=== PREGUNTAS Y RESPUESTAS DEL EQUIPO ===
{historial or '(ninguna)'}

=== PLANTILLA A UTILIZAR ===
{plantilla}

TAREA: Redacta la especificación final o documenta su cancelación, en español de Colombia.

PRECEDENCIA ANTE CONFLICTO: 1) CONTEXTO APROBADO, 2) respuestas del equipo, 3) MEMORIA, 4) NUEVA NECESIDAD.

PRINCIPIO CENTRAL: una contradicción con el contexto NO es motivo de rechazo. Rechazar es una decisión del equipo,
nunca tuya. Tú no decides rechazar ni cancelar una necesidad por tu cuenta, aunque la necesidad esté contradicha
por completo y aunque, al corregirla, quede igual a lo que ya dice el contexto.

CÓMO INTERPRETAR LAS RESPUESTAS DEL EQUIPO A UNA CONTRADICCIÓN:
- ADAPTACIÓN: "mantener la regla del contexto", "mantén la regla del contexto", "mantengamos el contexto",
  "respetar el contexto", "seguir el flujo original", "cumplir el contexto", "adaptar la necesidad",
  "que aplique la regla del contexto", o cualquier instrucción de cómo corregir la necesidad.
  Significan que la necesidad se AJUSTA al contexto y la especificación SE REDACTA. NUNCA son un rechazo.
- RECHAZO: solo cuando el historial contiene una orden explícita de no continuar con las palabras "rechazar",
  "rechaza", "cancelar", "descartar", "no hacer esta especificación" o "no es viable". Decidir mantener el
  contexto NO es rechazar la necesidad.
- Si la respuesta es ambigua entre adaptación y rechazo, trátala como ADAPTACIÓN y redacta la especificación.

VERIFICACIÓN OBLIGATORIA ANTES DE RECHAZAR: antes de usar el título "# ❌ Especificación Rechazada", comprueba
que el historial contenga literalmente una de las palabras de RECHAZO de arriba. Si no la contiene, TIENES
PROHIBIDO usar ese título y debes redactar la especificación.

REGLAS DE BLOQUEO O RECHAZO ESTRICTAS (se evalúan en este orden):
1. BLOQUEO POR FALTA DE DECISIÓN: Si en el historial hay una pregunta CRÍTICA con la respuesta
   "SIN RESPUESTA (queda pendiente...", es decir, una decisión sin la cual no se puede redactar la especificación,
   IGNORA LA PLANTILLA. Genera un documento con el título "# 🛑 Especificación Bloqueada" que liste esas preguntas
   críticas y explique por qué la falta de resolución impide el diseño.
   Las preguntas sin respuesta que NO sean críticas no bloquean: pásalas a la sección de preguntas abiertas.
2. RECHAZO EXPLÍCITO: Solo si el historial contiene una palabra de RECHAZO (ver verificación obligatoria),
   IGNORA LA PLANTILLA. Genera un documento con el título "# ❌ Especificación Rechazada" explicando brevemente
   por qué el equipo determinó que no es viable según las reglas del proyecto.
3. ADAPTACIÓN AL CONTEXTO: Si el equipo respondió con alguna de las frases de ADAPTACIÓN, redacta la SPEC completa
   usando la "PLANTILLA A UTILIZAR", ajustando los requerimientos para que cumplan exactamente con lo que dice
   el contexto. La parte de la necesidad que contradecía el contexto se reemplaza por lo que el contexto establece;
   el resto de la necesidad se conserva.
   CASO ESPECIAL: si al reemplazar lo contradictorio la necesidad queda sin contenido propio (porque toda ella
   estaba contradicha), IGUAL redacta la SPEC. Esa SPEC especifica el comportamiento que el contexto define para
   el escenario que planteaba la necesidad, con cada regla citada [CONFIRMADO: contexto §x.y], y deja constancia
   en la sección de contexto de que la propuesta original fue ajustada por decisión del equipo. No la rechaces.
4. GENERACIÓN EXITOSA: Si no ocurrió nada de lo anterior (la necesidad es válida o el equipo explicó cómo adaptarla),
   redacta la SPEC completa usando estrictamente la "PLANTILLA A UTILIZAR".

EJEMPLO DEL CASO ESPECIAL:
- Necesidad: "si la solicitud tiene medicamentos agudos y crónicos, agendar los agudos el mismo día y los crónicos
  al día siguiente en una cita separada".
- Respuesta del equipo: "mantener la regla del contexto".
- Resultado correcto: NO rechazar. Redactar una SPEC sobre solicitudes con medicamentos agudos y crónicos que aplique
  lo que el contexto establece para ese escenario (si una cita incluye algún medicamento crónico, aplica la regla
  del crónico; la reserva es por solicitud; una cita por punto), citando el contexto, con criterios de aceptación
  para ese escenario.

REGLAS PARA REDACTAR LA SPEC (casos 3 y 4):
a. ORIGEN CON FUENTE: cada requisito, regla o criterio lleva su origen. [CONFIRMADO] solo si puedes citar la fuente
   exacta: [CONFIRMADO: contexto §x.y] o [CONFIRMADO: respuesta del equipo]. Si no puedes citarla, no es CONFIRMADO:
   usa [INFERENCIA] o [PROPUESTA].
b. PROHIBIDO suponer: no escribas "se asume" ni completes vacíos. No inventes reglas, cifras, plazos, normas,
   integraciones ni comportamientos. Todo vacío o pregunta sin respuesta va a la sección de preguntas abiertas,
   con su impacto.
c. ALCANCE: incluye solo lo que la NUEVA NECESIDAD pide. Lo demás va a "Fuera de alcance", indicando la
   especificación responsable si existe en la MEMORIA.
d. SIN DUPLICADOS: si un requisito ya existe en la MEMORIA, no lo repitas: referencia su ID.
e. NUEVAS REGLAS DEL EQUIPO: si una respuesta del equipo agrega una regla que no está en el contexto, márcala como
   [CONFIRMADO: respuesta del equipo] y agrégala en una sección final "Decisiones que modifican el contexto".
   Si el equipo solo confirmó una regla que YA está en el contexto, no la agregues a esa sección.
f. DATOS DE CONTROL: no inventes la fecha, la versión ni el ID. El ID y la numeración deben continuar los de la MEMORIA.
   Si no tienes la fecha real, deja AAAA-MM-DD.
g. APROBACIÓN: deja el control de aprobación en estado PENDIENTE DE APROBACIÓN. NUNCA escribas "SPEC FROZEN" ni
   [APROBADO]: solo un humano los asigna.
h. COBERTURA: cada requisito funcional y cada regla de negocio debe tener al menos un criterio de aceptación."""

    return consultar_modelo(instrucciones, prompt)


def generar_documento_automatico(ruta_contexto, ruta_plantilla, ruta_salida, ruta_memoria):
    print("Cargando archivos base...")
    contexto = leer_archivo(ruta_contexto)
    plantilla = leer_archivo(ruta_plantilla)
    memoria = leer_memoria(ruta_memoria)

    necesidad = pedir_necesidad_consola()
    if not necesidad:
        print("❌ No se ingresó ninguna necesidad. Cancelando proceso...")
        return

    instrucciones = REGLAS
    historial = ""

    ronda = 1
    while True:
        print(
            f"\n🔎 Ronda {ronda}: auditando la necesidad frente al contexto y la memoria...")
        preguntas = pedir_preguntas(
            instrucciones, contexto, memoria, necesidad, historial)

        # Si el agente ya no devuelve preguntas (responde SIN_PREGUNTAS), se rompe el bucle
        if not preguntas:
            print("✅ El agente resolvió todas sus dudas y está listo para redactar.")
            break

        # Si hay preguntas, se le muestran al usuario y se guardan en el historial
        historial = responder_preguntas(preguntas, historial)
        ronda += 1

    print("📝 Generando la salida final del agente...")
    resultado_final = redactar_documento_final(
        instrucciones, contexto, memoria, necesidad, plantilla, historial)

    guardar_documento(resultado_final, ruta_salida)
    actualizar_memoria(ruta_memoria, resultado_final)


if __name__ == "__main__":
    archivo_contexto = "contexto_proyecto.md"
    archivo_plantilla = "SPEC-plantilla.md"
    archivo_salida = input(
        "Ingrese el nombre del archivo de salida (ej: SPEC-generada.md): ").strip()
    archivo_memoria = "memoria_agente.md"

    generar_documento_automatico(
        archivo_contexto, archivo_plantilla, archivo_salida, archivo_memoria)
