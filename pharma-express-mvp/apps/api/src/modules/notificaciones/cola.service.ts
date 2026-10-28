import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import PgBoss from 'pg-boss';
import { RelojService } from '../../common/reloj.service';

export const COLAS = ['recordatorio-noche', 'recordatorio-hora', 'expirar-cita', 'revalidacion-48h', 'aviso-proxima-entrega'] as const;
export type NombreCola = (typeof COLAS)[number];

/** Tareas programadas guardadas en el mismo PostgreSQL (pg-boss). */
@Injectable()
export class ColaService implements OnModuleInit, OnModuleDestroy {
  private boss = new PgBoss({ connectionString: process.env.DATABASE_URL! });
  private log = new Logger('Cola');
  private listo: Promise<void>;
  private resolver!: () => void;

  constructor(private reloj: RelojService) {
    this.listo = new Promise((r) => (this.resolver = r));
  }

  async onModuleInit() {
    this.boss.on('error', (e) => this.log.error(e));
    await this.boss.start();
    for (const c of COLAS) await this.boss.createQueue(c);
    this.resolver();
  }
  async onModuleDestroy() {
    await this.boss.stop({ graceful: true });
  }

  /** `cuando` está en hora del sistema (posiblemente desplazada en desarrollo). */
  async programar(cola: NombreCola, datos: object, cuando: Date) {
    await this.listo;
    const real = this.reloj.aReal(cuando);
    await this.boss.send(cola, datos, { startAfter: real < new Date() ? new Date() : real });
  }

  async atender<T extends object>(cola: NombreCola, manejador: (datos: T) => Promise<void>) {
    await this.listo;
    await this.boss.work<T>(cola, async (trabajos) => {
      for (const t of trabajos) await manejador(t.data);
    });
  }
}
