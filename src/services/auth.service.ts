import prismaClient from '../main';
import { Prisma } from '@prisma/client';

export const createUser = async (name: string, password: string, email: string) => {
    try {
        return await prismaClient.user.create({
                data: {
                    name: name,
                    email: email,
                    password: password,
                },
            });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new Error('User already exists');
          }
        };
        throw error;
    };
};

export const findUser = async (name: string) => {
    try {
        return await prismaClient.user.findFirstOrThrow({
            where: {
                name: name,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new Error('No such user');
          }
        };
        throw error;
    };
}