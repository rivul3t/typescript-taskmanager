import { Router, Request, Response } from "express";
import { register, login } from "../controllers/user.controller";

const router: Router = Router();

router.post('/register', register);

router.post('/login', login);

export default router;