import { Router } from "express";

import AuthController from "../controller/auth.controller";

const authRouter = Router();
const authController = new AuthController();


authRouter.post("/", authController.auth);


export default authRouter;
