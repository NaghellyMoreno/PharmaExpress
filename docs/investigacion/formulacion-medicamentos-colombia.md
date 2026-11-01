# Cómo funciona la formulación y autorización de medicamentos en Colombia (resumen para el prototipo)

Fecha: 2026-10-31 · Uso: insumo para decidir DEC-P02 / DEC-P11 y para modelar la EPS simulada (SPEC-008).
Advertencia: resumen de fuentes públicas hecho para diseñar un prototipo con EPS simulada. No es asesoría jurídica; la práctica de cada EPS puede variar.

## Hallazgos

1. **Medicamentos del plan (financiados con la UPC / PBS): no requieren autorización adicional.**
   - Resolución 4331 de 2012, art. 10 (citada por Supersalud, concepto 1502041 de 2022): las fórmulas de medicamentos «no requieren autorización adicional, excepto aquellos que no hacen parte del Plan Obligatorio de Salud».
   - Circular Externa 044 de 2025 (Minsalud): la prescripción ambulatoria de medicamentos financiados con la UPC es obligatoria por MIPRES y «ningún actor podrá exigir trámites adicionales, prescripciones duplicadas, autorizaciones administrativas». Transición: registro hasta el 28-feb-2026; implementación progresiva del 1-mar al 31-may-2026; obligatoria desde el 1-jun-2026. Excluye los medicamentos de control especial y monopolio del Estado.
   - Decreto Ley 019 de 2012, art. 120 (ya está en las restricciones de las SPEC): prohíbe trasladar al usuario los trámites de autorización.
2. **Medicamentos no financiados con la UPC (no PBS): pasan por un control adicional.** Se prescriben en MIPRES; algunos requieren aprobación de una Junta de Profesionales (campo `EstJM`, desde «no requiere junta» hasta «evaluada y no aprobada») y la EPS los direcciona a un proveedor. En el prototipo, ese control es lo que la EPS simulada representa como «autorización».
3. **Identificador de la fórmula.** En MIPRES la prescripción equivale a la fórmula («La prescripción efectuada en MIPRES será equivalente a la orden o fórmula médica», Circular 044 de 2025) y se identifica con el **Número de Prescripción** (`NoPrescripcion`, numérico, hasta 20 caracteres). También trae la fecha (`FPrescripcion`), el tipo y número de documento del paciente, el diagnóstico principal CIE-10 (`CodDxPpal`) y hasta dos relacionados, y los medicamentos por principio activo (`CodPriAct`).
4. **Vigencia.** Resolución 4331 de 2012, art. 10: la fórmula tiene vigencia «no inferior a un (1) mes». Para crónicos se exigen prescripciones por periodos no menores a 90 días con entregas no inferiores a un mes; de ahí viene la «fecha habilitada de entrega».

## Consecuencias para Pharma Express

- La regla del contexto 3.4 («un medicamento no cubierto solo continúa si está autorizado») coincide con la práctica: la autorización solo decide para los medicamentos **no PBS**.
- Exigir autorización a un medicamento PBS iría contra la Resolución 4331/2012, la Circular 044/2025 y el Decreto Ley 019/2012 art. 120 → ver la propuesta DEC-P11.
- Modelar el número de fórmula de la EPS simulada como un número de prescripción MIPRES (20 dígitos) y guardar con él el diagnóstico CIE-10 hace realista DEC-P05 y DEC-P09.

## Fuentes

- Supersalud, concepto 1502041 de 2022: https://normograma.supersalud.gov.co/compilacion/docs/concepto_supersalud_1502041_2022.htm
- Minsalud, Circular Externa 044 de 2025: https://www.minsalud.gov.co/Normatividad_Nuevo/Circular%20Externa%20No%20044%20de%202025.pdf
- Portafolio, «Prescripción y entrega cambiarán en 2026»: https://www.portafolio.co/economia/gobierno/prescripcion-y-entrega-cambiaran-en-2026-minsalud-impone-obligatoriedad-de-mipres-para-farmacos-upc-485488
- Minsalud, Disposición de información de prescripción MIPRES v5.6: https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/disposicion-informacion-prescripcion-v5.6.pdf
