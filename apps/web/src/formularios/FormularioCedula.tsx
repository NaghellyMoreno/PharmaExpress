import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Boton } from '../componentes/ui/boton';
import { Campo } from '../componentes/ui/campo';

const esquemaCedula = z.object({
  cedula: z.string().min(1, 'Ingresa tu número de cédula.'),
});

type DatosCedula = z.infer<typeof esquemaCedula>;

interface Props {
  onEnviar: (cedula: string) => Promise<void>;
  enviando: boolean;
}

export function FormularioCedula({ onEnviar, enviando }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosCedula>({ resolver: zodResolver(esquemaCedula) });

  return (
    <form
      data-testid="formulario-cedula"
      onSubmit={handleSubmit((datos) => onEnviar(datos.cedula))}
      className="flex flex-col gap-4"
    >
      <Campo
        etiqueta="Número de cédula"
        data-testid="campo-cedula"
        autoComplete="off"
        error={errors.cedula?.message}
        {...register('cedula')}
      />
      <Boton type="submit" disabled={enviando} data-testid="btn-enviar-cedula">
        {enviando ? 'Enviando código…' : 'Enviar código de verificación'}
      </Boton>
    </form>
  );
}
