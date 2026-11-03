/**
 * Repositorio Prisma del módulo `canales` (esquema `canales` de Postgres — ARQ-005/COMP-004).
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../comunes/prisma/prisma.service';
import {
  RepositorioAvisosCanal,
  RepositorioIntentosArchivoChat,
  RepositorioVinculaciones,
  Vinculacion,
} from './repositorios';

@Injectable()
export class CanalesRepositorioVinculaciones implements RepositorioVinculaciones {
  constructor(private readonly prisma: PrismaService) {}

  async crear(vinculacion: Vinculacion): Promise<void> {
    await this.prisma.vinculacion.create({
      data: {
        canalId: vinculacion.canalId,
        pacienteCC: vinculacion.pacienteCC,
        fechaVinculacionISO: vinculacion.fechaVinculacionISO,
        avisoPrivacidadAceptado: vinculacion.avisoPrivacidadAceptado,
        autorizacionDatosSalud: vinculacion.autorizacionDatosSalud,
        revocada: false,
      },
    });
  }

  async buscarActiva(canalId: string, pacienteCC: string): Promise<Vinculacion | undefined> {
    const registro = await this.prisma.vinculacion.findFirst({
      where: { canalId, pacienteCC, revocada: false },
      orderBy: { createdAt: 'desc' },
    });
    return registro ?? undefined;
  }

  async listarActivasPorCanal(canalId: string): Promise<Vinculacion[]> {
    return this.prisma.vinculacion.findMany({ where: { canalId, revocada: false } });
  }

  async actualizarFecha(canalId: string, pacienteCC: string, fechaVinculacionISO: string): Promise<void> {
    const registro = await this.buscarActiva(canalId, pacienteCC);
    if (!registro) {
      return;
    }
    await this.prisma.vinculacion.updateMany({
      where: { canalId, pacienteCC, revocada: false },
      data: { fechaVinculacionISO },
    });
  }

  async eliminar(canalId: string, pacienteCC: string): Promise<void> {
    await this.prisma.vinculacion.deleteMany({ where: { canalId, pacienteCC } });
  }

  async marcarRevocada(canalId: string, pacienteCC: string): Promise<void> {
    await this.prisma.vinculacion.updateMany({ where: { canalId, pacienteCC, revocada: false }, data: { revocada: true } });
  }
}

@Injectable()
export class CanalesRepositorioAvisos implements RepositorioAvisosCanal {
  constructor(private readonly prisma: PrismaService) {}

  async marcarAceptado(canalId: string, pacienteCC: string): Promise<void> {
    const clave = `${canalId}:${pacienteCC}`;
    await this.prisma.avisoPrivacidadCanal.upsert({
      where: { clave },
      create: { clave, aceptado: true },
      update: { aceptado: true },
    });
  }

  async fueAceptado(canalId: string, pacienteCC: string): Promise<boolean> {
    const clave = `${canalId}:${pacienteCC}`;
    const registro = await this.prisma.avisoPrivacidadCanal.findUnique({ where: { clave } });
    return registro?.aceptado === true;
  }
}

@Injectable()
export class CanalesRepositorioIntentosArchivoChat implements RepositorioIntentosArchivoChat {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(canalId: string, fecha: string): Promise<void> {
    await this.prisma.intentoArchivoChat.create({ data: { canalId, fecha } });
  }

  async contarPorCanal(canalId: string): Promise<number> {
    return this.prisma.intentoArchivoChat.count({ where: { canalId } });
  }
}
