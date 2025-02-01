'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CreditsContext = createContext();

export function CreditsProvider({ children }) {
  const [credits, setCredits] = useState(0);
  const [isLowCredits, setIsLowCredits] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const LOW_CREDITS_THRESHOLD = 5;
  const MAX_CREDITS = 20;

  useEffect(() => {
    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  useEffect(() => {
    setIsLowCredits(credits < LOW_CREDITS_THRESHOLD);
  }, [credits]);

  const fetchUserCredits = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/v1/user/credits');
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCredits = async (newCredits) => {
    try {
      // TODO: Replace with actual API call
      await fetch('/api/v1/user/credits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits: newCredits }),
      });
      setCredits(newCredits);
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const deductCredits = async (amount = 1) => {
    const newCredits = Math.max(0, credits - amount);
    await updateCredits(newCredits);
    return newCredits;
  };

  const addCredits = async (amount) => {
    const newCredits = Math.min(MAX_CREDITS, credits + amount);
    await updateCredits(newCredits);
    return newCredits;
  };

  const value = {
    credits,
    isLowCredits,
    loading,
    deductCredits,
    addCredits,
    updateCredits,
    maxCredits: MAX_CREDITS,
    lowCreditsThreshold: LOW_CREDITS_THRESHOLD,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};
