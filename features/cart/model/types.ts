export interface VariantItem {
	variantID: number,
	quantity: number;
}

export interface CartItem {
	id: number;
	name: string;
	image: string;
	price: number;
	variant: VariantItem;
}

export interface CartState {
	cart: CartItem[];
	checkoutProgress: 'cart-page' | 'payment-page' | 'confirmation-page';
	amount: number;
	cartOpened: boolean;
	setCartOpened: (val: boolean) => void;
	setTotalAmount: (amount: number) => void;
	setCheckoutProgress: (val: 'cart-page' | 'payment-page' | 'confirmation-page') => void;
	addToCart: (item: CartItem) => void,
	removeFromCart: (item: CartItem) => void;
	clearCart: () => void;
}