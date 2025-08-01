'use server';
import { eq } from 'drizzle-orm'
import { db } from '..'
import { products } from '../schema'

export const getProduct = async(id: number) => {
	
	try {
		const product = await db.query.products.findFirst({where: eq(products.id, id)});
		if(!product) throw new Error('Product not found')
		return { success: product }
	} catch (error) {
		console.log(JSON.stringify(error))
		return {error: 'Failed to get product'}
	}
}