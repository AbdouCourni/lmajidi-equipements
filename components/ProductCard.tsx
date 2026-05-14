// src/components/ProductCard.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getProductImages } from '../types/product';


import type { Route } from 'next';

import {
  getProductBadge,
  getProductDisplayPrice,
  getProductStockStatus,
  type Product,
} from '../types/product';

import WhatsAppIcon from './WhatsAppIcon';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {

  const displayPrice =
    getProductDisplayPrice(product);

  const badge =
    getProductBadge(product);

  const stockStatus =
    getProductStockStatus(product);

  /* =========================================================
     PRIMARY IMAGE
  ========================================================= */

const primaryImage = product.isExternalSrc && product.imageExternalLinks?.length > 0
  ? product.imageExternalLinks[0]
  : product.images?.find(image => image.isPrimary)?.url || product.images?.[0]?.url;

  /* =========================================================
     WHATSAPP MESSAGE
  ========================================================= */

  const formatWhatsAppMessage = () => {

    const message =
      `*Nouvelle demande de devis*%0A%0A` +

      `*Produit:* ${product.name}%0A` +

      `*Marque:* ${
        product.brand ||
        'Non spécifiée'
      }%0A` +

      `*Prix:* ${displayPrice}%0A` +

      `*Référence:* ${
        product.id
      }%0A` +

      `*Lien:* https://europmat.com/produits/${product.id}%0A%0A` +

      `*Description:*%0A${
        product.description.substring(
          0,
          100
        )
      }%0A%0A` +

      `*Catégorie:* ${
        product.category
      }%0A` +

      `*Sous-catégorie:* ${
        product.subCategory ||
        'Non spécifiée'
      }%0A%0A` +

      `Je souhaite recevoir plus d'informations et un devis détaillé pour ce produit.`;

    return message;
  };
  return (

    <div className="relative group bg-white rounded-2xl overflow-hidden border border-steel shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* FULL LINK */}
      <Link
        href={`/produits/${product.id}` as Route}
        className="absolute inset-0 z-10"
      />

      {/* IMAGE */}
      {/* <div className="relative h-56 bg-gradient-to-br from-beige-warm to-steel overflow-hidden"> */}
<div className="relative h-56 bg-white from-beige-warm to-steel overflow-hidden">
        {primaryImage ? (

          <Image
            src={primaryImage || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw,
       (max-width: 1200px) 50vw,
       33vw"
          />

        ) : (

          <div className="absolute inset-0 flex items-center justify-center text-5xl">

            🏪

          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

        {/* BADGE */}
        {badge && (

          <div className="absolute top-3 left-3 z-20">

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                badge === 'PROMO'
                  ? 'bg-red-premium text-white'
                  : badge === 'SUR DEVIS'
                  ? 'bg-navy-main text-white'
                  : 'bg-charcoal text-white'
              }`}
            >

              {badge}

            </span>

          </div>
        )}

        {/* STOCK */}
        <div className="absolute top-3 right-3 z-20">

          <span
            className={`text-xs px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm ${stockStatus.color}`}
          >

            {stockStatus.label}

          </span>

        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col relative z-20">

        {/* BRAND */}
        <div className="text-xs uppercase tracking-wider text-steel-dark mb-1">

          {product.brand || 'Produit'}

        </div>

        {/* NAME */}
        <h3 className="font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-navy-main transition text-sm leading-snug">

          {product.name}

        </h3>

        {/* PRICE */}
        <div className="mb-3">

          <span className="text-xl font-bold text-navy-main">

            {displayPrice}

          </span>

        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-steel-dark line-clamp-2 mb-5 flex-grow">

          {product.description}

        </p>

        {/* CTA */}
        <div className="flex gap-2 relative z-30">

          {/* DETAILS */}
          <Link
            href={`/produits/${product.id}` as Route}
            className="flex-1 text-center bg-charcoal text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-main transition"
          >

            Voir détails

          </Link>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/212659783940?text=${formatWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
          >

            <WhatsAppIcon className="w-4 h-4" />

            <span>Devis</span>

          </a>

        </div>

      </div>

    </div>
  );
}