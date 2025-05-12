import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'

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

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Token must be specified' });
        return;
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch(error) {
        res.status(401).json({ error: 'Invalid token' });
    }    
}
