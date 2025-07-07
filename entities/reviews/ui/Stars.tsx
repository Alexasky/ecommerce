'use client';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { FC } from 'react';

interface StarsProps {
	rating: number,
	totalReviews?: number,
	size?: number,
}

export const Stars:FC<StarsProps> = ({rating, totalReviews, size = 14}) => {
	return(
		<div className='flex gap-2 items-center'>
			<div className='flex'>
				{[1,2,3,4,5].map((star) => {
					return (
						<Star size={size} key={star} className={cn(rating >= star ? 'fill-primary' : 'fill-transparent')}/>
					)
				})}
			</div>
			<span className='text-sm font-bold'>{totalReviews || 0} reviews</span>
		</div>
	)
}
