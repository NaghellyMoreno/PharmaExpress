/**
 * Servicio del módulo `pre-dispensacion` — prevalidación de documentos y fórmulas (SPEC-003 v1.14).
 *
 * Depende de `simulacion` únicamente a través de su `api/` (`SimulacionApi`), nunca de su
 * servicio interno (skill `nestjs-modulo-estandar`; ver H-006 de
 * `qa/incidentes/INC-20261102-001-telegram-entradas.md`).
 */

import { Injectable } from '@nestjs/common';
import { SimulacionApi } from '../../simulacion/api/simulacion.api';
import { FestivosAnioFaltanteError } from '../../simulacion/servicios/simulacion.service';
import {
  BR014,
  esNumeroPrescripcionValido,
  formatoArchivoValido,
  formulaIlegible,
  MAXIMO_INTENTOS_DOCUMENTO,
} from '../dominio/reglas';

export { FestivosAnioFaltanteError };

export interface FormulaEntradaDto {
  numeroPrescripcion: string;
  medicamentos?: string[];
}

export interface SolicitudPrevalidacionDto {
  solicitudId?: string;
  cedulaPaciente: string;
  formulas: FormulaEntradaDto[];
  historiaClinica?: { diagnostico: string };
  /** Solo para pruebas: fija la fecha de prevalidación en vez de usar la fecha real (DEC-P36). */
  fechaSimuladaPrevalidacion?: string;
}

export interface ResultadoFormula {
  numeroPrescripcion: string;
  apta: boolean;
  motivo: string;
  siguientePaso: string;
}

export interface ResultadoPrevalidacionSolicitud {
  aptaAlgunaFormula: boolean;
  resultados: ResultadoFormula[];
}

interface RegistroAlmacenamiento {
  fotos: string[]; // RF-032: siempre vacío tras terminar — las fotos/PDF se purgan de inmediato.
  resultados: ResultadoFormula[];
}

@Injectable()
export class PrevalidacionalServicio {
  private readonly almacenamientoPorSolicitud = new Map<string, RegistroAlmacenamiento>();
  private readonly intentosPorDocumento = new Map<string, number>();

  constructor(private readonly simulacion: SimulacionApi) {}

  /** RF-024 / BR-008 — orden estricto: afiliación → por fórmula: vigencia → PBS/autorización → fecha habilitada (crónica). */
  async prevalidarSolicitud(dto: SolicitudPrevalidacionDto): Promise<ResultadoPrevalidacionSolicitud> {
    const fechaPrevalidacion = dto.fechaSimuladaPrevalidacion
      ? new Date(`${dto.fechaSimuladaPrevalidacion}T12:00:00-05:00`)
      : new Date();

    const paciente = await this.simulacion.consultarPaciente(dto.cedulaPaciente);
    if (!paciente || !paciente.afiliacionActiva) {
      // BR-008: la afiliación inactiva detiene toda la solicitud y reemplaza el resultado de todas las fórmulas.
      const resultados = dto.formulas.map((f) => this.noApta(f.numeroPrescripcion, BR014.AFILIACION_INACTIVA));
      this.registrarAlmacenamiento(dto.solicitudId, resultados);
      return { aptaAlgunaFormula: false, resultados };
    }

    const resultados: ResultadoFormula[] = [];
    for (const formulaDto of dto.formulas) {
      resultados.push(await this.evaluarFormula(formulaDto, dto.historiaClinica, fechaPrevalidacion));
    }
    this.registrarAlmacenamiento(dto.solicitudId, resultados);
    return { aptaAlgunaFormula: resultados.some((r) => r.apta), resultados };
  }

  private async evaluarFormula(
    formulaDto: FormulaEntradaDto,
    historiaClinica: { diagnostico: string } | undefined,
    fechaPrevalidacion: Date,
  ): Promise<ResultadoFormula> {
    const numero = formulaDto.numeroPrescripcion;

    if (formulaIlegible(formulaDto)) {
      return this.noApta(numero, BR014.DOCUMENTO_ILEGIBLE);
    }

    let vigente: boolean;
    try {
      vigente = await this.simulacion.evaluarVigenciaFormula(numero, fechaPrevalidacion);
    } catch {
      return this.noApta(numero, BR014.DOCUMENTO_NO_COINCIDENTE);
    }
    if (!vigente) {
      return this.noApta(numero, BR014.FORMULA_VENCIDA);
    }

    const formula = await this.simulacion.consultarFormula(numero);
    if (!formula) {
      return this.noApta(numero, BR014.DOCUMENTO_NO_COINCIDENTE);
    }

    for (const medicamento of formula.medicamentos) {
      const { apto } = await this.simulacion.verificarCoberturaPBS(medicamento.codigo, medicamento.autorizado);
      if (!apto) {
        return this.noApta(numero, BR014.NO_PBS_SIN_AUTORIZACION);
      }
    }

    const diagnostico = historiaClinica?.diagnostico ?? formula.diagnosticoCie10;
    const clasificacion = await this.simulacion.clasificarDiagnostico(diagnostico);
    if (clasificacion === 'cronico') {
      if (!formula.fechaHabilitada) {
        // DEC-P50: la falta de fecha habilitada se resuelve antes de consultar el catálogo de festivos.
        return this.noApta(numero, BR014.CRONICA_SIN_FECHA_HABILITADA);
      }
      // AC-052/DEC-P19/DEC-P43: si falta el año en el catálogo de festivos, no se emite resultado para
      // esta fórmula (lanza FestivosAnioFaltanteError) y la persona debe iniciar una solicitud nueva.
      const citaPosible = await this.simulacion.calcularDiaHabilSiguiente(fechaPrevalidacion);
      const citaPosibleISO = citaPosible.toISOString().slice(0, 10);
      if (formula.fechaHabilitada > citaPosibleISO) {
        return this.noApta(numero, BR014.FECHA_HABILITADA_POSTERIOR);
      }
    }

    return { numeroPrescripcion: numero, apta: true, ...BR014.APTA };
  }

  private noApta(numeroPrescripcion: string, causa: { motivo: string; siguientePaso: string }): ResultadoFormula {
    return { numeroPrescripcion, apta: false, ...causa };
  }

  private registrarAlmacenamiento(solicitudId: string | undefined, resultados: ResultadoFormula[]): void {
    if (!solicitudId) {
      return;
    }
    // RF-032 / DEC-P59 / DEC-P81: al terminar la prevalidación se purgan fotos/PDF; solo quedan los 4 campos del resultado.
    this.almacenamientoPorSolicitud.set(solicitudId, { fotos: [], resultados });
  }

  /** RF-029 / BR-009 / AC-003, AC-039, AC-040 — máximo 2 intentos de carga/confirmación por documento. */
  async procesarReintentoOCR(intentoDto: { documentoId: string; accion: 'RECHAZAR' | 'ACEPTAR' }): Promise<{
    intento: number;
    maximoIntentos: number;
    agotado: boolean;
  }> {
    if (intentoDto.accion === 'ACEPTAR') {
      this.intentosPorDocumento.delete(intentoDto.documentoId);
      return { intento: 0, maximoIntentos: MAXIMO_INTENTOS_DOCUMENTO, agotado: false };
    }
    const intentoActual = (this.intentosPorDocumento.get(intentoDto.documentoId) ?? 0) + 1;
    this.intentosPorDocumento.set(intentoDto.documentoId, intentoActual);
    return {
      intento: intentoActual,
      maximoIntentos: MAXIMO_INTENTOS_DOCUMENTO,
      agotado: intentoActual >= MAXIMO_INTENTOS_DOCUMENTO,
    };
  }

  /** RF-032 / DEC-P59 / DEC-P81 / AC-054 — tras terminar, no quedan fotos/PDF; solo resultado, motivo, siguiente paso y número. */
  async verificarLimpiezaAlmacenamiento(solicitudId: string): Promise<{ fotosRestantes: number; resultados: ResultadoFormula[] }> {
    const registro = this.almacenamientoPorSolicitud.get(solicitudId);
    if (!registro) {
      throw new Error('solicitud_no_encontrada');
    }
    return { fotosRestantes: registro.fotos.length, resultados: registro.resultados };
  }

  /** RF-024 (paso 5) / BR-014 / AC-031 — fórmula crónica sin fecha habilitada registrada queda no apta. */
  async evaluarFechaHabilitadaCronica(dto: { numeroPrescripcion: string; esCronica: boolean; fechaHabilitada: string | null }): Promise<ResultadoFormula> {
    if (dto.esCronica && !dto.fechaHabilitada) {
      return this.noApta(dto.numeroPrescripcion, BR014.CRONICA_SIN_FECHA_HABILITADA);
    }
    return { numeroPrescripcion: dto.numeroPrescripcion, apta: true, ...BR014.APTA };
  }

  /** BR-009 / DEC-P42 / AC-050 — un número de prescripción sin 20 dígitos numéricos cuenta como documento ilegible. */
  async validarEstructuraPrescripcion(dto: { numeroPrescripcion: string }): Promise<{ valido: boolean; ilegible: boolean }> {
    const valido = esNumeroPrescripcionValido(dto.numeroPrescripcion);
    return { valido, ilegible: !valido };
  }

  /** BR-009 / AC-056 / DEC-P74 — un archivo fuera de JPG/PNG/PDF se rechaza sin leerlo y sin gastar intento. */
  async validarFormatoArchivo(archivoDto: { nombre: string; mimetype: string }): Promise<{ aceptado: boolean; gastaIntento: boolean }> {
    const aceptado = formatoArchivoValido(archivoDto.mimetype);
    return { aceptado, gastaIntento: false };
  }
}
