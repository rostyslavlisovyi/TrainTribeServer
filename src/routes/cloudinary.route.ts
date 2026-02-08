import express, { Request, Router } from "express";

function getCloudinaryController(req: Request) {
  if (!req.context) {
    throw new Error("Request context not initialized");
  }
  return req.context.controllers.cloudinaryController;
}

const cloudinaryRoute: Router = express.Router();

cloudinaryRoute.post("/signature-upload", (req, res) =>
  getCloudinaryController(req).getSignatureUpload(req, res)
);
cloudinaryRoute.post("/signature-delete", (req, res) =>
  getCloudinaryController(req).getSignatureDelete(req, res)
);

export default cloudinaryRoute;
