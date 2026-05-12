// src/app/produits/page.tsx

import Link from 'next/link';
import type { Route } from 'next';
import ProductCard from '../../../components/ProductCard';
import { getProducts } from '../../../lib/firebase/products';
import { getMainCategories } from '../../../lib/firebase/categories';
import { Product } from '../../../types/product';
import { Key } from 'react';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const search = typeof params.search === 'string' ? params.search : '';
  const categoryParam = typeof params.category === 'string' ? params.category : '';
  const currentPage = parseInt(params.page || '1', 10);
  const ITEMS_PER_PAGE = 12;

  const [categories, productsData] = await Promise.all([
    getMainCategories(),
    getProducts({
      category: categoryParam || undefined, // Pass slug directly
      search: search || undefined,
      limit: ITEMS_PER_PAGE,
      page: currentPage,
    }),
  ]);

  const { products, total, totalPages, hasMore } = productsData;

  // Find the category display name from slug
  const activeCategory = categoryParam
    ? categories.find(c => c.slug === categoryParam) || 
      categories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase())
    : null;

  // Get popular search suggestions (when no results or empty search)
  const popularSearches = ['Réfrigérateur', 'Four', 'Pizza', 'Vitrine', 'Pétrin', 'Friteuse', 'Inox'];

  return (
    <div className="container-custom py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-charcoal mb-3">
          {activeCategory 
            ? activeCategory.name
            : search 
              ? `Recherche: "${search}"`
              : 'Nos Produits'
          }
        </h1>
        <p className="text-steel-dark">
          {total} produit{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* SEARCH + FILTER BAR */}
      <form className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="search"
            placeholder="Rechercher un produit..."
            defaultValue={search}
            className="input-field pl-10"
            autoComplete="off"
            list="search-suggestions"
          />
          <datalist id="search-suggestions">
            {popularSearches.map(term => (
              <option key={term} value={term} />
            ))}
            {/* Add product name suggestions */}
            {products.slice(0, 5).map((p: { id: Key | null | undefined; name: string | number | readonly string[] | undefined; }) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
        </div>
        {categoryParam && (
          <input type="hidden" name="category" value={categoryParam} />
        )}
        <button type="submit" className="btn-primary whitespace-nowrap">
          Rechercher
        </button>
        {(search || categoryParam) && (
          <Link href={'/produits' as Route} className="btn-secondary whitespace-nowrap">
            Effacer les filtres
          </Link>
        )}
      </form>

      {/* SEARCH SUGGESTIONS (when no results) */}
      {products.length === 0 && search && (
        <div className="mb-8 p-5 bg-beige-warm rounded-xl border border-steel">
          <p className="text-sm text-charcoal mb-3">
            Aucun résultat pour &ldquo;{search}&rdquo;. Essayez:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(term => (
              <Link
                key={term}
                href={`/produits?search=${encodeURIComponent(term)}` as Route}
                className="px-3 py-1.5 bg-white rounded-full text-sm text-navy-main hover:bg-navy-main hover:text-white transition border border-steel"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE FILTERS */}
      {(search || categoryParam) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-steel-dark">Filtres actifs:</span>
          {activeCategory && (
            <span className="badge-navy text-xs flex items-center gap-1">
              {activeCategory.name}
              <Link 
                href={`/produits${search ? `?search=${encodeURIComponent(search)}` : ''}` as Route} 
                className="hover:text-red-400 ml-1"
              >
                ×
              </Link>
            </span>
          )}
          {search && (
            <span className="badge-beige text-xs flex items-center gap-1">
              &ldquo;{search}&rdquo;
              <Link 
                href={`/produits${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}` as Route} 
                className="hover:text-red-400 ml-1"
              >
                ×
              </Link>
            </span>
          )}
        </div>
      )}

      {/* LAYOUT */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* SIDEBAR */}
        <aside>
          <div className="card-dashboard p-5 sticky top-24">
            <h2 className="font-bold text-charcoal mb-4">Catégories</h2>
            <div className="flex flex-col gap-1">
              <Link
                href={'/produits' as Route}
                className={`px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-between ${
                  !categoryParam ? 'bg-navy-main text-white' : 'hover:bg-beige-warm text-charcoal'
                }`}
              >
                <span>Tous les produits</span>
                {!categoryParam && <span className="text-xs opacity-70">({total})</span>}
              </Link>

              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/produits?category=${encodeURIComponent(cat.slug)}` as Route}
                  className={`px-4 py-2.5 rounded-xl text-sm transition ${
                    categoryParam === cat.slug
                      ? 'bg-navy-main text-white'
                      : 'hover:bg-beige-warm text-charcoal'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="card-dashboard p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Aucun produit trouvé</h3>
              <p className="text-steel-dark mb-6">
                {search 
                  ? `Aucun résultat pour "${search}"`
                  : categoryParam 
                    ? 'Aucun produit dans cette catégorie'
                    : 'Aucun produit disponible'}
              </p>
              <Link href={'/produits' as Route} className="btn-primary">
                Voir tous les produits
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {currentPage > 1 && (
                    <Link
                      href={`/produits?${new URLSearchParams({
                        ...(search && { search }),
                        ...(categoryParam && { category: categoryParam }),
                        page: String(currentPage - 1),
                      }).toString()}` as Route}
                      className="btn-secondary text-sm"
                    >
                      ← Précédent
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <Link
                        key={pageNum}
                        href={`/produits?${new URLSearchParams({
                          ...(search && { search }),
                          ...(categoryParam && { category: categoryParam }),
                          page: String(pageNum),
                        }).toString()}` as Route}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${
                          pageNum === currentPage
                            ? 'bg-navy-main text-white'
                            : 'hover:bg-beige-warm text-charcoal'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ))}
                  </div>

                  {hasMore && (
                    <Link
                      href={`/produits?${new URLSearchParams({
                        ...(search && { search }),
                        ...(categoryParam && { category: categoryParam }),
                        page: String(currentPage + 1),
                      }).toString()}` as Route}
                      className="btn-secondary text-sm"
                    >
                      Suivant →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}