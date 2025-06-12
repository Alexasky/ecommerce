'use client';
import { cn } from '@/lib/utils';
import { VariantsWithProduct } from '@/shared/lib/inferTypes';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

interface ProductPickProps {
	variant: VariantsWithProduct;
}
export const ProductPick: FC<ProductPickProps> = ({variant}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedColor = searchParams.get('color') || variant.color;
	return (
		<div
			style={{backgroundColor: variant.color}}
			onClick={() => {
				router.push(
					`${variant.id}?id=${variant.id}&productID=${variant.productID}&productType=${variant.productType}&color=${variant.color}&title=${variant.product.title}$price=${variant.product.price}`,
					{scroll: false}
				);
			}}
			className={cn(
				'w-8 h-8 rounded-full cursor-pointer',
				'transition-all duration-300 ease-in-out hover: opacity-75',
				selectedColor === variant.color
					? 'opacity-100'		
					: 'opacity-50',
			)}
		/>
	);
}