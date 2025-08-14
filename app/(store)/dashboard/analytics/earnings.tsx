'use client';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TotalOrders } from '@/shared/lib/inferTypes';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { weeklyChart } from './weeklyChart';
import { Bar, BarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { monthlyChart } from './monthlyChart';

export default function Earnings({totalOrders}: {totalOrders: TotalOrders[]}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const filter = searchParams.get('filter') || 'week';

	const chartItems = totalOrders.map(order => ({
		date: order.order.created!,
		revenue: (order.product.price * order.quantity),
	}))

	const activeChart = useMemo(() => {
		const weekly = weeklyChart(chartItems);
		const monthly = monthlyChart(chartItems);
		if (filter === 'week') {
			return weekly;
		}
		if (filter === 'month') {
			return monthly;
		}
	},[filter])

	const activeTotal = useMemo(() => {
		if ( filter === 'week') {
			return weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0);
		}

		return monthlyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0);
	}, [filter]);

	return (
		<Card className='flex-1 md:min-w-[400px] min-w-full'>
			<CardHeader>
				<CardTitle>Your Revenue: ${Math.floor(activeTotal)}</CardTitle>
				<CardDescription>Here are your recent earnings</CardDescription>
				<div className='flex gap-2 items-center'>
					<Badge
					className={cn(
						'cursor-pointer',
						filter === 'week' ? 'bg-primary' : 'bg-primary/25'
					)}
						onClick={() => router.push('/dashboard/analytics?filter=week', {scroll: false})}
					>
						This week
					</Badge>
					<Badge
					className={cn(
						'cursor-pointer',
						filter === 'month' ? 'bg-primary' : 'bg-primary/25'
					)}
						onClick={() => router.push('/dashboard/analytics?filter=month', {scroll: false})}
					>
						This Month
					</Badge>
				</div>
			</CardHeader>
			<CardContent className='h-96'>
				<ResponsiveContainer width={'100%'} height={'100%'}>
					<BarChart data={activeChart}>
						<Tooltip
							content={(props) => (
								<div>
									{props.payload.map((item) => {
										console.log(item);
										return (
											<div key={`${item.payload.date} + ${item.value}`} className='bg-primary p-2 px-4 rounded-md text-white shadow-lg text-xs'>
												<p>Revenue: ${Math.floor(item.value)}</p>
												<p>Date: {item.payload.date}</p>
											</div>
										)
									})}
								</div>
							)}
						/>
						<Bar dataKey='revenue' className='bg-primary'></Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}