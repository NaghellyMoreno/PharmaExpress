/**
 * Puerta de entrada del módulo `simulacion` (única API que consumen los demás módulos).
 * Delega en `servicios/`. Un módulo ajeno nunca importa `servicios/simulacion.service.ts`
 * directamente (skill `nestjs-modulo-estandar`; ver H-006 de `qa/incidentes/INC-20261102-001-telegram-entradas.md`).
 */

import { Injectable } from '@nestjs/common';
import { SimulacionService } from '../servicios/simulacion.service';

@Injectable()
export class SimulacionApi {
  constructor(private readonly simulacion: SimulacionService) {}

  consultarPaciente(cedula: string) {
    return this.simulacion.consultarPaciente(cedula);
  }

  consultarFormula(numeroPrescripcion: string) {
    return this.simulacion.consultarFormula(numeroPrescripcion);
  }

  verificarCoberturaPBS(medicamentoCodigo: string, autorizadoEnEps: boolean) {
    return this.simulacion.verificarCoberturaPBS(medicamentoCodigo, autorizadoEnEps);
  }

  clasificarDiagnostico(codigoCie10: string) {
    return this.simulacion.clasificarDiagnostico(codigoCie10);
  }

  calcularDiaHabilSiguiente(fecha: Date) {
    return this.simulacion.calcularDiaHabilSiguiente(fecha);
  }

  evaluarVigenciaFormula(numeroPrescripcion: string, fecha: Date) {
    return this.simulacion.evaluarVigenciaFormula(numeroPrescripcion, fecha);
  }
}
