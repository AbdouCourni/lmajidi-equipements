// src/app/image-sitemap.ts
import { getProducts } from '../../lib/firebase/products';
import type { Product } from '../../types/product';

export default async function imageSitemap() {
  const baseUrl = 'https://europmat.com';
  const { products } = await getProducts({ limit: 200 });

  const imageEntries = products
    .filter((p: { images: string | any[]; imageExternalLinks: string | any[]; }) => p.images?.length > 0 || p.imageExternalLinks?.length > 0)
    .flatMap((product: Product) => {
      const images = product.images?.length > 0 
        ? product.images.map(img => img.url)
        : product.imageExternalLinks || [];
      
      return images.map(imageUrl => ({
        url: `${baseUrl}/produits/${product.id}`,
        images: [{
          loc: imageUrl,
          title: product.name,
          caption: product.description?.substring(0, 200),
        }],
        lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
      }));
    });

  return imageEntries;
}