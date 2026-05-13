// src/app/produits/page.tsx

import Link from 'next/link';
import type { Route } from 'next';
import ProductCard from '../../../components/ProductCard';
import { getProductsPage } from '../../../lib/firebase/products';
import { getMainCategories } from '../../../lib/firebase/categories';
import type { Product } from '../../../types/product';
import type { Metadata } from 'next';


interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}
export const metadata: Metadata = {
  title: 'Catalogue Équipement Professionnel | Europmat',
  description: 'Découvrez notre gamme complète d\'équipements professionnels pour restaurants, boulangeries et snacks au Maroc. Réfrigération, cuisson, préparation, mobilier.',
  alternates: { canonical: 'https://europmat.com/produits' },
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const search = typeof params.search === 'string' ? params.search : '';
  const categoryParam = typeof params.category === 'string' ? params.category : '';
  const currentPage = parseInt(params.page || '1', 10);

  const [categories, productsData] = await Promise.all([
    getMainCategories(),
    getProductsPage({
      categoryId: categoryParam || undefined,
      search: search || undefined,
      limitCount: 30,
      page: currentPage,
    }),
  ]);

  const { products, total, totalPages, hasMore } = productsData;

  const activeCategory = categoryParam
    ? categories.find(c => c.slug === categoryParam) || categories.find(c => c.name.toLowerCase() === categoryParam.toLowerCase())
    : null;

  return (
    <div className="min-h-screen bg-white">
      
      {/* FIXED SEARCH BAR + CATEGORIES */}
      <div className="sticky top-0 z-40 bg-white border-b border-steel shadow-sm">
        <div className="container-custom py-3">
          
          {/* SEARCH ROW */}
          <form action="/produits" method="GET" className="flex items-center gap-2">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-steel-dark z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Rechercher un produit..."
                className="input-field pl-10 pr-10"
                autoComplete="off"
              />
              {search && (
                <Link
                  href={`/produits${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}` as Route}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-dark hover:text-red-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
            </div>
            {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
            <button type="submit" className="btn-primary text-sm px-4 py-2.5 whitespace-nowrap">
              Rechercher
            </button>
            {(search || categoryParam) && (
              <Link href={'/produits' as Route} className="btn-ghost text-sm whitespace-nowrap">
                Effacer
              </Link>
            )}
          </form>

          {/* CATEGORIES ROW - Desktop: next to search, Mobile: below */}
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            <Link
              href={'/produits' as Route}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                !categoryParam ? 'bg-navy-main text-white' : 'bg-beige-warm text-charcoal hover:bg-steel'
              }`}
            >
              Tous
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/produits?category=${encodeURIComponent(cat.slug)}` as Route}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  categoryParam === cat.slug ? 'bg-navy-main text-white' : 'bg-beige-warm text-charcoal hover:bg-steel'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        
       

        {/* ACTIVE FILTERS */}
        {(search || categoryParam) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-steel-dark">Filtres:</span>
            {activeCategory && (
              <span className="badge-navy text-xs flex items-center gap-1">
                {activeCategory.name}
                <Link href={`/produits${search ? `?search=${encodeURIComponent(search)}` : ''}` as Route} className="hover:text-red-400 ml-1">×</Link>
              </span>
            )}
            {search && (
              <span className="badge-beige text-xs flex items-center gap-1">
                &ldquo;{search}&rdquo;
                <Link href={`/produits${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}` as Route} className="hover:text-red-400 ml-1">×</Link>
              </span>
            )}
          </div>
        )}

        {/* NO RESULTS */}
        {products.length === 0 ? (
          <div className="card-dashboard p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">Aucun produit trouvé</h3>
            <p className="text-steel-dark text-sm">
              {search 
                ? `Aucun résultat pour "${search}"`
                : categoryParam 
                  ? 'Aucun produit dans cette catégorie'
                  : 'Aucun produit disponible'}
            </p>
          </div>
        ) : (
          <>
            {/* PRODUCT GRID - 4 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/produits?${new URLSearchParams({
                      ...(search && { search }),
                      ...(categoryParam && { category: categoryParam }),
                      page: String(currentPage - 1),
                    }).toString()}` as Route}
                    className="btn-secondary text-xs px-3 py-2"
                  >
                    ← Précédent
                  </Link>
                )}
                
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const start = Math.max(1, currentPage - 2);
                    const end = Math.min(totalPages, start + 4);
                    const pageNum = start + i;
                    if (pageNum > end) return null;
                    return (
                      <Link
                        key={pageNum}
                        href={`/produits?${new URLSearchParams({
                          ...(search && { search }),
                          ...(categoryParam && { category: categoryParam }),
                          page: String(pageNum),
                        }).toString()}` as Route}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition ${
                          pageNum === currentPage ? 'bg-navy-main text-white' : 'hover:bg-beige-warm text-charcoal'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                <span className="sm:hidden text-xs text-steel-dark">
                  {currentPage} / {totalPages}
                </span>

                {hasMore && (
                  <Link
                    href={`/produits?${new URLSearchParams({
                      ...(search && { search }),
                      ...(categoryParam && { category: categoryParam }),
                      page: String(currentPage + 1),
                    }).toString()}` as Route}
                    className="btn-secondary text-xs px-3 py-2"
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
  );
}