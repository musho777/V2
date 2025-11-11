import { z } from 'zod';

export const createScheduleSchema = z.object({
  name: z
    .string()
    .min(1, 'Schedule name is required')
    .max(50, 'Name must be 50 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(250, 'Description must be 250 characters or less'),
  workingStatus: z.enum(['WORKING', 'DAY_OFF']),
  shiftStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  }),
  shiftEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  }),
  breakStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  }),
  breakEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  }),
  nightStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  }),
  nightEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  }),
  overtimeRate: z.number().min(0, 'Rate must be 0 or greater'),
  nightRate: z.number().min(0, 'Rate must be 0 or greater'),
  weekendRate: z.number().min(0, 'Rate must be 0 or greater'),
  holidayRate: z.number().min(0, 'Rate must be 0 or greater'),
});

export type CreateScheduleFormValues = z.infer<typeof createScheduleSchema>;
