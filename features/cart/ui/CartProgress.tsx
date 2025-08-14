'use client';

import { motion } from 'framer-motion';
import { Check, CreditCard, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../model/store';

export const CartProgress = () => {
	const {checkoutProgress} = useCartStore();
	return (
		<div className='flex item-center justify-center mb-6'>			
			<motion.div className='relative flex items-center justify-between w-64 h-3 bg-muted rounded-md'>
				<motion.span 
					className='bg-primary rounded-md absolute top-0 left-0 h-full w-full ease-in-out'
					initial={{width: 0}}
					animate={{width: checkoutProgress === 'cart-page' ? 0 : checkoutProgress === 'payment-page' ? '50%' : '100%'}}
				/>
				<motion.div
					className='bg-primary rounded-full p-2 z-10'
				>
					<ShoppingCart width={14} height={14} className='text-white' />
				</motion.div>
				<motion.div
					initial={{scale: 0}}
					animate= {{scale: checkoutProgress === 'payment-page' ? 1 : 0 || checkoutProgress === 'confirmation-page' ? 1 : 0}}
					transition={{delay: 0.25}}
					className='bg-primary rounded-full p-2 z-10'
				>
					<CreditCard width={14} height={14} className='text-white' />
				</motion.div>
				<motion.div
					initial={{scale: 0}}
					animate= {{scale: checkoutProgress === 'confirmation-page' ? 1 : 0}}
					className='bg-primary rounded-full p-2 z-10'
				>
					<Check width={14} height={14} className='text-white' />
				</motion.div>
			</motion.div>
		</div>
	)
}