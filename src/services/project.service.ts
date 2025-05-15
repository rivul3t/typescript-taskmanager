import prismaClient from '../main';
import { Prisma, Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

export const createProject = async (name: string, description: string | undefined, userId: number) => {
    try {
    return await prismaClient.project.create({
            data: {
                name: name,
                description: description || "",
                members: {
                    create: {
                        userId: userId,
                        role: Role.OWNER,
                    },
                },
            },
        });
    } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(409, 'Project already exists');
      };
    };
    throw error;
    };
}

export const findProjects = async (userId: number) => {
    const projects = await prismaClient.project.findMany({
        where: {
            members: {
                some: {
                    userId: userId,
                },
            },
        },
    });

    return projects;
}

export const findProject = async (projectId: number) => {
    const project = await prismaClient.project.findUnique({
        where: {
            id: projectId,
        }
    });

    if (!project) {
        throw new ApiError(404, 'Project not found');
    };
}

export const addMember = async (projectId: number, userId: number, requestedUserId: number) => {
    const member = await prismaClient.projectMember.findUnique({
        where: {
            userId_projectId: {
                projectId: projectId,
                userId: userId,
            }
        },
    });

    if (!member || (member.role !== Role.OWNER)) {
        throw new ApiError(403, 'No such project, or you are not owner')
    }

    try {
        const newMember = await prismaClient.projectMember.create({
            data: {
                userId: userId,
                projectId: projectId,
            }
        });
    } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(409, 'User already member of project');
      }
    }

    throw error;
    }
}