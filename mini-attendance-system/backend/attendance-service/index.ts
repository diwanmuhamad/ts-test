import { createServer } from "../src/lib/server";
import attendanceRoutes from "./routes/attendance.routes";

const app = createServer();

// Routes
app.use("/attendance", attendanceRoutes);

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Attendance service running on port ${PORT}`);
});
