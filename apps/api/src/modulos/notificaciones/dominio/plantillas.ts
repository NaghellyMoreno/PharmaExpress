/**
 * Catálogo de plantillas fijas del módulo `notificaciones` (skill `plantillas-sin-datos-de-salud`).
 *
 * Sin I/O, sin NestJS. Ninguna plantilla admite datos de salud (medicamento, diagnóstico,
 * cédula, nombre, correo o teléfono reales); solo ids internos y, para el código, el código mismo.
 */

export type PlantillaId =
  | 'cambio_prevalidacion'
  | 'error_generico'
  | 'codigo_invalido'
  | 'codigo_verificacion'; // PREG-083: texto propuesto, pendiente de confirmación del equipo.

export interface DefinicionPlantilla {
  texto: string;
  variables: readonly string[];
  /** false mientras la redacción no esté confirmada por el equipo (PREG-083). */
  confirmada: boolean;
}

export const CATALOGO_PLANTILLAS: Record<PlantillaId, DefinicionPlantilla> = {
  cambio_prevalidacion: {
    texto: 'Hubo un cambio en tu solicitud. Revisa el detalle y el siguiente paso en la web.',
    variables: [],
    confirmada: true,
  },
  error_generico: {
    texto: 'No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.',
    variables: [],
    confirmada: true,
  },
  codigo_invalido: {
    texto: 'El código no es válido o venció. Solicita uno nuevo.',
    variables: [],
    confirmada: true,
  },
  codigo_verificacion: {
    texto: 'Tu código de verificación de Pharma Express es {{codigo}}. Vence en 10 minutos. Si no lo solicitaste, ignora este mensaje.',
    variables: ['codigo'],
    confirmada: false,
  },
};

const TERMINOS_PROHIBIDOS = ['medicamento', 'diagnostico', 'diagnóstico', 'cedula', 'cédula', 'formula_texto'];

/** Verifica que un texto ya renderizado no contenga términos de datos de salud o identificación. */
export function sinDatosDeSalud(texto: string): boolean {
  const normalizado = texto.toLowerCase();
  return !TERMINOS_PROHIBIDOS.some((termino) => normalizado.includes(termino));
}

export class VariableNoPermitidaError extends Error {
  constructor(public readonly variable: string) {
    super(`variable_no_permitida:${variable}`);
  }
}

/** Renderiza una plantilla sustituyendo solo las variables declaradas en su definición. */
export function renderizarPlantilla(plantillaId: PlantillaId, variables: Readonly<Record<string, string>> = {}): string {
  const definicion = CATALOGO_PLANTILLAS[plantillaId];
  for (const clave of Object.keys(variables)) {
    if (!definicion.variables.includes(clave)) {
      throw new VariableNoPermitidaError(clave);
    }
  }
  let texto = definicion.texto;
  for (const variable of definicion.variables) {
    texto = texto.replace(`{{${variable}}}`, variables[variable] ?? '');
  }
  return texto;
}
