'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type AuthUser = {
  email: string;
  username?: string;
  name?: string;
  avatarUrl?: string;
  token: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Nilai awal SELALU null, baik di server maupun client
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load dari localStorage setelah komponen ter‑mount di client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem('auth');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as AuthUser;

      // Jadikan update state async supaya tidak melanggar aturan React 19
      setTimeout(() => {
        setUser(parsed);
      }, 0);
    } catch {
      window.localStorage.removeItem('auth');
    }
  }, []);

  // Simpan ke localStorage tiap kali user berubah
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (user) {
      window.localStorage.setItem('auth', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('auth');
    }
  }, [user]);

  const login = (data: AuthUser) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
