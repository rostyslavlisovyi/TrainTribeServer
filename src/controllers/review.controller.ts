import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { IReview } from "../interfaces/index.js";
import { BaseResponse } from "../models/index.js";
import { ReviewService } from "../services/index.js";
import { handleError } from "../utils/handleError.js";
import { BaseController } from "./base.controller.js";

export class ReviewController extends BaseController<IReview, ReviewService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(reviewService: ReviewService, auth?: AuthResult) {
    super(reviewService, auth);
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
