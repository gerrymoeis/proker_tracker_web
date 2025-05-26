'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define user type to match the database schema
export type User = {
  id: number;
  name: string;
  email: string;
  organization_name: string;
  role: 'admin' | 'ketua' | 'wakil_ketua' | 'sekretaris' | 'bendahara' | 'kepala_departemen' | 'anggota';
  profile_image?: string | null;
};

// Define auth context type
export type AuthContextType = {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, organization_name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  error: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Update isAuthenticated whenever user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user from session/local storage first for quick UI update
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Then verify with the server
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // If server says not authenticated, clear local data
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Login gagal');
        setIsLoading(false);
        return;
      }

      // Update user state and localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // No need to verify again immediately, the useEffect will handle verification
      // This was causing a race condition where the state wasn't properly updated
      
      setIsLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login');
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, organization_name: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          organization_name,
          role: 'anggota' // Default role for new registrations
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Registrasi gagal');
        return;
      }

      // Automatically log in after successful registration
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error('Register error:', err);
      setError('Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  // Update profile function
  const updateProfile = async (name: string, email: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Gagal memperbarui profil');
        return;
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Terjadi kesalahan saat memperbarui profil');
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Gagal mengubah password');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError('Terjadi kesalahan saat mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
