import { createServer } from "../src/lib/server";
import attendanceRoutes from "./routes/attendance.routes";
import { logger } from "../src/utils/logger";

const app = createServer();

// Routes
app.use("/attendance", attendanceRoutes);

const PORT = 4002;
app.listen(PORT, () => {
  logger.info({ port: PORT }, "Attendance service running");
});
