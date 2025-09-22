import { CronJobController } from "controllers/cronJob.controller.js";
import express, { Request, Router } from "express";

const cronJobRouter: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<CronJobController>("cronJobConroller");

cronJobRouter.get("/city-inizialize", (req, res) =>
  controller(req).inizializeCity(req, res)
);

cronJobRouter.get("/notification", (req, res) =>
  controller(req).notification(req, res)
);
export default cronJobRouter;
