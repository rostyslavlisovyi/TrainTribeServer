import { Request, Response } from "express";
import { ICity } from "../interfaces/index.js";
import { CityService } from "../services/index.js";
import { handleError } from "../utils/handleError.ts";
import { BaseController } from "./base.controller.js";

export class CityController extends BaseController<ICity, CityService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(cityService: CityService) {
    super(cityService);
  }

  async inizialize(req: Request, res: Response): Promise<void> {
    try {
      const CRON_SECRET = process.env.CRON_SECRET;

      if (!req.query.token || req.query.token !== CRON_SECRET) {
        res.status(401).json({ error: "Accesso negato" });
      }

      await this.service.inizialize({ forceUpdateData: true });

      res.json({ message: "Inizialize completed" });
    } catch (error) {
      handleError(res, error);
    }
  }
}
