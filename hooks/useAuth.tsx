'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '@/lib/api-client';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, code: string) => Promise<void>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await apiClient.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phone: string) => {
    await apiClient.sendOTP(phone);
  };

  const login = async (phone: string, code: string) => {
    const result = await apiClient.verifyOTP(phone, code);
    setUser(result.user);
  };

  const logout = () => {
    setUser(null);
    apiClient.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a safe default during SSR/build
    if (typeof window === 'undefined') {
      return {
        user: null,
        loading: true,
        login: async () => {},
        logout: () => {},
        sendOTP: async () => {},
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

