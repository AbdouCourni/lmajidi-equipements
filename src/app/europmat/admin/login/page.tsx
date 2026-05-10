// src/app/europmat/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../lib/firebase/config';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Auth successful');
      
      // Step 2: Check if user is admin (with retry)
      const isUserAdmin = await checkAdminStatus(userCredential.user.uid);
      
      if (!isUserAdmin) {
        // Not an admin - sign out immediately
        await auth.signOut();
        throw new Error('This account does not have admin privileges');
      }
      
      console.log('✅ Admin verified, redirecting...');
      router.push('/europmat/admin/dashboard' as any);
      
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      
      // Clear any existing session
      if (auth.currentUser) {
        await auth.signOut();
      }
      
      // User-friendly error messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again in a few minutes');
      } else if (err.code === 'auth/network-request-failed' || err.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
        setError('Network blocked. Please disable ad blockers or try in incognito mode');
      } else if (err.message?.includes('admin privileges')) {
        setError('This account does not have admin privileges');
      } else {
        setError(err.message || 'Login failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check admin status with retry
  const checkAdminStatus = async (uid: string, retries = 2): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', uid));
        return adminDoc.exists();
      } catch (err) {
        console.log(`Retry ${i + 1}/${retries} checking admin status...`);
        if (i === retries - 1) throw err;
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 to-beige-100 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Europmat</h1>
            <p className="text-gray-600">Admin Dashboard</p>
            <div className="mt-2 inline-block px-3 py-1 bg-navy-100 text-navy-800 text-xs font-medium rounded-full">
              Restricted Access
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-800 text-sm">{error}</p>
                  {error.includes('ad blocker') && (
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 text-xs text-red-600 underline hover:no-underline"
                    >
                      Retry without ad blocker
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@europmat.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Europmat. All rights reserved.
        </p>
      </div>
    </div>
  );
}