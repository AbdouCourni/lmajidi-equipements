// src/app/produits/[id]/page.tsx

import Link from 'next/link';
import type { Route } from 'next';
import { getProductById, getAllProducts } from '../../../../lib/firebase/products';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container-custom py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Link href={'/produits' as Route} className="btn-primary">
          Voir tous les produits
        </Link>
      </div>
    );
  }

  // 🔥 GET RELATED PRODUCTS
  const allProducts = await getAllProducts();

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category?.toLowerCase() === product.category?.toLowerCase()
    )
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
    />
  );
}