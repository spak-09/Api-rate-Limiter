import { redisClient } from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";

export const slidingWindow = async (userId, settings) => {
  const key = `sliding:${userId}`;
  const now = Date.now();
  const windowStart = now - settings.windowSize * 1000;

  await redisClient.zremrangebyscore(key, 0, windowStart);
  const currentCount = await redisClient.zcard(key);

  if (currentCount < settings.maxRequests) {
    await redisClient.zadd(key, now, `${now}-${uuidv4()}`);
    await redisClient.expire(key, settings.windowSize);
    return {
      allowed: true,
      remaining: Math.max(0, settings.maxRequests - currentCount - 1),
    };
  }

  return {
    allowed: false,
    remaining: 0,
  };
};
