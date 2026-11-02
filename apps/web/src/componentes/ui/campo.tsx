import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface PropiedadesCampo extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string;
  error?: string;
}

export const Campo = forwardRef<HTMLInputElement, PropiedadesCampo>(
  ({ etiqueta, error, id, className, ...props }, ref) => {
    const campoId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={campoId} className="text-sm font-medium">
          {etiqueta}
        </label>
        <input
          ref={ref}
          id={campoId}
          className={clsx(
            'rounded-md border border-border bg-background px-3 py-2 text-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            error && 'border-destructive',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${campoId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${campoId}-error`} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Campo.displayName = 'Campo';
