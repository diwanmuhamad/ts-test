import pino from "pino";
import pinoHttp from "pino-http";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: { service: process.env.SERVICE_NAME || "mini-attendance-backend" },
  },
  isDev
    ? pino.transport({
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      })
    : undefined
);

// pino-http types can be strict; cast to `any` to avoid overload incompatibilities
export const httpLogger = (pinoHttp as any)({ logger });
