import { Router, Request, Response } from "express";
import { register, login } from "../register";

const router: Router = Router();

router.post('/register', register);

router.post('/login', login);

export default router;