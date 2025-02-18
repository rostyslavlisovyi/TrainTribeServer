import { Document, HydratedDocument, ObjectId } from "mongoose";
import { SportsEnum } from "../types/enums.js";
export interface IUser extends Document {
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  image_url?: string;
  city: ObjectId;
  sports?: SportsEnum[];
  completed_trainings?: number;
  social_number?: string;
  athlete_bio?: string;
  training_created?: ObjectId[];
  training_join?: ObjectId[];
  auth_id: string;
  last_onboarding_step: string;
  has_completed_onboarding: boolean;
  privacy_settings: boolean;
}

export type UserDocument = HydratedDocument<IUser>;
