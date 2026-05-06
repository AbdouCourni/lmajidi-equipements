// src/app/categories/page.tsx
import Link from 'next/link';
import type { Route } from 'next';
import { getAllProducts } from '../../../lib/firebase/products';

const categoriesList = [
  {
    id: 'refrigeration',
    name: 'Réfrigération',
    slug: 'refrigeration',
    description: 'Vitrines réfrigérées, comptoirs, armoires et chambres froides',
    image: 'https://i.imgur.com/fYeEzJb.png',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'cooking',
    name: 'Cuisson',
    slug: 'cooking',
    description: 'Fours, friteuses, réchauds, grillades et équipements de cuisson',
    image: 'https://i.imgur.com/fXf7niT.png',
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 'bakery',
    name: 'Boulangerie',
    slug: 'bakery',
    description: 'Pétrins, batteurs, laminoirs et façonneuses pour artisans',
    image: 'https://i.imgur.com/eriwSmK.png',
    color: 'from-amber-600 to-yellow-600'
  },
  {
    id: 'preparation',
    name: 'Préparation',
    slug: 'preparation',
    description: 'Robots coupe, hachoirs, coupe-frites et matériel de préparation',
    image: 'https://images.unsplash.com/photo-1586525198428-d2251f54237f?w=400&h=300&fit=crop',
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'snack-equipment',
    name: 'Snack',
    slug: 'snack-equipment',
    description: 'Machines à popcorn, barbes à papa, distributeurs et glaces',
    image: 'https://images.unsplash.com/photo-1581336585891-8d5f7f9c6a2f?w=400&h=300&fit=crop',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'furniture',
    name: 'Mobilier',
    slug: 'furniture',
    description: 'Bureaux de caisse, chaises et mobilier professionnel',
    image: 'https://images.unsplash.com/photo-1581336585891-8d5f7f9c6a2f?w=400&h=300&fit=crop',
    color: 'from-indigo-600 to-purple-600'
  }
];

export default async function CategoriesPage() {
  const allProducts = await getAllProducts();
  
  const categoryCounts = allProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container-custom py-12 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Nos Catégories
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Découvrez notre gamme complète d'équipements professionnels par catégorie
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesList.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}` as Route}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Background */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-3xl font-bold text-white mb-1">{category.name}</div>
                <div className="text-white/90 text-sm">{categoryCounts[category.id] || 0} produits</div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Découvrir</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}