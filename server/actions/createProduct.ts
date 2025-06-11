'use server';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { products } from '../schema';
import { eq } from 'drizzle-orm';
import { productSchema } from '@/shared/lib/schemas';


const actionClient = createSafeActionClient();

export const createProduct = actionClient
	.schema(productSchema)
	.action(async({ parsedInput: { id, title, description, price } }) => {
		try {
			if( !id ) {
				const createdProduct = await db
					.insert(products)
					.values({title, description, price})
					.returning();
					
				return { success: `Product ${createdProduct[0].title} has been created` };
			}
			const currentProduct = await db.query.products.findFirst({
				where: eq(products.id, id)
			});

			if( !currentProduct ) return { error: 'Product not found' }

			const editedProduct = await db
				.update(products)
				.set({
					title,
					description,
					price,
				})
				.where(eq(products.id, id))
				.returning();				

			return { success: `Product ${editedProduct[0]?.title ?? title} has been updated` }
	

		} catch (error: unknown) {
			console.error('Create/Update Product Error:', error);
			return { error: 'Failed to create or update product' }
		}
	});