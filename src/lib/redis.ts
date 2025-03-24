import { createClient, RedisClientType } from 'redis';
import { URL } from 'url'; 

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
  if (cached.client) {
    console.log('Using cached Redis client');
    return cached.client;
  }

  if (!cached.promise) {
    const client: RedisClientType = createClient({
      url: new URL(REDIS_URI).toString(),
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
    console.log('Redis client connected successfully');
  } catch (error) {
    cached.promise = null;
    console.error('Failed to connect to Redis:', error);
    throw error;
  }

  return cached.client;
}
