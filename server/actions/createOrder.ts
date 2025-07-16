'use server';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { orderProduct, orders } from '../schema';
import { eq } from 'drizzle-orm';
import { orderSchema } from '@/shared/lib/schemas';
import { auth } from '../auth';
const actionClient = createSafeActionClient();
export const createOrder = actionClient
	.schema(orderSchema)
	.action(async ({ parsedInput: { total, status, products } }) => {
		try {
			const user = await auth();
			if (!user) {
				return { error: 'Please login to continue' };
			}

			const newOrder = await db
				.insert(orders)
				.values({
					total,
					status,
					userID: user.user.id,
				})
				.returning();

			if (products && products.length > 0) {
				const orderProducts = products.map( async({ productID, variantID, quantity}) => {
					const newOrderProduct = await db
						.insert(orderProduct)
						.values({
							productID,
							productVariantID: variantID,
							quantity,
							orderID: newOrder[0].id,
							userID: user.user.id,
						})
				})
			}

			return { success: `Order ${newOrder[0].id} has been added successfully!` };
		} catch (error: unknown) {
			console.error('Create Order Error:', error);
			return { error: 'Failed to create order' };
		}
	});