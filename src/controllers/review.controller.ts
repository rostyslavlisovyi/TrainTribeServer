import { Request, Response } from "express";
import { IReview } from "../interfaces/index.js";
import { ReviewService } from "../services/review.service.js";
import { handleError } from "../utils/handleError.js";
import { BaseController } from "./base.controller.js";

export class ReviewController extends BaseController<IReview, ReviewService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(reviewService: ReviewService) {
    super(reviewService);
  }

  // Create review
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getUserFromToken(req);
      const reviewData = {
        ...req.body,
        reviewer: user._id
      };

      const result = await this.service.create(reviewData);
      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  // Update review with authorization
  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const updatedReview = await this.service.updateReview(
        id,
        req.body,
        user._id.toString()
      );
      res.status(200).json({ data: updatedReview });
    } catch (error) {
      handleError(res, error);
    }
  }

  // Delete review with authorization
  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      await this.service.deleteReview(id, user._id.toString());
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  }
}
