import express from "express";
import cityRoutes from "./city.routes.ts";
import cloudinaryRoute from "./cloudinary.route.ts";
import trainingRoutes from "./training.routes.ts";
import userRoutes from "./user.routes.ts";
const router = express.Router({ mergeParams: true });

router.use("/user", userRoutes);
router.use("/city", cityRoutes);
router.use("/training", trainingRoutes);
router.use("/cloudinary", cloudinaryRoute);

export default router;
