import { db } from '@/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { orderProduct } from '@/server/schema';
import { desc } from 'drizzle-orm';
import Sales from './sales';
import Earnings from './earnings';

export default async function Analytics() {
	const totalOrders  = await db.query.orderProduct.findMany({
		orderBy: [desc(orderProduct.id)],
		limit: 10,
		with: {
			product: true,
			order: {
				with: {user: true},
			},
			productVariants: {
				with: {
					variantImages: true,
				}
			}
		}
	})

	if( totalOrders.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Orders</CardTitle>
				</CardHeader>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Analytics</CardTitle>
				<CardDescription>Check your sales, new customers and more</CardDescription>
			</CardHeader>
			<CardContent className='flex gap-4 flex-wrap'>
				<Sales totalOrders={totalOrders}/>
				<Earnings totalOrders={totalOrders} />
			</CardContent>
		</Card>
	)
}