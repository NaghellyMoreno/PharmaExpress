import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Tarjeta({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-lg border border-border bg-background p-6 shadow-sm', className)}
      {...props}
    />
  );
}
