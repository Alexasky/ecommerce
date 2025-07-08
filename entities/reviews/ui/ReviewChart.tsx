'use client';

import { Card, CardDescription, CardTitle } from '@/shared/components/ui/card';
import { ReviewWithUser } from '@/shared/lib/inferTypes';
import { FC, useMemo } from 'react';
import { Stars } from './Stars';
import { getReviewAverage } from '@/shared/lib/reviewAverage';
import { Progress } from '@/shared/components/ui/progress';

interface ReviewChartProps {
	reviews: ReviewWithUser[]
}
export const ReviewChart: FC<ReviewChartProps> = ({ reviews }) => {
	const totalRating = getReviewAverage(reviews.map(r => r.rating));
	const getRatingByStars = useMemo(() => {
		const ratingValues = Array.from({length: 5}, ()=> 0);
		const totalReviews = reviews.length;
		reviews.forEach((review) => {
			const starIndex = review.rating - 1;
			if (starIndex >= 0 && starIndex < 5) {
				ratingValues[starIndex]++;
			}			
		});
		return ratingValues.map(rating => (rating / totalReviews) * 100);
	}, [reviews])
	return (
		<Card className='flex flex-col p-8 rounded-md gap-4'>
			<div className='flex flex-col gap-2'>
				<CardTitle>Product Rating:</CardTitle>
				<Stars rating={totalRating} totalReviews={reviews.length} size={18}/>
				<CardDescription>{totalRating.toFixed(1)} stars</CardDescription>
			</div>
			{getRatingByStars.map((rating, index) => {
				return (
					<div key={index} className='flex gap-2 justify-between items-center'>
						<p className='text-sm font-medium flex gap-1'>{index + 1} <span>stars</span></p>
						<Progress value={rating} />
					</div>					
				)
			})}			
		</Card>
	);
};