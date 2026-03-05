import mongoose, { Model, Schema } from "mongoose";
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
    address: {
      type: {
        house_number: String,
        road: String,
        suburb: String,
        city: String,
        town: String,
        village: String,
        county: String,
        state: String,
        postcode: String,
        country: String,
        country_code: String
      },
      required: false
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    sport: {
      type: String,
      enum: Object.values(SportsEnum)
    },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [
      {
        participant: { type: Schema.Types.ObjectId, ref: "User" },
        attended: { type: Boolean, default: false },
        hasLeftReview: { type: Boolean, default: false }
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
    status: {
      type: String,
      enum: Object.values(TrainingStatusEnum),
      default: TrainingStatusEnum.SCHEDULED
    },
    isRecurring: { type: Boolean, default: false },
    recurrence: {
      recurrenceId: { type: String },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly"
      },
      interval: { type: Number, min: 1, default: 1 },
      daysOfWeek: [{ type: Number, min: 0, max: 6 }],
      dayOfMonth: { type: Number, min: 1, max: 31 },
      endDate: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

TrainingSchema.index({ location: "2dsphere" });
TrainingSchema.index({ date: 1, sport: 1, creator: 1 });
TrainingSchema.index({ date: 1 });
TrainingSchema.index({ creator: 1 });
TrainingSchema.index({ "recurrence.recurrenceId": 1 });

const TrainingModel: Model<ITraining> = mongoose.model<ITraining>(
  "Training",
  TrainingSchema
);

export default TrainingModel;
