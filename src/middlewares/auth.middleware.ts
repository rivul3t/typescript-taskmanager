import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
    export interface Response {
      user: any;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const error = new ApiError(403, "Token must be specified");
    return next(error);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error) {
    next(error);
  }
};
