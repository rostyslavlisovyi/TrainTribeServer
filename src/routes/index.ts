import express from "express";
import userRoutes from "./user.routes.js";
import uploadRoute from "./upload.route.js";
import cityRoutes from "./city.routes.js";
const router = express.Router({ mergeParams: true });

router.use("/user", userRoutes);
router.use("/upload", uploadRoute);
router.use("/city", cityRoutes);
// router.use("/training", trainingRoutes);

export default router;
