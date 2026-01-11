import mongoose, { Document, HydratedDocument } from "mongoose";
import {
  LanguageEnum,
  NotificationEnum,
  SportsEnum,
  TrainingFrequencyEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../types/index.js";
import { ICity, ICloudinaryFile } from "./index.js";
import { ITimeSlot } from "./timeSlot.interface.js";
export interface IUser extends Document<mongoose.Types.ObjectId> {
  athleteBio?: string;
  authId: string;
  city: ICity;
  dateOfBirth?: Date;
  email: string;
  firstName?: string;
  hasCompletedOnboarding: boolean;
  image?: ICloudinaryFile;
  lastName?: string;
  lastOnboardingStep: string;
  termsAndPrivacyAccepted: boolean;
  termsAndPrivacyAcceptedAt?: Date;
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
  averageRating: number;
  fcmToken?: string;
  fcmTokenUpdatedAt?: Date;
  settings: {
    notifications: Record<NotificationEnum, boolean>;
  };
}

export type UserDocument = HydratedDocument<IUser>;
