import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { schemaBodyValidator } from "../middleware/schemaBodyValidator";
import { loginSchema, SignUpInput, signUpSchema } from "../schemas/users";

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });

router.post(
	"/login",
	authLimiter,
	schemaBodyValidator(loginSchema),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { username, password } = req.body;

			const userFromDb = await db
				.select({
					id: users.id,
					username: users.username,
					password: users.password,
				})
				.from(users)
				.where(eq(users.username, username));

			if (!userFromDb.length)
				return res.status(401).json({ message: "Invalid credentials" });

			const isMatch = await bcrypt.compare(password, userFromDb[0].password);

			if (!isMatch)
				return res.status(401).json({ message: "Invalid credentials" });

			const accessToken = jwt.sign(
				{ userId: userFromDb[0].id },
				process.env.JWT_SECRET!,
				{
					expiresIn: "15m",
					issuer: "mybackend-api",
					audience: "mybackend-client",
					algorithm: "HS256",
				},
			);

			const refreshToken = jwt.sign(
				{ userId: userFromDb[0].id },
				process.env.JWT_REFRESH_SECRET!,
				{
					expiresIn: "30d",
					issuer: "mybackend-api",
					audience: "mybackend-client",
					algorithm: "HS256",
				},
			);
			return res.status(200).json({
				accessToken,
				refreshToken,
			});
		} catch (err) {
			next(err);
		}
	},
);

router.post(
	"/signup",
	authLimiter,
	schemaBodyValidator(signUpSchema),
	async (req: Request, res: Response, next: NextFunction) => {
		const { name, username, password } = req.body as SignUpInput;
		try {
			const userFromDb = await db
				.select({ username: users.username })
				.from(users)
				.where(eq(users.username, username));

			if (userFromDb.length)
				return res.status(400).json({ message: "Username exists" });

			const hashedPassword = await bcrypt.hash(password, 10);

			const createdUser = await db
				.insert(users)
				.values({ name, username, password: hashedPassword })
				.returning({
					id: users.id,
				});

			const accessToken = jwt.sign(
				{ userId: createdUser[0].id },
				process.env.JWT_SECRET!,
				{
					expiresIn: "15m",
					issuer: "mybackend-api",
					audience: "mybackend-client",
					algorithm: "HS256",
				},
			);

			const refreshToken = jwt.sign(
				{ userId: createdUser[0].id },
				process.env.JWT_REFRESH_SECRET!,
				{
					expiresIn: "30d",
					issuer: "mybackend-api",
					audience: "mybackend-client",
					algorithm: "HS256",
				},
			);

			return res.status(201).json({
				accessToken,
				refreshToken,
				message: "Signed up successfully",
			});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
