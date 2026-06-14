import { redisClient } from "../config/redis.js";

export const tokenBucket = async (userId, settings) => {
  const key = `token:${userId}`;
  const now = Date.now();
  const bucket = await redisClient.hgetall(key);
  const capacity = settings.maxRequests;
  const refillRate = capacity / settings.windowSize;

  let tokens = Number(bucket.tokens ?? capacity);
  let lastUpdated = Number(bucket.timestamp ?? now);

  const elapsedSeconds = Math.max(0, (now - lastUpdated) / 1000);
  tokens = Math.min(capacity, tokens + elapsedSeconds * refillRate);

  if (tokens < 1) {
    await redisClient.hmset(key, { tokens: tokens.toString(), timestamp: now.toString() });
    await redisClient.expire(key, settings.windowSize);
    return { allowed: false, remaining: 0 };
  }

  tokens -= 1;
  await redisClient.hmset(key, { tokens: tokens.toString(), timestamp: now.toString() });
  await redisClient.expire(key, settings.windowSize);

  return {
    allowed: true,
    remaining: Math.floor(tokens),
  };
};
