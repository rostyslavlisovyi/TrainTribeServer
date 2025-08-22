import { Request, Response } from "express";
import { GeocodeService } from "../services/geocode.service.js";
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

      const results = await this.service.geocode(search, language);
      res.json({ data: results });
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

      const result = await this.service.reverse(lat, lon, language);
      res.json({ data: result });
    } catch (error) {
      handleError(res, error);
    }
  }
}
