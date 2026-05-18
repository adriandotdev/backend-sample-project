import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().min(1).max(255),
	price: z.number(),
	stock: z.number().int().min(0),
});

export const updateProductSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	price: z.number().optional(),
	stock: z.number().int().min(0).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
