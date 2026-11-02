import { cliente } from './cliente';
import { DocumentoCargado, ReintentoOcrResultado, ResultadoPrevalidacion, TipoDocumento } from './tipos';

export function subirDocumento(
  tipo: TipoDocumento,
  archivo: File,
  canalId: string,
  cedula: string,
): Promise<DocumentoCargado> {
  const formulario = new FormData();
  formulario.set('tipo', tipo);
  formulario.set('canalId', canalId);
  formulario.set('cedula', cedula);
  formulario.set('archivo', archivo);
  return cliente.post('/prevalidacion/documentos', formulario);
}

export function confirmarDocumento(documentoId: string, accion: 'ACEPTAR' | 'RECHAZAR'): Promise<ReintentoOcrResultado> {
  return cliente.post(`/prevalidacion/documentos/${documentoId}/confirmar`, { accion });
}

export function finalizarSolicitud(canalId: string, cedula: string): Promise<ResultadoPrevalidacion> {
  return cliente.post('/prevalidacion/solicitudes/finalizar', { canalId, cedula });
}
