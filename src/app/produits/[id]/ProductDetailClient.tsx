// src/app/produits/[id]/ProductDetailClient.tsx

'use client';

import Image from 'next/image';

import Link from 'next/link';

import type {
  Route,
} from 'next';

import type {
  Product,
} from '../../../../types/product';

import ProductCard from '../../../../components/ProductCard';
import { getPrimaryImage, getProductImages } from '../../../../types/product';


interface ProductDetailClientProps {
  product: Product;

  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {


  /* =========================================================
 IMAGES
========================================================= */

  // Use getPrimaryImage and getProductImages helpers
  const primaryImage = getPrimaryImage(product);
  const displayImages = getProductImages(product);

  /* =========================================================
     PRICE
  ========================================================= */

  const displayPrice =

    product.price !== null

      ? `${product.price.toLocaleString(
        'fr-MA'
      )} ${product.currency}`

      : 'Sur devis';

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const whatsappMessage =
    encodeURIComponent(

      `Bonjour, je souhaite recevoir un devis pour :

Produit : ${product.name}
Référence : ${product.id}
Catégorie : ${product.category}

Merci.`
    );

  return (

    <div className="bg-white">

      {/* =====================================================
         BREADCRUMB
      ===================================================== */}

      <div className="border-b border-steel">

        <div className="container-custom py-4">

          <div className="flex items-center gap-2 text-sm text-steel-dark">

            <Link
              href={'/' as Route}
              className="hover:text-navy-main transition"
            >
              Accueil
            </Link>

            <span>/</span>

            <Link
              href={'/produits' as Route}
              className="hover:text-navy-main transition"
            >
              Produits
            </Link>

            <span>/</span>

            <span className="text-charcoal font-medium">

              {product.name}

            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
         PRODUCT
      ===================================================== */}

      <section className="container-custom py-10">

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* =================================================
             IMAGES
          ================================================= */}

          <div>

            {/* MAIN IMAGE */}
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-steel bg-white">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-7xl">
                  🏪
                </div>
              )}
            </div>

            {/* GALLERY */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {displayImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-steel bg-beige-warm"
                  >
                    <Image
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* =================================================
             INFO
          ================================================= */}

          <div>

            {/* BRAND */}
            <p className="text-sm uppercase tracking-wider text-steel-dark mb-3">

              {product.brand ||
                'Produit'}

            </p>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight mb-5">

              {product.name}

            </h1>

            {/* CATEGORY */}
            <div className="mb-5">

              <span className="badge-beige capitalize">

                {product.category?.replace(
                  /-/g,
                  ' '
                )}

              </span>

            </div>

            {/* PRICE */}
            <div className="text-4xl font-bold text-navy-main mb-8">

              {displayPrice}

            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">

              <h2 className="text-lg font-semibold text-charcoal mb-3">

                Description

              </h2>

              <p className="text-steel-dark leading-relaxed whitespace-pre-line">

                {product.description}

              </p>

            </div>

            {/* KEY SPECS */}
            {product.keySpecs &&
              product.keySpecs.length >
              0 && (

                <div className="mb-8">

                  <h2 className="text-lg font-semibold text-charcoal mb-4">

                    Points clés

                  </h2>

                  <div className="space-y-3">

                    {product.keySpecs.map(
                      (
                        spec,
                        index
                      ) => (

                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <div className="w-2 h-2 rounded-full bg-navy-main mt-2"></div>

                          <p className="text-steel-dark">

                            {spec}

                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">

              <a
                href={`https://wa.me/212625652015?text=${whatsappMessage}`}
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
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-steel-dark">

              <span>
                ✔ Livraison rapide
              </span>

              <span>
                ✔ Garantie qualité
              </span>

              <span>
                ✔ Support professionnel
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
           SPECIFICATIONS
        ===================================================== */}

        {product.specifications &&
          Object.keys(
            product.specifications
          ).length > 0 && (

            <div className="mt-16">

              <h2 className="text-2xl font-bold text-charcoal mb-6">

                Spécifications techniques

              </h2>

              <div className="rounded-2xl border border-steel overflow-hidden">

                {Object.entries(
                  product.specifications
                )

                  .filter(
                    ([_, value]) =>
                      value
                  )

                  .map(
                    (
                      [key, value]
                    ) => (

                      <div
                        key={key}
                        className="grid grid-cols-2 border-b border-steel last:border-0"
                      >

                        <div className="bg-beige-warm/60 px-4 py-3 font-medium text-charcoal capitalize">

                          {key.replace(
                            /_/g,
                            ' '
                          )}

                        </div>

                        <div className="px-4 py-3 text-steel-dark">

                          {String(
                            value
                          )}

                        </div>

                      </div>
                    )
                  )}

              </div>

            </div>
          )}

      </section>

      {/* =====================================================
         RELATED PRODUCTS
      ===================================================== */}

      {relatedProducts.length >
        0 && (

          <section className="py-16 bg-beige-warm/40 border-t border-steel">

            <div className="container-custom">

              <div className="mb-8">

                <h2 className="text-3xl font-bold text-charcoal">

                  Produits similaires

                </h2>

                <p className="text-steel-dark mt-2">

                  Découvrez d'autres équipements similaires

                </p>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                {relatedProducts.map(
                  relatedProduct => (

                    <ProductCard
                      key={
                        relatedProduct.id
                      }
                      product={
                        relatedProduct
                      }
                    />
                  )
                )}

              </div>

            </div>

          </section>
        )}

    </div>
  );
}