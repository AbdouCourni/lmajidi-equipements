// src/app/europmat/admin/analytics/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';
import type { Product } from '../../../../../types/product';

interface AnalyticsData {
  totalProducts: number;
  totalCategories: number;
  totalSubscribers: number;
  productsOnPromotion: number;
  productsByCategory: { name: string; count: number }[];
  recentProducts: Product[];
  productsWithImages: number;
  productsWithoutPrice: number;
  productsOutOfStock: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Count queries
     const [
  productsSnapshot,
  categoriesCount,
  subscribersCount,
  promoCount,
  outOfStockCount,
] = await Promise.all([
  getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'))),
  getCountFromServer(collection(db, 'categories')),
  getCountFromServer(collection(db, 'subscribeList')),
  getCountFromServer(query(collection(db, 'products'), where('isOnPromotion', '==', true))),
  getCountFromServer(query(collection(db, 'products'), where('stockStatus', '==', 'out_of_stock'))),
]);

      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Products by category
      const categoryMap = new Map<string, number>();
      products.forEach(p => {
        const cat = p.category || 'Non classé';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });

      const productsByCategory = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Recent products
      const recentProducts = products.slice(0, 5);

      // Products with images
      const productsWithImages = products.filter(
        p => (p.images?.length > 0) || (p.imageExternalLinks?.length > 0)
      ).length;

      // Products without price
      const productsWithoutPrice = products.filter(
        p => !p.price || p.price <= 0
      ).length;

      setData({
        totalProducts: products.length,
        totalCategories: categoriesCount.data().count,
        totalSubscribers: subscribersCount.data().count,
        productsOnPromotion: promoCount.data().count,
        productsByCategory,
        recentProducts,
        productsWithImages,
        productsWithoutPrice,
        productsOutOfStock: outOfStockCount.data().count,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      label: 'Produits totaux',
      value: data.totalProducts,
      icon: '📦',
      color: 'bg-navy-100 text-navy-700',
      detail: `${data.productsOnPromotion} en promo`,
    },
    {
      label: 'Catégories',
      value: data.totalCategories,
      icon: '📂',
      color: 'bg-beige-300 text-charcoal-700',
      detail: 'Principales & sous-catégories',
    },
    {
      label: 'Abonnés newsletter',
      value: data.totalSubscribers,
      icon: '📧',
      color: 'bg-accent-100 text-accent-700',
      detail: 'Liste de diffusion',
    },
  ];

  const healthCards = [
    {
      label: 'Produits avec images',
      value: data.productsWithImages,
      total: data.totalProducts,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Produits sans prix',
      value: data.productsWithoutPrice,
      total: data.totalProducts,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Rupture de stock',
      value: data.productsOutOfStock,
      total: data.totalProducts,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'En promotion',
      value: data.productsOnPromotion,
      total: data.totalProducts,
      color: 'text-navy-600',
      bg: 'bg-navy-50',
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Analytics</h1>
          <p className="text-steel-dark mt-1">Vue d'ensemble de votre catalogue</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'week', 'month'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeframe === t
                  ? 'bg-navy-main text-white'
                  : 'bg-beige-warm text-charcoal hover:bg-steel'
              }`}
            >
              {t === 'all' ? 'Tout' : t === 'week' ? '7 jours' : '30 jours'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="card-dashboard p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-charcoal">{stat.value}</p>
            <p className="text-sm font-medium text-charcoal mt-1">{stat.label}</p>
            <p className="text-xs text-steel-dark mt-1">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Products by Category - Takes 2 columns */}
        <div className="lg:col-span-2 card-dashboard p-5">
          <h2 className="font-semibold text-charcoal mb-4">Produits par catégorie</h2>
          <div className="space-y-3">
            {data.productsByCategory.map(cat => {
              const percentage = Math.round((cat.count / data.totalProducts) * 100);
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-charcoal font-medium">{cat.name}</span>
                    <span className="text-steel-dark">{cat.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-beige-warm rounded-full h-2">
                    <div
                      className="bg-navy-main h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catalog Health */}
        <div className="card-dashboard p-5">
          <h2 className="font-semibold text-charcoal mb-4">Santé du catalogue</h2>
          <div className="space-y-3">
            {healthCards.map(card => {
              const percentage = Math.round((card.value / card.total) * 100);
              return (
                <div key={card.label} className={`${card.bg} rounded-xl p-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal">{card.label}</span>
                    <span className={`text-sm font-bold ${card.color}`}>
                      {card.value}/{card.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${card.color.replace('text', 'bg')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="card-dashboard p-5">
        <h2 className="font-semibold text-charcoal mb-4">Produits récents</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steel text-left">
                <th className="pb-3 text-steel-dark font-medium">Produit</th>
                <th className="pb-3 text-steel-dark font-medium">Catégorie</th>
                <th className="pb-3 text-steel-dark font-medium">Prix</th>
                <th className="pb-3 text-steel-dark font-medium">Images</th>
                <th className="pb-3 text-steel-dark font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProducts.map(product => (
                <tr key={product.id} className="border-b border-steel/50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-charcoal truncate max-w-[200px]">{product.name}</p>
                  </td>
                  <td className="py-3 px-2">
                    <span className="badge-steel text-xs">{product.category}</span>
                  </td>
                  <td className="py-3 px-2">
                    {product.price && product.price > 0
                      ? `${product.price.toLocaleString()} MAD`
                      : <span className="text-orange-500 text-xs">Sur devis</span>
                    }
                  </td>
                  <td className="py-3 px-2">
                    {product.images?.length || product.imageExternalLinks?.length || 0}
                  </td>
                  <td className="py-3 pl-2 text-steel-dark text-xs">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString('fr-FR')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-dashboard p-5">
        <h2 className="font-semibold text-charcoal mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="/europmat/admin/products/create" className="btn-primary text-center text-sm">
            + Ajouter un produit
          </a>
          <a href="/europmat/admin/products" className="btn-secondary text-center text-sm">
            Gérer les produits
          </a>
          <a href="/europmat/admin/pages" className="btn-secondary text-center text-sm">
            Organiser les pages
          </a>
        </div>
      </div>
    </div>
  );
}