import { z } from 'zod';

export const paymentIntentSchema = z.object({
	amount: z.number(),
	currency: z.string(),
	orderID: z.string(),
	cart: z.array(z.object({
		quantity: z.number(),
		productID: z.number(),
		title: z.string(),
		image: z.string(),
		price: z.number(),
	}))
});

export type PaymentIntentValues = z.infer<typeof paymentIntentSchema>;