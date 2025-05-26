import { Router } from "express";
import productRoutes from "./product.router.js";

const router = Router();

router.use("/products", productRoutes);

export { router };
