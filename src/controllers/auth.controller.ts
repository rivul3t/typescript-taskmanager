import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUser } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        const error = new ApiError(400, 'Request must specify fields name, password and email')
        next(error);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS as string));
        const user = await createUser(name, hashedPassword, email);
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'});
        res.status(200).json({ id: user.id, token: token });
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    if (!name || !password) {
        const error = new ApiError(400, 'Request must specify fields name and password')
        next(error);
    }

    try {
        const user = await findUser(name);
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new ApiError(401, 'Wrong password')
            next(error);
        }

        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'});
        res.status(200).json({ id: user.id, token: token });
    } catch (error) {
        next(error);
    };
}