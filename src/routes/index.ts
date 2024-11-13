import express from "express";
import usersRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import trainingRoutes from "./training.routes.js";

const router = express.Router({mergeParams: true});

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/training", trainingRoutes);
export default router;
