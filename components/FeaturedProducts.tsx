// src/components/FeaturedProducts.tsx

import Link from 'next/link';
import type { Route } from 'next';
import { getProducts } from '../lib/firebase/products';
import { Product } from '../types/product';
import ProductCard from './ProductCard';

export default async function FeaturedProducts() {
  const { products } = await getProducts({ 
    page: 2, 
    limit: 8 
  });

  if (products.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link
          href={'/produits' as Route}
          className="bg-white text-navy-main hover:bg-navy-main hover:text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg inline-flex items-center gap-2 border border-steel"
        >
          Voir tous les produits
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}