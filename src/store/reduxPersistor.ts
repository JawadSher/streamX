import type { ReducersMapObject } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import type { Storage } from 'redux-persist';

let persistReducerFn: typeof import('redux-persist').persistReducer;
let storage: Storage;

export async function setupPersist() {
  const persist = await import('redux-persist');
  persistReducerFn = persist.persistReducer;

  storage = {
    getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
  };
}

export async function createPersistedReducer(
  reducers: ReducersMapObject
): Promise<ReturnType<typeof persistReducerFn>> {
  await setupPersist();

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
  };

  const combinedReducer = combineReducers(reducers);
  return persistReducerFn(persistConfig, combinedReducer);
}