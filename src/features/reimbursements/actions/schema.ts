import { z } from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const schema = z.object({
  attachments: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  reimbursementType: z
    .string()
    .trim()
    .nonempty({ message: 'Reimbursement Type is required' }),
  amount: z.coerce
    .number({ required_error: 'Amount is required' })
    .gte(1, { message: 'Amount is Required' }), // alias .min(5)
  status: z.string()
});

export type FormState = z.infer<typeof schema>;
