// src/app/produits/[id]/page.tsx

import Link from 'next/link';
import type { Route } from 'next';
import { getProductById, getRelatedProducts } from '../../../../lib/firebase/products';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold">Produit introuvable</h1>
      </div>
    );
  }

  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
        <Link href={'/produits' as Route} className="btn-primary">
          Voir les produits
        </Link>
      </div>
    );
  }

  // FIX: Use dedicated function with server-side filtering
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category,
    4
  );

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}