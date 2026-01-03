import express, { Request, Router } from "express";
import { CloudinaryController } from "../controllers/index.js";

const cloudinaryRoute: Router = express.Router();

const controller = (req: Request) =>
  req.container.resolve<CloudinaryController>("cloudinaryController");

cloudinaryRoute.post("/signature-upload", (req, res) =>
  controller(req).getSignatureUpload(req, res)
);
cloudinaryRoute.post("/signature-delete", (req, res) =>
  controller(req).getSignatureDelete(req, res)
);

export default cloudinaryRoute;
