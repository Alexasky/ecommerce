
'use client';
import { cn } from '@/lib/utils';
import { addReview } from '@/server/actions/addReview';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';
import { ReviewFormValues, reviewSchema } from '@/shared/lib/schemas/reviewSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const ReviewForm = () => {
	const params = useSearchParams();
	const productID = Number(params.get('productID'));

	const form = useForm<ReviewFormValues>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			productID,
			rating: 0,
			comment: '',
		}
	});

	const {execute, status} = useAction(addReview, {
		onSuccess(data){
			if(data.data?.error) toast.error(data.data?.error);
			if( data.data?.success) {
				toast.success('Review Added')
				form.reset();
			}
		}
	})

	const onSubmit = ((values: ReviewFormValues) => {
		execute({
			productID,
			rating: values.rating,
			comment: values.comment,
		})
	})

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className='w-full'>
					<Button className='font-medium w-full' variant={'secondary'}>Leave a review</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='comment' 
							control={form.control}
							render= {({ field }) => (
								<FormItem  className='mb-4'>
									<FormLabel>Leave your review</FormLabel>
									<FormControl>
										<Textarea placeholder='How would you describe this product?' {...field}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField 
							name='rating' 
							control={form.control} 
							render= {({ field }) => (
								<FormItem className='mb-4'>
									<FormLabel>Leave your rating</FormLabel>
									<FormControl>
										<Input type='hidden' placeholder='Star rating' {...field}/>
									</FormControl>
									<div className='flex'>
										{[1,2,3,4,5].map((value) => {
											return (
												<motion.div 
													key={value}
													className='relative cursor-pointer'
													whileTap={{scale: 0.8}}
													whileHover={{scale: 1.2}}
												>
													<Star
														key={value}
														onClick={() => form.setValue('rating', value)}
														className={cn(
															'text-primary bg-transparent',
															'transition-all duration-300 ease-in-out',
															form.getValues('rating') >= value ? 'fill-primary' : 'fill-muted'
														)}
													 />
												</motion.div>											
											)
										})}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={status === 'executing'} className='w-full'type='submit'>
							{status === 'executing' ? 'Adding review ...' : 'Add review'}
						</Button>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}