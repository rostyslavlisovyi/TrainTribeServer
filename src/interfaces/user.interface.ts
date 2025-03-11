import { Document, HydratedDocument, ObjectId } from "mongoose";
import {
  SportsEnum,
  TrainingGoalEnum,
  TrainingLevelEnum,
  TrainingFrequencyEnum
} from "../types/index.js";
import { ITimeSlot } from "./timeSlot.interface.ts";
export interface IUser extends Document {
  athlete_bio?: string;
  auth_id: string;
  city: ObjectId;
  completed_trainings?: number;
  date_of_birth?: Date;
  email: string;
  first_name?: string;
  has_completed_onboarding: boolean;
  image_url?: string;
  last_name?: string;
  last_onboarding_step: string;
  privacy_settings: boolean;
  rangeOfAction: number;
  social_number?: string;
  sports?: SportsEnum[];
  training_created?: ObjectId[];
  training_goal?: TrainingGoalEnum[];
  training_join?: ObjectId[];
  training_level?: TrainingLevelEnum;
  trainingFrequency: TrainingFrequencyEnum;
  trainingPartnerPreference: string;
  trainingTimeSlot: ITimeSlot[];
  username?: string;
}

export type UserDocument = HydratedDocument<IUser>;
