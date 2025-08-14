import { ProductPick } from '@/entities/products/productPick';
import { ProductShowcase } from '@/entities/products/productShowcase';
import { ProductType } from '@/entities/products/productType';
import { Reviews } from '@/entities/reviews';
import { Stars } from '@/entities/reviews/ui/Stars';
import { AddCart } from '@/features/cart/ui/AddCart';
import { db } from '@/server';
import { productVariants } from '@/server/schema';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { formatPrice } from '@/shared/lib/formatPrice';
import { getReviewAverage } from '@/shared/lib/reviewAverage';
import { eq } from 'drizzle-orm';

export async function generateStaticParams() {
	const products = await db.query.productVariants.findMany({
		with: {
			variantImages: true,		
			variantTags: true,
			product: true,
		},
		orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
	});

	if(products && products.length === 0) {
		const slugID = products.map(variant => ({ slug: variant.id.toString() }))
		return slugID;
	}
	return [];			
}

export default async function ProductPage({params}: {params: {slug: string}}) {
	const paramsPage = await params;
	const variant = await db.query.productVariants.findFirst({
		where: eq(productVariants.id, Number(paramsPage.slug)),	
		with: {
			product: {
				with: {
					reviews: true,
					productVariants: {
						with: {
							variantImages: true,
							variantTags: true,
							product: true,
						},
					},
				},
			}
		},
	});
	if(variant) {
		const reviewAvg = getReviewAverage(variant.product.reviews.map(r => r.rating));
		return (
			<>		
				<section className='flex flex-col lg:flex-row gap-4 lg:gap-12'>
					<div className='flex flex-1'>
						<ProductShowcase
							variants={variant?.product.productVariants || []}
						/>
					</div>
					<div className='flex flex-1 flex-col'>
						<h2 className='text-2xl font-bold'>{variant?.product.title}</h2>
						<ProductType variants={variant?.product.productVariants || []} />
						<Stars rating={reviewAvg} totalReviews={variant.product.reviews.length} />
						<Separator className='my-4'/>
						<p className='text-2xl font-medium'>{formatPrice(Number(variant?.product.price))}</p>
						<div dangerouslySetInnerHTML={{__html: variant?.product.description || ''}	}/>
						<p className=' text-accent-foreground/70 font-medium my-2'>
							Available	colors
						</p>
						<div className='flex gap-2'>
							{variant && variant.product.productVariants.map((variantItem) => (
								<ProductPick 
									key={variantItem.id} 
									variant={variantItem} 
								/>
							))}
						</div>
						<AddCart />
					</div>
				</section>
				<Reviews productID={variant.productID}/>



				<div className="container mx-auto px-4 py-8">
					<div className="grid lg:grid-cols-2 gap-8 mb-8">
						<ProductShowcase
							variants={variant?.product.productVariants || []}
						/>
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Badge className="bg-secondary text-white">Home & Living</Badge>
									<span className="text-gray-600">ChefMaster</span>
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">{variant?.product.title}</h1>
									<ProductType variants={variant?.product.productVariants || []} />
								</div>							

								<Stars size={19} rating={reviewAvg} totalReviews={variant.product.reviews.length} />

								<div className="flex items-center space-x-4 mb-6">
									<span className="text-3xl font-bold text-primary">{formatPrice(Number(variant?.product.price))}</span>
									{/* <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span> */}
									{/* <Badge variant="secondary" className="bg-green-100 text-green-800">
										Save ${(product.originalPrice - currentVariant.price).toFixed(2)}
									</Badge> */}
								</div>
								<p className=" text-gray-700 mb-6 line-clamp-3" dangerouslySetInnerHTML={{__html: variant?.product.description || ''}	}/>
							</div>
							{variant 
							? (
								<div className="flex flex-col gap-3">
									<h3 className="font-semibold">Choose color</h3>
									<div className="flex gap-2">
										{variant.product.productVariants.map((variantItem) => (
											<ProductPick 
												key={variantItem.id} 
												variant={variantItem} 
											/>
										))}
									</div>
								</div>
							) : null
						 }
						</div>
					</div>

				</div>
			</>
		);
	}
}