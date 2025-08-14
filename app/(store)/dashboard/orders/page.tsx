import { OrderActions } from '@/features/orders/ui/OrderAction';
import { db } from '@/server';
import { auth } from '@/server/auth';
import { orders } from '@/server/schema';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { formatDistance, subMinutes } from 'date-fns';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function Orders() {
	const user = await auth();

	if (!user) {
		return redirect('/login');
	}

	const userOrders = await db.query.orders.findMany({
		where: eq(orders.userID, user.user.id),
		with: {
			orderProduct: {
				with: {
					product:true,
					productVariants: {
						with: {
							variantImages: true,
						},
					}
				},
			},
		},
		orderBy: (orders, { desc }) => [desc(orders.created)],
	})
	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Orders</CardTitle>
				<CardDescription>Check the status of your orders</CardDescription>
			</CardHeader>
			<CardContent>
				<Table className='table-auto border-collapse'>
				<TableCaption>A list of your recent orders.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Order</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{userOrders.map((order) => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>$ {order.total}</TableCell>
								<TableCell>
									<Badge className={
										order.status === 'succeeded' 
											? 'bg-green-700  hover:bg-green-800 text-white' 
											: 'bg-yellow-700 hover:bg-yellow-800 text-white'
									}>
										{order.status}
									</Badge>						
								</TableCell>
								<TableCell className='text-xs font-medium'>{formatDistance(subMinutes(order.created!, 0), new Date(), {addSuffix: true})}</TableCell>
								<TableCell>
									<OrderActions order={order} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}