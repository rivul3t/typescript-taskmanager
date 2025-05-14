import { Request, Response, Router } from "express";
import { createTask, finishTask, getTask, getTasks, startTask } from "../services/task.service";

export const addTask =  async (req: Request, res: Response) => {
    const { name, description, due_date } = req.body;
    const projectId = parseInt(req.params.projectId);

    if (!name) {
        res.status(400).json({ error: 'Request must specify fields name' });
    }

    try {
        const task = await createTask(projectId, name, description, due_date);
        res.status(200).json({ result: 'Task succesfully created' })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const assignTask = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);

    try {
        const task = await startTask(taskId, req.user.id);
        res.status(200).json({ result: 'You successfully assign task' })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const completeTask = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);

    try {
        const task = finishTask(taskId, req.user.id);
        res.status(200).json({ result: 'You successfully finish task' })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getProjectTask = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId)
    try {
        const tasks = getTask(taskId);
        res.status(200).json({ tasks })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getProjectTasks = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projecId);
    try {
        const tasks = getTasks(projectId);
        res.status(200).json({ tasks })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};