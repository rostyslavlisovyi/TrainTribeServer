import express, { Request, Router } from "express";

function getNotificationController(req: Request) {
  if (!req.context) {
    throw new Error("Request context not initialized");
  }
  return req.context.controllers.notificationController;
}

const notificationRoute: Router = express.Router();

notificationRoute.post("/list", (req, res) =>
  getNotificationController(req).list(req, res)
);

notificationRoute.get("/count-unread", (req, res) =>
  getNotificationController(req).countUnread(req, res)
);

notificationRoute.put("/mark-all-as-read", (req, res) =>
  getNotificationController(req).markAllAsRead(req, res)
);

notificationRoute.delete("/delete-all", (req, res) =>
  getNotificationController(req).deleteAll(req, res)
);

export default notificationRoute;
