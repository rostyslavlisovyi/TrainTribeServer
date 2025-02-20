import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../../interfaces/user.interfaces.js";
import {
  SportsEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../../types/enums.js";

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    image_url: { type: String, required: false },
    date_of_birth: { type: Date, required: false },
    city: { type: Schema.Types.ObjectId, ref: "City", required: false },
    sports: [
      {
        type: String,
        enum: Object.values(SportsEnum)
      }
    ],
    training_level: {
      type: String,
      enum: Object.values(TrainingLevelEnum)
    },
    training_goal: [
      {
        type: String,
        enum: Object.values(TrainingGoalEnum)
      }
    ],
    completed_trainings: { type: Number, default: 0 },
    social_number: { type: String, required: false },
    athlete_bio: { type: String, required: false },
    training_created: [{ type: Schema.Types.ObjectId, ref: "Training" }],
    training_join: [{ type: Schema.Types.ObjectId, ref: "Training" }],
    auth_id: { type: String, required: true },
    last_onboarding_step: { type: String, required: false },
    has_completed_onboarding: { type: Boolean, required: false },
    privacy_settings: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
