import express, { Request, Router } from "express";

function getCronJobController(req: Request) {
  if (!req.context) {
    throw new Error("Request context not initialized");
  }
  return req.context.controllers.cronJobController;
}

const cronJobRoute: Router = express.Router();

cronJobRoute.get("/city-inizialize", (req, res) =>
  getCronJobController(req).inizializeCity(req, res)
);

cronJobRoute.get("/notification", (req, res) =>
  getCronJobController(req).notification(req, res)
);

cronJobRoute.get("/ping", (req, res) =>
  getCronJobController(req).ping(req, res)
);

export default cronJobRoute;
