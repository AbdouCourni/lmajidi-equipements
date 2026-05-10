// src/lib/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';

interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin';
}

interface AuthContextType {
  user: User | null;
  adminData: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AdminUser>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminData: null,
  loading: true,
  signIn: async () => { throw new Error('Auth not initialized'); },
  signOut: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            const adminData = {
              uid: user.uid,
              email: user.email || '',
              role: adminDoc.data().role,
            };
          
            setAdminData(adminData);
          } else {
            console.log('User is not an admin');
            setAdminData(null);
            // Auto sign out if not an admin
            await firebaseSignOut(auth);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          setAdminData(null);
        }
      } else {
        setAdminData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AdminUser> => {
    if (!auth) {
      throw new Error('Firebase authentication is not initialized');
    }

    console.log('Attempting sign in with email:', email);
    
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful, checking admin status...');
      
      // Check if user is an admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      
      if (!adminDoc.exists()) {
        // Not an admin, sign out and throw error
        await firebaseSignOut(auth);
        throw new Error('Unauthorized access. Admin account required.');
      }
      
      const adminData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        role: adminDoc.data().role,
      };
      
      console.log('Admin verified:', adminData);
      return adminData;
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and disable any ad blockers for this site.');
      }
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Firebase configuration error. Please check your environment variables.');
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
        console.log('Sign out successful');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };

  const isAdmin = !!adminData;

  return (
    <AuthContext.Provider
      value={{
        user,
        adminData,
        loading,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};