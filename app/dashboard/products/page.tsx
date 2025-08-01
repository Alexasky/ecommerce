import { db } from '@/server'
import placeholderImage from '@/public/placeholder-image.jpg';
import { columns, DataTable } from '@/entities/products/productTable';

export default async function Products() {
	const products = await db.query.products.findMany({
		with: {
			productVariants: {
				with: {
					variantImages: true,
					variantTags: true,
				},
			}
		},
		orderBy: (products, {desc}) => [desc(products.id)],
	});

	if(!products) throw new Error('No products found');
	const dataTable = products.map((product) => {
		if (!product.productVariants || product.productVariants.length === 0) {
			return {
				id: product.id,
				title: product.title,
				price: product.price,
				variants: [],
				image: placeholderImage.src,
			}
		}
		const image = product.productVariants?.[0]?.variantImages?.[0]?.url || placeholderImage.src;
		return {
			id: product.id,
			title: product.title,
			price: product.price,
			variants: product.productVariants,
			image,
		}
	})
	if(!dataTable) throw new Error('No data found');
	return(
		<div>
			<DataTable columns={columns} data={dataTable} />
		</div>
	)
}