import mongoose, { Schema, Document, Types } from "mongoose";

interface ITraining extends Document {
  title: string;
  description: string;
  date: Date;
  latitude: number;
  longitude: number;
  sport: Types.ObjectId;
  creator: Types.ObjectId;
  participants: Types.ObjectId[];
}

const TrainingSchema = new Schema<ITraining>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    sport: { type: Schema.Types.ObjectId, ref: "Sport", required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

const TrainingModel = mongoose.model<ITraining>("Training", TrainingSchema);

module.exports = TrainingModel;
