import { createClient } from "redis";
import { logger } from "../src/utils/logger";

export const redis = createClient({
  url: process.env.REDIS_URL || "",
});

export async function initRedis() {
  redis.on("error", (err) => logger.error({ err }, "Redis error"));
  await redis.connect();
  logger.info("Report Worker connected to Redis");
}
