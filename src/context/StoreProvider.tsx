'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makeStore, makePersistor } from '@/store/store';

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const [store, setStore] = useState<any>(null);
  const [persistor, setPersistor] = useState<any>(null);

  useEffect(() => {
    const setup = async () => {
      const _store = await makeStore();
      const _persistor = await makePersistor(_store);
      setStore(_store);
      setPersistor(_persistor);
    };
    setup();
  }, []);

  if (!store || !persistor) return null; 

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
