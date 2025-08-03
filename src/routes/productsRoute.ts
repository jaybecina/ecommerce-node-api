import { Router } from "express";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";
import { validateData } from "../middlewares/validationMiddleware";

import { createProductSchema, updateProductSchema } from "../db/productsSchema";
import { verifySeller, verifyToken } from "../middlewares/authMiddleware";
import { apiLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.use(verifyToken);
router.use(apiLimiter);

router.get("/", listProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  verifySeller,
  validateData(createProductSchema),
  createProduct
);
router.put(
  "/:id",
  verifySeller,
  validateData(updateProductSchema),
  updateProduct
);
router.delete("/:id", verifySeller, deleteProduct);

export default router;
