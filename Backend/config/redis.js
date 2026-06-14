import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is required");
}

export const redisClient = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});