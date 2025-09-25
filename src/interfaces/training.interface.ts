import { Document, ObjectId } from "mongoose";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../types/index.js";
import { IGeoLocation } from "./geoLocation.interface.js";
import { ITrainingParticipant } from "./index.js";

export interface ITraining extends Document<ObjectId> {
  title: string;
  description: string;
  date: Date;
  address: string;
  location: IGeoLocation;
  sport: SportsEnum;
  creator: ObjectId;
  participants: ITrainingParticipant[];
  difficultyLevel: TrainingLevelEnum;
  duration: number;
  likes: ObjectId[];
  comments: ObjectId[];
  status: TrainingStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
