'use client';

import { formatPrice } from '@/shared/lib/formatPrice';
import { VariantsWithProduct } from '@/shared/lib/inferTypes';
import { Badge } from '@/shared/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface ProductListProps {
	variants: VariantsWithProduct[];	
}

export const ProductList:FC<ProductListProps> = ({variants}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{variants.map(variant  => (
				<Link	
					key={variant.id}
					href={`products/${variant.id}?id=${variant.id}&productID=${variant.productID}&productType=${variant.productType}&title=${variant.product.title}&price=${variant.product.price}&image=${variant.variantImages[0].url}&color=${variant.color}`}
					className="group relative block rounded-lg border hover:bg-gray-50 transition-colors"	
				>
					<Image
						src={variant.variantImages?.[0]?.url}
						alt={variant.product.title || 'Product Image'}
						width={720}
						height={480}
						className="h-48 w-full object-cover rounded-md mb-4"	
						loading='lazy'
					/>
					<div className="flex justify-between items-center p-4">
						<div>
							<h2>{variant.product.title}</h2>
							<p className="text-sm text-accent-foreground/70">{variant.productType}</p>
						</div>
						<Badge variant="secondary" className="text-sm">
							{formatPrice(variant.product.price)}
						</Badge>
					</div>
				</Link>
			))}
		</div>
	);
}