// src/components/FeaturedProducts.tsx

import { getProducts } from '../lib/firebase/products';
import { Product } from '../types/product';
import ProductCard from './ProductCard';

export default async function FeaturedProducts() {
  const { products } = await getProducts({ 
    featured: true, 
    limit: 8 
  });

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}