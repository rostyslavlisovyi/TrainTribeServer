import express from "express";
import sportsRoutes from "./sport.route.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router({ mergeParams: true });

router.use("/auth", authRoutes);
router.use("/sport", sportsRoutes);
router.use("/user", userRoutes);
// router.use("/training", trainingRoutes);
export default router;
