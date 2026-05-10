// src/app/europmat/admin/categories/create/page.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  addDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

import {
  useRouter,
} from 'next/navigation';

import {
  db,
} from '../../../../../../lib/firebase/config';

import type {
  Category,
} from '../../../../../../types/category';

import {
  ImageUpload,
} from '../../../../../../components/dashboard/ProductImageUpload';
import { Route } from 'next';
import { SingleImageUpload } from '../../../../../../components/dashboard/SingleImageUpload';

export default function CreateCategoryPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [mainCategories, setMainCategories] =
    useState<Category[]>([]);

  const [formData, setFormData] =
    useState<Omit<Category, 'id'>>({
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
     FETCH MAIN CATEGORIES
  ========================================================= */

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              'categories'
            )
          );

        const categories =
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Category[];

        setMainCategories(
          categories.filter(
            category =>
              category.level === 'main'
          )
        );

      } catch (error) {

        console.error(error);

      }
    };

    fetchCategories();

  }, []);

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

        createdAt:
          new Date().toISOString(),

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

      await addDoc(
        collection(
          db,
          'categories'
        ),
        cleanData
      );

      router.push(
        '/europmat/admin/categories' as Route
      );

    } catch (error) {

      console.error(error);

      alert(
        'Failed to create category'
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="max-w-4xl">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Create Category
        </h1>

        <p className="text-gray-500 mt-1">
          Create a main or sub category
        </p>

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
              placeholder="Réfrigération"
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
              placeholder="refrigeration"
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

          {/* PARENT CATEGORY */}
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
                formData.description
              }
              onChange={handleChange}
              className="input-field"
              rows={5}
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="label">
              Category Image
            </label>

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
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading
              ? 'Creating...'
              : 'Create Category'}
          </button>

        </div>

      </form>

    </div>
  );
}