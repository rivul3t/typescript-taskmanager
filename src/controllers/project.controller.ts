import { NextFunction, Request, Response, Router } from "express";
import { createMember, createProject, findProjects, findProject } from "../services/project.service";
import { ApiError } from "../utils/ApiError";

export const addProject = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
        const error = new ApiError(400, 'Request must specify field name')
        next(error);
    }
    
    try {
        const project = await createProject(name, description, req.user.id);
        res.status(200).json({ result: 'Project succesfully created', id: project.id });
    } catch (error) {
        next(error);
    }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.user.id);

    try {
        const projects = await findProjects(userId);
        res.status(200).json({ projects })
    } catch (error) {
        next(error);
    }
}

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = parseInt(req.params.projectId);
    const userId = parseInt(req.user.id);
    console.log(projectId);
    try {
        const project = await findProject(projectId, userId);
        res.status(200).json({ project })
    } catch (error) {
        next(error);
    }
}

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = parseInt(req.params.projectId);
    const { user_id } = req.body;

    if (!user_id) {
        const error = new ApiError(400, 'Request must specify user id');
        next(error);
    }

    try {
        const member = await createMember(projectId, req.user.id, user_id);
        res.status(200).json({ result: 'Member succesfully added', member: member });
    } catch (error) {
        next(error)
    }
}