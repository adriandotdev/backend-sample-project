import { Router } from "express";
import * as productController from "../controllers/products";
import { morganLogger, morganLoggerWithBody } from "../middleware/morgan";
import { authorize } from "../middleware/rbacMiddleware";
import { schemaBodyValidator } from "../middleware/schemaBodyValidator";
import { createProductSchema } from "../schemas/products";

const router = Router();

router.get(
	"/",
	[morganLogger, authorize(["admin", "user"])],
	productController.getAll,
);
router.get(
	"/:id",
	[morganLogger, authorize(["admin", "user"])],
	productController.getOne,
);
router.post(
	"/",
	[
		morganLoggerWithBody,
		authorize(["admin"]),
		schemaBodyValidator(createProductSchema),
	],
	productController.create,
);
router.patch(
	"/:id",
	[morganLoggerWithBody, authorize(["admin"])],
	productController.update,
);
router.delete(
	"/:id",
	[morganLoggerWithBody, authorize(["admin"])],
	productController.remove,
);

export default router;
