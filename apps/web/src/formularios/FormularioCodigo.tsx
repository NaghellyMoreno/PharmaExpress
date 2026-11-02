import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Boton } from '../componentes/ui/boton';
import { Campo } from '../componentes/ui/campo';

const esquemaCodigo = z.object({
  codigo: z.string().regex(/^\d{6}$/, 'El código debe tener 6 dígitos.'),
});

type DatosCodigo = z.infer<typeof esquemaCodigo>;

interface Props {
  onEnviar: (codigo: string) => Promise<void>;
  enviando: boolean;
}

export function FormularioCodigo({ onEnviar, enviando }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosCodigo>({ resolver: zodResolver(esquemaCodigo) });

  return (
    <form
      data-testid="formulario-codigo"
      onSubmit={handleSubmit((datos) => onEnviar(datos.codigo))}
      className="flex flex-col gap-4"
    >
      <Campo
        etiqueta="Código de verificación (6 dígitos)"
        data-testid="campo-codigo"
        inputMode="numeric"
        autoComplete="off"
        maxLength={6}
        error={errors.codigo?.message}
        {...register('codigo')}
      />
      <Boton type="submit" disabled={enviando} data-testid="btn-confirmar-codigo">
        {enviando ? 'Verificando…' : 'Confirmar código'}
      </Boton>
    </form>
  );
}
