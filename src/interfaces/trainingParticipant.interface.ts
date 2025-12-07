import mongoose, { Document } from "mongoose";
export interface ITrainingParticipant extends Document<mongoose.Types.ObjectId> {
  participant: mongoose.Types.ObjectId;
  attended: boolean;
  hasLeftReview: boolean;
}
