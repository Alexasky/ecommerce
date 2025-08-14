import { ProductForm } from '@/entities/products/productForm';
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation';

export default async function AddProduct() {
	const session = await auth();

	if ( session?.user.role !== 'admin' ) redirect('/dashboard/settings');
	return (
		<div>
			<ProductForm />
		</div>
	)
}