// components/Header.tsx

'use client';

import WhatsAppIcon from './WhatsAppIcon';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';


const navItems: {
  href: Route;
  label: string;
}[] = [
  { href: '/', label: 'Accueil' },
  { href: '/categories' as Route, label: 'Catégories' },
  { href: '/produits'as Route, label: 'Produits' },
  { href: '/contact'as Route, label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }

    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">

      <div className="container-custom">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            href={'/' as Route}
            className="flex items-center gap-3"
          >
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
{/* 
            <div>
              <p className="font-bold text-gray-900 text-lg leading-none">
                Europmat
              </p>

              <p className="text-xs text-gray-500">
                Équipements Professionnels
              </p>
            </div> */}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors text-sm font-medium ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}

          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            {/* WHATSAPP */}
            <a
              href="https://wa.me/212659783940"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
<WhatsAppIcon className="w-4 h-4" />
          <span>WhatsApp</span>            </a>
           
              
            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <a
                href="https://wa.me/212625652015"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 mt-2 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-semibold"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}