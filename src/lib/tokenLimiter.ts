import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connectRedis } from '../data-access/redisDB/redis';

const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local max_tokens = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local data = redis.call("HMGET", key, "tokens", "last_refill_ts")
local tokens = tonumber(data[1]) or max_tokens
local last_refill = tonumber(data[2]) or now

local elapsed = now - last_refill
local refill = math.floor(elapsed * refill_rate)
tokens = math.min(tokens + refill, max_tokens)

if tokens < requested then
  redis.call("HMSET", key, "tokens", tokens, "last_refill_ts", now)
  redis.call("EXPIRE", key, 600)
  return 0
end

tokens = tokens - requested
redis.call("HMSET", key, "tokens", tokens, "last_refill_ts", now)
redis.call("EXPIRE", key, 600)
return 1
`;

interface RateLimitConfig {
  maxTokens?: number;
  refillRate?: number;
  identifier?: string;
}

export async function tokenLimiter(
  request: NextRequest,
  config: RateLimitConfig = {}
): Promise<NextResponse | null> {
  const {
    maxTokens = 100,
    refillRate = 10,
    identifier = (request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous').replace(/[^a-zA-Z0-9._-]/g, '_'),
  } = config;

  const key = `app:rate_limit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    const redis = await connectRedis();
    const allowed = await redis.eval(TOKEN_BUCKET_SCRIPT, [key], [
      maxTokens.toString(),
      refillRate.toString(),
      now.toString(),
      '1',
    ]);

    if (Number(allowed) !== 1) {
      return NextResponse.json(
        { error: 'To many request - try later' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': maxTokens.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    return null;
  } catch (error: any) {
    console.error('Rate limiting error:', error);
    return null;
  }
}