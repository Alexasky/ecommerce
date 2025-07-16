'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '../model/store';
import { DrawerDescription, DrawerTitle } from '@/shared/components/ui/drawer';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CartMessage = () => {
	const {checkoutProgress, setCheckoutProgress} = useCartStore();

	return (
		<motion.div
			initial={{ opacity: 0, x: 10 }}
			animate={{ opacity: 1, x: 0}}
		>
			<DrawerTitle>
				{checkoutProgress === 'cart-page'? 'Your cart items' : null}
				{checkoutProgress === 'payment-page'? 'Choose a payment method' : null}
				{checkoutProgress === 'confirmation-page'? 'Order confirmation' : null}
			</DrawerTitle>
			<DrawerDescription className='py-1'>
				{checkoutProgress === 'cart-page'? 'View and edit your bag' : null}
				{checkoutProgress === 'payment-page'
					? (
						<span 
							className={cn('flex justify-center item-center gap-1', 'cursor-pointer hover:text-primary/80 transition-colors duration-300')}
							onClick={() => {
								setCheckoutProgress('cart-page');
							}}
						>
							<span className='flex items-center'><ArrowLeft size={14}/></span>
							Head back to cart
						</span>) 
					: null}
				{checkoutProgress === 'confirmation-page'? 'Thank you for your purchase!' : null}
			</DrawerDescription>
		</motion.div>
	)
}