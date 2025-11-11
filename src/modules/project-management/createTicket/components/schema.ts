import { z } from 'zod';

export const getSchema = (addAppointment: boolean) =>
  z.object({
    title: z
      .string()
      .max(250, 'Title must be less than or equal to 250 characters')
      .nonempty('Title is required'),

    project: z.union([
      z.number().min(1, 'Project is required'),
      z.object({
        id: z.number().min(1, 'Project is required'),
        label: z.string(),
      }),
    ]),

    subprojectId: z.union([
      z.number().min(1, 'Subproject is required'),
      z.object({
        id: z.number().min(1, 'Subproject is required'),
        label: z.string(),
      }),
    ]),

    tracker: z.union([
      z.number().min(1, 'Tracker is required'),
      z.object({
        id: z.number().min(1, 'Tracker is required'),
        label: z.string(),
      }),
    ]),

    priority: z.union([
      z.number().min(1, 'Priority is required'),
      z.object({
        id: z.number().min(1, 'Priority is required'),
        label: z.string(),
      }),
    ]),

    status: z.union([
      z.number().min(1, 'Status is required'),
      z.object({
        id: z.number().min(1, 'Status is required'),
        label: z.string(),
      }),
    ]),

    progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),

    assignee: z.array(z.any()).min(1, 'At least one assignee is required'),

    // Appointment fields (conditional)
    appointment: addAppointment
      ? z.object({
          location: z.string().nonempty('Location is required'),
          description: z.string().optional(),
          timezone: z.object({
            value: z.string().nonempty('Timezone is required'),
            label: z.string(),
          }),
          service: z.object({
            value: z.string().nonempty('Service is required'),
            label: z.string(),
          }),
          frequency: z.string().nonempty('Frequency is required'),
          date: z.string().nonempty('Date is required'),
          time: z.string().nonempty('Time is required'),
          weekday: z
            .object({
              value: z.string(),
              label: z.string(),
            })
            .optional(),
          duration: z.object({
            value: z.string().nonempty('Duration is required'),
            label: z.string(),
          }),
          reminder: z
            .object({
              value: z.string(),
              label: z.string(),
            })
            .optional(),
          communicationMethods: z.object({
            phoneCall: z
              .object({
                checked: z.boolean(),
                value: z.string().optional(),
              })
              .optional(),
            textMessage: z
              .object({
                checked: z.boolean(),
                value: z.string().optional(),
              })
              .optional(),
            email: z
              .object({
                checked: z.boolean(),
                value: z.string().optional(),
              })
              .optional(),
          }),
        })
      : z.any().optional(),
  });

export const schema = getSchema(false);
