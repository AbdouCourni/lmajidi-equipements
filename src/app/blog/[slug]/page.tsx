import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../../../../data/blog-posts';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'المقال غير موجود',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      locale: 'ar_MA',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Europmat',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Europmat',
      logo: {
        '@type': 'ImageObject',
        url: 'https://europmat.com/logoText.png',
      },
    },
    mainEntityOfPage: `https://europmat.com/blog/${post.slug}`,
    inLanguage: 'ar-MA',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main dir="rtl" className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article>
        <header className="border-b border-gray-200 bg-white-soft py-10 md:py-14">
          <div className="container-custom">
            <div className="max-w-4xl">
              <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href={'/' as Route} className="hover:text-navy-main">
                  الرئيسية
                </Link>
                <span>/</span>
                <Link href={'/blog' as Route} className="hover:text-navy-main">
                  المدونة
                </Link>
                <span>/</span>
                <span className="text-gray-700">{post.category}</span>
              </nav>

              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="text-5xl" aria-hidden>
                  {post.heroIcon}
                </span>
                <span className="badge badge-navy">{post.category}</span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>

              <h1 className="mb-5 text-3xl font-bold leading-tight text-charcoal md:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-gray-600">{post.excerpt}</p>
            </div>
          </div>
        </header>

        <div className="container-custom py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <section className="rounded-lg border border-gray-200 bg-beige-warm p-6">
                <h2 className="mb-4 text-2xl font-bold text-charcoal">
                  المعدات الأساسية
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {post.equipment.map((item) => (
                    <div key={item} className="rounded-lg bg-white p-4 text-sm text-gray-700">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {post.sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-bold text-charcoal">{section.title}</h2>
                  <p className="text-lg leading-9 text-gray-700">{section.body}</p>
                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3 text-gray-700">
                          <span className="mt-1 text-navy-accent">•</span>
                          <span className="leading-8">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <section className="rounded-lg border border-gray-200 p-6">
                <h2 className="mb-5 text-2xl font-bold text-charcoal">
                  قائمة سريعة قبل الشراء
                </h2>
                <ul className="space-y-3">
                  {post.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-gray-700">
                      <span className="mt-1 rounded-full bg-green-100 px-2 text-green-700">
                        ✓
                      </span>
                      <span className="leading-8">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-5">
                <h2 className="text-2xl font-bold text-charcoal">أسئلة شائعة</h2>
                {post.faq.map((item) => (
                  <div key={item.question} className="rounded-lg bg-gray-50 p-5">
                    <h3 className="mb-2 font-bold text-charcoal">{item.question}</h3>
                    <p className="leading-8 text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-bold text-charcoal">
                  تحتاج مساعدة في اختيار المعدات؟
                </h2>
                <p className="mb-5 leading-7 text-gray-600">
                  أرسل لنا نوع المشروع والمساحة والميزانية التقريبية، ونقترح عليك
                  قائمة معدات مناسبة.
                </p>
                <a
                  href={`https://wa.me/212625652015?text=${encodeURIComponent(
                    `السلام عليكم، أريد مساعدة في ${post.category}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta w-full"
                >
                  تواصل عبر WhatsApp
                </a>
                <Link href={'/produits' as Route} className="btn-secondary mt-3 w-full">
                  مشاهدة المنتجات
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}
