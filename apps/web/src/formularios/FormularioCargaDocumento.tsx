import { useRef, useState } from 'react';
import { Boton } from '../componentes/ui/boton';

interface Props {
  etiqueta: string;
  testId: string;
  onSeleccionar: (archivo: File) => Promise<void>;
  enviando: boolean;
}

export function FormularioCargaDocumento({ etiqueta, testId, onSeleccionar, enviando }: Props) {
  const entradaRef = useRef<HTMLInputElement>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);

  async function manejarCambio() {
    const archivo = entradaRef.current?.files?.[0];
    if (!archivo) {
      return;
    }
    setNombreArchivo(archivo.name);
    await onSeleccionar(archivo);
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={testId} className="text-sm font-medium">
        {etiqueta}
      </label>
      <input
        ref={entradaRef}
        id={testId}
        data-testid={testId}
        type="file"
        accept="image/jpeg,image/png"
        disabled={enviando}
        onChange={manejarCambio}
        className="text-sm"
      />
      {nombreArchivo && <p className="text-sm text-muted-foreground">Archivo: {nombreArchivo}</p>}
      {enviando && <Boton disabled variante="secundario">Leyendo documento…</Boton>}
    </div>
  );
}
