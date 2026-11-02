import { cliente } from './cliente';
import {
  AccesoMiniApp,
  ConfirmarRevalidacionRespuesta,
  ConfirmarVinculacionRespuesta,
  PacienteVinculado,
  SolicitarCodigoRespuesta,
} from './tipos';

export function solicitarCodigo(canalId: string, cedula: string): Promise<SolicitarCodigoRespuesta> {
  return cliente.post('/canales/codigo/solicitar', { canalId, cedula });
}

export function confirmarVinculacion(canalId: string, cedula: string, codigo: string): Promise<ConfirmarVinculacionRespuesta> {
  return cliente.post('/canales/vinculacion/confirmar', { canalId, cedula, codigo });
}

export function confirmarRevalidacion(canalId: string, cedula: string, codigo: string): Promise<ConfirmarRevalidacionRespuesta> {
  return cliente.post('/canales/revalidacion/confirmar', { canalId, cedula, codigo });
}

export function validarAcceso(canalId: string, cedula: string): Promise<AccesoMiniApp> {
  return cliente.get(`/canales/acceso/${canalId}/${cedula}`);
}

export function obtenerPacientesVinculados(canalId: string): Promise<PacienteVinculado[]> {
  return cliente.get(`/canales/pacientes/${canalId}`);
}
