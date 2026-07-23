// src/app/page.tsx
import Hero from '../../components/Hero';
import FeaturedProducts from '../../components/FeaturedProducts';
import Link from 'next/link';
import type { Route } from 'next';
import { getBlogPosts } from '../../data/blog-posts';

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
  const blogPosts = getBlogPosts().slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, localBusinessSchema, faqSchema]),
        }}
      />
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

      <section dir="rtl" className="bg-white py-12 md:py-16">
        <div className="container-custom">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="badge badge-navy mb-3">مدونة Europmat</span>
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal">
                أدلة عملية لتجهيز مشروعك في المغرب
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                مقالات عربية تساعدك على اختيار معدات المطاعم، المقاهي، المخابز،
                السناك، البيتزيريا ومحلات الآيس كريم.
              </p>
            </div>
            <Link href={'/blog' as Route} className="btn-secondary">
              عرض كل المقالات
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.slug} className="rounded-lg border border-gray-200 p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-4xl" aria-hidden>
                    {post.heroIcon}
                  </span>
                  <span className="rounded-full bg-beige-warm px-3 py-1 text-xs font-semibold text-charcoal">
                    {post.category}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold leading-8 text-charcoal">
                  <Link href={`/blog/${post.slug}` as Route}>{post.title}</Link>
                </h3>
                <p className="mb-5 text-sm leading-7 text-gray-600">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}` as Route} className="text-sm font-bold text-navy-main">
                  قراءة المقال
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quels types d\'équipements propose Europmat ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Europmat propose une large gamme d\'équipements professionnels : réfrigération, cuisson, boulangerie, préparation, snack et mobilier pour restaurants.',
      },
    },
    {
      '@type': 'Question',
      name: 'Livrez-vous dans tout le Maroc ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, Europmat livre dans tout le Maroc avec un service rapide et professionnel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment obtenir un devis ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contactez-nous par WhatsApp au 06 25 65 20 15 ou par email à contact@europmat.ma pour recevoir un devis gratuit.',
      },
    },
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Europmat',
  image: 'https://europmat.com/logoText.png',
  '@id': 'https://europmat.com',
  url: 'https://europmat.com',
  telephone: '+212625652015',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hay Arrid, à côté de Ecole Al Mada',
    addressLocality: 'Nador',
    addressCountry: 'MA',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '16:00',
    },
  ],
};
