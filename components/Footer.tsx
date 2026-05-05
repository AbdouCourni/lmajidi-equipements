//components/Footer.tsx
import Link from 'next/link';
import type { Route } from 'next';

const quickLinks: { href: Route; label: string }[] = [
  { href: '/produits' as Route, label: 'Tous les produits' },
  { href: '/categories' as Route, label: 'Catégories' },
  { href: '/contact' as Route, label: 'Contact' },
];

const categoryLinks: { href: Route; label: string }[] = [
  { href: '/categories/refrigeration' as Route, label: '❄️ Réfrigération' },
  { href: '/categories/cooking' as Route, label: '🔥 Cuisson' },
  { href: '/categories/bakery' as Route, label: '🍞 Boulangerie' },
  { href: '/categories/preparation' as Route, label: '🔪 Préparation' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="font-bold text-xl">Europmat</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Votre partenaire en équipements professionnels pour restaurants, 
              boulangeries et pâtisseries au Maroc.
            </p>
            <a
              href="https://wa.me/212625652015"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Nador, Hay Arrid</span>
              </li>
              <li>
                <a href="tel:+212625652015" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>📞</span>
                  <span>06 25 65 20 15</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@europmat.ma" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>📧</span>
                  <span>contact@europmat.ma</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {currentYear} Ste Europmat. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
