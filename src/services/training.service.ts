import { ITraining } from "../interfaces/index.js";
import TrainingModel from "../models/MongoDB/training.model.js";
import { BaseService } from "./base.service.js";

export class TrainingService extends BaseService<ITraining> {
  constructor() {
    super(TrainingModel);
  }

  async addLike(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async removeLike(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  async addParticipant(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { participants: userId } },
      { new: true }
    );
  }

  async removeParticipant(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { participants: userId } },
      { new: true }
    );
  }
}
