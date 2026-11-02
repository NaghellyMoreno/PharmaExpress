import { z } from 'zod';

export const createNotificationDto = z.object({
  patientId: z.string().min(1),
  channel: z.enum(['SMS', 'EMAIL', 'PUSH']),
  kind: z.enum(['REMINDER_1H', 'REMINDER_DAY_BEFORE', 'CANCELLATION', 'REVOCATION', 'EXPIRATION', 'CHANGE_STATUS']),
  message: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationDto>;
