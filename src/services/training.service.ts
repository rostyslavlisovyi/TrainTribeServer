import { ITraining } from "../interfaces/index.js";
import TrainingModel from "../models/MongoDB/training.model.js";
import { BaseService } from "./base.service.js";

export class TrainingService extends BaseService<ITraining> {
  constructor() {
    super(TrainingModel);
  }
}
