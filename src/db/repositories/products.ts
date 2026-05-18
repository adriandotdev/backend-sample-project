import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export async function getAllProducts() {
	return db.select().from(products);
}

export async function getProductById(id: number) {
	const [product] = await db.select().from(products).where(eq(products.id, id));
	return product ?? null;
}

export async function createProduct(data: {
	name: string;
	price: number;
	stock: number;
}) {
	const [created] = await db
		.insert(products)
		.values({ ...data, price: String(data.price) })
		.returning();
	return created;
}

export async function updateProduct(
	id: number,
	data: { name?: string; price?: number; stock?: number },
) {
	const { price, ...rest } = data;
	const [updated] = await db
		.update(products)
		.set({ ...rest, ...(price !== undefined && { price: String(price) }) })
		.where(eq(products.id, id))
		.returning();
	return updated ?? null;
}

export async function deleteProduct(id: number) {
	const [deleted] = await db
		.delete(products)
		.where(eq(products.id, id))
		.returning();
	return deleted ?? null;
}
