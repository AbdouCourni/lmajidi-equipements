// src/components/Footer.tsx

'use client';

import { useState, useEffect } from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import type { Category } from '../types/category';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const quickLinks: { href: Route; label: string }[] = [
  { href: '/produits' as Route, label: 'Tous les produits' },
  { href: '/categories' as Route, label: 'Catégories' },
  { href: '/about' as Route, label: 'À propos' },
  { href: '/contact' as Route, label: 'Contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(
          collection(db, 'categories'),
          where('level', '==', 'main')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Veuillez entrer un email valide');
      return;
    }

    try {
      setStatus('loading');

      // Check if already subscribed
      const existingQuery = query(
        collection(db, 'subscribeList'),
        where('email', '==', email.toLowerCase().trim())
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        setStatus('error');
        setMessage('Cet email est déjà inscrit');
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, 'subscribeList'), {
        email: email.toLowerCase().trim(),
        subscribedAt: new Date().toISOString(),
        source: 'footer',
      });

      setStatus('success');
      setMessage('Merci de votre inscription !');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('Erreur lors de l\'inscription');
    }
  };

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div>
          <div className="flex">
  <Image
    src="/logoText.png"
    alt="Europmat"
    width={180}
    height={36}
    priority
    className="h-9 w-auto object-contain rounded-lg"
  />
</div>
            <p className="text-steel-dark text-sm leading-relaxed mb-4">
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
              {/* <a
                href="mailto:contact@europmat.ma"
                className="flex items-center gap-2 bg-navy-main/20 text-navy-accent px-3 py-2 rounded-lg text-sm hover:bg-navy-main hover:text-white transition-all duration-300"
              >
                <Mail size={16} />
                <span>Email</span>
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-steel-dark hover:text-beige-300 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories - Dynamic from Firebase */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Catégories</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/produits?category=${cat.slug}` as Route}
                      className="text-steel-dark hover:text-beige-300 transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">→</span>
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li className="text-steel-dark">Réfrigération</li>
                  <li className="text-steel-dark">Cuisson</li>
                  <li className="text-steel-dark">Boulangerie</li>
                  <li className="text-steel-dark">Préparation</li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-steel-dark">
                <MapPin size={18} className="text-navy-accent flex-shrink-0 mt-0.5" />
                <span>Hay Arrid, à côté de Ecole Al Mada, Nador, Maroc</span>
              </li>
              <li>
                <a
                  href="tel:+212625652015"
                  className="flex items-center gap-3 text-steel-dark hover:text-beige-300 transition-colors"
                >
                  <Phone size={18} className="text-navy-accent" />
                  <span>06 25 65 20 15</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+212661767453"
                  className="flex items-center gap-3 text-steel-dark hover:text-beige-300 transition-colors"
                >
                  <Phone size={18} className="text-navy-accent" />
                  <span>06 61 76 74 53</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@europmat.ma"
                  className="flex items-center gap-3 text-steel-dark hover:text-beige-300 transition-colors"
                >
                  <Mail size={18} className="text-navy-accent" />
                  <span>contact@europmat.ma</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-steel-dark">
                <Clock size={18} className="text-navy-accent flex-shrink-0 mt-0.5" />
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
              <h4 className="font-semibold text-lg mb-2 text-white">Restez informé</h4>
              <p className="text-steel-dark text-sm">
                Recevez nos actualités et offres promotionnelles
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                placeholder="Votre email"
                required
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-navy-accent transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2.5 bg-navy-main hover:bg-navy-professional rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="spinner w-4 h-4 border-white/30 border-t-white"></div>
                ) : (
                  <Send size={16} />
                )}
                <span>S'abonner</span>
              </button>
            </form>
            {/* Status Messages */}
            {status === 'success' && (
              <div className="md:col-span-2 flex items-center gap-2 text-green-400 text-sm mt-2">
                <CheckCircle size={16} />
                {message}
              </div>
            )}
            {status === 'error' && (
              <div className="md:col-span-2 flex items-center gap-2 text-red-400 text-sm mt-2">
                <AlertCircle size={16} />
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-steel-dark">
              © {currentYear} Ste Europmat. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}