// src/app/produits/page.tsx

import ProductCard from '../../../components/ProductCard';
import { getAllProducts } from '../../../lib/firebase/products';
import Link from 'next/link';


export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const allProducts = await getAllProducts();

const params = await searchParams;

const search =
  typeof params?.search === 'string'
    ? params.search.toLowerCase()
    : '';

const category =
  typeof params?.category === 'string'
    ? params.category.toLowerCase()
    : '';
    console.log('CATEGORY PARAM:', category);

  // FILTER LOGIC (SERVER SIDE ✅)
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
    new Set(allProducts.map((p) => p.category))
  );

  return (
    <div className="container-custom py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Nos produits
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} produits trouvés
        </p>
      </div>

      {/* SEARCH BAR */}
      <form className="mb-6 flex gap-2 max-w-xl">
        <input
          name="search"
          placeholder="Rechercher un produit..."
          defaultValue={searchParams?.search}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Rechercher
        </button>
      </form>

      {/* LAYOUT */}
      <div className="grid lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">

            <h2 className="font-bold text-gray-900 mb-4">
              Catégories
            </h2>

            <div className="flex flex-col gap-2">

              {/* ALL */}
             <Link
  href="/produits"
  className={`px-3 py-2 rounded-lg text-sm font-medium ${
    !category
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100'
  }`}
>
  Tous les produits
</Link>

{categories.map((cat) => (
  <Link
    key={cat}
    href={`/produits?category=${cat}`}
    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
      category === cat
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {cat}
  </Link>
))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier votre recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}