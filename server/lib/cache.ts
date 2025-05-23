import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN, // Optional, for Upstash
});

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || "604800", 10); // 7 days

export function hashImage(image: string, ocrType: string): string {
  const hash = createHash("sha256").update(image).digest("hex");
  return `${ocrType}:${hash}`;
}

export async function getCache<T>(key: string): Promise<T | null> {
  return (await redis.get<T>(key)) ?? null;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  await redis.set(key, value, { ex: ttl });
}
