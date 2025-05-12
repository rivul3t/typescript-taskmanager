import { Request, Response, Router } from "express";
import prismaClient from '../main';
import { Prisma } from "@prisma/client";

export const createTask =  async (req: Request, res: Response) => {
    const { name, description, project_name } = req.body;

    if (!name || !project_name) {
        res.status(400).json({ error: 'Request must specify fields name and project_name' });
    }

    try {
        const task = await prismaClient.task.create({
            data: {
                name: name,
                description: description || "",
                creationDate: new Date(),
                project: {
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
}

export const pickTask =  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Request must specify field name' });
    }

    try {
        const task = await prismaClient.task.create({
            data: {
                name: name,
                description: description || "",
                project: {
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
}