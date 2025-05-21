import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
  }

  if (err instanceof JsonWebTokenError) {
    status = 401;
    message = err.message;
  }

  logger.error({
    message: err.message,
    status,
    method: req.method,
    path: req.originalUrl,
    user: req.user ? { id: req.user.id, email: req.user.email } : null,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack,
  });

  res.status(status).json({ error: message });
};
