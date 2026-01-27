import express, { Request, Router } from "express";
import { FeedbackController } from "../controllers/index.js";

const feedbackRoute: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<FeedbackController>("feedbackController");

feedbackRoute.post("/", (req, res) => controller(req).sendFeedback(req, res));

export default feedbackRoute;
