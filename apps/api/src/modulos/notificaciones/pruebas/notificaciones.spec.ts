/**
 * Pruebas unitarias — módulo `notificaciones` (plantillas fijas, skill `plantillas-sin-datos-de-salud`).
 *
 * No hay casos TC- diseñados formalmente por S2 para este módulo (sin LLM disponible
 * para ese paso); los oráculos citan directamente el texto de la skill y de SPEC-001/RF-004, RF-005.
 */

import { NotificacionesService, AdaptadorEnvio } from '../servicios/notificaciones.service';
import { renderizarPlantilla, sinDatosDeSalud, VariableNoPermitidaError } from '../dominio/plantillas';

function adaptadorEspía(): AdaptadorEnvio & { llamadas: { destino: string; texto: string }[] } {
  const llamadas: { destino: string; texto: string }[] = [];
  return {
    llamadas,
    async enviar(destino: string, texto: string) {
      llamadas.push({ destino, texto });
      return { ok: true };
    },
  };
}

describe('Módulo notificaciones — plantillas fijas', () => {
  it('RF-004: envía la plantilla de código de verificación por SMS con el código solicitado', async () => {
    const sms = adaptadorEspía();
    const correo = adaptadorEspía();
    const servicio = new NotificacionesService(sms, correo);

    const resultado = await servicio.enviar('sms', '3000000001', 'codigo_verificacion', { codigo: '548920' });

    expect(resultado.ok).toBe(true);
    expect(sms.llamadas[0].texto).toContain('548920');
    expect(correo.llamadas).toHaveLength(0);
  });

  it('RF-005: el mismo mensaje puede enviarse también por correo cuando existe', async () => {
    const sms = adaptadorEspía();
    const correo = adaptadorEspía();
    const servicio = new NotificacionesService(sms, correo);

    await servicio.enviar('correo', 'equipo1@pharmaexpress.test', 'codigo_verificacion', { codigo: '741203' });

    expect(correo.llamadas[0].texto).toContain('741203');
  });

  it('Plantilla «código inválido»: usa el texto fijo de la skill sin variables', async () => {
    expect(renderizarPlantilla('codigo_invalido')).toBe('El código no es válido o venció. Solicita uno nuevo.');
  });

  it('Plantilla «cambio en la prevalidación»: usa el texto fijo de la skill, sin mencionar medicamentos ni diagnósticos', async () => {
    const texto = renderizarPlantilla('cambio_prevalidacion');
    expect(texto).toBe('Hubo un cambio en tu solicitud. Revisa el detalle y el siguiente paso en la web.');
    expect(sinDatosDeSalud(texto)).toBe(true);
  });

  it('Ninguna plantilla renderizada contiene términos de datos de salud o identificación', () => {
    const textos = [
      renderizarPlantilla('cambio_prevalidacion'),
      renderizarPlantilla('error_generico'),
      renderizarPlantilla('codigo_invalido'),
      renderizarPlantilla('codigo_verificacion', { codigo: '123456' }),
    ];
    for (const texto of textos) {
      expect(sinDatosDeSalud(texto)).toBe(true);
    }
  });

  it('No se puede interpolar una variable fuera de las declaradas por la plantilla', () => {
    expect(() => renderizarPlantilla('codigo_invalido', { medicamento: 'FA-017' } as never)).toThrow(
      VariableNoPermitidaError,
    );
  });
});
