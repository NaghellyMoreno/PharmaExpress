import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RelojService } from './reloj.service';

/** Bitácora de trazabilidad y métricas (RNF-08, RNF-16, RF-84). Nunca guarda nombres de medicamentos. */
@Injectable()
export class EventosService {
  private log = new Logger('Eventos');
  constructor(private prisma: PrismaService, private reloj: RelojService) {}
  async registrar(tipo: string, detalle: Record<string, unknown> = {}) {
    this.log.log(`${tipo} ${JSON.stringify(detalle)}`);
    await this.prisma.evento.create({ data: { tipo, detalle: detalle as object, creadoEn: this.reloj.ahora() } });
  }
}
