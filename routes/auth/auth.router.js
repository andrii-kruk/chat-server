import express from "express";
import { authController } from "../../controllers/index.js";
import { authenticate, validation } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/sign-up", validation.userSignUpValidate, authController.signUp);
authRouter.post("/sign-in", validation.userSignInValidate, authController.signIn);
// authRouter.post("/sign-out", authenticate, authController.signOut);

authRouter.get("/verify/:verificationCode", authController.verifyEmail);

export default authRouter;
