'use server';

import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { products } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
	.schema(z.object({id: z.number()}))
	.action(async ({parsedInput: {id}}) => {
		try {
			const deletedProduct = await db
				.delete(products)
				.where(eq(products.id,id))
				.returning();
			revalidatePath('/dashboard/products')
			return {success: `Product ${deletedProduct[0].title} has been deleted`}
		} catch (error) {
			console.log(error)
			return {error: 'Failed to delete product'}
		}
	})
