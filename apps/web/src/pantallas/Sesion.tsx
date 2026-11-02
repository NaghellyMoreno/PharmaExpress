import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aceptarAvisoPrivacidad, rechazarAvisoPrivacidad } from '../api/identidad';
import { confirmarVinculacion, solicitarCodigo } from '../api/canales';
import { ErrorApi } from '../api/cliente';
import { Alerta } from '../componentes/ui/alerta';
import { Boton } from '../componentes/ui/boton';
import { Tarjeta } from '../componentes/ui/tarjeta';
import { FormularioCedula } from '../formularios/FormularioCedula';
import { FormularioCodigo } from '../formularios/FormularioCodigo';
import { usarCanal } from '../hooks/usarCanal';

type Paso = 'aviso' | 'cedula' | 'codigo' | 'vinculado';

const MENSAJE_RECHAZO = 'No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.';

export default function Sesion() {
  const canalId = usarCanal();
  const navegar = useNavigate();
  const [paso, setPaso] = useState<Paso>('aviso');
  const [cedula, setCedula] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rechazado, setRechazado] = useState(false);

  async function manejarAceptarAviso() {
    setError(null);
    setEnviando(true);
    try {
      await aceptarAvisoPrivacidad(canalId, 'titular', 'web');
      setPaso('cedula');
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarRechazarAviso() {
    setEnviando(true);
    try {
      await rechazarAvisoPrivacidad(canalId);
      setRechazado(true);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarEnvioCedula(valorCedula: string) {
    setError(null);
    setEnviando(true);
    try {
      const respuesta = await solicitarCodigo(canalId, valorCedula);
      if (!respuesta.enviado) {
        setError('No encontramos esa cédula. Verifica el número e intenta de nuevo.');
        return;
      }
      setCedula(valorCedula);
      setPaso('codigo');
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarEnvioCodigo(codigo: string) {
    setError(null);
    setEnviando(true);
    try {
      const respuesta = await confirmarVinculacion(canalId, cedula, codigo);
      if (!respuesta.vinculado) {
        setError('El código no es válido o venció. Solicita uno nuevo.');
        return;
      }
      setPaso('vinculado');
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Pharma Express</h1>

      {error && (
        <Alerta tono="error" data-testid="alerta-error">
          {error}
        </Alerta>
      )}

      {paso === 'aviso' && !rechazado && (
        <Tarjeta data-testid="tarjeta-aviso-privacidad">
          <h2 className="mb-2 text-lg font-medium">Aviso de privacidad</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Antes de continuar, necesitamos tu autorización para el tratamiento de tus datos
            personales, de acuerdo con la Ley 1581 de 2012.
          </p>
          <div className="flex gap-3">
            <Boton onClick={manejarAceptarAviso} disabled={enviando} data-testid="btn-aceptar-aviso">
              Acepto
            </Boton>
            <Boton variante="secundario" onClick={manejarRechazarAviso} disabled={enviando} data-testid="btn-rechazar-aviso">
              No acepto
            </Boton>
          </div>
        </Tarjeta>
      )}

      {rechazado && (
        <Alerta tono="info" data-testid="alerta-rechazo">
          {MENSAJE_RECHAZO}
        </Alerta>
      )}

      {paso === 'cedula' && (
        <Tarjeta>
          <h2 className="mb-4 text-lg font-medium">Verifica tu identidad</h2>
          <FormularioCedula onEnviar={manejarEnvioCedula} enviando={enviando} />
        </Tarjeta>
      )}

      {paso === 'codigo' && (
        <Tarjeta>
          <h2 className="mb-2 text-lg font-medium">Ingresa el código</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Enviamos un código de verificación al celular (y correo, si existe) registrados.
          </p>
          <FormularioCodigo onEnviar={manejarEnvioCodigo} enviando={enviando} />
        </Tarjeta>
      )}

      {paso === 'vinculado' && (
        <Tarjeta data-testid="tarjeta-vinculado">
          <Alerta tono="exito">Tu identidad quedó verificada.</Alerta>
          <Boton
            className="mt-4"
            data-testid="btn-ir-prevalidacion"
            onClick={() => navegar(`/prevalidacion?canalId=${canalId}&cedula=${cedula}`)}
          >
            Continuar a la prevalidación
          </Boton>
        </Tarjeta>
      )}
    </main>
  );
}
