import { z } from 'zod';

export const createAttendancePolicySchema = z.object({
  name: z
    .string()
    .min(1, 'Policy name is required')
    .max(50, 'Name must be 50 characters or less'),
  dailyAcceptableMinutes: z
    .number()
    .min(0, 'Minutes must be 0 or greater')
    .max(1440, 'Cannot exceed 1440 minutes (24 hours)'),
  dailyUnacceptableMinutes: z
    .number()
    .min(0, 'Minutes must be 0 or greater')
    .max(1440, 'Cannot exceed 1440 minutes (24 hours)'),
  monthlyAcceptableMinutes: z
    .number()
    .min(0, 'Minutes must be 0 or greater')
    .max(43200, 'Cannot exceed 43200 minutes (30 days)'),
  monthlyUnacceptableMinutes: z
    .number()
    .min(0, 'Minutes must be 0 or greater')
    .max(43200, 'Cannot exceed 43200 minutes (30 days)'),
});

export type CreateAttendancePolicyFormValues = z.infer<
  typeof createAttendancePolicySchema
>;
