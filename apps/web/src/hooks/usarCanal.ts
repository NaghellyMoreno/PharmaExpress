/**
 * Identificador de canal (RNF-009: no prueba identidad, no es un dato sensible) persistido en
 * `localStorage` para mantener la sesión del navegador entre recargas. La cédula y cualquier
 * dato de salud viven solo en memoria (React state), nunca en almacenamiento del navegador.
 */

const CLAVE_CANAL_ID = 'pharma-express:canalId';

export function usarCanal(): string {
  try {
    const existente = localStorage.getItem(CLAVE_CANAL_ID);
    if (existente) {
      return existente;
    }
  } catch {
    // Almacenamiento no disponible (modo privado): se usa un canal solo para esta sesión en memoria.
  }
  const nuevo = crypto.randomUUID();
  try {
    localStorage.setItem(CLAVE_CANAL_ID, nuevo);
  } catch {
    // Ignorado: sin almacenamiento persistente, el canal solo vive mientras la pestaña esté abierta.
  }
  return nuevo;
}
