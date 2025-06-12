import { ProductPick } from '@/entities/products/productPick';
import { ProductType } from '@/entities/products/productType';
import { db } from '@/server';
import { productVariants } from '@/server/schema';
import { Separator } from '@/shared/components/ui/separator';
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
	const variant = await db.query.productVariants.findFirst({
		where: eq(productVariants.id, Number(params.slug)),	
		with: {
			product: {
				with: {
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
	return (
		<section>
			<div className='flex flex-1'>
				Images
			</div>
			<div className='flex flex-1 flex-col gap-2'>
				<h2>{variant?.product.title}</h2>
				<ProductType variants={variant?.product.productVariants || []} />
				<Separator/>
				<p className='text-2xl font-medium'>formatPrice({variant?.product.price})</p>
				<div dangerouslySetInnerHTML={{__html: variant?.product.description || ''}	}/>
				<div className='flex gap-2'>
					{variant && variant.product.productVariants.map((variantItem) => (
						<ProductPick 
							key={variantItem.id} 
							variant={variantItem} 
						/>
					))}
				</div>
			</div>
		</section>		
	);
}