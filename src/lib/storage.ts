import { WebStorage } from 'redux-persist';

const isClient = typeof window !== 'undefined';

const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },

    setItem(_key, value) {
      return Promise.resolve(value);
    },
    
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = isClient ? sessionStorage : createNoopStorage();

export default storage;
