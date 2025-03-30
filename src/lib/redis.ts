import { Redis } from "@upstash/redis"

const REDIS_URI = process.env.UPSTASH_REDIS_URI!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

if (!REDIS_URI || !REDIS_TOKEN) {
  throw new Error("UPSTASH_REDIS_URI and UPSTASH_REDIS_TOKEN must be defined");
}

interface RedisCache {
  client: Redis | null;
  promise: Promise<Redis> | null;
}

let cached: RedisCache = (global as any).redis || { client: null, promise: null };
if (!(global as any).redis) {
  (global as any).redis = cached;
}

export async function connectRedis(): Promise<Redis> {
  if (cached.client) {
    console.log('Using cached Redis client');
    return cached.client;
  }

  if (!cached.promise) {
    console.log('Initiating Redis connection');

    cached.promise = (async () => {
      const client = new Redis({
        url: REDIS_URI,
        token: REDIS_TOKEN
      });

      try {
        await client.ping();
        console.log("Redis connection successful");
        return client;
      } catch (error) {
        console.error("Failed to connect to Redis: ", error);
        throw error;
      }
    })();
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
