import express, { Router } from "express";
import cityRoute from "./city.routes.js";
import cloudinaryRoute from "./cloudinary.route.js";
import geocodeRoutes from "./geocode.routes.js";
import leaderboardRoutes from "./leaderboard.routes.js";
import notificationRoute from "./notification.route.js";
import reviewRoutes from "./review.routes.js";
import trainingRoutes from "./training.routes.js";
import userRoute from "./user.routes.js";

const apiRouter: Router = express.Router();

apiRouter.use("/city", cityRoute);
apiRouter.use("/cloudinary", cloudinaryRoute);
apiRouter.use("/geocode", geocodeRoutes);
apiRouter.use("/training", trainingRoutes);
apiRouter.use("/user", userRoute);
apiRouter.use("/review", reviewRoutes);
apiRouter.use("/leaderboard", leaderboardRoutes);
apiRouter.use("/notification", notificationRoute);

const cronJobRouter = express.Router();
cronJobRouter.use("/", cronJobRouter);

export { apiRouter, cronJobRouter };
