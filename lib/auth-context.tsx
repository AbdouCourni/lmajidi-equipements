import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  adminData?: any;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);

useEffect(() => {
  let isMounted = true;

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      if (!isMounted) return;

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));

      setIsAdmin(adminDoc.exists());

    } catch (error) {
      console.error(error);
      setIsAdmin(false);
    } finally {
      setLoading(false); // 🔥 MUST ALWAYS RUN
    }
  });

  // 🔥 FAILSAFE (prevents infinite loading)
  const timeout = setTimeout(() => {
    if (isMounted) {
      console.warn('Auth timeout fallback');
      setLoading(false);
    }
  }, 4000);

  return () => {
    isMounted = false;
    clearTimeout(timeout);
    unsubscribe();
  };
}, []);
const signOut = async () => {
  try {
    await auth.signOut();
    setIsAdmin(false);
    setAdminData(null);
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, adminData, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);