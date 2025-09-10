import { ObjectId } from "mongoose";
export interface ITrainingParticipant {
  participant: ObjectId;
  attended: boolean;
  hasLeftReview: boolean;
}
