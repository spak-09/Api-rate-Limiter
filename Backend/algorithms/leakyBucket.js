import { redisClient } from "../config/redis.js";

export const leakyBucket = async (userId, settings) => {
  const key = `bucket:${userId}`;
  const now = Date.now();
  const bucket = await redisClient.hgetall(key);
  const capacity = settings.maxRequests;
  const leakRate = capacity / settings.windowSize;

  let water = Number(bucket.water ?? 0);
  let lastUpdated = Number(bucket.timestamp ?? now);

  const elapsedSeconds = Math.max(0, (now - lastUpdated) / 1000);
  const leaked = elapsedSeconds * leakRate;
  water = Math.max(0, water - leaked);

  if (water + 1 > capacity) {
    await redisClient.hmset(key, { water: water.toString(), timestamp: now.toString() });
    await redisClient.expire(key, settings.windowSize);
    return { allowed: false, remaining: 0 };
  }

  water += 1;
  await redisClient.hmset(key, { water: water.toString(), timestamp: now.toString() });
  await redisClient.expire(key, settings.windowSize);

  return {
    allowed: true,
    remaining: Math.max(0, Math.floor(capacity - water)),
  };
};
