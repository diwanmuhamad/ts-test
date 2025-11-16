import dotenv from "dotenv";
dotenv.config();

export const config = {
  db: process.env.DATABASE_URL!,
  redis: process.env.REDIS_URL!,
  jwtSecret: process.env.JWT_SECRET!,
};
