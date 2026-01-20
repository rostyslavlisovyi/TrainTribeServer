import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { BaseResponse } from "../models/index.js";
import { FeedbackService } from "../services/feedback.service.js";
import { handleError } from "../utils/index.js";

export class FeedbackController {
  private readonly feedbackService: FeedbackService;
  private readonly auth?: AuthResult;

  constructor(feedbackService: FeedbackService, auth?: AuthResult) {
    this.feedbackService = feedbackService;
    this.auth = auth;
  }

  async sendFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      // Validazione parametri
      if (!message) {
        res.status(400).json({
          message: "Missing required field: message"
        });
        return;
      }

      const user = await this.feedbackService.getAuthUser();
      await this.feedbackService.sendFeedback({
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || "User",
        email: user.email,
        message
      });

      res.status(200).json(
        new BaseResponse({
          message: "Feedback sent successfully"
        })
      );
    } catch (error) {
      handleError(res, req, error);
    }
  }
}
