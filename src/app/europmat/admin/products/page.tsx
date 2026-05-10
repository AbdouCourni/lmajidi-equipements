// src/app/europmat/admin/products/page.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';

import Link from 'next/link';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';

import {
  Route,
} from 'next';

import {
  db,
} from '../../../../../lib/firebase/config';

import type {
  Product,
} from '../../../../../types/product';

export default function ProductsPage() {

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState<string | null>(null);

  const [products, setProducts] =
    useState<Product[]>([]);

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const snapshot =
        await getDocs(
          collection(
            db,
            'products'
          )
        );

      const data =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

      setProducts(data);

    } catch (error) {

      console.error(error);

      alert(
        'Failed to load products'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchProducts();

  }, []);

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  const handleDelete = async (
    productId: string
  ) => {

    const confirmed =
      confirm(
        'Delete this product?'
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(productId);

      await deleteDoc(
        doc(
          db,
          'products',
          productId
        )
      );

      setProducts(prev =>
        prev.filter(
          product =>
            product.id !== productId
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        'Failed to delete product'
      );

    } finally {

      setDeleting(null);

    }
  };

  /* =========================================================
     FORMAT PRICE
  ========================================================= */

  const formatPrice = (
    price: number | null,
    currency: string
  ) => {

    if (!price) {
      return 'Sur devis';
    }

    return `${price.toLocaleString(
      'fr-FR'
    )} ${currency}`;
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-charcoal">
            Products
          </h1>

          <p className="text-steel-dark mt-1">
            Manage Europmat products
          </p>

        </div>

        <Link
          href={
            '/europmat/admin/products/create' as Route
          }
          className="btn-primary flex items-center gap-2"
        >

          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>

          Add Product

        </Link>

      </div>

      {/* LOADING */}
      {loading && (

        <div className="flex items-center justify-center h-64">

          <div className="spinner w-12 h-12"></div>

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        products.length === 0 && (

        <div className="card-dashboard p-12 text-center">

          <div className="flex flex-col items-center gap-4">

            <div className="w-20 h-20 rounded-2xl bg-beige-warm flex items-center justify-center">

              <svg
                className="w-10 h-10 text-steel-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-xl font-semibold text-charcoal">
                No products yet
              </h2>

              <p className="text-steel-dark mt-1">
                Create your first product
              </p>

            </div>

            <Link
              href={
                '/europmat/admin/products/create' as Route
              }
              className="btn-primary"
            >
              Add Product
            </Link>

          </div>

        </div>
      )}

      {/* TABLE */}
      {!loading &&
        products.length > 0 && (

        <div className="card-dashboard overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-steel">

                  <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-steel-dark">
                    Product
                  </th>

                  <th className="hidden md:table-cell text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-steel-dark">
                    Category
                  </th>

                  <th className="hidden lg:table-cell text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-steel-dark">
                    Brand
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-steel-dark">
                    Price
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-steel-dark">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-steel-dark">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-steel">

                {products.map(product => {

                  const primaryImage =
                    product.images?.find(
                      image =>
                        image.isPrimary
                    )?.url ||
                    product.images?.[0]
                      ?.url;

                  return (

                    <tr
                      key={product.id}
                      className="hover:bg-beige-warm/40 transition"
                    >

                      {/* PRODUCT */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-4">

                          {/* IMAGE */}
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-steel flex-shrink-0 border border-steel">

                            {primaryImage ? (

                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />

                            ) : (

                              <div className="w-full h-full flex items-center justify-center text-steel-dark">

                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16"
                                  />
                                </svg>

                              </div>
                            )}

                          </div>

                          {/* INFO */}
                          <div>

                            <h3 className="font-semibold text-charcoal line-clamp-1">
                              {product.name}
                            </h3>

                            <p className="text-sm text-steel-dark line-clamp-1 mt-1">
                              {product.description}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td className="hidden md:table-cell px-5 py-4">

                        <span className="badge-steel text-xs">

                          {product.category ||
                            '-'}

                        </span>

                      </td>

                      {/* BRAND */}
                      <td className="hidden lg:table-cell px-5 py-4 text-charcoal">

                        {product.brand ||
                          '-'}

                      </td>

                      {/* PRICE */}
                      <td className="px-5 py-4">

                        <span className="font-medium text-charcoal">

                          {formatPrice(
                            product.price,
                            product.currency
                          )}

                        </span>

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <div className="flex flex-wrap gap-2">

                          {product.isOnPromotion && (

                            <span className="badge-red text-xs">
                              Promo
                            </span>
                          )}

                          {!product.isOnPromotion && (

                            <span className="badge-steel text-xs">
                              Standard
                            </span>
                          )}

                        </div>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          {/* EDIT */}
                          <Link
                            href={`/europmat/admin/products/edit/${product.id}` as Route}
                            className="p-2 rounded-lg hover:bg-beige-warm transition text-charcoal hover:text-navy-main"
                            title="Edit"
                          >

                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>

                          </Link>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            disabled={
                              deleting ===
                              product.id
                            }
                            className="p-2 rounded-lg hover:bg-red-50 transition text-charcoal hover:text-red-premium disabled:opacity-50"
                            title="Delete"
                          >

                            {deleting ===
                            product.id ? (

                              <div className="spinner w-4 h-4"></div>

                            ) : (

                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}

                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}