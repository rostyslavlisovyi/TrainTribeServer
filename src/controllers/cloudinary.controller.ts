import { Request, Response } from "express";
import { handleError } from "utils/index.js";
import { BaseResponse } from "../models/index.js";
import { CloudinaryService } from "../services/index.js";
export class CloudinaryController {
  private readonly service: CloudinaryService;

  constructor(cloudinaryService: CloudinaryService) {
    this.service = cloudinaryService;
  }

  upload = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "NO FILE UPLOADED" });
        return;
      }

      const folder = req.body.folder;
      const result = await this.service.upload(req.file, folder);

      res.status(200).json(new BaseResponse(result));
    } catch (error: unknown) {
      handleError(res, req, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { public_id } = req.params;

      if (!public_id) {
        res.status(400).json({ message: "PUBLIC_ID IS REQUIRED" });
        return;
      }

      const result = await this.service.delete(public_id);

      res.status(200).json(new BaseResponse(result));
    } catch (error: unknown) {
      handleError(res, req, error);
    }
  };
}
