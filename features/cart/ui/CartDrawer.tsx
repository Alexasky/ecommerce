'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../model/store';

export const CartDrawer = () => {
	const { cart } = useCartStore();
    return(
			<div>
				<ShoppingBag />
			</div>
		);
};