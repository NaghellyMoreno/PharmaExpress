import { z } from 'zod';
import { DateTime } from 'luxon';

export const scheduleReminderDto = z.object({
  patientId: z.string().min(1),
  channel: z.enum(['SMS', 'EMAIL', 'PUSH']),
  kind: z.enum(['REMINDER_1H', 'REMINDER_DAY_BEFORE']),
  scheduledAt: DateTime.datetime({ zone: 'utc' }).transform((val) => val.toJSDate()),
  message: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
});

export type ScheduleReminderDto = z.infer<typeof scheduleReminderDto>;
