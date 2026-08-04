// components/Header.tsx

'use client';

import WhatsAppIcon from './WhatsAppIcon';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

interface ContactSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  catalogueUrl: string;
  openingHours: {
    'Lun-Ven': string;
    'Sam': string;
    'Dim': string;
  };
}

const defaultSettings: ContactSettings = {
  whatsappNumber: '212625652015',
  whatsappMessage: 'Bonjour, je souhaite recevoir un devis',
  phone1: '0625652015',
  phone2: '0661767453',
  email: 'contact@europmat.ma',
  address: 'Hay Arrid, à côté de Ecole Al Mada, Nador, Maroc',
  catalogueUrl: '/catalogue-europmat.pdf',
  openingHours: {
    'Lun-Ven': '9h00 - 19h00',
    'Sam': '10h00 - 16h00',
    'Dim': 'Fermé',
  },
};

const navItems: { href: Route; label: string }[] = [
  { href: '/' as Route, label: 'Accueil' },
  { href: '/categories' as Route, label: 'Catégories' },
  { href: '/produits' as Route, label: 'Produits' },
  { href: '/contact' as Route, label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);

  // Fetch settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() } as ContactSettings);
        }
        console.log('Fetched settings:', docSnap.data());
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname?.startsWith(path);
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href={'/' as Route} className="flex items-center gap-3">
            <div className="flex items-center">
              <Image
                src="/logoText.png"
                alt="Europmat"
                width={180}
                height={36}
                priority
                className="h-9 w-auto object-contain"
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors text-sm font-medium ${
                  isActive(item.href)
                    ? 'text-navy-main border-b-2 border-navy-main pb-1'
                    : 'text-charcoal hover:text-navy-main'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            <a
  href={settings.catalogueUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="hidden lg:flex items-center gap-2 bg-navy-main hover:bg-navy-professional text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
  <span>Voir catalogue</span>
</a>

            {/* WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(item.href)
                      ? 'bg-navy-50 text-navy-main'
                      : 'text-charcoal hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

             <a
  href={settings.catalogueUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="mx-4 mt-2 flex items-center justify-center gap-2 bg-navy-main text-white px-4 py-3 rounded-xl text-sm font-semibold"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
  <span>Voir le catalogue</span>
</a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 mt-2 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-semibold"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}