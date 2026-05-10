// src/app/europmat/admin/products/edit/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../../../../../../../lib/firebase/config';

import type { Product, ProductImage } from '../../../../../../../types/product';

import { ImageUpload } from '../../../../../../../components/dashboard/ProductImageUpload';
import { Route } from 'next';

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES: Record<string, string> = {
  refrigeration: 'Réfrigération',
  pizza: 'Équipement Pizza',
  bakery: 'Boulangerie',
  fryers: 'Friteuses',
  grills: 'Grillades',
  shawarma: 'Shawarma',
  pastry: 'Pâtisserie',
  furniture: 'Mobilier',
};

/* =========================================================
   PAGE
========================================================= */

export default function EditProductPage() {

  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: null,
    currency: 'MAD',
    category: '',
    subCategory: '',
    brand: '',
    images: [],
    stockStatus: 'in_stock',
    isOnPromotion: false,
    keySpecs: [''],
    specifications: {
      dimensions: '',
      weight: '',
      power: '',
      voltage: '220V/50Hz',
      refrigerant: '',
    },
  });

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const docRef = doc(db, 'products', productId);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {

          alert('Product not found');

          router.push('/europmat/admin/products' as any);

          return;
        }

        const data = docSnap.data() as Product;

        setFormData({
          ...data,
          id: docSnap.id,
          images: data.images || [],
          keySpecs: data.keySpecs || [''],
          specifications: data.specifications || {},
        });

      } catch (error) {

        console.error(error);

        alert('Failed to load product');

      } finally {

        setInitialLoading(false);

      }
    };

    fetchProduct();

  }, [productId, router]);

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

    const { name, value, type } = e.target;

    if (type === 'checkbox') {

      const checked = (e.target as HTMLInputElement).checked;

      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'price'
          ? value === ''
            ? null
            : Number(value)
          : value,
    }));
  };

  /* =========================================================
     SPECIFICATIONS
  ========================================================= */

  const handleSpecChange = (
    key: string,
    value: string
  ) => {

    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  /* =========================================================
     KEY SPECS
  ========================================================= */

  const handleKeySpecChange = (
    index: number,
    value: string
  ) => {

    const updated = [...(formData.keySpecs || [])];

    updated[index] = value;

    setFormData(prev => ({
      ...prev,
      keySpecs: updated,
    }));
  };

  const addKeySpec = () => {

    setFormData(prev => ({
      ...prev,
      keySpecs: [...(prev.keySpecs || []), ''],
    }));
  };

  const removeKeySpec = (index: number) => {

    const updated = [...(formData.keySpecs || [])];

    updated.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      keySpecs: updated,
    }));
  };

  /* =========================================================
     IMAGES
  ========================================================= */

  const handleImagesChange = (
  images: ProductImage[]
) => {

  setFormData(prev => ({
    ...prev,
    images,
  }));
};



/* =========================================================
   SUBMIT
========================================================= */

const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  setLoading(true);

  try {

    const productData = {

      name: formData.name,

      description: formData.description,

      price: formData.price ?? null,

      currency: formData.currency || 'MAD',

      category: formData.category,

      subCategory:
        formData.subCategory || '',

      brand:
        formData.brand || '',

      images:
        formData.images || [],

      stockStatus:
        formData.stockStatus ||
        'in_stock',

      isOnPromotion:
        formData.isOnPromotion || false,

      keySpecs:
        formData.keySpecs?.filter(
          spec => spec.trim() !== ''
        ) || [],

      specifications:
        formData.specifications || {},

      updatedAt:
        new Date().toISOString(),
    };

    // REMOVE UNDEFINED VALUES
    const cleanData = Object.fromEntries(
      Object.entries(productData).filter(
        ([_, value]) =>
          value !== undefined
      )
    );

    await updateDoc(
      doc(db, 'products', productId),
      cleanData
    );

    router.push(
      '/europmat/admin/products' as any
    );

  } catch (error) {

    console.error(error);

    alert('Failed to update product');

  } finally {

    setLoading(false);

  }
};

  /* =========================================================
     LOADING
  ========================================================= */

  if (initialLoading) {

    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <Link
          href={"/europmat/admin/products"as Route}
          className="p-2 hover:bg-beige-warm rounded-lg transition"
        >
          ←
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            Edit Product
          </h1>

          <p className="text-sm text-steel-dark">
            {formData.name}
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        {/* BASIC INFO */}
        <div className="card-dashboard p-6 mb-6">

          <h2 className="text-lg font-semibold mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product name"
              className="input-field"
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">
                Select category
              </option>

              {Object.entries(CATEGORIES).map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>

            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="Sub category"
              className="input-field"
            />

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="input-field"
            />

            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Price"
              className="input-field"
            />

            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-field"
            >
              <option value="MAD">MAD</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>

          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Description"
            className="input-field mt-4"
          />

          {/* TOGGLES */}
          <div className="flex flex-wrap gap-6 mt-4">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                name="isOnPromotion"
                checked={formData.isOnPromotion || false}
                onChange={handleChange}
              />

              <span>On Promotion</span>

            </label>

          </div>

        </div>

        {/* IMAGES */}
        <div className="card-dashboard p-6 mb-6">

          <h2 className="text-lg font-semibold mb-4">
            Product Images
          </h2>

          <ImageUpload
  images={formData.images || []}
  onChange={handleImagesChange}
  maxImages={10}
/>

        </div>

        {/* KEY SPECS */}
        <div className="card-dashboard p-6 mb-6">

          <h2 className="text-lg font-semibold mb-4">
            Key Specifications
          </h2>

          <div className="space-y-2">

            {(formData.keySpecs || []).map(
              (spec, index) => (

                <div
                  key={index}
                  className="flex gap-2"
                >

                  <input
                    type="text"
                    value={spec}
                    onChange={(e) =>
                      handleKeySpecChange(
                        index,
                        e.target.value
                      )
                    }
                    className="input-field flex-1"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeKeySpec(index)
                    }
                    className="px-3 py-2 text-red-500"
                  >
                    ✕
                  </button>

                </div>
              )
            )}

            <button
              type="button"
              onClick={addKeySpec}
              className="text-sm text-navy-accent"
            >
              + Add specification
            </button>

          </div>

        </div>

        {/* TECHNICAL SPECS */}
        <div className="card-dashboard p-6 mb-6">

          <h2 className="text-lg font-semibold mb-4">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {Object.entries(
              formData.specifications || {}
            ).map(([key, value]) => (

              <div key={key}>

                <label className="label capitalize">
                  {key}
                </label>

                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) =>
                    handleSpecChange(
                      key,
                      e.target.value
                    )
                  }
                  className="input-field"
                />

              </div>
            ))}

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">

          <Link
            href={"/europmat/admin/products"as Route}
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
              : 'Update Product'}
          </button>

        </div>

      </form>

    </div>
  );
}