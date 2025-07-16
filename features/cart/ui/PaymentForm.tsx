'use client';
import { createPaymentIntent } from '@/server/actions/createPaymentIntent';
import { Button } from '@/shared/components/ui/button';
import  { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';;
import { useState } from 'react';
import { useCartStore } from '../model/store';
import { useAction } from 'next-safe-action/hooks';
import { createOrder } from '@/server/actions/createOrder';
import { toast } from 'sonner';


export const PaymentForm = () => {
	const { amount, cart, setCheckoutProgress, clearCart } = useCartStore();
	const stripe = useStripe();
	const elements = useElements()
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { execute } = useAction(createOrder, {
		onSuccess(data) {
			if (data.data?.error) {
				toast.error(data.data.error);
			} else {
				setIsLoading(false);
				toast.success(data.data?.success);
				clearCart();
				setCheckoutProgress('confirmation-page');
			}
		}
	})

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		if (!stripe || !elements) {
			setIsLoading(false);
			setErrorMessage('Stripe is not loaded yet. Please try again later.');
			return;
		}
		const {error: submitError} = await elements.submit();

		if (submitError) {
			setIsLoading(false);
			setErrorMessage(submitError.message || 'An error occurred while processing your payment.');
			return;
		}

		const result = await createPaymentIntent({
			amount,
			currency: 'usd',
			cart: cart.map(item => ({
				quantity: item.variant.quantity,
				productID: item.id,
				title: item.name,
				image: item.image,
				price: item.price,
			})),
			orderID: crypto.randomUUID(),
		});

		if (result?.data?.error) {
			setIsLoading(false);
			setErrorMessage(result?.data?.error);
			return;
		}

		if (result?.data?.success) {
			const { error } = await stripe.confirmPayment({
				elements,
				clientSecret: result.data.success.clientSecretID!,
				redirect: 'if_required',
				confirmParams: {
					return_url: `${window.location.origin}/success`,
					receipt_email: result.data.success.user as string,
				},
			})

			if (error) {
				setIsLoading(false);
				setErrorMessage(error.message || 'An error occurred while confirming your payment.');
			} else {
				setIsLoading(false);
				execute({
					total: amount,
					status: 'pending',
					products: cart.map(item => ({
						quantity: item.variant.quantity,
						productID: item.id,
						variantID: item.variant.variantID,
					})),
				})
			}
		}
	}
	return (
		<form onSubmit={handleSubmit} className='xl:max-w-xl w-full flex flex-col gap-4 justify-center m-auto'>
			<PaymentElement />
			<AddressElement options={{mode: 'shipping'}} />
			<Button className='w-full my-4 self-center' type="submit" disabled={!stripe || !elements || isLoading }><span>{isLoading ? 'Processing ...' : 'Pay now'}</span></Button>
		</form>
	)
}