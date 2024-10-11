import { useState, useEffect } from 'react';

export function useHiveData() {
  const [hiveData, setHiveData] = useState<string[]>([]);

  useEffect(() => {
    const storedHive = localStorage.getItem('hiveData');
    if (storedHive) {
      setHiveData(JSON.parse(storedHive));
    }
  }, []);

  const updateHiveData = (newHiveData: string[]) => {
    setHiveData(newHiveData);
    localStorage.setItem('hiveData', JSON.stringify(newHiveData));
  };

  return { hiveData, updateHiveData };
}