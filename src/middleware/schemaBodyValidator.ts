import { NextFunction, Request, Response } from "express";
import z, { type ZodObject } from "zod";

export function schemaBodyValidator(schema: ZodObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({ errors: z.treeifyError(result.error) });
		}

		next();
	};
}
