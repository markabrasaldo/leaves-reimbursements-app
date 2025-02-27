import { z } from 'zod';

export const schema = z.object({
  startDate: z.string().trim().nonempty({ message: 'Start date is required' }),
  endDate: z.string().trim().nonempty({ message: 'End date is required' }),
  leaveType: z.string().trim().nonempty({ message: 'Leave Type is required' }),
  remarks: z.string(),
  status: z.string().optional()
});

export type FormState = z.infer<typeof schema>;
