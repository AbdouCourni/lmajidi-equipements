// src/app/europmat/admin/pages/page.tsx

'use client';

import PagesManager from '../../../../../components/dashboard/PagesManager';

export default function AdminPagesPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-charcoal mb-8">Gestion des Pages</h1>
      <PagesManager />
    </div>
  );
}