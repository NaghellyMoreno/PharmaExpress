/**
 * Interfaces de persistencia del módulo `canales` + implementación en memoria (por defecto,
 * para pruebas unitarias sin Docker). La implementación real contra Postgres vía Prisma vive
 * en `canales.repository.ts` y solo se usa en producción y en pruebas de integración.
 *
 * El código de revalidación (vigente ~10 min) se mantiene en memoria del proceso a propósito:
 * si el servidor se reinicia, el usuario simplemente pide un código nuevo (RF-015).
 */

export const REPO_VINCULACIONES = Symbol('REPO_VINCULACIONES');
export const REPO_AVISOS_CANAL = Symbol('REPO_AVISOS_CANAL');
export const REPO_INTENTOS_ARCHIVO_CHAT = Symbol('REPO_INTENTOS_ARCHIVO_CHAT');

export interface Vinculacion {
  canalId: string;
  pacienteCC: string;
  fechaVinculacionISO: string;
  avisoPrivacidadAceptado: boolean;
  autorizacionDatosSalud: boolean;
  revocada: boolean;
}

export interface RepositorioVinculaciones {
  crear(vinculacion: Vinculacion): Promise<void>;
  buscarActiva(canalId: string, pacienteCC: string): Promise<Vinculacion | undefined>;
  listarActivasPorCanal(canalId: string): Promise<Vinculacion[]>;
  actualizarFecha(canalId: string, pacienteCC: string, fechaVinculacionISO: string): Promise<void>;
  eliminar(canalId: string, pacienteCC: string): Promise<void>;
  marcarRevocada(canalId: string, pacienteCC: string): Promise<void>;
}

export interface RepositorioAvisosCanal {
  marcarAceptado(canalId: string, pacienteCC: string): Promise<void>;
  fueAceptado(canalId: string, pacienteCC: string): Promise<boolean>;
}

export interface RepositorioIntentosArchivoChat {
  registrar(canalId: string, fecha: string): Promise<void>;
  contarPorCanal(canalId: string): Promise<number>;
}

function clave(canalId: string, pacienteCC: string): string {
  return `${canalId}:${pacienteCC}`;
}

export class RepositorioVinculacionesEnMemoria implements RepositorioVinculaciones {
  private readonly vinculaciones: Vinculacion[] = [];

  async crear(vinculacion: Vinculacion): Promise<void> {
    this.vinculaciones.push({ ...vinculacion });
  }

  async buscarActiva(canalId: string, pacienteCC: string): Promise<Vinculacion | undefined> {
    return this.vinculaciones.find((v) => v.canalId === canalId && v.pacienteCC === pacienteCC && !v.revocada);
  }

  async listarActivasPorCanal(canalId: string): Promise<Vinculacion[]> {
    return this.vinculaciones.filter((v) => v.canalId === canalId && !v.revocada);
  }

  async actualizarFecha(canalId: string, pacienteCC: string, fechaVinculacionISO: string): Promise<void> {
    const vinculacion = await this.buscarActiva(canalId, pacienteCC);
    if (vinculacion) {
      vinculacion.fechaVinculacionISO = fechaVinculacionISO;
    }
  }

  async eliminar(canalId: string, pacienteCC: string): Promise<void> {
    const indice = this.vinculaciones.findIndex((v) => v.canalId === canalId && v.pacienteCC === pacienteCC);
    if (indice !== -1) {
      this.vinculaciones.splice(indice, 1);
    }
  }

  async marcarRevocada(canalId: string, pacienteCC: string): Promise<void> {
    const vinculacion = await this.buscarActiva(canalId, pacienteCC);
    if (vinculacion) {
      vinculacion.revocada = true;
    }
  }
}

export class RepositorioAvisosCanalEnMemoria implements RepositorioAvisosCanal {
  private readonly aceptados = new Set<string>();

  async marcarAceptado(canalId: string, pacienteCC: string): Promise<void> {
    this.aceptados.add(clave(canalId, pacienteCC));
  }

  async fueAceptado(canalId: string, pacienteCC: string): Promise<boolean> {
    return this.aceptados.has(clave(canalId, pacienteCC));
  }
}

export class RepositorioIntentosArchivoChatEnMemoria implements RepositorioIntentosArchivoChat {
  private readonly intentos: { canalId: string; fecha: string }[] = [];

  async registrar(canalId: string, fecha: string): Promise<void> {
    this.intentos.push({ canalId, fecha });
  }

  async contarPorCanal(canalId: string): Promise<number> {
    return this.intentos.filter((i) => i.canalId === canalId).length;
  }
}
