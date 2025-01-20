import { Document, HydratedDocument, ObjectId } from "mongoose";
export interface IUser extends Document {
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  sport?: ObjectId[];
  completed_trainings: number;
  social_number: string;
  athlete_bio?: string;
  training_created?: ObjectId[];
  training_join?: ObjectId[];
  auth_id: string;
  last_onbording_step: boolean;
  has_complyted_onboarding: boolean;
}

export type UserDocument = HydratedDocument<IUser>;
