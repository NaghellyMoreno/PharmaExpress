import { DocumentoCargado } from '../api/tipos';
import { Alerta } from './ui/alerta';
import { Boton } from './ui/boton';
import { Tarjeta } from './ui/tarjeta';

interface Props {
  documento: DocumentoCargado;
  onConfirmar: () => Promise<void>;
  onRechazar: () => Promise<void>;
  enviando: boolean;
}

/** RF-030: el usuario solo confirma o rechaza la lectura; no se permite editar los campos leídos. */
export function VistaPreviaOcr({ documento, onConfirmar, onRechazar, enviando }: Props) {
  if (!documento.legible) {
    return (
      <Alerta tono="error" data-testid="alerta-documento-ilegible">
        No pudimos leer el documento. Si la fórmula es manuscrita, debes acudir a la atención
        presencial.
      </Alerta>
    );
  }

  return (
    <Tarjeta data-testid="vista-previa-ocr">
      <h3 className="mb-2 text-base font-medium">Verifica los datos leídos</h3>
      <dl className="mb-4 space-y-1 text-sm">
        {documento.numeroPrescripcion && (
          <div>
            <dt className="inline font-medium">Número de fórmula: </dt>
            <dd className="inline" data-testid="ocr-numero-prescripcion">
              {documento.numeroPrescripcion}
            </dd>
          </div>
        )}
        {documento.diagnostico && (
          <div>
            <dt className="inline font-medium">Diagnóstico: </dt>
            <dd className="inline">{documento.diagnostico}</dd>
          </div>
        )}
        {documento.medicamentos.length > 0 && (
          <div>
            <dt className="font-medium">Medicamentos leídos:</dt>
            <dd>
              <ul className="list-inside list-disc">
                {documento.medicamentos.map((medicamento) => (
                  <li key={medicamento}>{medicamento}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      <div className="flex gap-3">
        <Boton onClick={onConfirmar} disabled={enviando} data-testid="btn-confirmar-ocr">
          Confirmar datos
        </Boton>
        <Boton variante="secundario" onClick={onRechazar} disabled={enviando} data-testid="btn-rechazar-ocr">
          Rechazar lectura
        </Boton>
      </div>
    </Tarjeta>
  );
}
