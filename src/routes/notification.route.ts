import express, { Request, Router } from "express";
import { NotificationController } from "../controllers/index.js";

const notificationRoute: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<NotificationController>("notificationController");

notificationRoute.post("/list", (req, res) => controller(req).list(req, res));

notificationRoute.get("/count-unread", (req, res) =>
  controller(req).countUnread(req, res)
);

notificationRoute.put("/mark-all-as-read", (req, res) =>
  controller(req).markAllAsRead(req, res)
);

notificationRoute.delete("/delete-all", (req, res) =>
  controller(req).deleteAll(req, res)
);

export default notificationRoute;
