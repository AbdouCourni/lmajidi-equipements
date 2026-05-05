// src/components/FeaturedProducts.tsx

import { getFeaturedProducts } from '../lib/firebase/products';
import FeaturedProductsClient from './FeaturedProductsClient';

export default async function FeaturedProducts() {
  try {
    const products = await getFeaturedProducts(8);

    return (
      <FeaturedProductsClient products={products} />
    );
  } catch (error) {
    console.error('Error loading products:', error);

    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          Erreur lors du chargement des produits
        </p>
      </div>
    );
  }
}
