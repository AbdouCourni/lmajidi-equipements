// src/components/ProductCard.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
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

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = getProductDisplayPrice(product);
  const badge = getProductBadge(product);
  const stockStatus = getProductStockStatus(product);

  const variantColors = product.variants
    .filter(v => v.color)
    .map(v => v.color)
    .slice(0, 3);

  // Format WhatsApp message with product details
  const formatWhatsAppMessage = () => {
    const message = `*Nouvelle demande de devis*%0A%0A` +
      `*Produit:* ${product.name}%0A` +
      `*Marque:* ${product.brand || 'Non spécifiée'}%0A` +
      `*Prix:* ${displayPrice}%0A` +
      `*Référence:* ${product.id}%0A%0A` +
      `*Description:*%0A${product.description.substring(0, 100)}%0A%0A` +
      `*Catégorie:* ${product.category}%0A` +
      `*Sous-catégorie:* ${product.subCategory}%0A%0A` +
      `Je souhaite recevoir plus d'informations et un devis détaillé pour ce produit.`;
    
    return message;
  };

  return (
    <div className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">

      {/* FULL CLICKABLE LINK */}
      <Link
        href={`/produits/${product.id}` as Route}
        className="absolute inset-0 z-10"
      />

      {/* IMAGE */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            🏪
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

        {/* BADGE */}
        {badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg shadow ${
              badge === 'PROMO'
                ? 'bg-red-500 text-white'
                : badge === 'SUR DEVIS'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white'
            }`}>
              {badge}
            </span>
          </div>
        )}

        {/* STOCK */}
        <div className="absolute top-3 right-3 z-20">
          <span className={`text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur shadow ${stockStatus.color}`}>
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col relative z-20">

        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          {product.brand || 'Produit'}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition text-sm leading-snug">
          {product.name}
        </h3>

        {variantColors.length > 0 && (
          <div className="text-xs text-gray-500 mb-2">
            <span className="font-medium">Couleurs:</span>{' '}
            {variantColors.join(', ')}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            {displayPrice}
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* CTA BUTTONS */}
        <div className="flex gap-2 relative z-30">
          
          <Link
            href={`/produits/${product.id}` as Route}
            className="flex-1 text-center bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
          >
            Voir détails
          </Link>

          <a
            href={`https://wa.me/212625652015?text=${formatWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition flex items-center justify-center gap-1.5"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Devis</span>
          </a>
        </div>
      </div>
    </div>
  );
}