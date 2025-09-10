import { Request, Response } from "express";
import { ITraining } from "../interfaces/index.js";
import { TrainingService } from "../services/training.service.js";
import { TrainingStatusEnum } from "../types/index.js";
import { handleError } from "../utils/handleError.js";
import { BaseController } from "./base.controller.js";

export class TrainingController extends BaseController<
  ITraining,
  TrainingService
> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(trainingService: TrainingService) {
    super(trainingService);
  }

  async getRecommendedTrainings(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getUserFromToken(req, ["city"]);
      const populateFields = req.query.populate as string | string[];
      const result = await this.service.getRecommendedTrainings(
        user,
        populateFields
      );
      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  async addLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addLike(id, user._id.toString());
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.removeLike(id, user._id.toString());
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async addParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addParticipant(id, user._id.toString());
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.removeParticipant(
        id,
        user._id.toString()
      );
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addComment(id, user._id.toString(), text);
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const data = await this.service.updateComment(commentId, text);
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeComment(req: Request, res: Response) {
    try {
      const { id, commentId } = req.params;
      const data = await this.service.removeComment(id, commentId);
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await this.getUserFromToken(req);

      const data = await this.service.changeStatus(
        id,
        user._id.toString(),
        status as TrainingStatusEnum
      );

      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
}
