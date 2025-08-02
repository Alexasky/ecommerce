'use client';

import { motion } from 'framer-motion';
import PaymentSuccessfulAnimation from '@/public/PaymentSuccessfulAnimation.json';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { useCartStore } from '../model/store';


export const OrderConfirmed = () => {
	const { setCheckoutProgress, setCartOpened } = useCartStore();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5, duration: 0.5}}
			className="flex flex-col items-center justify-center h-full"
		>
			<Link href='/dashboard/orders'>
				<Button 
					onClick={() => {
						setCheckoutProgress('cart-page')
						setCartOpened(false);
					}}
				>
					View your order
				</Button>
			</Link>
			<Lottie animationData={PaymentSuccessfulAnimation} loop={true} className="w-64 h-64" />
		</motion.div>
	);
}