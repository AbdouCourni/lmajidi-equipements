// src/components/Hero.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';

const SLIDES = [
  {
    image: 'https://i.imgur.com/gyj3XGX.png',
    title: 'Équipement Professionnel',
    subtitle: 'Pour restaurants & commerces',
    category: 'refrigeration',
  },
  {
    image: 'https://res.cloudinary.com/dfsmkq5mw/image/upload/v1778428813/bakery_em8bxi.png',
    title: 'Matériel de Boulangerie',
    subtitle: 'Qualité professionnelle',
    category: 'bakery',
  },
  {
    image: 'https://res.cloudinary.com/dfsmkq5mw/image/upload/v1778428627/pizza_dhvbxs.png',
    title: 'Cuisine & Snack',
    subtitle: 'Tout l\'équipement nécessaire',
    category: 'cooking',
  },
   {
    image: 'https://res.cloudinary.com/dfsmkq5mw/image/upload/v1778435221/europmat/categories/nrfsf354k7n2emeqymz9.png',
    title: 'Froid Commercial',
    subtitle: 'Vitrines & chambres froides',
    category: 'refrigeration',
  },
];

const STATS = [
  { value: '120+', label: 'Produits' },
  { value: '20+', label: 'Années d\'expérience' },
  { value: '500+', label: 'Clients satisfaits' },
];

const QUICK_LINKS = [
  { 
    label: 'Réfrigération', 
    slug: 'refrigeration', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    label: 'Boulangerie', 
    slug: 'bakery', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-3.314 0-6 1.343-6 3s2.686 3 6 3 6-1.343 6-3-2.686-3-6-3zM3 18h18M5 11V8a7 7 0 0114 0v3" />
      </svg>
    )
  },
  { 
    label: 'Cuisson', 
    slug: 'cooking', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    )
  },
  { 
    label: 'Préparation', 
    slug: 'preparation', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    )
  },
  { 
    label: 'Mobilier Pro', 
    slug: 'furniture', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 6h18M3 18h18M9 6v12M15 6v12" />
      </svg>
    )
  },
  { 
    label: 'Snack & Boissons', 
    slug: 'snack-equipment', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16M8 2v20M16 2v20" />
      </svg>
    )
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % SLIDES.length);
  }, [currentSlide, goToSlide]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
<section 
  className="relative bg-gradient-to-br from-navy-main via-navy-professional to-navy-accent overflow-hidden flex items-center"
  style={{ minHeight: 'calc(100vh - 72px)' }}
>      {/* SLIDING BACKGROUND IMAGES */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-90' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
className="object-cover object-top"

          />
        </div>
      ))}

      {/* GRADIENT OVERLAY */}
<div className="absolute inset-0 bg-gradient-to-r from-navy-main/80 via-navy-professional/70 to-transparent" />
      {/* DECORATIVE ELEMENTS */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/30 rounded-full blur-3xl" />
<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-beige-300/20 rounded-full blur-3xl" />
      {/* CONTENT */}
      <div className="container-custom relative z-10 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT TEXT */}
          <div>
            

            {/* MAIN TITLE */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                {SLIDES[currentSlide].title}
              </span>
              <span className="block text-beige-300 mt-2">
                {SLIDES[currentSlide].subtitle}
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-xl">
              Découvrez une large gamme d&apos;équipements professionnels pour restaurants, 
              boulangeries et snacks. Qualité, performance et livraison rapide partout au Maroc.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
             <Link
  href={`/produits?category=${SLIDES[currentSlide].category}` as Route}
  className="bg-white text-navy-main hover:bg-steel-200 font-semibold text-lg px-8 py-4 rounded-lg transition-all hover:shadow-xl inline-flex items-center gap-2"
>
                Voir les produits
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <a
                href="https://wa.me/212654063922?text=Bonjour%2C%20je%20souhaite%20un%20devis"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white text-lg px-8 py-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Demander un devis
              </a>
            </div>

            {/* SLIDE INDICATORS */}
            <div className="flex items-center gap-3 mb-8">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            {/* TRUST STRIP */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Livraison rapide
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Support 24/7
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Garantie produits
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - QUICK LINKS & STATS */}
          <div className="hidden lg:block">
            {/* QUICK CATEGORY LINKS */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.slug}
                  href={`/produits?category=${link.slug}` as Route}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all hover:scale-105"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <p className="text-white font-medium mt-2 group-hover:text-beige-300 transition">
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}