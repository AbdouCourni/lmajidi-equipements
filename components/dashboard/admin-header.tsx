// src/components/dashboard/admin-header.tsx
'use client';

import { useAuth } from '../../lib/auth-context';

export function AdminHeader() {
  const { adminData } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Welcome back</h2>
          <p className="text-sm text-gray-600">{adminData?.email}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-beige-100 text-navy-800 rounded-full text-sm font-medium">
            {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}