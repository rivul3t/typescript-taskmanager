import { NextFunction, Request, Response, Router } from "express";
import { createTask, finishTask, getTask, getTasks, startTask } from "../services/task.service";
import { ApiError } from "../utils/ApiError";

export const addTask =  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, due_date } = req.body;
    const projectId = parseInt(req.params.projectId);

    if (!name) {
        const error = new ApiError(400, 'Request must specify field name')
        next(error);
    }
    try {
        const task = await createTask(projectId, name, description, due_date);
        res.status(200).json({ result: 'Task succesfully created' })
    } catch (error) {
        next(error);
    }
};

export const assignTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = parseInt(req.params.id);

    try {
        const task = await startTask(taskId, req.user.id);
        res.status(200).json({ result: 'You successfully assign task' })
    } catch (error) {
        next(error);
    }
};

export const completeTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = parseInt(req.params.id);

    try {
        const task = finishTask(taskId, req.user.id);
        res.status(200).json({ result: 'You successfully finish task' })
    } catch (error) {
        next(error);
    }
};

export const getProjectTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = parseInt(req.params.taskId)
    try {
        const tasks = getTask(taskId);
        res.status(200).json({ tasks })
    } catch (error) {
        next(error);
    }
};

export const getProjectTasks = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = parseInt(req.params.projecId);
    try {
        const tasks = getTasks(projectId);
        res.status(200).json({ tasks })
    } catch (error) {
        next(error);
    }
};