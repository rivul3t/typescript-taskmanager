import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/users/register", register);

router.post("/users/login", login);

export default router;
