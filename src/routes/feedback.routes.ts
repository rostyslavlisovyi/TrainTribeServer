import express, { Request, Router } from "express";

function getFeedbackController(req: Request) {
  if (!req.context) {
    throw new Error("Request context not initialized");
  }
  return req.context.controllers.feedbackController();
}

const feedbackRoute: Router = express.Router();

feedbackRoute.post("/", (req, res) =>
  getFeedbackController(req).sendFeedback(req, res)
);

export default feedbackRoute;
