import { Router } from "express";
import { createProject } from "../controllers/project.controller";

const router: Router = Router();

router.post('/projects', createProject);

export default router;