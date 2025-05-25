import { configureStore } from '@reduxjs/toolkit';
import { createPersistedReducer, setupPersist } from '@/store/reduxPersistor';
import { rootReducers } from '@/store/reducers';
import type { combineReducers, Store } from '@reduxjs/toolkit';
import { PersistPartial } from 'redux-persist/es/persistReducer';

export type RootState = ReturnType<ReturnType<typeof combineReducers<typeof rootReducers>>> & PersistPartial;

let storeInstance: Awaited<ReturnType<typeof makeStore>>;
let persistorInstance: Awaited<ReturnType<typeof makePersistor>>;

export async function makeStore() {
  const persistedReducers = await createPersistedReducer(rootReducers);

  return configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
        },
      }),
  });
}

export async function makePersistor(store: Store) {
  await setupPersist();
  const { persistStore } = await import('redux-persist');
  return persistStore(store);
}

export const setupStore = async () => {
  if (!storeInstance) {
    storeInstance = await makeStore();
    persistorInstance = await makePersistor(storeInstance);
  }
  return { store: storeInstance, persistor: persistorInstance };
};

export type AppStore = Awaited<ReturnType<typeof makeStore>>;
export type AppDispatch = AppStore['dispatch'];