// src/components/CategoryCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Category } from '../types/category';

interface CategoryCardProps {
  category: Category;
  productCount: number;
}

export default function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}` as Route}
      className="group relative bg-white rounded-3xl overflow-hidden border border-steel hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden bg-beige-warm">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl">
            📦
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* CONTENT */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {category.name}
              </h2>

              <p className="text-white/80 text-sm">
                {productCount} produit{productCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:translate-x-1 transition">
              →
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="p-6">
        <p className="text-steel-dark leading-relaxed line-clamp-3">
          {category.description || 'Découvrez nos équipements professionnels.'}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-navy-main font-semibold text-sm">
          <span>
            Découvrir {productCount} produit{productCount !== 1 ? 's' : ''}
          </span>

          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}