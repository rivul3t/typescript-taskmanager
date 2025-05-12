import { Request, Response, Router } from "express";
import prismaClient from '../main';
import { Prisma } from "@prisma/client";

export const createProject =  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Request must specify field name' });
    }
    try {
        
        const project = await prismaClient.project.create({
            data: {
                name: name,
                description: description || "",
                creator: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });

        res.status(200).json({ result: 'Project succesfully created' })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && 
            error.code === 'P2002') {
            res.status(409).json({ error: 'Project already exists' });
        } else {
            throw error;
        }
    }
};