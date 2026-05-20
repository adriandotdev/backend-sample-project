import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import type { LoginInput, SignUpInput } from "../schemas/users";

export class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body as LoginInput;

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

			const tokens = this.signTokens(userFromDb[0].id);
			return res.status(200).json(tokens);
		} catch (err) {
			next(err);
		}
	}

	async signup(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, username, password } = req.body as SignUpInput;

			const existing = await db
				.select({ username: users.username })
				.from(users)
				.where(eq(users.username, username));

			if (existing.length)
				return res.status(400).json({ message: "Username exists" });

			const hashedPassword = await bcrypt.hash(password, 10);
			const [created] = await db
				.insert(users)
				.values({ name, username, password: hashedPassword })
				.returning({ id: users.id });

			const tokens = this.signTokens(created.id);
			return res
				.status(201)
				.json({ ...tokens, message: "Signed up successfully" });
		} catch (err) {
			next(err);
		}
	}

	private signTokens(userId: number) {
		const payload = { userId };
		const opts = {
			issuer: "mybackend-api",
			audience: "mybackend-client",
			algorithm: "HS256" as const,
		};

		const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
			...opts,
			expiresIn: "15m",
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
			...opts,
			expiresIn: "30d",
		});

		return { accessToken, refreshToken };
	}
}
