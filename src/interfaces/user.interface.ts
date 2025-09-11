import { Document, HydratedDocument, ObjectId } from "mongoose";
import {
  LanguageEnum,
  SportsEnum,
  TrainingFrequencyEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../types/index.js";
import { ICity, IFileUpload } from "./index.js";
import { ITimeSlot } from "./timeSlot.interface.js";
export interface IUser extends Document<ObjectId> {
  athleteBio?: string;
  authId: string;
  city: ICity;
  dateOfBirth?: Date;
  email: string;
  firstName?: string;
  hasCompletedOnboarding: boolean;
  image?: IFileUpload;
  lastName?: string;
  lastOnboardingStep: string;
  privacySettings: boolean;
  rangeOfAction: number;
  sports?: SportsEnum[];
  trainingGoal?: TrainingGoalEnum[];
  trainingLevel?: TrainingLevelEnum;
  trainingFrequency: TrainingFrequencyEnum;
  trainingPartnerPreference: string;
  trainingTimeSlot: ITimeSlot[];
  trainingPoints: number;
  reviewPoints: number;
  countTrainingOrganized?: number;
  countTrainingJoined?: number;
  countTrainingMissed?: number;
  language: LanguageEnum;
}

export type UserDocument = HydratedDocument<IUser>;
