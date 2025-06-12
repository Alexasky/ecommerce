'use server';
import { variantSchema } from '@/shared/lib/schemas/variantSchema';
import { createSafeActionClient } from 'next-safe-action';	
import { db } from '..';
import { products, productVariants, variantImages, variantTags } from '../schema';
import { eq} from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import algoliasearch from "algoliasearch";

const client = algoliasearch(
	process.env.NEXT_PUBLIC_ALGOLIA_ID!,
	process.env.ALGOLIA_WRITE_API_KEY!
);
const algoliaIndex = client.initIndex('products');

const actionClient = createSafeActionClient();
export const createVariant = actionClient
	.schema(variantSchema)
	.action(async ({ parsedInput: { id, editMode, productID, productType, color, tags, variantImages: newImages  } }) => {
		try {
			if (editMode && id) {
				const editVariant = await db.update(productVariants).set({ productType, color, updated: new Date() }).where(eq(productVariants.id, id)).returning();
				await db.delete(variantTags).where(eq(variantTags.variantID, editVariant[0].id));
				await db.insert(variantTags).values(tags.map(tag => ({ tag, variantID: editVariant[0].id })));
				await db.delete(variantImages).where(eq(variantImages.variantID, editVariant[0].id));
				await db.insert(variantImages).values(newImages.map((image, index) => ({		
					url: image.url,
					size: image.size,
					name: image.name,
					variantID: id,
					order: index,
				})));

				await algoliaIndex.partialUpdateObject({
					objectID: editVariant[0].id,
					productType: editVariant[0].productType,
					id: editVariant[0].productID,
					variantImages: newImages[0].url || '',
				});

				revalidatePath('/dashboard/products');
				return { success: `Variant for product ${editVariant[0].productType} has been updated` };
			}

			const createdVariant = await db.insert(productVariants).values({
				productType,			
				color,
				productID,
			}).returning();

			const product = await db.query.products.findFirst({
				where: eq(products.id, productID),
			});

			await db.insert(variantTags).values(tags.map(tag => ({
				tag,
				variantID: createdVariant[0].id,
			})));
			await db.insert(variantImages).values(newImages.map((image, index) => ({
				url: image.url,
				size: image.size,
				name: image.name,
				variantID: createdVariant[0].id,
				order: index,
			})));

			if(product) {
				await algoliaIndex.saveObject({
					objectID: createdVariant[0].id,
					productType: createdVariant[0].productType,
					title: product.title,
					price: product.price,
					id: createdVariant[0].productID,
					variantImages: newImages[0].url || '',
				});
			}			
			revalidatePath('/dashboard/products');
			return { success: `Variant for product ${createdVariant[0].productType} has been created` };
		} catch (error) {
			console.error('Create Variant Error:', error);
			return { error: 'Failed to create variant' };
		}
	});

