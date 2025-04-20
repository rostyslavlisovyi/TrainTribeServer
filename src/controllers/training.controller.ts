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
}
