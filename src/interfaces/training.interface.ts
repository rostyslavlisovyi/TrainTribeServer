import { Document, ObjectId } from "mongoose";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../types/index.js";
import { ITrainingParticipant } from "./trainingParticipant.interface.js";

export interface ITraining extends Document<ObjectId> {
  title: string;
  description: string;
  date: Date;
  address: string;
  location: GeoLocation;
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

interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
