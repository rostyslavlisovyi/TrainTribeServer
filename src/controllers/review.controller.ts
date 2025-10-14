import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { IReview } from "../interfaces/index.js";
import { BaseResponse } from "../models/index.js";
import {
  NotificationService,
  ReviewService,
  TrainingService
} from "../services/index.js";
import { NotificationEnum } from "../types/enums.js";
import { handleError } from "../utils/handleError.js";
import { completeName } from "../utils/user.js";
import { BaseController } from "./base.controller.js";

export class ReviewController extends BaseController<IReview, ReviewService> {
  private readonly notificationService: NotificationService;
  private readonly trainingService: TrainingService;

  constructor(
    reviewService: ReviewService,
    notificationService: NotificationService,
    trainingService: TrainingService,
    auth?: AuthResult
  ) {
    super(reviewService, auth);
    this.notificationService = notificationService;
    this.trainingService = trainingService;
  }

  // Create review
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getAuthUser();
      const reviewData = {
        ...req.body,
        reviewer: user._id
      };

      const result = await this.service.create(reviewData);

      const training = await this.trainingService.get({
        id: result.training.toString()
      });

      await this.notificationService.create({
        user: result.reviewedUser,
        triggeredBy: result.reviewer,
        type: NotificationEnum.NEW_REVIEW_ON_TRAINING,
        data: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          trainingId: training!._id.toString(),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          trainingTitle: training!.title,
          user: completeName(user)
        },
        read: false
      });

      res.status(200).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  // Update review with authorization
  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getAuthUser();
      const result = await this.service.updateReview(
        id,
        req.body,
        user._id.toString()
      );
      res.status(200).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  // Delete review with authorization
  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getAuthUser();
      await this.service.deleteReview(id, user._id.toString());
      res.status(200).json(new BaseResponse(true));
    } catch (error) {
      handleError(res, error);
    }
  }
}
