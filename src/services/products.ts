import * as productRepo from "../db/repositories/products";

export async function listProducts() {
	return productRepo.getAllProducts();
}

export async function getProduct(id: number) {
	return productRepo.getProductById(id);
}

export async function createProduct(data: {
	name: string;
	price: number;
	stock: number;
}) {
	return productRepo.createProduct(data);
}

export async function updateProduct(
	id: number,
	data: { name?: string; price?: number; stock?: number },
) {
	return productRepo.updateProduct(id, data);
}

export async function deleteProduct(id: number) {
	return productRepo.deleteProduct(id);
}
