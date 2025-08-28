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
    athleteBio: { type: String, required: false },
    authId: { type: String, required: true, unique: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: false },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    hasCompletedOnboarding: { type: Boolean, required: false },
    image: { type: Schema.Types.Mixed, required: false },
    lastName: { type: String },
    lastOnboardingStep: { type: String, required: false },
    privacySettings: { type: Boolean, default: false },
    rangeOfAction: { type: Number },
    sports: [
      {
        type: String,
        enum: Object.values(SportsEnum)
      }
    ],
    trainingGoal: [
      {
        type: String,
        enum: Object.values(TrainingGoalEnum)
      }
    ],
    trainingLevel: {
      type: String,
      enum: Object.values(TrainingLevelEnum)
    },
    trainingFrequency: {
      type: String,
      enum: Object.values(TrainingFrequencyEnum)
    },
    trainingPartnerPreference: { type: String },
    trainingTimeSlot: [
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
    trainingPoints: { type: Number, default: 0 },
    reviewPoints: { type: Number, default: 0 },
    countTrainingOrganized: { type: Number, default: 0 },
    countTrainingJoined: { type: Number, default: 0 },
    countTrainingMissed: { type: Number, default: 0 },
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
