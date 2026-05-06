// src/app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductCard from '../../../../components/ProductCard';
import { getProductsByCategory } from '../../../../lib/firebase/products';
import Link from 'next/link';

const categoryConfig: Record<string, {
  name: string;
  description: string;
  gradient: string;
  bgGradient: string;
  icon: React.ReactNode;
  features: string[];
}> = {
  refrigeration: {
    name: 'Réfrigération',
    description: 'Équipements de réfrigération professionnelle pour la conservation optimale de vos produits',
    gradient: 'from-blue-600 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        <path d="M8 7h8M8 11h8M8 15h5M16 15h-1" />
        <path d="M12 19v-2" />
      </svg>
    ),
    features: ['Température contrôlée', 'Économie d\'énergie', 'Design professionnel']
  },
  cooking: {
    name: 'Cuisson',
    description: 'Équipements de cuisson professionnels pour une qualité et une efficacité optimales',
    gradient: 'from-orange-600 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M8 4l2 2M16 4l-2 2" />
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M9 12v4M15 12v4M4 12h16" />
      </svg>
    ),
    features: ['Cuisson homogène', 'Haute performance', 'Sécurité intégrée']
  },
  bakery: {
    name: 'Boulangerie & Pâtisserie',
    description: 'Matériel professionnel pour boulangers et pâtissiers artisans',
    gradient: 'from-amber-600 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4 2-4 4-4z" />
        <path d="M6 14h12" />
        <path d="M8 18h8" />
        <path d="M10 14v4M14 14v4" />
      </svg>
    ),
    features: ['Résultats professionnels', 'Fiabilité', 'Facilité d\'entretien']
  },
  preparation: {
    name: 'Préparation',
    description: 'Équipements de préparation pour optimiser votre productivité en cuisine',
    gradient: 'from-green-600 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 4L8 8l-2 6 6 2 6-2-2-6-6-4z" />
        <path d="M14 10l2 2M10 10l-2 2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    features: ['Gain de temps', 'Précision', 'Polyvalence']
  },
  'snack-equipment': {
    name: 'Équipement Snack',
    description: 'Solutions professionnelles pour snacks, fast-foods et food trucks',
    gradient: 'from-purple-600 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 8v8a3 3 0 003 3h4a3 3 0 003-3V8" />
        <path d="M5 8h14" />
        <path d="M8 5l1-2h6l1 2H8z" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
    features: ['Rentabilité', 'Rapidité', 'Compact']
  },
  furniture: {
    name: 'Mobilier',
    description: 'Mobilier professionnel pour l\'aménagement de vos espaces de vente',
    gradient: 'from-indigo-600 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12h16v8H4z" />
        <path d="M6 12V8h12v4" />
        <path d="M8 8V6h8v2" />
      </svg>
    ),
    features: ['Design moderne', 'Durabilité', 'Ergonomie']
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const config = categoryConfig[slug];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-r ${config.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container-custom relative z-10 py-12 md:py-20">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-white transition-colors">Catégories</Link>
              <span>/</span>
              <span className="text-white font-medium">{config.name}</span>
            </nav>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
              {config.icon}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {config.name}
            </h1>
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              {config.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {config.features.map((feature, idx) => (
                <span key={idx} className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container-custom py-8 md:py-12">
        {/* Header with count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Nos équipements
            </h2>
            <p className="text-gray-500 text-sm">
              {products.length} produit{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Sort/Filter options (optional) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Trier par :</span>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Pertinence</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Nom A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid - Fully Responsive */}
        {products.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-white rounded-2xl">
            <div className="text-6xl md:text-7xl mb-4">🔧</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Aucun équipement disponible
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Cette catégorie sera bientôt approvisionnée. Consultez nos autres catégories.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>←</span>
              <span>Voir toutes les catégories</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Results count for mobile */}
            <div className="mb-4 text-sm text-gray-500 lg:hidden">
              {products.length} résultat{products.length !== 1 ? 's' : ''}
            </div>
            
            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-16 mt-8">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour vous conseiller
          </p>
          <a
            href="https://wa.me/212625652015"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <span>💬</span>
            <span>Contacter un expert</span>
          </a>
        </div>
      </section>
    </div>
  );
}