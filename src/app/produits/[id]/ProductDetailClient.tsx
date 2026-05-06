// src/app/produits/[id]/ProductDetailClient.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Product } from '../../../../types/product';

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const displayPrice =
    product.price !== null
      ? `${product.price} ${product.currency}`
      : 'Sur devis';

  return (
    <div className="container-custom py-10 bg-white">

      {/* BREADCRUMB */}
      <div className="text-sm text-gray-500 mb-6 flex gap-2">

        <Link href={'/' as Route}>
          Accueil
        </Link>

        <span>›</span>

        <Link href={'/produits' as Route}>
          Produits
        </Link>

        <span>›</span>

        <span className="text-gray-900 font-medium">
          {product.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">

        {/* IMAGE */}
        <div className="relative h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">

          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-6xl">
              🏪
            </div>
          )}

        </div>

        {/* INFO */}
        <div>

          {/* BRAND */}
          <p className="text-sm text-gray-400 uppercase mb-2">
            {product.brand || 'Produit'}
          </p>

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* PRICE */}
          <div className="text-2xl font-bold text-blue-600 mb-6">
            {displayPrice}
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* VARIANTS */}
          {product.variants.length > 0 && (
            <div className="mb-6">

              <h3 className="font-semibold text-gray-900 mb-2">
                Variantes disponibles :
              </h3>

              <div className="flex flex-wrap gap-2">

                {product.variants.map((v, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {v.color || v.sku}
                  </span>
                ))}

              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">

            <a
              href={`https://wa.me/212625652015?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center"
            >
              💬 Demander un devis
            </a>

            <Link
              href={'/produits' as Route}
              className="btn-secondary text-center"
            >
              ← Retour catalogue
            </Link>

          </div>

          {/* TRUST */}
          <div className="mt-8 text-sm text-gray-500 flex flex-wrap gap-6">
            <span>✔ Livraison rapide</span>
            <span>✔ Garantie</span>
            <span>✔ Support 24/7</span>
          </div>

        </div>
      </div>

      {/* SPECIFICATIONS */}
      {product.specifications &&
        Object.keys(product.specifications).length > 0 && (
          <div className="mt-12">

            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Spécifications
            </h2>

            <div className="bg-white rounded-xl border border-gray-100 divide-y">

              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between p-4 text-sm"
                >
                  <span className="text-gray-500">
                    {key}
                  </span>

                  <span className="font-medium text-gray-900">
                    {value}
                  </span>
                </div>
              ))}

            </div>
          </div>
        )}
    </div>
  );
}