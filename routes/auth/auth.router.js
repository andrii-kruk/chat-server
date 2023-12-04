import express from "express";
import { authController } from "../../controllers/index.js";
import { validation } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/sign-up", validation.userSignUpValidate, authController.signUp);
authRouter.get("/verify/:verificationCode", authController.verifyEmail);

export default authRouter;
