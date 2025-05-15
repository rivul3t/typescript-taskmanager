import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';
import logger from './logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let status = 500;
    let message = 'Internal server error';

    logger.error(err);

    if (err instanceof ApiError) {
        status = err.statusCode;
        message = err.message;
    };

    res.status(status).json({ error: message });
}