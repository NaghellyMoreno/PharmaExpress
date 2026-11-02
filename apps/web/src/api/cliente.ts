/**
 * Instancia base del cliente de la API (skill `cliente-api-tipado`).
 * Nada de `fetch` suelto en pantallas o componentes: todo pasa por aquí.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface ErrorApi {
  codigo: string;
  mensaje: string;
}

async function solicitar<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    ...opciones,
    credentials: 'include',
    headers:
      opciones.body instanceof FormData
        ? opciones.headers
        : { 'Content-Type': 'application/json', ...opciones.headers },
  });

  if (!respuesta.ok) {
    let mensaje = 'No pudimos completar la operación. Intenta de nuevo o acude a la atención presencial.';
    try {
      const cuerpo = await respuesta.json();
      if (typeof cuerpo?.message === 'string') {
        mensaje = cuerpo.message;
      }
    } catch {
      // Respuesta sin cuerpo JSON: se mantiene el mensaje genérico.
    }
    const error: ErrorApi = { codigo: String(respuesta.status), mensaje };
    throw error;
  }

  return (await respuesta.json()) as T;
}

export const cliente = {
  get: <T>(ruta: string) => solicitar<T>(ruta, { method: 'GET' }),
  post: <T>(ruta: string, cuerpo?: unknown) =>
    solicitar<T>(ruta, {
      method: 'POST',
      body: cuerpo instanceof FormData ? cuerpo : cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    }),
};
