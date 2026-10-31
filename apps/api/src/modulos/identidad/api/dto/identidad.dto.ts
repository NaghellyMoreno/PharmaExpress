/**
 * DTOs + validación Zod en el borde del módulo `identidad` (skill: `formularios-rhf-zod` aplica en B3).
 */

import { z } from 'zod';

export const AceptarAvisoDto = z.object({
  solicitudId: z.string().min(1),
  condicion: z.enum(['titular', 'tercero']),
  fecha: z.string().datetime(),
  canal: z.enum(['web', 'telegram']),
});

export const VerificarCodigoDto = z.object({
  solicitudId: z.string().min(1),
  cédula: z.string().regex(/^\d{1,2}(\.\d{3}){2}-\d$/),
  codigo: z.string().regex(/^\d{6}$/),
  fechaMs: z.number().int(),
});

export const SolicitarCodigoDto = z.object({
  solicitudId: z.string().min(1),
  cédula: z.string().regex(/^\d{1,2}(\.\d{3}){2}-\d$/),
});

export type AceptarAvisoDto = z.infer<typeof AceptarAvisoDto>;
export type VerificarCodigoDto = z.infer<typeof VerificarCodigoDto>;
export type SolicitarCodigoDto = z.infer<typeof SolicitarCodigoDto>;
