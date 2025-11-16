import { createClient } from "redis";
import { config } from "../../src/lib/config";
import { logger } from "../../src/utils/logger";

const redis = createClient({ url: config.redis });
redis.connect();

export const publishEvent = async (event: string, data: any) => {
  // Use PUBLISH instead of xAdd
  await redis.publish(event, JSON.stringify(data));
  logger.info({ event, data }, "Published event to Redis Pub/Sub");
};
