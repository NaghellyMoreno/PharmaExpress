# PREG-007. En Telegram, ¿por dónde viajan la fórmula, la confirmación del OCR y el resultado de la prevalidación?

Origen: revisión de alcance (decisión de la persona del 2026-10-31: prevalidación completa en web y Telegram)
SPEC: SPEC-003 v1.0 (RF-021, RNF-010, DEC-12) · SPEC-002 v1.1 (RF-011, RF-017) · plan §4 B2 y §10
Estado: respondida
Bloquea: no
Fecha: 2026-10-31

## Contexto

- SPEC-003 / RF-021: cargar fórmulas e historia clínica «a través de la aplicación web y del bot de Telegram».
- SPEC-003 / RNF-010: la carga y la «visualización de resultados» deben estar «operativa[s] tanto en la aplicación web como en el bot de Telegram».
- Plan §4 B2 (aprobado): «los chats de Telegram no tienen cifrado extremo a extremo por defecto: el bot solo envía avisos con plantillas fijas […] y no muestra ni pide medicamentos o diagnósticos por chat».
- Plan §4 B3: siempre debe existir una pantalla donde la persona confirma los medicamentos detectados por el OCR.

Hacer la prevalidación completa dentro del chat obliga a pedir una foto de la fórmula (un dato de salud) y a mostrar los medicamentos detectados para confirmarlos. Ambas cosas chocan con la regla del plan.

## Por qué importa

Define qué construye B2 (bot) y B3 (web), dónde corre el OCR y si hay que cambiar el plan aprobado. También toca la Ley 1581: datos de salud enviados a un tercero (Telegram).

## Opciones

1. Todo en el chat: foto en el chat, OCR en el servidor y confirmación y resultado en el chat. Cumple SPEC-003 al pie de la letra, pero rompe la regla de B2 del plan; habría que cambiar el plan y el consentimiento, y revisarlo con criterio legal.
2. Mini App de Telegram: un botón del bot abre la misma web dentro de Telegram. La carga, el OCR local y la confirmación ocurren en la web por HTTPS hacia nuestro servidor; el chat solo lleva avisos con plantilla fija («Tu fórmula 1 tiene resultado. Ábrelo aquí»). Se reutiliza B3 y se cumplen el plan y SPEC-003, si el equipo acepta que la Mini App cuenta como «en el bot». Riesgo: el acceso a la cámara y a archivos dentro de Telegram varía por dispositivo; hay que probarlo temprano.
3. Carga en el chat, confirmación y resultado por enlace a la web: la foto sí pasa por los servidores de Telegram y el OCR corre en el servidor.

En las tres opciones, los mensajes del chat nombran las fórmulas por número y el motivo por categoría (p. ej. «cobertura»), nunca por medicamento.

## Propuesta (PROPUESTA)

Opción 2.

## Respuesta del equipo

Opción 2 (Mini App). Decidida por la persona como DEC-P10 (`docs/decisiones.md`, 2026-10-31).
