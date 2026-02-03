import { Redis } from "@upstash/redis";

// Lazy initialization - only create client when first accessed (not at build time)
let redisClient: Redis | null = null;

export function getRedis(): Redis {
  if (!redisClient) {
    if (!process.env.UPSTASH_REDIS_URL) {
      throw new Error("UPSTASH_REDIS_URL environment variable is required.");
    }
    if (!process.env.UPSTASH_REDIS_TOKEN) {
      throw new Error("UPSTASH_REDIS_TOKEN environment variable is required.");
    }

    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }

  return redisClient;
}
