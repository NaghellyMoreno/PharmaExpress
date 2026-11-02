/**
 * Servicio del módulo `notificaciones` — envío de mensajes de plantilla fija (SPEC-001 / RF-004, RF-005).
 *
 * El envío real a los planes de prueba de Twilio (SMS) y Resend (correo) vía `pg-boss`
 * (ARQ-005/COMP-006) es un paso de integración posterior: aquí se usa un adaptador simulado
 * mientras no haya credenciales de esos planes de prueba en este entorno.
 */

import { Injectable, Optional } from '@nestjs/common';
import { PlantillaId, renderizarPlantilla, sinDatosDeSalud } from '../dominio/plantillas';

export interface AdaptadorEnvio {
  enviar(destino: string, texto: string): Promise<{ ok: boolean }>;
}

/**
 * Adaptador de respaldo: no hace red real. Mientras no haya credenciales de los planes de
 * prueba (Twilio/Resend), imprime el mensaje en la consola del servidor de desarrollo para
 * poder verificar el flujo manualmente; nunca se usa así en producción.
 */
export class AdaptadorEnvioSimulado implements AdaptadorEnvio {
  async enviar(destino: string, texto: string): Promise<{ ok: boolean }> {
    // eslint-disable-next-line no-console
    console.log(`[notificaciones:simulado] → ${destino}: ${texto}`);
    return { ok: true };
  }
}

export interface ResultadoEnvio {
  ok: boolean;
  plantillaId: PlantillaId;
}

@Injectable()
export class NotificacionesService {
  constructor(
    @Optional() private readonly smsAdaptador: AdaptadorEnvio = new AdaptadorEnvioSimulado(),
    @Optional() private readonly correoAdaptador: AdaptadorEnvio = new AdaptadorEnvioSimulado(),
  ) {}

  /** RF-004 / RF-005 — renderiza la plantilla fija, verifica que no lleve datos de salud y la envía. */
  async enviar(
    canal: 'sms' | 'correo',
    destino: string,
    plantillaId: PlantillaId,
    variables: Readonly<Record<string, string>> = {},
  ): Promise<ResultadoEnvio> {
    const texto = renderizarPlantilla(plantillaId, variables);
    if (!sinDatosDeSalud(texto)) {
      // No debería ocurrir con el catálogo fijo; es una defensa, no una ruta esperada.
      throw new Error('plantilla_con_datos_de_salud');
    }
    const adaptador = canal === 'sms' ? this.smsAdaptador : this.correoAdaptador;
    const resultado = await adaptador.enviar(destino, texto);
    return { ok: resultado.ok, plantillaId };
  }
}
