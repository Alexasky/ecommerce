import { create } from "zustand";
import { CartState } from './types';
import { persist } from "zustand/middleware";

export const useCartStore = create<CartState>()(
	persist(
	(set) => ({
	cart: [],
	addToCart: (item) => set((state) => {		
		const existingItem = state.cart.find(cartItem => cartItem.variant.variantID === item.variant.variantID);		
		if ( existingItem ) {
			const updatedItem = state.cart.map(cartItem => {
				if (cartItem.variant.variantID === item.variant.variantID) {
					return {
						...cartItem,
						variant: {
							...cartItem.variant,
							quantity: cartItem.variant.quantity + item.variant.quantity
						}
					}
				}
				return cartItem;
			})
			return {cart: updatedItem};
		} else {
			return {
				cart: [ 
					...state.cart,
					{
						...item, 
						variant: {
							variantID: item.variant.variantID,
							quantity: item.variant.quantity,
						}
					}
				]
			}
		}
	}),
	removeFromCart: (item) => set((state) => {
		const updatedCart = state.cart.map(cartItem => {	
			if(cartItem.variant.variantID === item.variant.variantID) {
				return {
					...cartItem,
					variant: {
						...cartItem.variant,
						quantity: cartItem.variant.quantity - 1
					}
				}
			}
			return cartItem;
		});
		return {cart: updatedCart.filter(cartItem => cartItem.variant.quantity > 0)};
	}),
}), {name: 'cart-storage'})
)