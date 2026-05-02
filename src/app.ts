import compression from "compression";
import cors from "cors";
import { eq } from "drizzle-orm";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { db } from "./db";
import { products } from "./db/schema";
import { morganLogger, morganLoggerWithBody } from "./middleware/morgan";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: "https://myappstore.com" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(morganLogger);

const APPNAME = process.env.APP_NAME;

// GET all products
app.get("/products", async (_req, res) => {
	const rows = await db.select().from(products);
	return res.json(rows);
});

// GET single product
app.get("/products/:id", async (req, res) => {
	const id = Number(req.params.id);
	const [product] = await db.select().from(products).where(eq(products.id, id));
	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}
	return res.json(product);
});

// POST create product
app.post("/products", morganLoggerWithBody, async (req, res) => {
	const { name, price, stock } = req.body;
	const [created] = await db
		.insert(products)
		.values({ name, price, stock })
		.returning();
	return res.status(201).json(created);
});

// PATCH update product
app.patch("/products/:id", async (req, res) => {
	const id = Number(req.params.id);
	const { name, price, stock } = req.body;
	const [updated] = await db
		.update(products)
		.set({ name, price, stock })
		.where(eq(products.id, id))
		.returning();
	if (!updated) {
		return res.status(404).json({ message: "Product not found" });
	}
	return res.json(updated);
});

// DELETE product
app.delete("/products/:id", async (req, res) => {
	const id = Number(req.params.id);
	const [deleted] = await db
		.delete(products)
		.where(eq(products.id, id))
		.returning();
	if (!deleted) {
		return res.status(404).json({ message: "Product not found" });
	}
	return res.json(deleted);
});

app.get("/", (_req, res) => {
	return res.json({
		appName: APPNAME,
		messsage: "Success",
	});
});

export default app;
