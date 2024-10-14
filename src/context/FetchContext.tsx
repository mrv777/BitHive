import React, { createContext, useState, useContext, useRef } from 'react';

interface FetchContextType {
  lastFetchTime: number;
  setLastFetchTime: (time: number) => void;
  currentlyFetching: React.MutableRefObject<boolean>;
}

const FetchContext = createContext<FetchContextType | undefined>(undefined);

export const FetchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const currentlyFetching = useRef(false);

  return (
    <FetchContext.Provider value={{ lastFetchTime, setLastFetchTime, currentlyFetching }}>
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
