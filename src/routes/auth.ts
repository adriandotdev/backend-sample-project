import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth";
import { schemaBodyValidator } from "../middleware/schemaBodyValidator";
import { loginSchema, signUpSchema } from "../schemas/users";

const router = Router();

const authController = new AuthController();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });

router.post(
	"/login",
	authLimiter,
	schemaBodyValidator(loginSchema),
	authController.login.bind(authController),
);

router.post(
	"/signup",
	authLimiter,
	schemaBodyValidator(signUpSchema),
	authController.signup.bind(authController),
);

export default router;
