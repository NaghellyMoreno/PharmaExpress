/**
 * Tipos del contrato de la API (skill `cliente-api-tipado`): reflejan los DTO reales de
 * `apps/api/src/modulos/*\/api/*.controller.ts`. Ningún tipo de agendamiento/reservas: está
 * fuera del MVP (DEC-P01, SPEC-004 en evaluación).
 */

export interface RegistroConsentimiento {
  condicion: 'titular' | 'tercero';
  fecha: string;
  canal: 'web' | 'telegram';
}

export interface SolicitarCodigoRespuesta {
  enviado: boolean;
}

export interface ConfirmarVinculacionRespuesta {
  vinculado: boolean;
}

export interface ConfirmarRevalidacionRespuesta {
  revalidada: boolean;
}

export interface AccesoMiniApp {
  accesoDirecto: boolean;
  requiereCodigoNuevo: boolean;
  requiereCedula: boolean;
}

export interface PacienteVinculado {
  pacienteCC: string;
  cedulaEnmascarada: string;
  vigente: boolean;
  vencida: boolean;
}

export type TipoDocumento = 'formula' | 'historia';

export interface DocumentoCargado {
  documentoId: string;
  legible: boolean;
  numeroPrescripcion?: string;
  medicamentos: string[];
  diagnostico?: string;
}

export interface ReintentoOcrResultado {
  intento: number;
  maximoIntentos: number;
  agotado: boolean;
}

export interface ResultadoFormula {
  numeroPrescripcion: string;
  apta: boolean;
  motivo: string;
  siguientePaso: string;
}

export interface ResultadoPrevalidacion {
  aptaAlgunaFormula: boolean;
  resultados: ResultadoFormula[];
}
