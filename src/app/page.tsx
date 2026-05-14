// src/app/page.tsx
import Hero from '../../components/Hero';
import FeaturedProducts from '../../components/FeaturedProducts';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Europmat',
  url: 'https://europmat.com',
  logo: 'https://europmat.com/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+212625652015',
    contactType: 'sales',
    availableLanguage: ['French', 'Arabic'],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Trust Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Livraison rapide</p>
                <p className="text-xs text-gray-500">Partout au Maroc</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Produits garantis</p>
                <p className="text-xs text-gray-500">1 an minimum</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Meilleurs prix</p>
                <p className="text-xs text-gray-500">Prix compétitifs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Support 24/7</p>
                <p className="text-xs text-gray-500">WhatsApp dédié</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
   <section className="py-12 md:py-16 bg-beige-warm">
  <div className="container-custom">
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
        Nos meilleures ventes
      </h2>
      <p className="text-steel-dark max-w-2xl mx-auto text-sm md:text-base px-4">
        Découvrez les équipements les plus populaires auprès de nos clients
      </p>
    </div>
    
    <FeaturedProducts />
  </div>
</section>
    </>
  );
}