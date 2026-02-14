import { Request, Response } from "express";
import { BaseResponse } from "../models/index.js";
import { CityService, CronJobService } from "../services/index.js";
import { handleError } from "../utils/index.js";

export class CronJobController {
  private readonly cityService: CityService;
  private readonly cronJobService: CronJobService;

  constructor(cityService: CityService, cronJobService: CronJobService) {
    this.cityService = cityService;
    this.cronJobService = cronJobService;
  }

  inizializeCity = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.cityService.inizialize();
      res.status(200).json(new BaseResponse(true));
    } catch (error) {
      handleError(res, req, error);
    }
  };

  notification = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.cronJobService.createNotificationTrainingCompletionReminder();
      await this.cronJobService.createNotificationTodayTrainingsReminder();
      await this.cronJobService.createNotificationRememberToCreateTraining();
      res.status(200).json(new BaseResponse(true));
    } catch (error) {
      handleError(res, req, error);
    }
  };

  ping = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(new BaseResponse(true));
  };
}
