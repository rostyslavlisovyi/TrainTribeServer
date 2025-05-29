import { ITraining } from "../interfaces/index.js";
import { BaseController } from "./base.controller.js";
import { TrainingService } from "../services/training.service.js";
import { Request, Response } from "express";

export class TrainingController extends BaseController<
  ITraining,
  TrainingService
> {
  constructor(trainingService: TrainingService) {
    super(trainingService);
    this.service = trainingService;
  }

  async addLike(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.body.userId;
    const data = await this.service.addLike(id, userId);
    res.status(200).json({ data });
  }

  async removeLike(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.body.userId;
    const data = await this.service.removeLike(id, userId);
    res.status(200).json({ data });
  }

  async addParticipant(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.body.userId;
    const data = await this.service.addParticipant(id, userId);
    res.status(200).json({ data });
  }

  async removeParticipant(req: Request, res: Response) {
    const { id, userId } = req.params;
    const data = await this.service.removeParticipant(id, userId);
    res.status(200).json({ data });
  }

  async addComment(req: Request, res: Response) {
    const { id } = req.params;
    const { userId, text } = req.body;
    const data = await this.service.addComment(id, userId, text);
    res.status(200).json({ data });
  }

  async updateComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const { text } = req.body;
    const data = await this.service.updateComment(commentId, text);
    res.status(200).json({ data });
  }

  async removeComment(req: Request, res: Response) {
    const { id, commentId } = req.params;
    const data = await this.service.removeComment(id, commentId);
    res.status(200).json({ data });
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.body.userId;

      const data = await this.service.changeStatus(id, userId, status);
      res.status(200).json({ data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
}
