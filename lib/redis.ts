import { Redis } from "@upstash/redis";

// Validate that Redis environment variables are set
if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error(
    "UPSTASH_REDIS_URL environment variable is required but not set."
  );
}

if (!process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error(
    "UPSTASH_REDIS_TOKEN environment variable is required but not set."
  );
}

if (!process.env.REDIS_MASTER_LIST) {
  throw new Error(
    "REDIS_MASTER_LIST environment variable is required but not set."
  );
}

// Create Redis client (mandatory)
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});
