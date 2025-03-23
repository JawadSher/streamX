import { createClient, RedisClientType } from 'redis';

const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';

if (!REDIS_URI) {
  throw new Error('REDIS_URI is not defined');
}

interface RedisCache {
  client: RedisClientType | null;
  promise: Promise<RedisClientType> | null;
}

let cached: RedisCache = global.redis;
if (!cached) {
  cached = global.redis = {
    client: null,
    promise: null,
  };
}

export async function connectRedis(): Promise<RedisClientType> {
  if (cached.client) return cached.client;

  if (!cached.promise) {
    const client: RedisClientType = createClient({
      url: REDIS_URI,
    });

    client.on('error', (error) => {
      console.error('Redis Client Error: ', error);
    });

    cached.promise = client.connect().then(() => {
      console.log('Redis Connected');
      return client;
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
}
