import { Request, Response } from "express";
import * as attendanceService from "../services/attendance.service";

export const checkIn = async (req: Request & { user?: any }, res: Response) => {
  try {
    const result = await attendanceService.checkIn(req.user.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const checkOut = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const result = await attendanceService.checkOut(req.user.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getReports = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { status } = req.query as any;
    const reports = await attendanceService.fetchReports({ status });
    res.json({ success: true, data: reports });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
