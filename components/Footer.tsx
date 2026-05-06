// src/components/Footer.tsx
'use client';

import  WhatsAppIcon  from './WhatsAppIcon';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Send,
  Clock
} from 'lucide-react';

const quickLinks: { href: Route; label: string }[] = [
  { href: '/produits' as Route, label: 'Tous les produits' },
  { href: '/categories' as Route, label: 'Catégories' },
  { href: '/about' as Route, label: 'À propos' },
  { href: '/contact' as Route, label: 'Contact' },
];

const categoryLinks: { href: Route; label: string }[] = [
  { href: '/categories/refrigeration' as Route, label: 'Réfrigération' },
  { href: '/categories/cooking' as Route, label: 'Cuisson' },
  { href: '/categories/bakery' as Route, label: 'Boulangerie' },
  { href: '/categories/preparation' as Route, label: 'Préparation' },
  { href: '/categories/snack-equipment' as Route, label: 'Équipement Snack' },
  { href: '/categories/furniture' as Route, label: 'Mobilier' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                 <Image
                    src="/h-logo48.png"
                    alt="Europmat"
                    width={180}
                    height={50}
                    priority
                    className="h-10 w-auto object-contain"
                  />
              </div>
              <span className="font-bold text-xl tracking-tight">Europmat</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Leader marocain en équipements professionnels pour la restauration, 
              boulangerie et pâtisserie depuis 2005.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://wa.me/212625652015" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600/20 text-green-400 px-3 py-2 rounded-lg text-sm hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                <WhatsAppIcon className="w-5 h-5 text-green-500" />
                <span>WhatsApp</span>
              </a>
              <a 
                href="mailto:contact@europmat.ma"
                className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Hay Arrid, à côté de Ecole Al Mada, Nador, Maroc</span>
              </li>
              <li>
                <a 
                  href="tel:+212625652015" 
                  className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Phone size={18} className="text-blue-500" />
                  <span>06 25 65 20 15</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+212661767453" 
                  className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Phone size={18} className="text-blue-500" />
                  <span>06 61 76 74 53</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@europmat.ma" 
                  className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Mail size={18} className="text-blue-500" />
                  <span>contact@europmat.ma</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Clock size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div>Lun-Ven: 9h00 - 19h00</div>
                  <div>Sam: 10h00 - 16h00</div>
                  <div>Dim: Fermé</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="font-semibold text-lg mb-2">Restez informé</h4>
              <p className="text-gray-400 text-sm">
                Recevez nos actualités et offres promotionnelles
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Send size={16} />
                <span>S'abonner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Ste Europmat. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/mentions-legales" className="hover:text-blue-400 transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="hover:text-blue-400 transition-colors">
                Confidentialité
              </Link>
              <Link href="/cgv" className="hover:text-blue-400 transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}