import { Router } from "express";
import * as productController from "../controllers/products";
import { morganLoggerWithBody } from "../middleware/morgan";
import { schemaBodyValidator } from "../middleware/schemaBodyValidator";
import { createProductSchema } from "../schemas/products";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.post(
	"/",
	[morganLoggerWithBody, schemaBodyValidator(createProductSchema)],
	productController.create,
);
router.patch("/:id", productController.update);
router.delete("/:id", productController.remove);

export default router;
