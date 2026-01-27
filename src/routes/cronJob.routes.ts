import { CronJobController } from "controllers/cronJob.controller.js";
import express, { Request, Router } from "express";

const cronJobRoute: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<CronJobController>("cronJobController");

cronJobRoute.get("/city-inizialize", (req, res) =>
  controller(req).inizializeCity(req, res)
);

cronJobRoute.get("/notification", (req, res) =>
  controller(req).notification(req, res)
);

cronJobRoute.get("/ping", (req, res) => controller(req).ping(req, res));

export default cronJobRoute;
