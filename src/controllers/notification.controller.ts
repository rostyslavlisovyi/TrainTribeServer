import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { INotification } from "../interfaces/index.js";
import { BaseResponse } from "../models/index.js";
import { NotificationService } from "../services/index.js";
import { handleError } from "../utils/handleError.js";
import { BaseController } from "./base.controller.js";

export class NotificationController extends BaseController<
  INotification,
  NotificationService
> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(notificationService: NotificationService, auth?: AuthResult) {
    super(notificationService, auth);
  }

  async countUnread(req: Request, res: Response) {
    try {
      const result = await this.service.countUnread();
      res.status(200).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const result = await this.service.markAllAsRead();
      res.status(200).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }
}
