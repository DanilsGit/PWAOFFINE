import { Router } from "express";

const router = Router();

router.use("/users", userRoutes);

export { router };
