'use server';

import { createSafeActionClient } from 'next-safe-action';
import { productVariants } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '..';
import { z } from 'zod';

const actionClient = createSafeActionClient();
export const deleteVariant = actionClient
	.schema(z.object({id: z.number()}))
	.action(async ({ parsedInput: { id } }) => {
		try {
			const deletedVariant = await db
				.delete(productVariants)
				.where(eq(productVariants.id, id))
				.returning();
			revalidatePath('/dashboard/products');
			return { success: `Variant ${deletedVariant[0].productType} has been deleted` };
		} catch (error) {
			console.error(error);
			return { error: 'Failed to delete variant' };
		}
	});