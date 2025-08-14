
import * as z from 'zod';

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
	confirmPassword: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
	name: z.string().min(4, {
		message: 'Please add a name with at least 4 characters',
	}),
	terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;