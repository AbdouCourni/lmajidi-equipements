// src/app/produits/page.tsx

import Link from 'next/link';

import type {
  Route,
} from 'next';

import ProductCard from '../../../components/ProductCard';

import {
  getAllProducts,
} from '../../../lib/firebase/products';

import {
  getMainCategories,
} from '../../../lib/firebase/categories';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {

  const params =
    await searchParams;

  const [
    allProducts,
    categories,
  ] = await Promise.all([
    getAllProducts(),
    getMainCategories(),
  ]);

  const search =
    typeof params.search ===
    'string'
      ? params.search.toLowerCase()
      : '';

  const category =
    typeof params.category ===
    'string'
      ? params.category.toLowerCase()
      : '';

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts =
    allProducts.filter(
      product => {

        const matchSearch =
          !search ||

          product.name
            .toLowerCase()
            .includes(search) ||

          product.description
            .toLowerCase()
            .includes(search) ||

          product.brand
            ?.toLowerCase()
            .includes(search);

        const matchCategory =
          !category ||

          product.category
            ?.toLowerCase()
            .trim() ===
            category.trim();

        return (
          matchSearch &&
          matchCategory
        );
      }
    );

  return (
    <div className="container-custom py-10">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-charcoal mb-3">

          Nos Produits

        </h1>

        <p className="text-steel-dark">

          {filteredProducts.length} produits trouvés

        </p>

      </div>

      {/* SEARCH */}
      <form className="mb-10 flex flex-col md:flex-row gap-3">

        <input
          type="text"
          name="search"
          placeholder="Rechercher un produit..."
          defaultValue={
            params.search || ''
          }
          className="input-field flex-1"
        />

        {category && (

          <input
            type="hidden"
            name="category"
            value={category}
          />
        )}

        <button
          type="submit"
          className="btn-primary"
        >

          Rechercher

        </button>

      </form>

      {/* LAYOUT */}
      <div className="grid lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <aside>

          <div className="card-dashboard p-5 sticky top-24">

            <h2 className="font-bold text-charcoal mb-5">

              Catégories

            </h2>

            <div className="flex flex-col gap-2">

              {/* ALL */}
              <Link
                href={
                  '/produits' as Route
                }
                className={`px-4 py-3 rounded-xl text-sm transition ${
                  !category
                    ? 'bg-navy-main text-white'
                    : 'hover:bg-beige-warm'
                }`}
              >

                Tous les produits

              </Link>

              {/* CATEGORIES */}
              {categories.map(
                cat => (

                  <Link
                    key={cat.id}
                    href={`/produits?category=${encodeURIComponent(cat.name)}` as Route}
                    className={`px-4 py-3 rounded-xl text-sm transition ${
                      category ===
                      cat.name.toLowerCase()
                        ? 'bg-navy-main text-white'
                        : 'hover:bg-beige-warm'
                    }`}
                  >

                    {cat.name}

                  </Link>
                )
              )}

            </div>

          </div>

        </aside>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">

          {filteredProducts.length ===
          0 ? (

            <div className="card-dashboard p-16 text-center">

              <div className="text-6xl mb-4">

                🔍

              </div>

              <h3 className="text-2xl font-bold mb-3">

                Aucun produit trouvé

              </h3>

              <p className="text-steel-dark mb-6">

                Essayez une autre recherche

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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {filteredProducts.map(
                product => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}