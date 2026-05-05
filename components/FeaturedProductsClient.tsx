// src/components/FeaturedProductsClient.tsx

'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types/product';

export default function FeaturedProductsClient({
  products,
}: {
  products: Product[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Optional loading effect (for hydration smoothness)
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aucun produit disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
