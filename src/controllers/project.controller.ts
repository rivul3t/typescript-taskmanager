import { Request, Response, Router } from "express";
import { addMember, createProject, findProjects } from "../services/project.service";

export const addProject = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Request must specify field name' });
    }
    
    try {
        const project = await createProject(name, description, req.user.id);
        res.status(200).json({ result: 'Project succesfully created' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    const userId = parseInt(req.user.id);

    try {
        const projects = await findProjects(userId);
        res.status(200).json({ projects })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

export const getProject = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    try {
        const project = await findProjects(projectId);
        res.status(200).json({ project })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

export const createMember = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    const { user_id } = req.body;

    if (!user_id) {
        res.status(400).json({ error: 'Request must specify user id' })
    }

    try {
        const member = await addMember(projectId, req.user.id, user_id);
        res.status(200).json({ result: 'Member succesfully added' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}