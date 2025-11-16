import { createServer } from "../src/lib/server";
import authRoutes from "./routes/auth.routes";

const app = createServer();

// Register routes
app.use("/auth", authRoutes);

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
