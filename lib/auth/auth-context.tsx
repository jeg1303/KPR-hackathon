'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, name?: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string; user?: User }>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('rg_user');
    const sessionToken = localStorage.getItem('rg_token');
    
    if (storedUser && sessionToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('rg_user');
        localStorage.removeItem('rg_token');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'OTP sent to your email' };
      } else {
        return { success: false, message: data.error || 'Failed to send OTP' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (email: string, name?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'Registration successful! Check your email for OTP.' };
      } else {
        return { success: false, message: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // Store user and token
        const userData: User = data.user;
        setUser(userData);
        localStorage.setItem('rg_user', JSON.stringify(userData));
        localStorage.setItem('rg_token', data.token || 'demo-token');

        return { success: true, message: 'Login successful!', user: userData };
      } else {
        return { success: false, message: data.error || 'Invalid OTP' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('rg_user');
    localStorage.removeItem('rg_token');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        register,
        verifyOTP,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
