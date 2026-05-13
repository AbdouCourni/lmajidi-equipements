// src/types/product.ts

export type ProductStockStatus =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock';

/* =========================================================
   PRODUCT IMAGE
========================================================= */

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
}

/* =========================================================
   PRODUCT SPECIFICATIONS
========================================================= */

export interface ProductSpecifications {
  dimensions?: string;
  weight?: string;
 power?: string;
  voltage?: string;
  refrigerant?: string;

  [key: string]: string | undefined;
}

/* =========================================================
   PRODUCT
========================================================= */

export interface Product {
  id: string;

  name: string;
  description: string;

  price: number | null;

  currency: 'MAD' | 'EUR' | 'USD';

  category: string;

  subCategory?: string;

  brand?: string;

  images: ProductImage[];
  isExternalSrc: boolean;
  imageExternalLinks: string[];

  stockStatus?: ProductStockStatus;

  isOnPromotion?: boolean;

  keySpecs?: string[];

  specifications?: ProductSpecifications;

  page?: number;

  createdAt?: string;

  updatedAt?: string;
}
// Helper function to get display price
export function getProductDisplayPrice(product: Product): string {

  // Product has price
  if (product.price && product.price > 0) {
    return `${product.price.toLocaleString('fr-FR')} ${product.currency}`;
  }

  // No price
  return 'Sur devis';
}

// Helper function to get product badge
export function getProductBadge(product: Product): string | null {

  if (product.isOnPromotion) {
    return 'PROMO';
  }

  if (product.price === null || product.price <= 0) {
    return 'SUR DEVIS';
  }

  return null;
}

// Helper function to get stock status
export function getProductStockStatus(
  product: Product
): { label: string; color: string } {

  switch (product.stockStatus) {

    case 'in_stock':
      return {
        label: 'En stock',
        color: 'bg-green-100 text-green-700'
      };

    case 'low_stock':
      return {
        label: 'Stock limité',
        color: 'bg-orange-100 text-orange-700'
      };

    case 'out_of_stock':
      return {
        label: 'Sur commande',
        color: 'bg-blue-100 text-blue-700'
      };

    default:
      return {
        label: 'Disponible',
        color: 'bg-green-100 text-green-700'
      };
  }
}
export function getProductImages(product: Product): string[] {
  if (product.isExternalSrc && product.imageExternalLinks?.length > 0) {
    return product.imageExternalLinks;
  }
  return product.images
    ?.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    .map(img => img.url) || [];
}

export function getPrimaryImage(product: Product): string | null {
  if (product.isExternalSrc && product.imageExternalLinks?.length > 0) {
    return product.imageExternalLinks[0];
  }
  const primary = product.images?.find(img => img.isPrimary);
  return primary?.url || product.images?.[0]?.url || null;
}