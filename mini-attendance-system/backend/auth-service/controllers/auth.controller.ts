import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { success, failure } from "../../src/utils/response";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    return res.json(success(user));
  } catch (err: any) {
    return res.status(400).json(failure(err.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await authService.login(req.body);
    return res.json(success({ token }));
  } catch (err: any) {
    return res.status(400).json(failure(err.message));
  }
};
