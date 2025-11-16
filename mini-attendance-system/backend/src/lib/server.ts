import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("dev"));

  return app;
};
