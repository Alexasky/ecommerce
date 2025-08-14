
import { db } from '@/server';
import { ProductList } from '@/entities/products/productsList';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { CreditCard, Shield, Star, Truck } from 'lucide-react';

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
    <>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Quality Goods,
            <span className="text-[#37999f]"> Smart Prices</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover premium products for your home, family, and lifestyle. Carefully curated for the discerning shopper
            who values both quality and value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-[#37999f] hover:bg-[#37999f]/90 text-white px-8">
                Shop Now
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="border-[#cb962e] text-[#cb962e] hover:bg-[#cb962e] hover:text-white px-8 bg-transparent"
              >
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="w-8 h-8 text-[#37999f] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">Every product tested for excellence</p>
            </div>
            <div className="text-center">
              <Truck className="w-8 h-8 text-[#37999f] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Free delivery on orders over $50</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-8 h-8 text-[#37999f] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Your transactions are protected</p>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-[#37999f] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Top Rated</h3>
              <p className="text-sm text-gray-600">4.8/5 customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Hand-picked items that deliver exceptional value</p>
          </div>
          <ProductList variants={variants} />
        </div>
      </section>      
    </>    
  );
}
