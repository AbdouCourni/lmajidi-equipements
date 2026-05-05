// src/types/product.ts
export interface ProductVariant {
  sku: string;
  color?: string;
  type?: string;
  price?: number;  // Optional - some variants may not have price
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  image?: string;
  page?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  category: string;
  subCategory: string;
  brand?: string;
  description: string;
  variants: ProductVariant[];
  primaryImage?: string;
  gallery?: string[];
  isOnPromotion?: boolean;
  keySpecs?: string[];
  specifications?: Record<string, string>;
  page?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to get display price
export function getProductDisplayPrice(product: Product): string {
  // Check if product has direct price
  if (product.price) {
    return `${product.price.toLocaleString('fr-FR')} ${product.currency}`;
  }
  
  // Check variants for prices
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants
      .map(v => v.price)
      .filter((p): p is number => p !== undefined && p !== null && p > 0);
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return `${minPrice.toLocaleString('fr-FR')} ${product.currency}`;
      } else {
        return `${minPrice.toLocaleString('fr-FR')} - ${maxPrice.toLocaleString('fr-FR')} ${product.currency}`;
      }
    }
  }
  
  // If no price found
  return 'Sur devis';
}

// Helper function to get product badge
export function getProductBadge(product: Product): string | null {
  if (product.isOnPromotion) return 'PROMO';
  if (product.price === null && (!product.variants || product.variants.length === 0)) return 'SUR DEVIS';
  return null;
}

// Helper function to get stock status
export function getProductStockStatus(product: Product): { label: string; color: string } {
  if (!product.variants || product.variants.length === 0) {
    return { label: 'Disponible', color: 'bg-green-100 text-green-700' };
  }
  
  const hasStock = product.variants.some(v => v.stockStatus === 'in_stock');
  const hasLowStock = product.variants.some(v => v.stockStatus === 'low_stock');
  
  if (hasStock) return { label: 'En stock', color: 'bg-green-100 text-green-700' };
  if (hasLowStock) return { label: 'Stock limité', color: 'bg-orange-100 text-orange-700' };
  return { label: 'Sur commande', color: 'bg-blue-100 text-blue-700' };
}