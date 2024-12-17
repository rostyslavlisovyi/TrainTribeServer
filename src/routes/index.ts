import express from "express";
import sportsRoutes from "./sport.route.js";
import userRoutes from "./user.routes.js";
import uploadRoute from "./upload.route.js";
const router = express.Router({ mergeParams: true });

router.use("/sport", sportsRoutes);
router.use("/user", userRoutes);
router.use("/upload", uploadRoute);
// router.use("/training", trainingRoutes);

export default router;
