// src/app/europmat/admin/dashboard/page.tsx
'use client';

import { AuthGuard } from '../../../../../components/auth/auth-guard';
import { useAuth } from '../../../../../lib/auth-context';
import { useState, useEffect } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';

export default function DashboardPage() {
  const { user, adminData } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsCount = await getCountFromServer(collection(db, 'products'));
        const categoriesCount = await getCountFromServer(collection(db, 'categories'));
        const messagesCount = await getCountFromServer(collection(db, 'messages'));

        setStats({
          totalProducts: productsCount.data().count,
          totalCategories: categoriesCount.data().count,
          totalMessages: messagesCount.data().count,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AuthGuard>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {adminData?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-navy-900 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-navy-900 mt-2">{stats.totalCategories}</p>
              </div>
              <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-3xl font-bold text-navy-900 mt-2">{stats.totalMessages}</p>
              </div>
              <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/europmat/admin/products/create"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-navy-500 hover:bg-beige-50 transition group"
            >
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition">
                <svg className="w-5 h-5 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-navy-900">Add Product</span>
            </a>

            <a
              href="/europmat/admin/categories"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-navy-500 hover:bg-beige-50 transition group"
            >
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition">
                <svg className="w-5 h-5 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="font-medium text-navy-900">Manage Categories</span>
            </a>

            <a
              href="/europmat/admin/messages"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-navy-500 hover:bg-beige-50 transition group"
            >
              <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition">
                <svg className="w-5 h-5 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-medium text-navy-900">View Messages</span>
            </a>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}