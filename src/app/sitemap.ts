// src/app/sitemap.ts
import { getProducts } from '../../lib/firebase/products';
import { getAllCategories } from '../../lib/firebase/categories';

export default async function sitemap() {
  const baseUrl = 'https://europmat.com';
  
  const [products, categories] = await Promise.all([
    getProducts({ limit: 150 }),
    getAllCategories(),
  ]);

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/produits`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const productPages = products.map((product: { id: any; updatedAt: any; createdAt: any; }) => ({
    url: `${baseUrl}/produits/${product.id}`,
    lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map(cat => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(cat.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}