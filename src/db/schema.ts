import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	username: varchar("username", { length: 255 }).notNull().unique(),
	password: text("password").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	role: roleEnum("role").notNull().default("user"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	stock: integer("stock").notNull().default(0),
});
