import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Tono = 'info' | 'exito' | 'error';

interface PropiedadesAlerta extends HTMLAttributes<HTMLDivElement> {
  tono?: Tono;
}

const clasesPorTono: Record<Tono, string> = {
  info: 'border-border bg-muted text-foreground',
  exito: 'border-primary/30 bg-primary/10 text-primary',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
};

export function Alerta({ tono = 'info', className, role, ...props }: PropiedadesAlerta) {
  return (
    <div
      role={role ?? 'status'}
      aria-live="polite"
      className={clsx('rounded-md border px-4 py-3 text-sm', clasesPorTono[tono], className)}
      {...props}
    />
  );
}
