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
	addToCart: (item: CartItem) => void,
}