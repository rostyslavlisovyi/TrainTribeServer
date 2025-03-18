import express from "express";
import userRoutes from "./user.routes.ts";
import uploadRoute from "./upload.route.ts";
import cityRoutes from "./city.routes.ts";
import trainingRoutes from "./training.routes.ts";
const router = express.Router({ mergeParams: true });

router.use("/user", userRoutes);
router.use("/upload", uploadRoute);
router.use("/city", cityRoutes);
router.use("/training", trainingRoutes);

export default router;
