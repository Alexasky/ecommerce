import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { TotalOrders } from '@/shared/lib/inferTypes'
import Image from 'next/image'
import PlaceholderUser from '@/public/placeholder_user.jpg'

export default function Sales({totalOrders}: {totalOrders: TotalOrders[]}){
	return (
		<Card className='overflow-x-auto flex-1 md:min-w-[400px] '>
			<CardHeader>
				<CardTitle>New Sales</CardTitle>
				<CardDescription>Here are your recent sales</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Customer</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Image</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{totalOrders.map(({order, product, productVariants, quantity}) => (
							<TableRow key={`${order.id}-${product.id}-${productVariants.id}`}>
								<TableCell>
									{order.user.image && order.user.name 
										? (
											<div className='flex flex-col sm:flex-row gap-2 items-center sm:items-start sm:justify-start"'>
												<Image src={order.user.image} alt={order.user.name} width={25} height={25} className='rounded-full'></Image>
												<p className='text-xs font-medium break-words truncate'>{order.user.name}</p>
											</div>
										)
										: (
											<div className='flex gap-2 items-center'>
												<Image src={PlaceholderUser} alt='User not found' width={25} height={25} className='rounded-full'></Image>
												<p className='text-xs font-medium break-words max-w-[100px] sm:max-w-[200px] truncate'>User not found</p>
											</div>
										)
									}
								</TableCell>
								<TableCell className='break-words truncate max-w-[200px]'>{product.title}</TableCell>
								<TableCell>${product.price}</TableCell>
								<TableCell>{quantity}</TableCell>
								<TableCell>
									<Image src={productVariants.variantImages[0].url} alt={product.title} width={48} height={48}/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}