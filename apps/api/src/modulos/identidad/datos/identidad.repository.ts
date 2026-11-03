/**
 * Repositorio Prisma del módulo `identidad` (esquema `identidad` de Postgres — ARQ-005/COMP-004).
 * Un módulo solo accede a sus propios datos; los demás módulos usan la `api/` del módulo.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../comunes/prisma/prisma.service';
import { ContextoCodigoVigente } from '../dominio';
import { RegistroConsentimiento } from '../servicios/consentimiento.service';
import { RepositorioAutorizaciones, RepositorioCodigos, RepositorioConsentimientos } from './repositorios';

@Injectable()
export class IdentidadRepositorioConsentimientos implements RepositorioConsentimientos {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(solicitudId: string, registro: RegistroConsentimiento): Promise<void> {
    await this.prisma.consentimiento.create({
      data: { solicitudId, condicion: registro.condicion, fecha: registro.fecha, canal: registro.canal },
    });
  }
}

@Injectable()
export class IdentidadRepositorioCodigos implements RepositorioCodigos {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(clave: string, contexto: ContextoCodigoVigente): Promise<void> {
    await this.prisma.codigoVerificacion.upsert({
      where: { clave },
      create: {
        clave,
        codigo: contexto.codigo,
        emisionMs: BigInt(contexto.emisionMs),
        intentosFallidos: contexto.intentosFallidos,
        inactivo: contexto.inactivo,
      },
      update: {
        codigo: contexto.codigo,
        emisionMs: BigInt(contexto.emisionMs),
        intentosFallidos: contexto.intentosFallidos,
        inactivo: contexto.inactivo,
      },
    });
  }

  async obtener(clave: string): Promise<ContextoCodigoVigente | undefined> {
    const codigo = await this.prisma.codigoVerificacion.findUnique({ where: { clave } });
    if (!codigo) {
      return undefined;
    }
    return {
      codigo: codigo.codigo,
      emisionMs: Number(codigo.emisionMs),
      intentosFallidos: codigo.intentosFallidos,
      inactivo: codigo.inactivo,
    };
  }
}

@Injectable()
export class IdentidadRepositorioAutorizaciones implements RepositorioAutorizaciones {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(solicitudId: string, autorizada: boolean): Promise<void> {
    await this.prisma.autorizacionDatosSalud.upsert({
      where: { solicitudId },
      create: { solicitudId, autorizada },
      update: { autorizada },
    });
  }

  async obtener(solicitudId: string): Promise<boolean | undefined> {
    const registro = await this.prisma.autorizacionDatosSalud.findUnique({ where: { solicitudId } });
    return registro?.autorizada;
  }
}
