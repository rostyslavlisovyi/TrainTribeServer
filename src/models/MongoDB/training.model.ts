import mongoose, { Schema, Model } from "mongoose";
import { ITraining } from "../../interfaces/index.js";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../../types/index.js";

const TrainingSchema = new Schema<ITraining>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    sport: {
      type: String,
      enum: Object.values(SportsEnum)
    },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    partipantAttendance: [
      {
        participant: { type: Schema.Types.ObjectId, ref: "User" },
        attended: { type: Boolean, default: false }
      }
    ],
    difficultyLevel: { type: String, enum: Object.values(TrainingLevelEnum) },
    duration: { type: Number },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    status: {
      type: String,
      enum: Object.values(TrainingStatusEnum),
      default: TrainingStatusEnum.SCHEDULED
    }
  },
  {
    timestamps: true
  }
);

const TrainingModel: Model<ITraining> = mongoose.model<ITraining>(
  "Training",
  TrainingSchema
);

export default TrainingModel;
