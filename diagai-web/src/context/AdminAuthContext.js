'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/services/adminApi';

const AdminAuthContext = createContext({});

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        
        if (token && adminData) {
          const parsedData = JSON.parse(adminData);
          if (parsedData?.is_admin) {
            setAdmin(parsedData);
          } else {
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  const login = async (email, password) => {
    try {
      const { access_token, user } = await adminApi.login(email, password);
      
      if (!user?.is_admin) {
        throw new Error('Not an admin user');
      }

      localStorage.setItem('adminToken', access_token);
      localStorage.setItem('adminData', JSON.stringify(user));
      setAdmin(user);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
