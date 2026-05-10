// src/app/europmat/admin/categories/edit/[id]/page.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../../../../../../lib/firebase/config';

import type {
  Category,
} from '../../../../../../../types/category';

import {
  ImageUpload,
} from '../../../../../../../components/dashboard/ProductImageUpload';
import { Route } from 'next';
import { SingleImageUpload } from '../../../../../../../components/dashboard/SingleImageUpload';

export default function EditCategoryPage() {

  const router = useRouter();

  const params = useParams();

  const categoryId =
    params.id as string;

  const [loading, setLoading] =
    useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [mainCategories, setMainCategories] =
    useState<Category[]>([]);

  const [formData, setFormData] =
    useState<Category>({
      id: '',
      name: '',
      slug: '',
      image: '',
      description: '',
      parentId: null,
      level: 'main',
      createdAt: '',
      updatedAt: '',
    });

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        // CATEGORY
        const categoryRef =
          doc(
            db,
            'categories',
            categoryId
          );

        const categorySnap =
          await getDoc(categoryRef);

        if (!categorySnap.exists()) {

          alert(
            'Category not found'
          );

          router.push(
            '/europmat/admin/categories' as Route
          );

          return;
        }

        const categoryData = {
          id: categorySnap.id,
          ...categorySnap.data(),
        } as Category;

        setFormData(categoryData);

        // MAIN CATEGORIES
        const categoriesSnap =
          await getDocs(
            collection(
              db,
              'categories'
            )
          );

        const categories =
          categoriesSnap.docs.map(
            doc => ({
              id: doc.id,
              ...doc.data(),
            })
          ) as Category[];

        setMainCategories(
          categories.filter(
            category =>
              category.level === 'main' &&
              category.id !== categoryId
          )
        );

      } catch (error) {

        console.error(error);

      } finally {

        setInitialLoading(false);

      }
    };

    fetchData();

  }, [categoryId, router]);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,

      [name]:
        name === 'parentId'
          ? value || null
          : value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const categoryData = {

        name:
          formData.name.trim(),

        slug:
          formData.slug.trim(),

        image:
          formData.image || '',

        description:
          formData.description || '',

        level:
          formData.level,

        parentId:
          formData.level === 'sub'
            ? formData.parentId
            : null,

        updatedAt:
          new Date().toISOString(),
      };

      const cleanData =
        Object.fromEntries(
          Object.entries(
            categoryData
          ).filter(
            ([_, value]) =>
              value !== undefined
          )
        );

      await updateDoc(
        doc(
          db,
          'categories',
          categoryId
        ),
        cleanData
      );

      router.push(
        '/europmat/admin/categories' as Route
      );

    } catch (error) {

      console.error(error);

      alert(
        'Failed to update category'
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (initialLoading) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="max-w-4xl">

      <div className="flex items-center gap-4 mb-8">

        <Link
          href={"/europmat/admin/categories" as Route}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          ←
        </Link>

        <div>

          <h1 className="text-3xl font-bold">
            Edit Category
          </h1>

          <p className="text-gray-500">
            {formData.name}
          </p>

        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="card-dashboard p-6 space-y-5">

          {/* NAME */}
          <div>

            <label className="label">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />

          </div>

          {/* SLUG */}
          <div>

            <label className="label">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="input-field"
              required
            />

          </div>

          {/* LEVEL */}
          <div>

            <label className="label">
              Category Type
            </label>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="input-field"
            >

              <option value="main">
                Main Category
              </option>

              <option value="sub">
                Sub Category
              </option>

            </select>

          </div>

          {/* PARENT */}
          {formData.level === 'sub' && (

            <div>

              <label className="label">
                Parent Category
              </label>

              <select
                name="parentId"
                value={
                  formData.parentId || ''
                }
                onChange={handleChange}
                className="input-field"
                required
              >

                <option value="">
                  Select parent category
                </option>

                {mainCategories.map(
                  category => (

                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>
          )}

          {/* DESCRIPTION */}
          <div>

            <label className="label">
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description || ''
              }
              onChange={handleChange}
              className="input-field"
              rows={5}
            />

          </div>

          {/* IMAGE */}
          <div>

            {/* <label className="label">
              Category Image
            </label> */}

         <SingleImageUpload
  image={formData.image || ''}
  folder="europmat/categories"
  label="Category Image"
  onChange={(image) =>
    setFormData(prev => ({
      ...prev,
      image,
    }))
  }
/>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">

          <Link
            href={"/europmat/admin/categories" as Route}
            className="btn-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading
              ? 'Updating...'
              : 'Update Category'}
          </button>

        </div>

      </form>

    </div>
  );
}