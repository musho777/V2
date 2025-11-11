import { z } from 'zod';

export const createSubProjectSchema = z
  .object({
    name: z.preprocess(
      (val) => (val === undefined || val === null ? '' : val),
      z.string().min(1, 'Subproject name is required'),
    ),
    description: z.string().optional(),
    status: z.boolean(),
    subprojectTypeName: z.preprocess(
      (val) => (val === undefined || val === null ? '' : val),
      z.string().min(1, 'Subproject type is required'),
    ),
    managementTypeName: z.preprocess(
      (val) => (val === undefined || val === null ? '' : val),
      z.string().min(1, 'Management type is required'),
    ),
    timezoneId: z.number().min(1, 'Time zone is required'),
    timezoneName: z.preprocess(
      (val) => (val === undefined || val === null ? '' : val),
      z.string().min(1, 'Time zone is required'),
    ),
    startTime: z.preprocess(
      (val) => (val === undefined || val === null ? '' : val),
      z
        .string()
        .min(1, 'Start time is required')
        .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'),
    ),
    endTime: z.preprocess(
      (val) => (val === undefined || val === null ? '' : val),
      z
        .string()
        .min(1, 'End time is required')
        .regex(/^\d{2}:\d{2}$/, 'End time must be in HH:mm format'),
    ),
    timeFormat: z.enum(['12', '24']),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;

      const start =
        Number(data.startTime.split(':')[0]) * 60 +
        Number(data.startTime.split(':')[1]);
      const end =
        Number(data.endTime.split(':')[0]) * 60 +
        Number(data.endTime.split(':')[1]);

      return end > start;
    },
    {
      message: 'End time must be greater than start time',
      path: ['endTime'],
    },
  );

export type CreateSubProjectFormValues = z.infer<typeof createSubProjectSchema>;
