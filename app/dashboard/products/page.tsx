import { db } from '@/server'
import placeholderImage from '@/public/placeholder-image.jpg';
import { columns, DataTable } from '@/entities/products/productTable';

export default async function Products() {
	const products = await db.query.products.findMany({
		orderBy: (products, {desc}) => [desc(products.id)],
	});
	if(!products) throw new Error('No products found');
	const dataTable = products.map((product) => {
		return {
			id: product.id,
			title: product.title,
			description: product.description,
			price: product.price,
			variants: [],
			image: placeholderImage.src,
		}
	})
	if(!dataTable) throw new Error('No data found');
	return(
		<div>
			<DataTable columns={columns} data={dataTable} />
		</div>
	)
}