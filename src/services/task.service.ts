import prismaClient from '../main';
import { Prisma, TaskStatus } from '@prisma/client';

export const createTask = async (projectId: number, name: string, description: string, dueDate: Date,) => {
    try {
        return await prismaClient.task.create({
            data: {
                projectId: projectId,
                name: name,
                description: description || "",
                dueDate: dueDate,
                status: TaskStatus.CREATED,
            },
        });
    } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Task already exists');
      } else if (error.code === 'P2003') {
        throw new Error('No such project');
      }
    }
    throw error;
    }
};

export const getTasks = async (projecId: number) => {
  return await prismaClient.task.findMany({
    where: {
      projectId: projecId,
    },
  });
};

export const getTask = async (taskId: number) => {
  return await prismaClient.task.findFirst({
    where: {
      id: taskId,
    },
  });
}

export const startTask = async (taskId: number, userId: number) => {
  return await prismaClient.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: TaskStatus.PROGRESS,
      performerId: userId,
      startDate: new Date(),
    },
  });
};

export const finishTask = async (taskId: number, userId: number) => {
  const task = await prismaClient.task.findUnique({
    where: {
      id: taskId,
    }
  })

  if (!task?.performerId || task.performerId !== userId || !task.startDate) {
    throw new Error('This task not started yet or you are not performer');
  }

  const currentDate = new Date();
  const diff = currentDate.getTime() - task.startDate.getTime();

  return await prismaClient.task.update({
    where: {
      id: taskId,
    },
    data: {
      completionDate: currentDate,
      costedTime: diff,
    },
  })
};