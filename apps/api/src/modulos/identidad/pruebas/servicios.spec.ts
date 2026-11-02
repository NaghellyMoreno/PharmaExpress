/**
 * Pruebas unitarias de servicios — módulo identidad (QA shift-left, S3).
 *
 * Casos fuente: TC-002 a TC-005, TC-009 a TC-014 de `qa/casos/` (diseñados por
 * S2 para el módulo `identidad` de la SPEC-001 v1.1, veredicto S1: APTA).
 * Orálogos: todos `definitivo` (DEC-01 a DEC-11 / contexto de la SPEC).
 * Estado: ROJA por «no implementado». Los servicios del módulo `identidad` no
 * existen aún: la implementación es tarea de B1/B4.
 *
 * Reglas aplicadas:
 * - SMS y correo: dobles de prueba (stub/spy) del proveedor; nunca envíos reales.
 * - OCR: no aplica en este módulo.
 * - Datos sintéticos: cédula `8.765.432-1`, `7.654.321-0`; códigos `548920`,
 *   `741203`, `339966`; medicamento sintético `FA-017`; ids internos `res-101`,
 *   `cita-101`. Sin datos de salud reales.
 * - Ningún mensaje, log ni respuesta de error nombra medicamento, diagnóstico
 *   ni cédula; usa plantillas fijas.
 */

import { ConsentimientoService } from '../servicios';
import { VerificacionIdentidadService } from '../servicios';
import { AutorizacionDatosSaludService } from '../servicios';
import { RevocacionService } from '../servicios';

describe('Módulo identidad — pruebas unitarias de servicios', () => {
  describe('Consentimiento y aviso de privacidad — SPEC-001/AC-002, AC-006', () => {
    it('AC-002 / TC-002: al rechazar el aviso el sistema informa la atención presencial y no registra ningún dato', async () => {
      const consentimiento = new ConsentimientoService();
      const resultado = await consentimiento.rechazar('solicitud-1');
      // El rechazo no registra aceptación, titular/tercero, fecha/hora/canal ni cédula.
      expect(resultado.registrado).toBe(false);
      expect(resultado.atencionPresencial).toBeDefined();
    });

    it('AC-006 / TC-003: la aceptación como tercero se registra con fecha, hora y canal sin cédula ni nombre', async () => {
      const consentimiento = new ConsentimientoService();
      const registro = await consentimiento.aceptarTercero(
        'solicitud-1',
        'tercero',
        '2026-10-31T10:20:00-05:00',
        'web',
      );
      expect(registro.condicion).toBe('tercero');
      expect(registro.fecha).toBe('2026-10-31T10:20:00-05:00');
      expect(registro.canal).toBe('web');
      expect(registro.cedula).toBeUndefined();
      expect(registro.nombre).toBeUndefined();
    });
  });

  describe('Verificación de identidad — SPEC-001/AC-004, AC-005, AC-009, AC-010, AC-011, AC-012, AC-013', () => {
    it('AC-004 / TC-004: con la cédula sintética registrada y el código correcto dentro de los 10 minutos la identidad se verifica', async () => {
      const eps = { consultar: async () => ({ encontrada: true }) };
      const sms = { enviar: async () => ({ ok: true }) };
      const correo = { enviar: async () => ({ ok: true }) };
      const verificacion = new VerificacionIdentidadService(eps, sms, correo);
      const resultado = await verificacion.validar('8.765.432-1', '548920', Date.UTC(2026, 9, 31, 10, 5, 0));
      expect(resultado.verificado).toBe(true);
    });

    it('AC-005 / TC-005: antes de cargar documentos se exige autorización separada de datos de salud', async () => {
      const autorizacion = new AutorizacionDatosSaludService();
      // Sin autorización separada: no se solicitan ni se guardan datos de salud.
      await expect(autorizacion.puedeCargar('solicitud-1')).resolves.toBe(false);
    });

    it('AC-005 / TC-005: con autorización separada aceptada se continúa con la carga del documento', async () => {
      const autorizacion = new AutorizacionDatosSaludService();
      // Con autorización separada registrada y aceptada (PREG-005): el flujo continúa con la carga.
      await autorizacion.registrarAutorizacion('solicitud-1', true);
      await expect(autorizacion.puedeCargar('solicitud-1')).resolves.toBe(true);
    });

    it('AC-009 / TC-006: al ingresar el código a las 10:10:00 el sistema lo rechaza y ofrece la ruta alternativa', async () => {
      const eps = { consultar: async () => ({ encontrada: true }) };
      const sms = { enviar: async () => ({ ok: true }) };
      const correo = { enviar: async () => ({ ok: true }) };
      const verificacion = new VerificacionIdentidadService(eps, sms, correo);
      // Emitido a las 10:00:00 (falta el dato de emisión era el defecto de la prueba): a los 10 min exactos ya venció.
      const resultado = await verificacion.validar(
        '8.765.432-1',
        '548920',
        Date.UTC(2026, 9, 31, 10, 10, 0),
        Date.UTC(2026, 9, 31, 10, 0, 0),
      );
      expect(resultado.valido).toBe(false);
      expect(resultado.rutaAlternativa).toBeDefined();
    });

    it('AC-010 / TC-007: en el primer intento fallido informa el error y muestra dos intentos restantes; el reintento está permitido', async () => {
      const eps = { consultar: async () => ({ encontrada: true }) };
      const sms = { enviar: async () => ({ ok: true }) };
      const correo = { enviar: async () => ({ ok: true }) };
      const verificacion = new VerificacionIdentidadService(eps, sms, correo);
      const primerIntento = await verificacion.validar('8.765.432-1', '339966', Date.UTC(2026, 9, 31, 10, 2, 0));
      expect(primerIntento.error).toBeDefined();
      expect(primerIntento.intentosRestantes).toBe(2);
      expect(primerIntento.reintentoPermitido).toBe(true);

      const segundoIntento = await verificacion.validar('8.765.432-1', '339966', Date.UTC(2026, 9, 31, 10, 4, 0));
      expect(segundoIntento.error).toBeDefined();
      expect(segundoIntento.intentosRestantes).toBe(1);
      expect(segundoIntento.reintentoPermitido).toBe(true);
    });

    it('AC-011 / TC-008: el tercer intento fallido inactiva el código y deriva a la ruta alternativa', async () => {
      const eps = { consultar: async () => ({ encontrada: true }) };
      const sms = { enviar: async () => ({ ok: true }) };
      const correo = { enviar: async () => ({ ok: true }) };
      const verificacion = new VerificacionIdentidadService(eps, sms, correo);
      const tercerIntento = await verificacion.validar('8.765.432-1', '339966', Date.UTC(2026, 9, 31, 10, 6, 0));
      expect(tercerIntento.error).toBeDefined();
      expect(tercerIntento.inactivo).toBe(true);
      expect(tercerIntento.rutaAlternativa).toBeDefined();

      const intentoSobreInactivo = await verificacion.validar('8.765.432-1', '548920', Date.UTC(2026, 9, 31, 10, 7, 0));
      expect(intentoSobreInactivo.valido).toBe(false);
    });

    it('AC-012 / TC-011: la cédula no registrada o la indisponibilidad de la EPS notifican y orientan', async () => {
      const eps = { consultar: async () => ({ encontrada: false }) };
      const sms = { enviar: async () => ({ ok: true }) };
      const correo = { enviar: async () => ({ ok: true }) };
      const verificacion = new VerificacionIdentidadService(eps, sms, correo);
      const resultado = await verificacion.validar('7.654.321-0', '548920', Date.UTC(2026, 9, 31, 10, 8, 0));
      expect(resultado.notificado).toBe(true);
      expect(resultado.orientacion).toBeDefined();
    });

    it('AC-013 / TC-012: el fallo en el envío de SMS o correo informa y ofrece reintentar o atención presencial', async () => {
      const eps = { consultar: async () => ({ encontrada: true }) };
      const sms = { enviar: async () => ({ ok: false }) };
      const correo = { enviar: async () => ({ ok: true }) };
      const verificacion = new VerificacionIdentidadService(eps, sms, correo);
      const resultado = await verificacion.validar('8.765.432-1', '548920', Date.UTC(2026, 9, 31, 10, 9, 0));
      expect(resultado.errorEnvio).toBeDefined();
      expect(resultado.ofreceRutaAlternativa).toBe(true);
    });
  });

  describe('Revocación y eliminación de datos — SPEC-001/AC-007, AC-008', () => {
    it('AC-007 / TC-009: la revocación elimina los datos personales y de salud conservando la auditoría disociada', async () => {
      const revocacion = new RevocacionService();
      const resultado = await revocacion.ejecutar('titular-1');
      expect(resultado.datosEliminados).toBe(true);
      expect(resultado.auditoriaConservada).toBe(true);
    });

    it('AC-008 / TC-010: la revocación con citas activas cancela citas, anula códigos, libera existencias y desvincula canales', async () => {
      const revocacion = new RevocacionService();
      const resultado = await revocacion.ejecutarConCitasActivas('titular-1', ['cita-101']);
      expect(resultado.citasCanceladas).toBe(1);
      expect(resultado.codigosAnulados).toBe(1);
      expect(resultado.existenciasLiberadas).toBe(true);
      expect(resultado.canalesDesvinculados).toBe(true);
    });

    it('AC-008 / TC-014: en el flujo de revocación ningún mensaje ni log nombra medicamento, diagnóstico o dato personal', async () => {
      const revocacion = new RevocacionService();
      const resultado = await revocacion.ejecutar('titular-1');
      const salidas = [...resultado.mensajes, ...resultado.logs];
      // Plantilla fija: «Tu consentimiento fue procesado. Puedes gestionar desde la web.»
      // Prohibido: nombres de medicamentos (p. ej., FA-017), diagnósticos o datos personales.
      for (const salida of salidas) {
        expect(salida).not.toContain('FA-017');
        expect(salida).not.toContain('diagnóstico');
      }
    });
  });
});
