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
		<div className='flex items-center gap-4'>
			<div className='flex items-center'>
				{Array.from({length: 5}).map((_, i) => {
					return (
						<Star 
							size={size} 
							key={i} className={cn(i < Math.floor(rating) ? 'fill-secondary text-secondary' : 'fill-transparent text-gray-300')}/>
					)
				})}
			</div>
			{totalReviews === 0 
				? <span className="text-gray-600">No reviews yet</span>
				: (
					<>
						<span className="text-lg font-medium">{rating}</span>
						<span className="text-gray-600">({totalReviews || 0} reviews)</span>
					</>
				)}
			
		</div>
	)
}
