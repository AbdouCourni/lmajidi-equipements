// src/app/categories/[slug]/page.tsx

import ProductCard from '../../../../components/ProductCard';
import { getProductsByCategory } from '../../../../lib/firebase/products';

const categoryNames: Record<string, string> = {
  refrigeration: 'Réfrigération',
  cooking: 'Cuisson',
  bakery: 'Boulangerie & Pâtisserie',
  preparation: 'Préparation',
  'snack-equipment': 'Équipement Snack',
  furniture: 'Mobilier',
};

const categoryIcons: Record<string, string> = {
  refrigeration: '❄️',
  cooking: '🔥',
  bakery: '🍞',
  preparation: '🔪',
  'snack-equipment': '🍿',
  furniture: '🪑',
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const products = await getProductsByCategory(slug);

  const categoryName = categoryNames[slug] || slug;
  const categoryIcon = categoryIcons[slug] || '📦';

  return (
    <div className="container-custom py-8 bg-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{categoryIcon}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-600">{products.length} produits</p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          Aucun produit
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
