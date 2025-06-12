'use client';
import { VariantsWithImagesTags } from '@/shared/lib/inferTypes';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

interface ProductTypeProps {
	variants: VariantsWithImagesTags[];
}

export const ProductType:FC<ProductTypeProps> = ({variants}) => {
	const searchParams = useSearchParams();
	const selectedType = searchParams.get('productType') || variants[0]?.productType;
	return (
		variants.map(variant => {
			if (variant.productType === selectedType) {
				return (
					<motion.div
						key={variant.id}
						className='text-secondary-foreground font-medium'
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
					>
						{selectedType}
					</motion.div>
				);
			}
			return null;
		})
	)	
}