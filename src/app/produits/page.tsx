// src/app/produits/page.tsx

import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';
import { getAllProducts } from '../../../lib/firebase/products';
import type { Route } from 'next';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const allProducts = await getAllProducts();

  // NEXT 15/16 ASYNC SEARCH PARAMS
  const params = await searchParams;

  const search =
    typeof params?.search === 'string'
      ? params.search.toLowerCase()
      : '';

  const category =
    typeof params?.category === 'string'
      ? params.category.toLowerCase()
      : '';

  // FILTER PRODUCTS
  const filteredProducts = allProducts.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.brand?.toLowerCase().includes(search);

    const matchCategory =
      !category ||
      p.category?.toLowerCase().trim() === category.trim();

    return matchSearch && matchCategory;
  });

  // UNIQUE CATEGORIES
  const categories = Array.from(
    new Set(
      allProducts
        .map((p) => p.category)
        .filter(Boolean)
    )
  );

  return (
    <div className="container-custom py-8 bg-white">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Nos produits
        </h1>

        <p className="text-gray-600">
          {filteredProducts.length} produits trouvés
        </p>
      </div>

      {/* SEARCH */}
      <form className="mb-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <input
          type="text"
          name="search"
          placeholder="Rechercher un produit..."
          defaultValue={params?.search || ''}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* KEEP CATEGORY ON SEARCH */}
        {category && (
          <input
            type="hidden"
            name="category"
            value={category}
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Rechercher
        </button>
      </form>

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">

            <h2 className="font-bold text-gray-900 mb-5 text-lg">
              Catégories
            </h2>

            <div className="flex flex-col gap-2">

              {/* ALL PRODUCTS */}
              <Link
                href={'/produits' as Route}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                  !category
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tous les produits
              </Link>

              {/* CATEGORY LIST */}
              {categories.map((cat) => {
                const normalizedCat = cat.toLowerCase();

                return (
                  <Link
                    key={cat}
                    href={`/produits?category=${encodeURIComponent(cat)}` as Route}
                    className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition ${
                      category === normalizedCat
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat.replace(/-/g, ' ')}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun produit trouvé
              </h3>

              <p className="text-gray-500 mb-6">
                Essayez de modifier votre recherche ou catégorie.
              </p>

              <Link
                href={'/produits' as Route}
                className="btn-primary"
              >
                Voir tous les produits
              </Link>
            </div>
          ) : (
            <>
              {/* ACTIVE FILTERS */}
              {(search || category) && (
                <div className="flex flex-wrap gap-2 mb-6">

                  {search && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Recherche : {search}
                    </div>
                  )}

                  {category && (
                    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                      Catégorie : {category.replace(/-/g, ' ')}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}