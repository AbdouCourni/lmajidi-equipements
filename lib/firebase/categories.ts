// src/lib/firebase/categories.ts

import 'server-only';

import {
  adminDb,
} from './admin';

import type {
  Category,
} from '../../types/category';

/* =========================================================
   CACHE
========================================================= */

let categoriesCache:
  | Category[]
  | null = null;

let categoriesCacheTime = 0;

const CACHE_DURATION =
  5 * 60 * 1000;

/* =========================================================
   CONVERT
========================================================= */

function convertToCategory(
  doc: FirebaseFirestore.QueryDocumentSnapshot
): Category {

  const data = doc.data();

  return {

    id: doc.id,

    name:
      data.name || '',

    slug:
      data.slug || '',

    image:
      data.image || '',

    description:
      data.description || '',

    parentId:
      data.parentId || null,

    level:
      data.level || 'main',

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}

/* =========================================================
   GET ALL
========================================================= */

export async function getAllCategories(): Promise<Category[]> {

  if (
    categoriesCache &&
    Date.now() -
      categoriesCacheTime <
      CACHE_DURATION
  ) {

    return categoriesCache;
  }

  try {

    const snapshot =
      await adminDb
        .collection(
          'categories'
        )
        .orderBy(
          'name',
          'asc'
        )
        .get();

    const categories =
      snapshot.docs.map(
        convertToCategory
      );

    categoriesCache =
      categories;

    categoriesCacheTime =
      Date.now();

    return categories;

  } catch (error) {

    console.error(
      'Error fetching categories:',
      error
    );

    return [];
  }
}

/* =========================================================
   MAIN CATEGORIES
========================================================= */

export async function getMainCategories(): Promise<Category[]> {

  const categories =
    await getAllCategories();

  return categories.filter(
    category =>
      category.level ===
      'main'
  );
}

/* =========================================================
   SUB CATEGORIES
========================================================= */

export async function getSubCategories(
  parentId: string
): Promise<Category[]> {

  const categories =
    await getAllCategories();

  return categories.filter(
    category =>
      category.level ===
        'sub' &&
      category.parentId ===
        parentId
  );
}
