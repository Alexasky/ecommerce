'use client';

import { useState } from 'react';
import { useCartStore } from '../model/store';
import { Button } from '@/shared/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { redirect, useSearchParams } from 'next/navigation';

export const AddCart = () => {

	const { addToCart } = useCartStore();
	const [quantity, setQuantity] = useState(1);

	const params = useSearchParams();

	const title = params.get('title');
	const price = Number(params.get('price'));
	const id = Number(params.get('id'));
	const type = params.get('productType');
	const productID = Number(params.get('productID'));
	const image = params.get('image');

	if (!id || !productID || !price || !type || !image || !title ) {
		toast.error('Product not found');
		return redirect('/');
	}

	return (
		<>
		<div className='flex items-center py-4 gap-2'>
			<Button 
				variant='secondary'
				className='text-primary'
				onClick={() => {
					if(quantity > 1) {
						setQuantity(quantity - 1);
					}
				}}
			>
				<Minus size={18} strokeWidth={3} />
			</Button>
			<Button className='flex-1'>Quantity: <span className='min-w-10 flex'>{quantity}</span></Button>
			<Button
				variant='secondary'
				className='text-primary'
				onClick={() => {
					setQuantity(quantity + 1);
				}}
			>
				<Plus size={18} strokeWidth={3} />
			</Button>
		</div>
		<Button
			onClick={() => {
				toast.success(`Added ${title} ${type} to your cart!`);
				addToCart({
					id: productID,
					name: title + ' ' + type,
					variant: {
						variantID: id,
						quantity
					},
					price,
					image,
				})
			}}
		>
			Add to cart
		</Button>
		</>
	)
}