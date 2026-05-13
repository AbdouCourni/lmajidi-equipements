// src/app/not-found.tsx

import Link from 'next/link';
import type { Route } from 'next';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container-custom py-20 text-center">
        
        {/* ICON */}
        <div className="text-8xl mb-6">
          🔧
        </div>

        {/* 404 */}
        <h1 className="text-6xl md:text-8xl font-bold text-navy-main mb-4">
          404
        </h1>

        {/* MESSAGE */}
        <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
          Page introuvable
        </h2>

        <p className="text-steel-dark max-w-md mx-auto mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée. 
          Veuillez vérifier l'URL ou retourner à l'accueil.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={'/' as Route} className="btn-primary">
            ← Retour à l'accueil
          </Link>
          <Link href={'/produits' as Route} className="btn-secondary">
            Voir les produits
          </Link>
        </div>
      </div>
    </div>
  );
}
