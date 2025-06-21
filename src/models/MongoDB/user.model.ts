import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../../interfaces/index.js";
import {
  DaysOfTheWeekEnum,
  LanguageEnum,
  SportsEnum,
  TimeSlotsEnum,
  TrainingFrequencyEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../../types/enums.js";

const UserSchema: Schema = new Schema(
  {
    athlete_bio: { type: String, required: false },
    auth_id: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: false },
    completed_trainings: { type: Number, default: 0 },
    date_of_birth: { type: Date, required: false },
    email: { type: String, required: true, unique: true },
    first_name: { type: String },
    has_completed_onboarding: { type: Boolean, required: false },
    image_url: { type: String, required: false },
    last_name: { type: String },
    last_onboarding_step: { type: String, required: false },
    privacy_settings: { type: Boolean, default: false },
    range_of_action: { type: Number },
    sports: [
      {
        type: String,
        enum: Object.values(SportsEnum)
      }
    ],
    training_created: [{ type: Schema.Types.ObjectId, ref: "Training" }],
    training_goal: [
      {
        type: String,
        enum: Object.values(TrainingGoalEnum)
      }
    ],
    training_join: [{ type: Schema.Types.ObjectId, ref: "Training" }],
    training_level: {
      type: String,
      enum: Object.values(TrainingLevelEnum)
    },
    training_frequency: {
      type: String,
      enum: Object.values(TrainingFrequencyEnum)
    },
    training_partner_preference: { type: String },
    training_time_slot: [
      {
        day: {
          type: String,
          enum: Object.values(DaysOfTheWeekEnum)
        },
        startTime: {
          type: String,
          enum: Object.values(TimeSlotsEnum)
        },
        endTime: {
          type: String,
          enum: Object.values(TimeSlotsEnum)
        }
      }
    ],
    training_points: { type: Number, default: 0 },
    review_points: { type: Number, default: 0 },
    username: { type: String },
    language: {
      type: String,
      enum: Object.values(LanguageEnum),
      default: LanguageEnum.IT
    }
  },
  {
    timestamps: true
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
