'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { adminApi } from '@/services/adminApi';

const AuthContext = createContext({});
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Helper function to store auth data
const storeAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', user.id || user._id);
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userData', JSON.stringify(user));
};

// Helper function to clear auth data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userData');
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const authenticateWithBackend = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: idToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Authentication failed');
      }

      const data = await response.json();
      storeAuthData(data.access_token, data.user);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Backend authentication failed:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return await authenticateWithBackend(userCredential.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const data = await adminApi.login(email, password);
      storeAuthData(data.access_token, data.user);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await authenticateWithBackend(result.user);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Only sign out from Firebase if not an admin user
      if (!user?.is_admin) {
        await signOut(auth);
      }
      clearAuthData();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      // Skip token refresh for admin users
      if (user?.is_admin) {
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        storeAuthData(data.access_token, data.user);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    adminLogin,
    logout,
    signInWithGoogle,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
