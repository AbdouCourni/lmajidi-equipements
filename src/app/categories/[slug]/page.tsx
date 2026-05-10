// src/app/categories/[slug]/page.tsx

import Link from 'next/link';

import type {
  Route,
} from 'next';

import {
  notFound,
} from 'next/navigation';

import ProductCard from '../../../../components/ProductCard';

import {
  getAllProducts,
} from '../../../../lib/firebase/products';

import {
  getAllCategories,
} from '../../../../lib/firebase/categories';

interface CategoryPageProps {

  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {

  /* =========================================================
     PARAMS
  ========================================================= */

  const { slug } =
    await params;

  /* =========================================================
     DATA
  ========================================================= */

  const [
    allProducts,
    allCategories,
  ] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  /* =========================================================
     CATEGORY
  ========================================================= */

  const category =
    allCategories.find(
      category =>
        category.slug === slug
    );

  if (!category) {

    notFound();
  }

  /* =========================================================
     SUB CATEGORIES
  ========================================================= */

  const subCategories =
    allCategories.filter(
      cat =>
        cat.parentId ===
        category.id
    );

  const subCategoryNames =
    subCategories.map(
      cat => cat.name
    );

  /* =========================================================
     PRODUCTS
  ========================================================= */

  const products =
    allProducts.filter(
      product => {

        // MAIN CATEGORY
        if (
          product.category ===
          category.name
        ) {

          return true;
        }

        // SUB CATEGORY
        if (
          subCategoryNames.includes(
            product.subCategory || ''
          )
        ) {

          return true;
        }

        return false;
      }
    );

  return (

    <div className="bg-white min-h-screen">

      {/* =====================================================
         HERO
      ===================================================== */}

      <section className="relative border-b border-steel overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-navy-main to-navy-accent opacity-95"></div>

        <div className="container-custom relative z-10 py-20 text-white">

          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-white/70 mb-6">

            <Link
              href={'/' as Route}
              className="hover:text-white transition"
            >
              Accueil
            </Link>

            <span>/</span>

            <Link
              href={'/produits' as Route}
              className="hover:text-white transition"
            >
              Produits
            </Link>

            <span>/</span>

            <span className="text-white">

              {category.name}

            </span>

          </div>

          {/* CONTENT */}
          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-5xl font-bold mb-5">

              {category.name}

            </h1>

            {category.description && (

              <p className="text-lg text-white/80 leading-relaxed">

                {category.description}

              </p>
            )}

            <div className="mt-8 flex items-center gap-4 text-sm text-white/70">

              <span>

                {products.length} produits

              </span>

              {subCategories.length >
                0 && (

                <span>

                  {subCategories.length} sous-catégories

                </span>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
         CONTENT
      ===================================================== */}

      <section className="container-custom py-10">

        <div className="grid lg:grid-cols-4 gap-8">

          {/* =================================================
             SIDEBAR
          ================================================= */}

          <aside>

            <div className="card-dashboard p-5 sticky top-24">

              {/* TITLE */}
              <h2 className="font-bold text-charcoal mb-5">

                Sous-catégories

              </h2>

              {/* SUB CATEGORIES */}
              <div className="space-y-2">

                {subCategories.length ===
                0 && (

                  <p className="text-sm text-steel-dark">

                    Aucune sous-catégorie

                  </p>
                )}

                {subCategories.map(
                  subCategory => (

                    <Link
                      key={
                        subCategory.id
                      }
                      href={`/categories/${subCategory.slug}` as Route}
                      className="block px-4 py-3 rounded-xl hover:bg-beige-warm transition text-sm text-charcoal"
                    >

                      {subCategory.name}

                    </Link>
                  )
                )}

              </div>

            </div>

          </aside>

          {/* =================================================
             PRODUCTS
          ================================================= */}

          <div className="lg:col-span-3">

            {/* EMPTY */}
            {products.length ===
            0 ? (

              <div className="card-dashboard p-16 text-center">

                <div className="text-6xl mb-5">

                  📦

                </div>

                <h2 className="text-2xl font-bold text-charcoal mb-3">

                  Aucun produit trouvé

                </h2>

                <p className="text-steel-dark mb-6">

                  Aucun produit disponible dans cette catégorie.

                </p>

                <Link
                  href={
                    '/produits' as Route
                  }
                  className="btn-primary"
                >

                  Voir tous les produits

                </Link>

              </div>

            ) : (

              <>
                {/* COUNT */}
                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-2xl font-bold text-charcoal">

                    Produits

                  </h2>

                  <p className="text-sm text-steel-dark">

                    {products.length} résultats

                  </p>

                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                  {products.map(
                    product => (

                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}

                </div>
              </>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}