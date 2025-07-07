'use server';
import { reviewSchema } from '@/shared/lib/schemas/reviewSchema';
import { createSafeActionClient } from 'next-safe-action'
import { auth } from '../auth';
import { and, eq } from 'drizzle-orm';
import { reviews} from '../schema';
import { db } from '..';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();

export const addReview = actionClient
	.schema(reviewSchema)
	.action(async({parsedInput: { productID, rating, comment }}) => {
		try {
			const session = await auth();
			if(!session) return {error: 'Please sign in to add a review'}
			const reviewExisting = await db.query.reviews.findFirst({
				where: and(
					eq(reviews.userID, session.user.id),
					eq(reviews.productID, productID)
				)
			})

			if(reviewExisting) return {error: 'You have already reviewed this product'};

			const newReview = await db.insert(reviews).values({
				productID,
				rating,
				comment,
				userID: session.user.id
			}).returning();
			
			revalidatePath(`products/${productID}`)
			return {success: newReview[0]}


		} catch (error) {
			return { error: JSON.stringify(error)}
		}
	})