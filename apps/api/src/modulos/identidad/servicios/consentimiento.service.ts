/**
 * Servicio de consentimiento — módulo identidad (SPEC-001 / RF-001…RF-003, BR-001, AC-001…AC-006, TC-001…TC-003).
 */

import { Inject, Injectable, Optional } from '@nestjs/common';
import { puedeSolicitarDato } from '../dominio';
import {
  REPO_CONSENTIMIENTOS,
  RepositorioConsentimientos,
  RepositorioConsentimientosEnMemoria,
} from '../datos/repositorios';

/** Plantilla fija: no incluye datos de salud, medicamentos ni diagnósticos. (skill: plantillas-sin-datos-de-salud) */
const PLANTILLA_ATENCION_PRESENCIAL =
  'No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.';

export interface RegistroConsentimiento {
  condicion: string;
  fecha: string;
  canal: string;
  cedula?: string;
  nombre?: string;
}

@Injectable()
export class ConsentimientoService {
  constructor(
    @Optional()
    @Inject(REPO_CONSENTIMIENTOS)
    private readonly repositorio: RepositorioConsentimientos = new RepositorioConsentimientosEnMemoria(),
  ) {}

  /** BR-001 / RF-003 / AC-002 / TC-002 — sin aceptación no se registra nada; se informa la atención presencial. */
  async rechazar(solicitudId: string): Promise<{ registrado: boolean; atencionPresencial: string }> {
    return { registrado: false, atencionPresencial: PLANTILLA_ATENCION_PRESENCIAL };
  }

  /** DEC-03 / RF-002 / AC-006 / TC-003 — se registra titular o tercero con fecha, hora y canal. */
  async aceptar(
    solicitudId: string,
    condicion: string,
    fecha: string,
    canal: string,
  ): Promise<RegistroConsentimiento> {
    // El tercero no aporta cédula ni nombre (RF-002 / DEC-03).
    const registro: RegistroConsentimiento = { condicion, fecha, canal, cedula: undefined, nombre: undefined };
    await this.repositorio.guardar(solicitudId, registro);
    return registro;
  }

  async aceptarTercero(
    solicitudId: string,
    condicion: string,
    fecha: string,
    canal: string,
  ): Promise<RegistroConsentimiento> {
    return this.aceptar(solicitudId, condicion, fecha, canal);
  }

  puedeSolicitarDato(consentimientoAceptado: boolean): boolean {
    return puedeSolicitarDato(consentimientoAceptado);
  }

  // Los métodos siguientes cubren TC-001, TC-003, TC-004, TC-005, TC-006, TC-009…TC-020
  // de `apps/api/src/modulos/identidad/pruebas/consentimiento-identidad.spec.ts` contra una
  // fachada única del módulo `identidad`. Están pendientes de implementación (B1): los
  // servicios reales ya existen por separado (VerificacionIdentidadService,
  // AutorizacionDatosSaludService, RevocacionService) mientras el equipo decide si esta
  // fachada los reemplaza o los delega.
  async verificarAvisoPrevio(cedula: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async registrarRechazoAviso(canal: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async solicitarNuevoCodigo(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async verificarIdentidad(cedula: string, codigo: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async verificarAutorizacionSalud(cedula: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async registrarAceptacionTercero(canal: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async revocarConsentimiento(cedula: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async revocarConsentimientoConReservas(cedula: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async validarVigenciaCodigo(codigo: string, fechaEmision: Date): Promise<unknown> {
    throw new Error('No implementado');
  }

  async intentarVerificacionCodigo(cedula: string, codigo: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async agotarIntentosCodigo(cedula: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async consultarCedulaEPS(cedula: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async enviarCodigoConFalloSimulado(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async validarTopeEnvios(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async renovarCodigoBajoTope(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async manejarTopeConCodigoVigente(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async registrarEnvioFallidoTotal(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async contarEnvioMultipleCanales(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }

  async manejarEnvioParcialCanales(celular: string): Promise<unknown> {
    throw new Error('No implementado');
  }
}
