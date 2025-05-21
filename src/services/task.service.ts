import prismaClient from "../lib/prisma";
import { Prisma, TaskStatus } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

const checkUserInTheProject = async (projectId: number, userId: number) => {
  const project = await prismaClient.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId: userId,
        },
      },
    },
  });

  if (!project) {
    throw new ApiError(404, "Not found");
  }

  return project;
};

export const createTask = async (
  projectId: number,
  userId: number,
  name: string,
  description: string,
  dueDate: Date,
) => {
  try {
    await checkUserInTheProject(projectId, userId);

    const task = await prismaClient.task.create({
      data: {
        projectId: projectId,
        name: name,
        description: description || "",
        dueDate: dueDate,
        status: TaskStatus.CREATED,
      },
    });
    return task;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ApiError(409, "Task already exists");
      } else if (error.code === "P2003") {
        throw new ApiError(404, "No such project");
      }
    }
    throw error;
  }
};

export const getTasks = async (projecId: number, userId: number) => {
  await checkUserInTheProject(projecId, userId);

  const tasks = await prismaClient.task.findMany({
    where: {
      projectId: projecId,
    },
  });

  return tasks;
};

export const getTask = async (
  taskId: number,
  projectId: number,
  userId: number,
) => {
  await checkUserInTheProject(projectId, userId);

  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
      projectId: projectId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return task;
};

export const startTask = async (
  taskId: number,
  userId: number,
  projectId: number,
) => {
  try {
    await checkUserInTheProject(projectId, userId);
    const updatedTask = await prismaClient.task.update({
      where: {
        id: taskId,
        status: TaskStatus.CREATED,
      },
      data: {
        status: TaskStatus.PROGRESS,
        performerId: userId,
        startDate: new Date(),
      },
    });

    return updatedTask;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new ApiError(404, "No such task");
    }
    throw error;
  }
};

export const finishTask = async (taskId: number, userId: number) => {
  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
    },
  });

  if (!task?.performerId || task.performerId !== userId || !task.startDate) {
    throw new ApiError(
      400,
      "This task not started yet or you are not performer",
    );
  }

  const currentDate = new Date();
  const diff = currentDate.getTime() - task.startDate.getTime();
  try {
    const updatedTask = await prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        completionDate: currentDate,
        costedTime: diff,
      },
    });
    return updatedTask;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new ApiError(404, "No such task");
    }
    throw error;
  }
};
