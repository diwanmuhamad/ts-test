import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL!,
});

export async function initRedis() {
  redis.on("error", (err) => console.error("Redis error:", err));
  await redis.connect();
  console.log("Report Worker connected to Redis");
}
