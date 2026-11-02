import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { autorizarDatosSalud } from '../api/identidad';
import { ErrorApi } from '../api/cliente';
import { confirmarDocumento, finalizarSolicitud, subirDocumento } from '../api/prevalidacion';
import { DocumentoCargado, ResultadoPrevalidacion } from '../api/tipos';
import { Alerta } from '../componentes/ui/alerta';
import { Boton } from '../componentes/ui/boton';
import { Tarjeta } from '../componentes/ui/tarjeta';
import { VistaPreviaOcr } from '../componentes/VistaPreviaOcr';
import { FormularioCargaDocumento } from '../formularios/FormularioCargaDocumento';

type EstadoDocumento = 'pendiente' | 'confirmado';

const LEYENDA_RESULTADO_PRELIMINAR =
  'Este resultado es preliminar. La validación oficial se realiza en el punto de dispensación por el personal farmacéutico.';

export default function Prevalidacion() {
  const [parametros] = useSearchParams();
  const canalId = parametros.get('canalId') ?? '';
  const cedula = parametros.get('cedula') ?? '';

  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [documentoFormula, setDocumentoFormula] = useState<DocumentoCargado | null>(null);
  const [estadoFormula, setEstadoFormula] = useState<EstadoDocumento>('pendiente');
  const [documentoHistoria, setDocumentoHistoria] = useState<DocumentoCargado | null>(null);
  const [estadoHistoria, setEstadoHistoria] = useState<EstadoDocumento>('pendiente');

  const [resultado, setResultado] = useState<ResultadoPrevalidacion | null>(null);

  if (!canalId || !cedula) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <Alerta tono="error">Primero verifica tu identidad en la pantalla de sesión.</Alerta>
      </main>
    );
  }

  async function manejarAutorizar() {
    setCargando(true);
    setError(null);
    try {
      await autorizarDatosSalud(`${canalId}:${cedula}`, true);
      setAutorizado(true);
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCargaFormula(archivo: File) {
    setCargando(true);
    setError(null);
    try {
      const documento = await subirDocumento('formula', archivo, canalId, cedula);
      setDocumentoFormula(documento);
      setEstadoFormula('pendiente');
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCargaHistoria(archivo: File) {
    setCargando(true);
    setError(null);
    try {
      const documento = await subirDocumento('historia', archivo, canalId, cedula);
      setDocumentoHistoria(documento);
      setEstadoHistoria('pendiente');
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setCargando(false);
    }
  }

  async function manejarConfirmarDocumento(
    documento: DocumentoCargado,
    marcarConfirmado: () => void,
    limpiarDocumento: () => void,
  ) {
    setCargando(true);
    setError(null);
    try {
      await confirmarDocumento(documento.documentoId, 'ACEPTAR');
      marcarConfirmado();
    } catch (e) {
      setError((e as ErrorApi).mensaje);
      limpiarDocumento();
    } finally {
      setCargando(false);
    }
  }

  async function manejarRechazarDocumento(documento: DocumentoCargado, limpiarDocumento: () => void) {
    setCargando(true);
    setError(null);
    try {
      const resultadoReintento = await confirmarDocumento(documento.documentoId, 'RECHAZAR');
      if (resultadoReintento.agotado) {
        setError('No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.');
      }
      limpiarDocumento();
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setCargando(false);
    }
  }

  async function manejarFinalizar() {
    setCargando(true);
    setError(null);
    try {
      const resultadoFinal = await finalizarSolicitud(canalId, cedula);
      setResultado(resultadoFinal);
    } catch (e) {
      setError((e as ErrorApi).mensaje);
    } finally {
      setCargando(false);
    }
  }

  const puedeFinalizar = estadoFormula === 'confirmado';

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Prevalidación</h1>

      {error && (
        <Alerta tono="error" data-testid="alerta-error">
          {error}
        </Alerta>
      )}

      {!autorizado && (
        <Tarjeta data-testid="tarjeta-autorizacion-datos-salud">
          <h2 className="mb-2 text-lg font-medium">Autorización de datos de salud</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Para cargar tus fórmulas e historia clínica necesitamos tu autorización separada
            para el tratamiento de datos de salud.
          </p>
          <Boton onClick={manejarAutorizar} disabled={cargando} data-testid="btn-autorizar-datos-salud">
            Autorizo el tratamiento de mis datos de salud
          </Boton>
        </Tarjeta>
      )}

      {autorizado && !resultado && (
        <>
          <Tarjeta>
            <h2 className="mb-3 text-lg font-medium">Fórmula médica</h2>
            {estadoFormula === 'confirmado' ? (
              <Alerta tono="exito">Fórmula confirmada.</Alerta>
            ) : documentoFormula ? (
              <VistaPreviaOcr
                documento={documentoFormula}
                enviando={cargando}
                onConfirmar={() =>
                  manejarConfirmarDocumento(documentoFormula, () => setEstadoFormula('confirmado'), () =>
                    setDocumentoFormula(null),
                  )
                }
                onRechazar={() => manejarRechazarDocumento(documentoFormula, () => setDocumentoFormula(null))}
              />
            ) : (
              <FormularioCargaDocumento
                etiqueta="Foto o PDF de la fórmula"
                testId="archivo-formula"
                onSeleccionar={manejarCargaFormula}
                enviando={cargando}
              />
            )}
          </Tarjeta>

          <Tarjeta>
            <h2 className="mb-3 text-lg font-medium">Historia clínica (opcional en esta demo)</h2>
            {estadoHistoria === 'confirmado' ? (
              <Alerta tono="exito">Historia clínica confirmada.</Alerta>
            ) : documentoHistoria ? (
              <VistaPreviaOcr
                documento={documentoHistoria}
                enviando={cargando}
                onConfirmar={() =>
                  manejarConfirmarDocumento(documentoHistoria, () => setEstadoHistoria('confirmado'), () =>
                    setDocumentoHistoria(null),
                  )
                }
                onRechazar={() => manejarRechazarDocumento(documentoHistoria, () => setDocumentoHistoria(null))}
              />
            ) : (
              <FormularioCargaDocumento
                etiqueta="Foto o PDF de la historia clínica"
                testId="archivo-historia"
                onSeleccionar={manejarCargaHistoria}
                enviando={cargando}
              />
            )}
          </Tarjeta>

          <Boton onClick={manejarFinalizar} disabled={!puedeFinalizar || cargando} data-testid="btn-finalizar-solicitud">
            Ver resultado preliminar
          </Boton>
        </>
      )}

      {resultado && (
        <Tarjeta data-testid="tarjeta-resultado">
          <h2 className="mb-3 text-lg font-medium">Resultado preliminar</h2>
          {resultado.resultados.map((formula) => (
            <Alerta
              key={formula.numeroPrescripcion}
              tono={formula.apta ? 'exito' : 'error'}
              className="mb-2"
              data-testid={`resultado-${formula.numeroPrescripcion}`}
            >
              <p className="font-medium">{formula.apta ? 'Apta' : 'No apta'}</p>
              <p>{formula.motivo}</p>
              <p className="text-xs">{formula.siguientePaso}</p>
            </Alerta>
          ))}
          <p className="mt-2 text-xs text-muted-foreground">{LEYENDA_RESULTADO_PRELIMINAR}</p>
        </Tarjeta>
      )}
    </main>
  );
}
