import express from "express";
import sportsRoutes from "./sports.route.js";
import authRoutes from "./auth.routes.js";

const router = express.Router({ mergeParams: true });

router.use("/auth", authRoutes);
router.use("/sports", sportsRoutes);
// router.use("/users", usersRoutes);
// router.use("/training", trainingRoutes);
export default router;
