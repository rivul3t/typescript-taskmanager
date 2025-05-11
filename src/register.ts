import prismaClient from './main';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwt_token = 'abcde';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ error: 'Request must specify fields username, password and email' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS as string));
        const user = await prismaClient.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'});
        res.status(200).json({ id: user.id, token: token });

    } catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'User already exists' });
        } else {
            throw error;
        }
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: 'Request must specify fields username, password and email' });
    }

    const user = await prismaClient.user.findFirst({
        where: {
            name: username,
        }
    });

    if (!user) {
        res.status(400).json({ error: 'User doesnt exists' });
        return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        res.status(400).json({ error: 'Wrong password' })
    }

    const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'});
    res.status(200).json({ id: user.id, token: token });
}