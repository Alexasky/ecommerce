import { db } from '@/server'
import { Review } from './Review'
import { ReviewForm } from './ReviewForm'
import { desc, eq } from 'drizzle-orm'
import { reviews } from '@/server/schema'
import { ReviewChart } from './ReviewChart'

export const Reviews = async ({ productID } : { productID: number }) => {
	const data = await db.query.reviews.findMany({
		where: eq(reviews.productID, productID),
		with: {
			user:true
		},
		orderBy:[desc(reviews.created)]
	})
	return (
		<section className='py-8'>
			<h2 className='text-2xl font-bold mb-4'>Product Reviews</h2>
			<div className='flex gap-4 flex-col lg:flex-row lg:gap-12'>
				{data.length > 0 && <div className='flex-1'>
					<Review reviews={data}/>
				</div>}
				<div className='flex-1 flex flex-col gap-4'>
					<ReviewForm />
					<ReviewChart reviews={data} />
				</div>				
			</div>
		</section>
	)
}