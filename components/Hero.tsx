// src/components/Hero.tsx

'use client';

import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">

      <div className="container-custom py-16 md:py-24">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
              <span>🏆</span>
              <span>Leader au Maroc depuis 2005</span>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Équipez votre
              <span className="block text-blue-600">
                Cuisine Professionnelle
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-xl">
              Découvrez une large gamme d’équipements professionnels pour restaurants,
              boulangeries et snacks. Qualité, performance et livraison rapide partout au Maroc.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">

              <Link
                href={'/produits' as Route}
                className="btn-primary"
              >
                Explorer le catalogue
              </Link>

              <a
                href="https://wa.me/212625652015?text=Bonjour%2C%20je%20souhaite%20un%20devis"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Demander un devis
              </a>

            </div>

            {/* TRUST */}
            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-gray-500">
              <div>✔ Livraison rapide</div>
              <div>✔ Support 24/7</div>
              <div>✔ Garantie produits</div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[350px] md:h-[500px]">

            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">

              <Image
                src="/images/hero.png"
                alt="Cuisine professionnelle"
                fill
                priority
                className="object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />

            </div>

            {/* FLOATING CARD 1 */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4">
              <p className="text-lg font-bold text-gray-900">
                +120
              </p>

              <p className="text-xs text-gray-500">
                Produits
              </p>
            </div>

            {/* FLOATING CARD 2 */}
            <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg p-4">
              <p className="text-lg font-bold text-gray-900">
                20+
              </p>

              <p className="text-xs text-gray-500">
                Années
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* BG DECORATION */}
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-30" />

      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-300 rounded-full blur-3xl opacity-30" />

    </section>
  );
}