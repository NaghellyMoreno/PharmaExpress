import { Injectable } from '@nestjs/common';

/**
 * Reloj del sistema. En desarrollo y pruebas se puede desplazar (POST /admin/reloj) para
 * demostrar recordatorios y expiraciones sin esperar. En producción siempre es la hora real.
 */
@Injectable()
export class RelojService {
  private desfaseMs = 0;
  ahora(): Date {
    return new Date(Date.now() + this.desfaseMs);
  }
  /** Convierte una hora simulada a hora real (para programar trabajos en la cola). */
  aReal(d: Date): Date {
    return new Date(d.getTime() - this.desfaseMs);
  }
  fijar(fecha: Date) {
    if (process.env.NODE_ENV === 'production') throw new Error('No disponible en producción');
    this.desfaseMs = fecha.getTime() - Date.now();
  }
  reiniciar() {
    this.desfaseMs = 0;
  }
}
