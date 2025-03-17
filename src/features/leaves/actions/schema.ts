import { z } from 'zod';

export const schema = z.object({
  startDate: z.string().trim().nonempty({ message: 'Start date is required' }),
  endDate: z.string().trim().nonempty({ message: 'End date is required' }),
  leaveType: z.string().trim().nonempty({ message: 'Leave Type is required' }),
  descriptions: z.string(),
  remarks: z.string().optional(),
  status: z.string().optional(),
  daysApplied: z.number().optional()
});

export type FormState = z.infer<typeof schema>;
