import { createServer } from "../src/lib/server";
import authRoutes from "./routes/auth.routes";
import { logger } from "../src/utils/logger";

const app = createServer();

// Register routes
app.use("/auth", authRoutes);

const PORT = 4001;
app.listen(PORT, () => {
  logger.info({ port: PORT }, "Auth service running");
});
