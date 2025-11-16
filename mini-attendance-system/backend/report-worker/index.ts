import express from "express";
import { initRedis } from "./redis";
import { startWorker } from "./worker";

const app = express();

app.get("/health", (_, res) =>
  res.json({ status: "ok", service: "report-worker" })
);

async function bootstrap() {
  await initRedis();
  await startWorker();

  app.listen(4003, () => {
    console.log("Report Worker running on port 4003");
  });
}

bootstrap();
