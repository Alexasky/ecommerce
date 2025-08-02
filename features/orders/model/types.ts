export interface Order {
	id: number;
	total: number;
	status: string;
	created: Date | null;
	orderProduct: OrderProduct[];
	receiptURL: string | null;
	paymentIntentID: string | null;
}

interface ProductVariant {
	id: number;
	color: string;
	productType: string
	variantImages: VariantImage[];
}

interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	created: Date | null;
}

interface VariantImage {
	id: number;
	url: string;
	size: number;
}


interface OrderProduct {
	quantity: number;
	productVariants: ProductVariant;
	product: Product;
}
