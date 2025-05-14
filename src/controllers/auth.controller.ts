import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { createUser, findUser } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ error: 'Request must specify fields username, password and email' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS as string));
        const user = await createUser(username, hashedPassword, email);
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'});
        res.status(200).json({ id: user.id, token: token });

    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: 'Request must specify fields username, password and email' });
    }

    try {
        const user = await findUser(username);
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).json({ error: 'Wrong password' })
        }

        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'});
        res.status(200).json({ id: user.id, token: token });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    };
}