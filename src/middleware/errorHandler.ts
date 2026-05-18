import type { Request, Response } from "express";

export function errorHandler(err: Error, _req: Request, res: Response) {
	console.error(err);
	if (err) console.error("Caused by:", err);
	res.status(500).json({ message: "Internal server error" });
}
