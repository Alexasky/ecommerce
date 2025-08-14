'use client';

import { useState } from 'react';
import { useCartStore } from '../model/store';
import { Button } from '@/shared/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { redirect, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

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


		{/* <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(10, product.stockCount) }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600">{product.stockCount} items in stock</div>
              </div>

              <div className="flex space-x-3">
                <Button
                  size="lg"
                  className="flex-1 bg-[#37999f] hover:bg-[#37999f]/90"
                  disabled={!currentVariant.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div> */}
		</>
	)
}