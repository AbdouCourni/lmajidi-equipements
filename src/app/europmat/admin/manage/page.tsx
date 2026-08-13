// src/app/europmat/admin/manage/page.tsx

'use client';

import { useAuth } from '../../../../../lib/auth-context';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';
import Link from 'next/link';
import type { Product } from '../../../../../types/product';
import type { Category } from '../../../../../types/category';

export default function ManagePage() {
  const { adminData } = useAuth();

  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsSnap, categoriesSnap, subscribersSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'subscribeList')),
        ]);

        setProductCount(productsSnap.size);
        setCategoryCount(categoriesSnap.size);
        setSubscriberCount(subscribersSnap.size);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {adminData?.email}
          </p>
        </div>

        <Link
          href={'/europmat/admin/products/create' as any}  
          className="btn-primary w-fit"
        >
          + Add Product
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard
          title="Products"
          value={productCount}
          icon="📦"
          color="bg-blue-500"
        />

        <StatCard
          title="Categories"
          value={categoryCount}
          icon="📂"
          color="bg-purple-500"
        />

        <StatCard
          title="Subscribers"
          value={subscriberCount}
          icon="📧"
          color="bg-green-500"
        />

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <QuickLink
            href="/europmat/admin/products"
            icon="📦"
            label="Products"
          />

          <QuickLink
            href="/europmat/admin/categories"
            icon="📂"
            label="Categories"
          />

          <QuickLink
            href="/europmat/admin/products/new"
            icon="➕"
            label="Add Product"
          />

          <QuickLink
            href="/europmat/admin/pages"
            icon="📄"
            label="Pages"
          />

        </div>
      </div>

      {/* RECENT PRODUCTS */}
   

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4">

      <div className={`w-12 h-12 flex items-center justify-center text-white rounded-xl ${color}`}>
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>

    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href as any}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border hover:shadow-md hover:-translate-y-1 transition"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
    </Link>
  );
}