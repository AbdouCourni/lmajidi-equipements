import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '../../../data/blog-posts';

export const metadata: Metadata = {
  title: 'مدونة تجهيز المطاعم والمقاهي في المغرب',
  description:
    'دليل عربي عملي لتجهيز المطاعم، المقاهي، المخابز، محلات الجزارة، السناك، البيتزيريا ومحلات الآيس كريم في المغرب.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'مدونة Europmat لتجهيز المشاريع المهنية',
    description:
      'مقالات عربية منظمة تساعدك على اختيار معدات المطبخ المهني والمقهى والمخبزة والمطعم في المغرب.',
    url: '/blog',
    type: 'website',
    locale: 'ar_MA',
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'مدونة Europmat',
    description:
      'نصائح وتجهيزات مهنية لفتح مقهى، مطعم، مخبزة، سناك، بيتزيريا، جزارة أو محل آيس كريم في المغرب.',
    url: 'https://europmat.com/blog',
    inLanguage: 'ar-MA',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://europmat.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    })),
  };

  return (
    <main dir="rtl" className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <section className="border-b border-gray-200 bg-white-soft py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="badge badge-navy mb-4">دليل تجهيز المشاريع</span>
            <h1 className="text-3xl md:text-5xl font-bold text-charcoal leading-tight mb-5">
              مدونة عربية لمساعدتك على فتح مشروع مطعم، مقهى أو مخبزة بثقة
            </h1>
            <p className="text-lg text-gray-600 leading-8">
              محتوى عملي ومنظم حول اختيار معدات المطابخ المهنية، التبريد، الطهي،
              التحضير، العرض، والتنظيم اليومي للمشاريع الغذائية في المغرب.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="card overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="bg-beige-warm p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="text-5xl" aria-hidden>
                      {post.heroIcon}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-main">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold leading-8 text-charcoal">
                    <Link href={`/blog/${post.slug}` as Route}>{post.title}</Link>
                  </h2>
                </div>
                <div className="p-6">
                  <p className="mb-5 text-sm leading-7 text-gray-600">{post.excerpt}</p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span key={keyword} className="badge badge-beige">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}` as Route}
                    className="btn-primary w-full"
                  >
                    قراءة الدليل
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
