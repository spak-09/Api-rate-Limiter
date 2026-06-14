import { redisClient } from "../config/redis.js";

export const fixedWindow = async (userId, settings) => {
  const key = `rate:${userId}`;
  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, settings.windowSize);
  }

  return {
    allowed: count <= settings.maxRequests,
    remaining: Math.max(0, settings.maxRequests - count),
  };
};
