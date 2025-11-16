import { Router } from "express";
import {
  checkIn,
  checkOut,
  getReports,
} from "../controllers/attendance.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);
router.get("/reports", auth, getReports);

export default router;
