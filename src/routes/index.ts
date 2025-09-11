import express, { Router } from "express";
import cityRoute from "./city.routes.js";
import cloudinaryRoute from "./cloudinary.route.js";
import geocodeRoutes from "./geocode.routes.js";
import reviewRoutes from "./review.routes.js";
import trainingRoutes from "./training.routes.js";
import userRoute from "./user.routes.js";

const router: Router = express.Router();

router.use("/city", cityRoute);
router.use("/cloudinary", cloudinaryRoute);
router.use("/geocode", geocodeRoutes);
router.use("/training", trainingRoutes);
router.use("/user", userRoute);
router.use("/review", reviewRoutes);

export default router;
