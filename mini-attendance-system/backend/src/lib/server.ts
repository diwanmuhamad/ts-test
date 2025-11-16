import express from "express";
import cors from "cors";
import helmet from "helmet";
import { httpLogger, logger } from "../utils/logger";
import swaggerUi from "swagger-ui-express";

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(httpLogger);

  // Swagger UI
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Mini Attendance System API",
      version: "1.0.0",
      description: "Auth, Attendance and Report APIs",
    },
    paths: {
      "/auth/register": {
        post: {
          summary: "Register user",
          requestBody: {
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: { "200": { description: "OK" } },
        },
      },
      "/auth/login": {
        post: { summary: "Login", responses: { "200": { description: "OK" } } },
      },
      "/attendance/checkin": {
        post: {
          summary: "Check-in (auth required)",
          responses: { "200": { description: "OK" } },
        },
      },
      "/attendance/checkout": {
        post: {
          summary: "Check-out (auth required)",
          responses: { "200": { description: "OK" } },
        },
      },
    },
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
};
