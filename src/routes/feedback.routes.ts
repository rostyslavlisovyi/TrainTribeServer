import express, { Request, Router } from "express";
import { FeedbackController } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";

const feedbackRoute: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<FeedbackController>("feedbackController");

feedbackRoute.post("/", authenticate, (req, res) =>
  controller(req).sendFeedback(req, res)
);

export default feedbackRoute;
