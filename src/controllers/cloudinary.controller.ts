import { Request, Response } from "express";
import { BaseResponse } from "../models/index.js";
import { CloudinaryService } from "../services/index.js";
import { handleError } from "../utils/index.js";
export class CloudinaryController {
  private readonly service: CloudinaryService;

  constructor(cloudinaryService: CloudinaryService) {
    this.service = cloudinaryService;
  }

  getSignatureUpload = async (req: Request, res: Response): Promise<void> => {
    try {
      const folder = req.body.folder;
      const result = await this.service.getSignatureUpload(folder);

      res.status(200).json(new BaseResponse(result));
    } catch (error: unknown) {
      handleError(res, req, error);
    }
  };

  getSignatureDelete = async (req: Request, res: Response): Promise<void> => {
    try {
      const publicId = req.body.publicId;
      const result = await this.service.getSignatureDelete(publicId);

      res.status(200).json(new BaseResponse(result));
    } catch (error: unknown) {
      handleError(res, req, error);
    }
  };
}
