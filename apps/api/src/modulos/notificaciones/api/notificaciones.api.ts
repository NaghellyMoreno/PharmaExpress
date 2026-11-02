/**
 * Puerta de entrada del módulo `notificaciones` (única API que consumen los demás módulos).
 */

import { Injectable } from '@nestjs/common';
import { PlantillaId } from '../dominio/plantillas';
import { NotificacionesService, ResultadoEnvio } from '../servicios/notificaciones.service';

@Injectable()
export class NotificacionesApi {
  constructor(private readonly notificaciones: NotificacionesService) {}

  enviar(
    canal: 'sms' | 'correo',
    destino: string,
    plantillaId: PlantillaId,
    variables?: Readonly<Record<string, string>>,
  ): Promise<ResultadoEnvio> {
    return this.notificaciones.enviar(canal, destino, plantillaId, variables);
  }
}
