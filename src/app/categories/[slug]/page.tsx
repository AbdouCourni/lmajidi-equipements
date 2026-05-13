// src/app/categories/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import type { Metadata, Route } from 'next';
import { notFound } from 'next/navigation';

import ProductCard from '../../../../components/ProductCard';
import { getProducts } from '../../../../lib/firebase/products';
import { getAllCategories } from '../../../../lib/firebase/categories';
import { Product } from '../../../../types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const allCategories = await getAllCategories();
  const category = allCategories.find(cat => cat.slug === slug);
  
  if (!category) return { title: 'Catégorie non trouvée' };

  return {
    title: `${category.name} - Équipement Professionnel | Europmat`,
    description: category.description || `Découvrez notre gamme de ${category.name.toLowerCase()} pour professionnels au Maroc.`,
    alternates: { canonical: `https://europmat.com/categories/${slug}` },
  };
}
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [productsData, allCategories] = await Promise.all([
  getProducts({ limit: 1000 }),
  getAllCategories(),
]);

const allProducts = productsData.products; 

  const category = allCategories.find(cat => cat.slug === slug);

  if (!category) notFound();

  /* =========================================================
     FIND PARENT CATEGORY (if this is a subcategory)
  ========================================================= */

  const parentCategory = category.parentId
    ? allCategories.find(cat => cat.id === category.parentId) || null
    : null;

  /* =========================================================
     SUBCATEGORIES
  ========================================================= */

  // If this is a MAIN category, get its subcategories
  // If this is a SUB category, get its siblings (same parent)
  const subCategories = category.level === 'main'
    ? allCategories.filter(cat => cat.parentId === category.id && cat.level === 'sub')
    : allCategories.filter(cat => cat.parentId === category.parentId && cat.level === 'sub');

  const subCategorySlugs = subCategories.map(cat => cat.slug);

  /* =========================================================
     PRODUCTS
  ========================================================= */

  // If MAIN category: show products from this category AND all its subcategories
  // If SUB category: show ONLY products from this subcategory
const products = category.level === 'main'
    ? allProducts.filter((product: { category: string; subCategory: string; }) =>
        product.category === category.slug ||
        (product.subCategory && subCategorySlugs.includes(product.subCategory))
      )
    : allProducts.filter((product: { subCategory: string; category: string; }) =>
        product.subCategory === category.slug ||
        product.category === category.slug
      );

  /* =========================================================
     PRODUCTS PER SUBCATEGORY
  ========================================================= */

  function getSubCategoryProductCount(subCategorySlug: string): number {
    return allProducts.filter((p: { subCategory: string; }) => p.subCategory === subCategorySlug).length;
  }

  return (
    <div className="bg-white min-h-screen">

      {/* =====================================================
         HERO BANNER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-steel">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-main via-navy-professional to-navy-accent opacity-95"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container-custom relative z-10 py-10 md:py-14 text-white">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href={'/' as Route} className="hover:text-white transition">
              Accueil
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={'/categories' as Route} className="hover:text-white transition">
              Catégories
            </Link>

            {/* Show parent if this is a subcategory */}
            {parentCategory && (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/categories/${parentCategory.slug}` as Route}
                  className="hover:text-white transition"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}

            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{category.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {category.name}
              </h1>

              {category.description && (
                <p className="text-base text-white/70 leading-relaxed">
                  {category.description}
                </p>
              )}

              {/* Back to parent link (if this is a subcategory) */}
              {parentCategory && (
                <Link
                  href={`/categories/${parentCategory.slug}` as Route}
                  className="inline-flex items-center gap-2 mt-4 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour à {parentCategory.name}
                </Link>
              )}

              {/* Stats pills */}
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-sm font-medium">
                    {products.length} produit{products.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {subCategories.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {subCategories.length} sous-catégorie{subCategories.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {category.image && (
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm flex-shrink-0 border border-white/20">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
         MAIN CONTENT
      ===================================================== */}

      <section className="container-custom py-10">

        {/* =================================================
           SUBCATEGORIES SECTION
        ================================================= */}

        {subCategories.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-steel"></div>
              <h2 className="text-lg font-bold text-charcoal whitespace-nowrap">
                {category.level === 'main' ? 'Sous-catégories' : 'Autres sous-catégories'}
              </h2>
              <div className="h-px flex-1 bg-steel"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map(sub => {
                const count = getSubCategoryProductCount(sub.slug);
                const isActive = sub.slug === slug;

                return (
                  <Link
                    key={sub.id}
                    href={`/categories/${sub.slug}` as Route}
                    className={`group card-dashboard p-4 flex items-center gap-4 transition-all ${
                      isActive
                        ? 'border-navy-accent bg-beige-warm/50 ring-1 ring-navy-accent'
                        : 'hover:border-navy-accent'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-beige-warm flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition">
                      {sub.image ? (
                        <Image
                          src={sub.image}
                          alt={sub.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-navy-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal text-sm group-hover:text-navy-main transition">
                        {sub.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-steel-dark">
                          {count} produit{count !== 1 ? 's' : ''}
                        </span>
                        {!isActive && (
                          <span className="text-navy-accent text-xs group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================
           PRODUCTS SECTION
        ================================================= */}

        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-charcoal whitespace-nowrap">
                {category.level === 'main' ? 'Tous les produits' : `Produits - ${category.name}`}
              </h2>
            </div>
            <p className="text-sm text-steel-dark flex-shrink-0">
              {products.length} résultat{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="card-dashboard p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-charcoal mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-sm text-steel-dark mb-5 max-w-md mx-auto">
                Aucun produit n'est disponible dans cette catégorie pour le moment.
              </p>
              <Link href={'/categories' as Route} className="btn-primary text-sm">
                Explorer d'autres catégories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}