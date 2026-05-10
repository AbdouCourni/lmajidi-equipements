// src/app/categories/page.tsx

import Image from 'next/image';

import Link from 'next/link';

import type {
  Route,
} from 'next';

import {
  getAllProducts,
} from '../../../lib/firebase/products';

import {
  getMainCategories,
} from '../../../lib/firebase/categories';

export default async function CategoriesPage() {

  /* =========================================================
     DATA
  ========================================================= */

  const [
    categories,
    products,
  ] = await Promise.all([
    getMainCategories(),
    getAllProducts(),
  ]);

  /* =========================================================
     CATEGORY COUNTS
  ========================================================= */

  const categoryCounts =
    products.reduce(
      (acc, product) => {

        if (!product.category) {
          return acc;
        }

        acc[
          product.category
        ] =

          (
            acc[
              product.category
            ] || 0
          ) + 1;

        return acc;

      },
      {} as Record<
        string,
        number
      >
    );

  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="bg-white min-h-screen">

      {/* =====================================================
         HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-steel">

        <div className="absolute inset-0 bg-gradient-to-r from-navy-main to-navy-accent opacity-95"></div>

        <div className="container-custom relative z-10 py-20 text-white">

          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-5xl font-bold mb-6">

              Nos Catégories

            </h1>

            <p className="text-lg text-white/80 leading-relaxed">

              Découvrez notre gamme complète d'équipements professionnels pour restaurants, boulangeries, pâtisseries, snacks et cuisines professionnelles.

            </p>

            <div className="flex flex-wrap gap-6 mt-8 text-sm text-white/70">

              <span>

                {categories.length} catégories

              </span>

              <span>

                {products.length} produits

              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
         CATEGORIES GRID
      ===================================================== */}

      <section className="container-custom py-12">

        {categories.length ===
        0 ? (

          <div className="card-dashboard p-16 text-center">

            <div className="text-6xl mb-5">

              📂

            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-3">

              Aucune catégorie

            </h2>

            <p className="text-steel-dark">

              Les catégories seront bientôt disponibles.

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {categories.map(
              category => {

                const productCount =

                  categoryCounts[
                    category.name
                  ] || 0;

                return (

                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}` as Route}
                    className="group relative bg-white rounded-3xl overflow-hidden border border-steel hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >

                    {/* IMAGE */}
                    <div className="relative h-64 overflow-hidden bg-beige-warm">

                      {category.image ? (

                        <Image
                          src={
                            category.image
                          }
                          alt={
                            category.name
                          }
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

                              {productCount} produits

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

                        {category.description ||

                          'Découvrez nos équipements professionnels.'}

                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-navy-main font-semibold text-sm">

                        <span>
                          Découvrir
                        </span>

                        <span className="group-hover:translate-x-1 transition-transform">

                          →

                        </span>

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}