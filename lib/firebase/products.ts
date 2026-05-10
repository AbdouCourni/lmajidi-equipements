import 'server-only';

import type { DocumentSnapshot } from 'firebase-admin/firestore';
import { adminDb } from './admin';
import type { Product } from '../../types/product';

let productsCache: Product[] | null = null;
let productsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

function convertToProduct(
  doc: DocumentSnapshot
): Product {

  const data = doc.data() || {};

  return {

    id: doc.id,

    name: data.name || '',

    description:
      data.description || '',

    price:
      data.price ?? null,

    currency:
      data.currency || 'MAD',

    category:
      data.category || '',

    subCategory:
      data.subCategory || '',

    brand:
      data.brand || '',

    images:
      (data.images || []).map(
        (image: Record<string, unknown>) => ({

          id:
            String(
              image.id || ''
            ),

          url:
            String(
              image.url || ''
            ),

          publicId:
            String(
              image.publicId || ''
            ),

          isPrimary:
            Boolean(
              image.isPrimary
            ),
        })
      ),

    stockStatus:
      data.stockStatus ||
      'in_stock',

    isOnPromotion:
      data.isOnPromotion || false,

    keySpecs:
      data.keySpecs || [],

    specifications:
      data.specifications || {},

    page:
      data.page,

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}

function sortByName(products: Product[]) {
  return [...products].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

export async function getAllProducts(): Promise<Product[]> {
  if (productsCache && Date.now() - productsCacheTime < CACHE_DURATION) {
    return productsCache;
  }

  try {
    const snapshot = await adminDb.collection('products').orderBy('name', 'asc').get();
    const products = snapshot.docs.map(convertToProduct);

    productsCache = products;
    productsCacheTime = Date.now();
   console.log(`Fetched ${products.length} products from Firestore at ${new Date(productsCacheTime).toLocaleTimeString()}`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return productsCache || [];
  }
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  console.log(`Fetching product with ID: ${id}`);

  if (!id) {
    return null;
  }

  try {

    const snapshot =
      await adminDb
        .collection('products')
        .doc(id)
        .get();

    return snapshot.exists
      ? convertToProduct(snapshot)
      : null;

  } catch (error) {

    console.error(
      `Error fetching product ${id}:`,
      error
    );

    return null;
  }
}

export async function getFeaturedProducts(limitCount = 8): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((product) => product.price !== null && product.price > 0)
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, limitCount);
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const products = await getAllProducts();
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    return products;
  }

  return products.filter((product) =>
    [
      product.name,
      product.brand,
      product.description,
      product.category,
      product.subCategory,
    ].some((value) => value?.toLowerCase().includes(term)),
  );
}
export function getPrimaryImage(
  product: Product
) {

  return (
    product.images?.find(
      image => image.isPrimary
    )?.url ||

    product.images?.[0]?.url ||

    null
  );
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('category', '==', category)
      .orderBy('name', 'asc')
      .get();

    return snapshot.docs.map(convertToProduct);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return sortByName((await getAllProducts()).filter((product) => product.category === category));
  }
}

export async function getProductsBySubCategory(subCategory: string): Promise<Product[]> {
  const products = await getAllProducts();
  return sortByName(products.filter((product) => product.subCategory === subCategory));
}

export async function getProductsByBrand(brand: string): Promise<Product[]> {
  const products = await getAllProducts();
  return sortByName(products.filter((product) => product.brand === brand));
}

export async function getProductsByPriceRange(
  minPrice: number,
  maxPrice: number,
): Promise<Product[]> {
  const products = await getAllProducts();
  return sortByName(
    products.filter(
      (product) => product.price !== null && product.price >= minPrice && product.price <= maxPrice,
    ),
  );
}

export async function getPromotionProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return sortByName(products.filter((product) => product.isOnPromotion));
}

export function clearCache() {
  productsCache = null;
  productsCacheTime = 0;
}
