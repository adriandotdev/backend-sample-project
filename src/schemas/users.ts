import z from "zod";

export const signUpSchema = z.object({
	username: z
		.string({ error: "Username is required" })
		.min(8, { error: "Username must at least 8 characters long" }),
	name: z.string({ error: "Name is required" }),
	password: z
		.string({ error: "Password is required" })
		.min(8, { error: "Password must be at least 8 characters long" }),
});

export const loginSchema = z.object({
	username: z.string({ error: "Username is required" }),
	password: z.string({ error: "Password is required" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
