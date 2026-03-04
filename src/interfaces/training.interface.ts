import mongoose, { Document } from "mongoose";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../types/index.js";
import { IGeoLocation } from "./geoLocation.interface.js";
import { IGeocodeAddress, ITrainingParticipant } from "./index.js";

export interface TrainingRecurrence {
  recurrenceId: string;
  daysOfWeek: number[];
  endDate: Date;
}

export interface ITraining extends Document<mongoose.Types.ObjectId> {
  title: string;
  description: string;
  date: Date;
  address: IGeocodeAddress;
  location: IGeoLocation;
  sport: SportsEnum;
  creator: mongoose.Types.ObjectId;
  participants: ITrainingParticipant[];
  difficultyLevel: TrainingLevelEnum;
  duration: number;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  status: TrainingStatusEnum;
  isRecurring?: boolean;
  recurrence?: TrainingRecurrence;
  createdAt: Date;
  updatedAt: Date;
}
