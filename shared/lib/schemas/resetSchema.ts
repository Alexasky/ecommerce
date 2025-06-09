import { z } from 'zod';

export const ResetSchema = z.object({
	email: z.string().email({message: 'Email is required'}),
})

export type ResetFormValues = z.infer<typeof ResetSchema>;