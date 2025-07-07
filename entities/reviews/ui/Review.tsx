'use client';
import { Card } from '@/shared/components/ui/card'
import { ReviewWithUser } from '@/shared/lib/inferTypes'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FC } from 'react'
import {formatDistance, subDays} from 'date-fns';
import { Stars } from './Stars';

interface ReviewProps {
	reviews: ReviewWithUser[],
}
	
export const Review:FC<ReviewProps> = ({reviews}) => {
	return (
		<motion.div className='flex flex-col gap-4'>
			{reviews.map(review => (
				<Card key={review.id} className='p-4'>
					<div className='flex gap-2 items-center'>
						<div className='w-8 h-8' >
							<Image 
								src={review.user.image!} 
								alt={review.user.name! ?? 'User'} 
								width={32} 
								height={32} 
								className='rounded-full object-cover w-full h-full' 
							/>
						</div>						
						<div>
							<p className='text-sm font-bold'>{review.user.name!}</p>
							<div className='flex gap-2 items-center'>
								<Stars rating={review.rating} totalReviews={reviews.length} />
								<span className='text-xs font-bold text-muted-foreground'>{formatDistance(subDays(review.created!, 0), new Date())}</span>
							</div>
						</div>						
					</div>
					<p className='text-sm'>{review.comment}</p>
				</Card>
			))}
		</motion.div>
	)
}