// src/app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          À propos de nous
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Votre partenaire de confiance en équipements professionnels au Maroc depuis 2005
        </p>
      </div>

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Notre histoire
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Fondée en 2005, Ste Europmat est devenue un leader dans la distribution 
            d'équipements professionnels pour la restauration, la boulangerie et 
            la pâtisserie au Maroc.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Notre mission est d'offrir des équipements de qualité supérieure à des 
            prix compétitifs, avec un service client exceptionnel.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Aujourd'hui, nous accompagnons plus de 1000 professionnels à travers 
            le Maroc dans le développement de leur activité.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
          <div className="text-8xl mb-4">🏆</div>
          <div className="text-3xl font-bold text-gray-900">2005</div>
          <div className="text-gray-600">Année de création</div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Nos valeurs
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Qualité</h3>
            <p className="text-gray-600 text-sm">
              Des produits certifiés et testés pour garantir la satisfaction de nos clients
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Confiance</h3>
            <p className="text-gray-600 text-sm">
              Une relation de confiance durable avec nos clients et partenaires
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600 text-sm">
              Toujours à la recherche des dernières innovations du marché
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">120+</div>
            <div className="text-sm opacity-90">Produits</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">1000+</div>
            <div className="text-sm opacity-90">Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">6</div>
            <div className="text-sm opacity-90">Catégories</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">24/7</div>
            <div className="text-sm opacity-90">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}