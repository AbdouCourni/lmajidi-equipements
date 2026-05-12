// src/app/categories/page.tsx

import CategoryCard from '../../../components/CategoryCard';
import { getProducts } from '../../../lib/firebase/products';
import { getMainCategories, getAllCategories } from '../../../lib/firebase/categories';

export default async function CategoriesPage() {
  const [categories, allCategories, productsData] = await Promise.all([
    getMainCategories(),
    getAllCategories(),
    getProducts({ limit: 1000 }), // Fetch up to 1000 for counting
  ]);

  // FIX: Destructure the products array from the returned object
  const products = productsData.products;

  /* FIXED: Match by slug instead of name */
  function getProductCount(categoryId: string, categorySlug: string): number {
    const subCategorySlugs = allCategories
      .filter(cat => cat.parentId === categoryId && cat.level === 'sub')
      .map(cat => cat.slug);

    return products.filter((product: { category: string; subCategory: string; }) =>
      product.category === categorySlug ||
      (product.subCategory && subCategorySlugs.includes(product.subCategory))
    ).length;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-steel">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-main to-navy-accent opacity-95"></div>
        <div className="container-custom relative z-10 py-20 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Catégories</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Découvrez notre gamme complète d'équipements professionnels pour restaurants, boulangeries, pâtisseries, snacks et cuisines professionnelles.
            </p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-white/70">
              <span>{categories.length} catégories</span>
              <span>{products.length} produits</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="container-custom py-12">
        {categories.length === 0 ? (
          <div className="card-dashboard p-16 text-center">
            <div className="text-6xl mb-5">📂</div>
            <h2 className="text-2xl font-bold text-charcoal mb-3">Aucune catégorie</h2>
            <p className="text-steel-dark">Les catégories seront bientôt disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={getProductCount(category.id, category.slug)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}