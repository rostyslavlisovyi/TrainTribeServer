import { Request, Response } from "express";
import { BaseResponse } from "../models/index.js";
import { GeocodeService } from "../services/index.js";
import { handleError } from "../utils/handleError.js";

export class GeocodeController {
  private readonly service: GeocodeService;

  constructor(geocodeService: GeocodeService) {
    this.service = geocodeService;
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const language = req.headers["accept-language"]?.split(",")[0] || "it";

      if (!search || typeof search !== "string") {
        res.status(400).json({ message: "search parameter is required" });
        return;
      }

      const data = await this.service.geocode(search, language);
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async reverse(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon } = req.query;
      const language = req.headers["accept-language"]?.split(",")[0] || "it";

      if (!lat || !lon || typeof lat !== "string" || typeof lon !== "string") {
        res.status(400).json({
          message: "Latitude and longitude parameters are required"
        });
        return;
      }

      const data = await this.service.reverse(lat, lon, language);
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }
}
