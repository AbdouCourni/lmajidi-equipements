'use client';

import { useMemo, useState } from 'react';
import type { Product } from '../types/product';

export function useProducts(initialProducts: Product[] = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const products = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return initialProducts.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch =
        !term ||
        [
          product.name,
          product.brand,
          product.description,
          product.category,
          product.subCategory,
        ].some((value) => value?.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [category, initialProducts, searchTerm]);

  return {
    products,
    loading: false,
    error: null,
    search: setSearchTerm,
    filterByCategory: setCategory,
    refresh: () => undefined,
  };
}
