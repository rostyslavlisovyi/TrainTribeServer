import { ITraining } from "../interfaces/index.js";
import { BaseController } from "./base.controller.js";
import { TrainingService } from "../services/training.service.js";

export class TrainingController extends BaseController<ITraining> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(trainingService: TrainingService) {
    super(trainingService);
  }
}
