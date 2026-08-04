// src/app/europmat/admin/layout.tsx

'use client';

import { AuthProvider } from '../../../../lib/auth-context';
import { AdminSidebar } from '../../../../components/dashboard/admin-sidebar';
import { AdminHeader } from '../../../../components/dashboard/admin-header';
import { useAuth } from '../../../../lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  const isLoginPage = pathname === '/europmat/admin/login';

  useEffect(() => {
    if (!loading && !isAdmin && !isLoginPage && !redirected.current) {
      redirected.current = true;
      router.replace('/europmat/admin/login');
    }
  }, [loading, isAdmin, isLoginPage, router]);

  // Reset redirect flag when on login page
  useEffect(() => {
    if (isLoginPage) {
      redirected.current = false;
    }
  }, [isLoginPage]);

if (loading && !isLoginPage) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
  </AuthProvider>
  );
}