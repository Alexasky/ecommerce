'use client';

import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { getStripe } from '@/shared/lib/getStripe';
import { PaymentForm } from './PaymentForm';
import { useCartStore } from '../model/store';

const stripe = getStripe();

export const Payment = () => {
	const { amount } = useCartStore();
	return (
		<motion.div>
			<Elements stripe={stripe} options={{
				mode: 'payment',
				currency: 'usd',
				amount: amount * 100,
			}}>
				<PaymentForm />
			</Elements>
		</motion.div>
	)
}