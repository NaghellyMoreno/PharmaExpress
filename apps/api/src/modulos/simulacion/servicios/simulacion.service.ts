/**
 * Servicio de datos simulados — módulo `simulacion` (SPEC-008 v1.10).
 *
 * Expone la EPS simulada y los catálogos configurables que usa `prevalidacion`.
 * Persistencia: almacén en memoria sembrado con datos sintéticos (ver `datos/eps-simulada.fixture.ts`);
 * la persistencia real en el esquema `eps_simulada` de PostgreSQL (ARQ-005/COMP-004) es
 * un paso de integración posterior, no de las pruebas de unidad de este módulo.
 * El equipo provoca cambios de prueba (RF-082/DEC-P36) con los métodos `establecer*`.
 */

import { Injectable } from '@nestjs/common';
import {
  CATALOGO_COBERTURA_PBS,
  CATALOGO_DIAGNOSTICOS_CRONICOS,
  CATALOGO_FESTIVOS_COLOMBIA,
  CONTACTOS_AUTORIZADOS_PRUEBA,
  EventoPrevalidacion,
  FormulaSimulada,
  PacienteSimulado,
  eventosSemilla,
  formulasSemilla,
  pacientesSemilla,
} from '../datos/eps-simulada.fixture';
import {
  FestivosAnioFaltanteError,
  ResultadoCobertura,
  calcularDiaHabilSiguiente as calcularDiaHabilSiguienteDominio,
  clasificarDiagnostico as clasificarDiagnosticoDominio,
  esFormulaVigente,
  fechaColombiaISO,
  verificarCoberturaPBS as verificarCoberturaPBSDominio,
  vigenciaDentroDeRangoDePrueba,
} from '../dominio/reglas';

export { FestivosAnioFaltanteError };

@Injectable()
export class SimulacionService {
  private pacientes: PacienteSimulado[] = pacientesSemilla();
  private formulas: FormulaSimulada[] = formulasSemilla();
  private eventos: EventoPrevalidacion[] = eventosSemilla();
  private readonly catalogoFestivos: Record<number, string[]> = { ...CATALOGO_FESTIVOS_COLOMBIA };

  /** RF-075 / AC-034. */
  async consultarPaciente(cedula: string): Promise<PacienteSimulado | null> {
    return this.pacientes.find((p) => p.cedula === cedula) ?? null;
  }

  /** RF-076 / AC-035, AC-044. */
  async consultarFormula(numeroPrescripcion: string): Promise<FormulaSimulada | null> {
    return this.formulas.find((f) => f.numero === numeroPrescripcion) ?? null;
  }

  /** RF-077 / BR-026 / AC-036, AC-047, AC-048, AC-051, AC-053. */
  async verificarCoberturaPBS(medicamentoCodigo: string, autorizadoEnEps: boolean): Promise<ResultadoCobertura> {
    return verificarCoberturaPBSDominio(medicamentoCodigo, autorizadoEnEps, CATALOGO_COBERTURA_PBS);
  }

  /** RF-078 / AC-037. */
  async clasificarDiagnostico(codigoCie10: string): Promise<'cronico' | 'agudo'> {
    return clasificarDiagnosticoDominio(codigoCie10, CATALOGO_DIAGNOSTICOS_CRONICOS);
  }

  /** RF-084 / BR-027 / AC-043, AC-052 / CL-020 — `fecha` es el instante de la prevalidación. */
  async calcularDiaHabilSiguiente(fecha: Date): Promise<Date> {
    const fechaISO = fechaColombiaISO(fecha.getTime());
    const siguienteISO = calcularDiaHabilSiguienteDominio(fechaISO, this.catalogoFestivos);
    const [anio, mes, dia] = siguienteISO.split('-').map(Number);
    return new Date(Date.UTC(anio, mes - 1, dia));
  }

  /** RF-076 / BR-025 / AC-045, AC-046, AC-055 — vigencia frente a la fecha de prevalidación. */
  async evaluarVigenciaFormula(numeroPrescripcion: string, fecha: Date): Promise<boolean> {
    const formula = await this.consultarFormula(numeroPrescripcion);
    if (!formula) {
      throw new Error('formula_no_encontrada');
    }
    const fechaPrevalidacionISO = fechaColombiaISO(fecha.getTime());
    return esFormulaVigente(formula.vigenciaHasta, fechaPrevalidacionISO);
  }

  /** RNF-017 / E1 / AC-049 / DEC-P18 — el entorno de pruebas rechaza contactos fuera de la lista del equipo. */
  async validarDatosContactoPrueba(celular: string, correo?: string): Promise<boolean> {
    const celularAutorizado = CONTACTOS_AUTORIZADOS_PRUEBA.celulares.has(celular);
    const correoAutorizado = !correo || CONTACTOS_AUTORIZADOS_PRUEBA.correos.has(correo);
    return celularAutorizado && correoAutorizado;
  }

  /** RF-083 / RNF-018 / AC-054 / DEC-P51 — tras la revocación solo quedan tipo y fecha del evento. */
  async revocarConsentimientoEvento(eventoId: string): Promise<EventoPrevalidacion> {
    const evento = this.eventos.find((e) => e.id === eventoId);
    if (!evento) {
      throw new Error('evento_no_encontrado');
    }
    evento.pacienteCedula = undefined;
    evento.resultado = undefined;
    evento.novedades = undefined;
    return evento;
  }

  /** BR-025 / AC-056 — cada fórmula de prueba debe tener vigencia de 8 a 9 meses tras su prescripción. */
  async validarRangoVigenciaDatosPrueba(): Promise<boolean> {
    return this.formulas.every((f) => vigenciaDentroDeRangoDePrueba(f.fechaPrescripcion, f.vigenciaHasta));
  }

  // --- Mutación para pruebas (RF-082 / A1 / DEC-010 / DEC-P36): sin interfaz de producto ni rol nuevo. ---

  async establecerAfiliacion(cedula: string, activa: boolean): Promise<void> {
    const paciente = this.pacientes.find((p) => p.cedula === cedula);
    if (!paciente) {
      throw new Error('paciente_no_encontrado');
    }
    paciente.afiliacionActiva = activa;
  }

  async establecerVigenciaFormula(numeroPrescripcion: string, vigenciaHastaISO: string): Promise<void> {
    const formula = await this.consultarFormula(numeroPrescripcion);
    if (!formula) {
      throw new Error('formula_no_encontrada');
    }
    formula.vigenciaHasta = vigenciaHastaISO;
  }

  async establecerAutorizacion(numeroPrescripcion: string, medicamentoCodigo: string, autorizado: boolean): Promise<void> {
    const formula = await this.consultarFormula(numeroPrescripcion);
    const medicamento = formula?.medicamentos.find((m) => m.codigo === medicamentoCodigo);
    if (!medicamento) {
      throw new Error('medicamento_no_encontrado');
    }
    medicamento.autorizado = autorizado;
  }

  async cargarAnioFestivos(anio: number, fechasISO: string[]): Promise<void> {
    this.catalogoFestivos[anio] = fechasISO;
  }

  async quitarAnioFestivos(anio: number): Promise<void> {
    delete this.catalogoFestivos[anio];
  }
}
