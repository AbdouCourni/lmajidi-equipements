// src/app/produits/[id]/page.tsx

import Link from 'next/link';
import type { Route } from 'next';
import { getProductById, getRelatedProducts } from '../../../../lib/firebase/products';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';


interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) return { title: 'Produit non trouvé' };

  return {
    title: `${product.name} | Europmat`,
    description: product.description?.substring(0, 160) || `${product.name} - Équipement professionnel de qualité`,
    alternates: { canonical: `https://europmat.com/produits/${id}` },
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      images: product.images?.[0]?.url ? [{ url: product.images[0].url, width: 800, height: 800 }] : [],
    },
  };
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