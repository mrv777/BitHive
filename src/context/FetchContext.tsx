import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

interface FetchContextType {
  lastFetchTime: number;
  setLastFetchTime: (time: number) => void;
  currentlyFetching: React.MutableRefObject<boolean>;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

const FetchContext = createContext<FetchContextType | undefined>(undefined);

export const FetchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [refreshInterval, setRefreshInterval] = useState(6000); // 6 seconds default
  const currentlyFetching = useRef(false);

  useEffect(() => {
    const storedRefreshInterval = localStorage.getItem("refreshInterval");
    if (storedRefreshInterval) {
      const parsedInterval = parseInt(storedRefreshInterval, 10);
      if (!isNaN(parsedInterval) && parsedInterval >= 1000) { // Minimum 1 second
        setRefreshInterval(parsedInterval);
      }
    }
  }, []);

  return (
    <FetchContext.Provider value={{ lastFetchTime, setLastFetchTime, currentlyFetching, refreshInterval, setRefreshInterval }}>
      {children}
    </FetchContext.Provider>
  );
};

export const useFetchContext = () => {
  const context = useContext(FetchContext);
  if (context === undefined) {
    throw new Error('useFetchContext must be used within a FetchProvider');
  }
  return context;
};
