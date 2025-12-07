import { Request, Response } from "express";
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
      res.status(500).json({
        message: "UPLOAD FAILED",
        error: error instanceof Error ? error.message : "Unknown error"
      });
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
      res.status(500).json({
        message: "DELETE FAILED",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
}
