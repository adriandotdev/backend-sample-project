import type { NextFunction, Request, Response } from "express";
import * as productService from "../services/products";

export async function getAll(_req: Request, res: Response, next: NextFunction) {
	try {
		const rows = await productService.listProducts();
		res.json(rows);
	} catch (err) {
		next(err);
	}
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const product = await productService.getProduct(id);
		if (!product) return res.status(404).json({ message: "Product not found" });
		res.json(product);
	} catch (err) {
		next(err);
	}
}

export async function create(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, price, stock } = req.body;
		const created = await productService.createProduct({ name, price, stock });
		res.status(201).json(created);
	} catch (err) {
		console.log(err);
		next(err);
	}
}

export async function update(req: Request, res: Response, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const { name, price, stock } = req.body;
		const updated = await productService.updateProduct(id, {
			name,
			price,
			stock,
		});
		if (!updated) return res.status(404).json({ message: "Product not found" });
		res.json(updated);
	} catch (err) {
		next(err);
	}
}

export async function remove(req: Request, res: Response, next: NextFunction) {
	try {
		const id = Number(req.params.id);
		const deleted = await productService.deleteProduct(id);
		if (!deleted) return res.status(404).json({ message: "Product not found" });
		res.json(deleted);
	} catch (err) {
		next(err);
	}
}
