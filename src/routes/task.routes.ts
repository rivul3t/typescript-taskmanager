import { Router } from "express";
import {
  assignTask,
  completeTask,
  getProjectTask,
  getProjectTasks,
  addTask,
} from "../controllers/task.controller";

const router: Router = Router();

router.get("/projects/:projectId/tasks/:taskId", getProjectTask);
router.get("/projects/:projectId/tasks", getProjectTasks);
router.post("/projects/:projectId/tasks", addTask);
router.patch("/projects/:projectId/tasks/:taskId/assign", assignTask);
router.patch("/projects/:projectId/tasks/:taskId/complete", completeTask);

export default router;
