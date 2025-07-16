import { z } from 'zod';

export const orderSchema = z.object({
	total: z.number(),
	status: z.string(),
	products: z.array(z.object({
		productID: z.number(),
		variantID: z.number(),
		quantity: z.number(),
	}))
})