/**
 * Interfaces de persistencia del módulo `identidad` + implementación en memoria (por defecto,
 * para pruebas unitarias sin Docker — skill `plantilla-jest-nestjs`). La implementación real
 * contra Postgres vía Prisma vive en `identidad.repository.ts` y solo se usa en producción y
 * en las pruebas de integración (con Testcontainers).
 */

import { ContextoCodigoVigente } from '../dominio';
import { RegistroConsentimiento } from '../servicios/consentimiento.service';

// Tokens de inyección (las interfaces se borran en tiempo de ejecución; NestJS necesita un
// token explícito para resolver la implementación real — Prisma en producción, en memoria
// por defecto en pruebas unitarias sin Docker).
export const REPO_CONSENTIMIENTOS = Symbol('REPO_CONSENTIMIENTOS');
export const REPO_CODIGOS = Symbol('REPO_CODIGOS');
export const REPO_AUTORIZACIONES = Symbol('REPO_AUTORIZACIONES');

export interface RepositorioConsentimientos {
  guardar(solicitudId: string, registro: RegistroConsentimiento): Promise<void>;
}

export interface RepositorioCodigos {
  guardar(clave: string, contexto: ContextoCodigoVigente): Promise<void>;
  obtener(clave: string): Promise<ContextoCodigoVigente | undefined>;
}

export interface RepositorioAutorizaciones {
  guardar(solicitudId: string, autorizada: boolean): Promise<void>;
  obtener(solicitudId: string): Promise<boolean | undefined>;
}

export class RepositorioConsentimientosEnMemoria implements RepositorioConsentimientos {
  private readonly registros: (RegistroConsentimiento & { solicitudId: string })[] = [];

  async guardar(solicitudId: string, registro: RegistroConsentimiento): Promise<void> {
    this.registros.push({ solicitudId, ...registro });
  }
}

export class RepositorioCodigosEnMemoria implements RepositorioCodigos {
  private readonly estados = new Map<string, ContextoCodigoVigente>();

  async guardar(clave: string, contexto: ContextoCodigoVigente): Promise<void> {
    this.estados.set(clave, contexto);
  }

  async obtener(clave: string): Promise<ContextoCodigoVigente | undefined> {
    return this.estados.get(clave);
  }
}

export class RepositorioAutorizacionesEnMemoria implements RepositorioAutorizaciones {
  private readonly autorizaciones = new Map<string, boolean>();

  async guardar(solicitudId: string, autorizada: boolean): Promise<void> {
    this.autorizaciones.set(solicitudId, autorizada);
  }

  async obtener(solicitudId: string): Promise<boolean | undefined> {
    return this.autorizaciones.get(solicitudId);
  }
}
