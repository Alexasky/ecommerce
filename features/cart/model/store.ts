import { create } from "zustand";
import { CartState } from './types';

export const useCartStore = create<CartState>((set) => ({
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
							quatity: cartItem.variant.quantity + item.variant.quantity
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
	})
}))