import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedTokenType extends jwt.JwtPayload {
	userId: number;
	role: string;
}

export function authorize(roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.headers["authorization"]?.split(" ")[1];

		if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

		try {
			const decoded = jwt.verify(
				accessToken,
				process.env.JWT_SECRET!,
			) as DecodedTokenType;

			if (!roles.includes(decoded.role))
				return res.status(403).json({ message: "Forbidden" });
			next();
		} catch {
			return res.status(401).json({ message: "Unauthorized" });
		}
	};
}
