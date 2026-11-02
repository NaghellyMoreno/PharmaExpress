import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variante = 'primario' | 'secundario' | 'destructivo';

interface PropiedadesBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const clasesPorVariante: Record<Variante, string> = {
  primario: 'bg-primary text-primary-foreground hover:opacity-90',
  secundario: 'bg-muted text-foreground hover:bg-muted/80',
  destructivo: 'bg-destructive text-destructive-foreground hover:opacity-90',
};

export const Boton = forwardRef<HTMLButtonElement, PropiedadesBoton>(
  ({ variante = 'primario', className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        clasesPorVariante[variante],
        className,
      )}
      {...props}
    />
  ),
);
Boton.displayName = 'Boton';
