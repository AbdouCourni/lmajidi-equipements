// src/app/europmat/admin/products/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { ImageUpload } from '../../../../../../components/dashboard/ProductImageUpload';
import Link from 'next/link';
import type { Route } from 'next';
import type { ProductImage, ProductStockStatus } from '../../../../../../types/product';

const CATEGORIES = [
  'refrigeration',
  'cooking',
  'bakery',
  'preparation',
  'snack-equipment',
  'furniture',
];

const STOCK_STATUSES: { value: ProductStockStatus; label: string }[] = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'low_stock', label: 'Stock limité' },
  { value: 'out_of_stock', label: 'Sur commande' },
];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'MAD' as 'MAD' | 'EUR' | 'USD',
    category: '',
    subCategory: '',
    brand: '',
    stockStatus: 'in_stock' as ProductStockStatus,
    isOnPromotion: false,
    keySpecs: [''],
    specifications: {
      dimensions: '',
      weight: '',
      power: '',
      voltage: '',
      refrigerant: '',
    },
  });

  const [images, setImages] = useState<ProductImage[]>([]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value },
    }));
  };

  const handleKeySpecChange = (index: number, value: string) => {
    const newSpecs = [...formData.keySpecs];
    newSpecs[index] = value;
    setFormData(prev => ({ ...prev, keySpecs: newSpecs }));
  };

  const addKeySpec = () => {
    setFormData(prev => ({ ...prev, keySpecs: [...prev.keySpecs, ''] }));
  };

  const removeKeySpec = (index: number) => {
    if (formData.keySpecs.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      keySpecs: prev.keySpecs.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!formData.name || !formData.category) {
      setError('Name and category are required');
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        category: formData.category,
        subCategory: formData.subCategory.trim() || '',
        brand: formData.brand.trim() || '',
        images,
        stockStatus: formData.stockStatus,
        isOnPromotion: formData.isOnPromotion,
        keySpecs: formData.keySpecs.filter(s => s.trim()),
        specifications: Object.fromEntries(
          Object.entries(formData.specifications).filter(([_, v]) => v.trim())
        ),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'products'), productData);
      router.push('/europmat/admin/products' as Route);
    } catch (err) {
      console.error(err);
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={'/europmat/admin/products' as Route}
          className="p-2 hover:bg-beige-warm rounded-lg transition"
        >
          <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Create Product</h1>
          <p className="text-sm text-steel-dark mt-1">Add a new product to the catalog</p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFORMATION */}
        <div className="card-dashboard p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Vitrine Réfrigérée 3 Portes"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Product description..."
              />
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., vitrines-refrigerees"
              />
            </div>

            <div>
              <label className="label">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Comerssa"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="input-field"
                  placeholder="Leave empty for 'Sur devis'"
                />
              </div>
              <div>
                <label className="label">Currency</label>
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
            </div>

            <div>
              <label className="label">Stock Status</label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                className="input-field"
              >
                {STOCK_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                name="isOnPromotion"
                checked={formData.isOnPromotion}
                onChange={handleChange}
                className="w-4 h-4 rounded border-steel-dark text-red-premium focus:ring-red-premium"
              />
              <label className="text-sm font-medium text-charcoal">
                On Promotion
              </label>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="card-dashboard p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">
            Images ({images.length}/10)
          </h2>
          <ImageUpload
            images={images}
            onChange={setImages}
            maxImages={10}
          />
        </div>

        {/* KEY SPECS */}
        <div className="card-dashboard p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Key Specifications</h2>
          <div className="space-y-2">
            {formData.keySpecs.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleKeySpecChange(index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., 1000L capacité"
                />
                <button
                  type="button"
                  onClick={() => removeKeySpec(index)}
                  className="px-3 text-red-premium hover:bg-red-50 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKeySpec}
              className="text-sm text-navy-accent hover:underline flex items-center gap-1 mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add specification
            </button>
          </div>
        </div>

        {/* TECHNICAL SPECIFICATIONS */}
        <div className="card-dashboard p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Dimensions</label>
              <input
                type="text"
                value={formData.specifications.dimensions}
                onChange={(e) => handleSpecChange('dimensions', e.target.value)}
                className="input-field"
                placeholder="e.g., 1800 x 750 x 2000 mm"
              />
            </div>
            <div>
              <label className="label">Weight</label>
              <input
                type="text"
                value={formData.specifications.weight}
                onChange={(e) => handleSpecChange('weight', e.target.value)}
                className="input-field"
                placeholder="e.g., 180 kg"
              />
            </div>
            <div>
              <label className="label">Power</label>
              <input
                type="text"
                value={formData.specifications.power}
                onChange={(e) => handleSpecChange('power', e.target.value)}
                className="input-field"
                placeholder="e.g., 400 W"
              />
            </div>
            <div>
              <label className="label">Voltage</label>
              <input
                type="text"
                value={formData.specifications.voltage}
                onChange={(e) => handleSpecChange('voltage', e.target.value)}
                className="input-field"
                placeholder="e.g., 220V/50Hz"
              />
            </div>
            <div>
              <label className="label">Refrigerant</label>
              <input
                type="text"
                value={formData.specifications.refrigerant}
                onChange={(e) => handleSpecChange('refrigerant', e.target.value)}
                className="input-field"
                placeholder="e.g., R290"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></div>
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </button>
          <Link
            href={'/europmat/admin/products' as Route}
            className="btn-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}