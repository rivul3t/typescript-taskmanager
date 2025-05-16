import { Router } from "express";
import { assignTask, completeTask, getProjectTask, getProjectTasks } from "../controllers/task.controller";

const router: Router = Router();

router.get('/tasks/:taskId', getProjectTask)
router.patch('/tasks/assign', assignTask);
router.patch('/tasks/complete', completeTask);

router.post('/projects/:projectId/tasks', getProjectTasks);

export default router;