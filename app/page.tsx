
import { ProductList } from '@/entities/products/productsList';
import { db } from '@/server';

export default async function Home() {
  const variants = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (!variants) {
    return <div>No product variants found</div>;
  }
  return (
    <ProductList variants={variants} />
  );
}
