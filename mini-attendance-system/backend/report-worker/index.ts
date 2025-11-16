import express from "express";
import { initRedis } from "./redis";
import { startWorker } from "./worker";
import { logger } from "../src/utils/logger";

const app = express();

app.get("/health", (_, res) =>
  res.json({ status: "ok", service: "report-worker" })
);

async function bootstrap() {
  await initRedis();
  await startWorker();

  app.listen(4003, () => {
    logger.info({ port: 4003 }, "Report Worker running");
  });
}

bootstrap();
