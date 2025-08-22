import { Document, HydratedDocument, ObjectId } from "mongoose";
import {
  FileUpload,
  LanguageEnum,
  SportsEnum,
  TrainingFrequencyEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../types/index.js";
import { ITimeSlot } from "./timeSlot.interface.js";
export interface IUser extends Document<ObjectId> {
  athlete_bio?: string;
  auth_id: string;
  city: ObjectId;
  completed_trainings?: number;
  date_of_birth?: Date;
  email: string;
  first_name?: string;
  has_completed_onboarding: boolean;
  image?: FileUpload;
  last_name?: string;
  last_onboarding_step: string;
  privacy_settings: boolean;
  range_of_action: number;
  sports?: SportsEnum[];
  training_created?: ObjectId[];
  training_goal?: TrainingGoalEnum[];
  training_join?: ObjectId[];
  training_level?: TrainingLevelEnum;
  training_frequency: TrainingFrequencyEnum;
  training_partner_preference: string;
  training_time_slot: ITimeSlot[];
  training_points: number;
  review_points: number;
  username?: string;
  count_training_organized?: number;
  count_training_joined?: number;
  count_training_missed?: number;
  language: LanguageEnum;
}

export type UserDocument = HydratedDocument<IUser>;
