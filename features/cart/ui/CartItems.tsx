'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { useCartStore } from '../model/store';
import { formatPrice } from '@/shared/lib/formatPrice';
import Image from 'next/image';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import emptyCart from '@/public/emptyBox.json'
import { createId } from '@paralleldrive/cuid2';
import { Button } from '@/shared/components/ui/button';

export const CartItems = () => {
	const  {cart, addToCart, removeFromCart, setCheckoutProgress, setTotalAmount } = useCartStore();
	const totalPrice =  useMemo(() => {
		const totalAmount = cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0);
		return totalAmount
	}, [cart]);

	const priceInLetters = useMemo(() => {
		return [...totalPrice.toFixed(2).toString()].map(letter => ({
			letter,
			id: createId()
		}))
	}, [totalPrice]);

	useEffect(() => {
		setTotalAmount(totalPrice);
	}, [totalPrice]);

	return (
		<motion.div>
			{cart.length === 0
				? (
					<motion.div
						animate={{ y: 0 }}
						initial={{ y: 20 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						<h2 className='text-2xl text-muted-foreground text-center'>Your cart is empty.</h2>
						<Lottie
							animationData={emptyCart}
							loop={true}
							className='w-64 h-64 mx-auto'	
						/>
					</motion.div>
				)
				: (
					<div className='h-91 overflow-y-auto mb-7'>
						<Table className="xl:w-4xl xl:m-auto table-auto border-collapse">
							<TableHeader>
								<TableRow className='bg-secondary dark:bg-secondary text-secondary-foreground'>
									<TableHead>Product</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Image</TableHead>
									<TableHead className='text-right'>Quantity</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.map((item) => (
									<TableRow key={item.variant.variantID} className='hover:bg-secondary/50 transition-colors duration-300'>
										<TableCell className='text-left whitespace-normal break-words md:whitespace-nowrap md:pl-4'>{item.name}</TableCell>
										<TableCell className='text-left'>{formatPrice(item.price)}</TableCell>
										<TableCell>
											<Image src={item.image} alt={item.name} width={48} height={48} priority className='rounded-md'/>										
										</TableCell>
										<TableCell className='md:pr-4'>
											<div className='h-full flex items-center justify-end gap-2 p-0'>
												<MinusCircle
													size={14}
													className={cn(
														'cursor-pointer',
														'hover:text-muted-foreground duration-300 transition-colors',
													)}
													onClick={() => removeFromCart(item)}
												/>
												<p className='text-sm font-bold w-[35px] text-center'>{item.variant.quantity}</p>
												<PlusCircle
													size={14}
													className={cn(
														'cursor-pointer',
														'hover:text-muted-foreground duration-300 transition-colors',
													)}
													onClick={() => addToCart({
														...item,
														variant: {
															variantID: item.variant.variantID,
															quantity: 1
														}
													})}										 
												/>
											</div>										
										</TableCell>
									</TableRow>
								) )}							
							</TableBody>
						</Table>
					</div>
				)
			}
			<motion.div className='flex justify-center items-center relative overflow-hidden mb-7'>
				<div className='flex items-center justify-start min-w-[50px]'>
					<span className='text-md leading-4'>Total: $</span>
					<div className='w-[60px]'>
						<AnimatePresence mode='popLayout'>
							{priceInLetters.map((letter, index) => (
								<motion.span
									key={letter.id}
									initial={{ y: 20 }}
									animate={{ y: 0 }}
									exit={{ y: -20 }}
									transition={{ delay: 0.1 * index, duration: 0.3 }}
									className='inline-block text-md leading-4'
								>
									{letter.letter}
								</motion.span>
							))}
						</AnimatePresence>
					</div>					
				</div>
			</motion.div>
			<Button 
				className='max-w-md w-full block m-auto' 
				disabled={cart.length === 0}
				onClick={() => {
					if (cart.length > 0) {
						setCheckoutProgress('payment-page');
					}
				}}
			>
				Checkout
			</Button>
		</motion.div>
	)
}