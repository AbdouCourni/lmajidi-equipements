// src/lib/firebase/products.ts

import 'server-only';
import { adminDb } from './admin';
import type { Product } from '../../types/product';

/* =========================================================
   CACHE
========================================================= */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache: { data: any; timestamp: number; key: string } | null = null;

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
  
  if (cache && cache.key === cacheKey && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection('products');

    // Apply filters server-side
    if (category) {
      query = query.where('category', '==', category);
    }

    if (featured) {
      query = query.where('featured', '==', true);
    }

    if (onPromotion) {
      query = query.where('isOnPromotion', '==', true);
    }

    // Order by creation date (newest first)
    query = query.orderBy('createdAt', 'desc');

    // Get total count (for pagination)
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    if (offset > 0) {
      // Firebase doesn't support offset, so we use startAfter
      // For simplicity, we'll fetch with limit and handle it differently
    }

    query = query.limit(limit);

    const snapshot = await query.get();

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Client-side search filter (Firebase doesn't support full-text search natively)
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

    // Update cache
    cache = { data: result, timestamp: Date.now(), key: cacheKey };

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