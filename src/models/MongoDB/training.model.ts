import mongoose, { Schema, Model } from "mongoose";
import { ITraining } from "../../interfaces/index.js";
import { SportsEnum, TrainingLevelEnum } from "../../types/index.js";

const TrainingSchema = new Schema<ITraining>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    sport: [
      {
        type: String,
        enum: Object.values(SportsEnum)
      }
    ],
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    difficultyLevel: { type: String, enum: Object.values(TrainingLevelEnum) },
    duration: { type: Number },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      }
    ]
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
