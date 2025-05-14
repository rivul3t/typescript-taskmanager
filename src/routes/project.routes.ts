import { Router } from "express";
import { addProject, createMember, getProject, getProjects } from "../controllers/project.controller";

const router: Router = Router();

router.post('/projects', addProject);

router.get('/projects', getProjects);

router.get('/projects/:projectId', getProject);

router.post('/projects/:projectId/members', createMember);

export default router;