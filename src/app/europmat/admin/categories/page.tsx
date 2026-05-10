// src/app/europmat/admin/categories/page.tsx

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
  db,
} from '../../../../../lib/firebase/config';

import type {
  Category,
} from '../../../../../types/category';
import { Route } from 'next';

export default function CategoriesPage() {

  const [loading, setLoading] =
    useState(true);

  const [categories, setCategories] =
    useState<Category[]>([]);

  /* =========================================================
     FETCH CATEGORIES
  ========================================================= */

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const snapshot =
        await getDocs(
          collection(
            db,
            'categories'
          )
        );

      const data =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

      setCategories(data);

    } catch (error) {

      console.error(error);

      alert(
        'Failed to load categories'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchCategories();

  }, []);

  /* =========================================================
     DELETE CATEGORY
  ========================================================= */

  const handleDelete = async (
    categoryId: string
  ) => {

    const confirmed =
      confirm(
        'Delete this category?'
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteDoc(
        doc(
          db,
          'categories',
          categoryId
        )
      );

      setCategories(prev =>
        prev.filter(
          category =>
            category.id !== categoryId
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        'Failed to delete category'
      );
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const getParentCategoryName = (
    parentId?: string | null
  ) => {

    if (!parentId) {
      return '-';
    }

    const parent =
      categories.find(
        category =>
          category.id === parentId
      );

    return parent?.name || '-';
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
            Categories
          </h1>

          <p className="text-gray-500 mt-1">
            Manage product categories
          </p>

        </div>

        <Link
          href= {"/europmat/admin/categories/create" as Route}
          className="btn-primary"
        >
          + Create Category
        </Link>

      </div>

      {/* LOADING */}
      {loading && (

        <div className="p-10 text-center">

          Loading categories...

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        categories.length === 0 && (

        <div className="card-dashboard p-10 text-center">

          <div className="text-5xl mb-4">
            📂
          </div>

          <h2 className="text-xl font-semibold mb-2">
            No categories found
          </h2>

          <p className="text-gray-500 mb-6">
            Create your first category
          </p>

          <Link
            href={"/europmat/admin/categories/create" as Route}
            className="btn-primary"
          >
            Create Category
          </Link>

        </div>
      )}

      {/* TABLE */}
      {!loading &&
        categories.length > 0 && (

        <div className="card-dashboard overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left p-4 font-semibold">
                    Image
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Name
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Slug
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Type
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Parent
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Created
                  </th>

                  <th className="text-right p-4 font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {categories.map(category => (

                  <tr
                    key={category.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* IMAGE */}
                    <td className="p-4">

                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">

                        {category.image ? (

                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />

                        ) : (

                          <div className="flex items-center justify-center h-full text-2xl">

                            📂

                          </div>
                        )}

                      </div>

                    </td>

                    {/* NAME */}
                    <td className="p-4">

                      <div>

                        <h3 className="font-semibold text-charcoal">
                          {category.name}
                        </h3>

                        {category.description && (

                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {category.description}
                          </p>
                        )}

                      </div>

                    </td>

                    {/* SLUG */}
                    <td className="p-4">

                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">

                        {category.slug}

                      </span>

                    </td>

                    {/* LEVEL */}
                    <td className="p-4">

                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          category.level ===
                          'main'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >

                        {category.level ===
                        'main'
                          ? 'Main'
                          : 'Sub'}

                      </span>

                    </td>

                    {/* PARENT */}
                    <td className="p-4 text-sm text-gray-600">

                      {getParentCategoryName(
                        category.parentId
                      )}

                    </td>

                    {/* DATE */}
                    <td className="p-4 text-sm text-gray-500">

                      {category.createdAt
                        ? new Date(
                            category.createdAt
                          ).toLocaleDateString(
                            'fr-FR'
                          )
                        : '-'}

                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">

                      <div className="flex items-center justify-end gap-3">

                        {/* EDIT */}
                        <Link
                          href={`/europmat/admin/categories/edit/${category.id}` as Route}
                          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm"
                        >
                          Edit
                        </Link>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              category.id
                            )
                          }
                          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition text-sm"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}