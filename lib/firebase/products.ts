// src/lib/firebase/products.ts

import 'server-only';
import { adminDb } from './admin';
import type { Product } from '../../types/product';

/* =========================================================
   CACHE
========================================================= */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>(); // ← CHANGED

/* =========================================================
   GET PRODUCTS WITH FILTERS & PAGINATION
========================================================= */

interface GetProductsOptions {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
  featured?: boolean;
  onPromotion?: boolean;
}

export async function getProducts(options: GetProductsOptions = {}) {
  const {
    category,
    search,
    limit = 12,
    page = 1,
    featured,
    onPromotion,
  } = options;

  // Build cache key
  const cacheKey = JSON.stringify(options);
  
  // ← FIXED: Use Map.get() instead of single cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection('products');

    if (category) {
      query = query.where('category', '==', category);
    }

    if (onPromotion) {
      query = query.where('isOnPromotion', '==', true);
    }

    query = query.orderBy('createdAt', 'desc');

    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    query = query.limit(limit);

    const snapshot = await query.get();

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }

    const result = {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };

    // ← FIXED: Use Map.set()
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasMore: false,
    };
  }
}
/* =========================================================
   GET RELATED PRODUCTS
========================================================= */

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('category', '==', category)
      .limit(limit + 1) // Fetch one extra in case the current product is included
      .get();

    const products = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Product))
      .filter(p => p.id !== productId)
      .slice(0, limit);

    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const doc = await adminDb
      .collection('products')
      .doc(id)
      .get();

    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() } as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/* =========================================================
   GET PRODUCTS BY CATEGORY (with subcategories)
========================================================= */

export async function getProductsByCategory(
  categorySlug: string,
  subCategorySlugs: string[] = []
): Promise<Product[]> {
  try {
    // Main category query
    const mainQuery = adminDb
      .collection('products')
      .where('category', '==', categorySlug)
      .limit(50);

    const [mainSnapshot, ...subSnapshots] = await Promise.all([
      mainQuery.get(),
      ...subCategorySlugs.map(slug =>
        adminDb
          .collection('products')
          .where('subCategory', '==', slug)
          .limit(50)
          .get()
      ),
    ]);

    const products = [
      ...mainSnapshot.docs,
      ...subSnapshots.flatMap(snap => snap.docs),
    ].map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Remove duplicates
    return Array.from(new Map(products.map(p => [p.id, p])).values());
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}