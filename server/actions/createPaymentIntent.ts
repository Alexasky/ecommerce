"use server";
import { paymentIntentSchema } from '@/shared/lib/schemas';
import { createSafeActionClient } from 'next-safe-action';
import { auth } from '../auth';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const actionClient = createSafeActionClient();

export const createPaymentIntent = actionClient
	.schema(paymentIntentSchema)
	.action(async ({ parsedInput: { amount, orderID, currency } }) => {
		try {
			const user = await auth();
			if (!user) {
				return { error: 'Please login to continue' };
			}
			if ( !amount ) {
				return { error: 'No products to checkout' };
			}

			const paymentIntent = await stripe.paymentIntents.create({
				amount: amount * 100,
				currency,
				automatic_payment_methods: {
					enabled: true
				},
				metadata: {
					orderID
				},
			})
			return { success: {
				clientSecretID: paymentIntent.client_secret,
				paymentIntentID: paymentIntent.id,
				user: user.user.email,
			} };
		} catch (error: unknown) {
			console.error('Payment Intent Creation Error:', error);
			return { error: 'Failed to create payment intent' };
		}
	});