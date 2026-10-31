/**
 * Repositorio Prisma del módulo `identidad` (esquema PostgreSQL del módulo).
 * Un módulo solo accede a sus propios datos; los demás módulos usan la `api/` del módulo.
 */

export class IdentidadRepository {
  constructor(protected readonly prisma: unknown) {}
}
