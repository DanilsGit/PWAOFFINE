import { Router } from "express";
import {
  getProducts,
  createProduct,
  createBatchProducts,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.post("/batch", createBatchProducts);

export default router;
