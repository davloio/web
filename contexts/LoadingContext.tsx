'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  assetsLoaded: boolean;
  setAssetsLoaded: (loaded: boolean) => void;
  interactionsEnabled: boolean;
  setInteractionsEnabled: (enabled: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [interactionsEnabled, setInteractionsEnabled] = useState(false);

  return (
    <LoadingContext.Provider value={{
      assetsLoaded,
      setAssetsLoaded,
      interactionsEnabled,
      setInteractionsEnabled
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
