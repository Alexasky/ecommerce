'use client';
import { cn } from '@/lib/utils';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/shared/components/ui/carousel';
import { VariantsWithImagesTags } from '@/shared/lib/inferTypes';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
interface ProductShowcaseProps {
	variants: VariantsWithImagesTags[];
}

export const ProductShowcase:FC<ProductShowcaseProps> = ({variants}) => {
	const [api, setApi] = useState<CarouselApi>();
	const [activThumbnail, setActiveThumbnail] = useState([0]);
	const searchParams = useSearchParams();
	const selectedType = searchParams.get('productType') || variants[0]?.productType;

	const updatePreview = (index: number) => {
		if (!api) return;
		api.scrollTo(index);
	}

	useEffect(() => {
		if (!api) return;
		api.on('slidesInView',(e) => {
			setActiveThumbnail(e.slidesInView());
		})
	}, [api])
	return (
		<Carousel setApi={setApi} opts={{loop: true}} className='space-y-4'>
			<CarouselContent>
				{variants.map((variant) => (variant.productType === selectedType) && variant.variantImages.map((image) => (
					<CarouselItem key={image.url}>
						{image.url ? (
							<Image 
								className="rounded-md cursor-pointer"
								priority
								src={image.url} 
								alt={image.name} 
								width={1280}
								height={720}
							/>
							) : null }
					</CarouselItem>
				)))}
			</CarouselContent>
			<div className='flex overflow-clip space-x-2'>
				{variants.map((variant) => (variant.productType === selectedType) && variant.variantImages.map((image, index) => (
						<div key={image.url}>
							{image.url ? (
								<Image 
									onClick={() => updatePreview(index)}
									className={cn(
										'cursor-pointer w-20 h-20 rounded-lg overflow-hidden border-2',
										'transition-all duration-300 ease-in-out hover:opacity-75',
										index === activThumbnail[0] ? 'opacity-100 border-primary' : 'opacity-75 border-grey-200',
									)}
									priority
									src={image.url} 
									alt={image.name} 
									width={72}
									height={48}
								/>
								) : null }
						</div>
					)))}
			</div>
		</Carousel>
	);
}