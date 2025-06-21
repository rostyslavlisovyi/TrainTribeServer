import { Document, ObjectId } from "mongoose";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../types/index.js";

export interface ITraining extends Document {
  title: string;
  description: string;
  date: Date;
  address: string;
  latitude: string;
  longitude: string;
  sport: SportsEnum;
  creator: ObjectId;
  participants: ObjectId[];
  difficultyLevel: TrainingLevelEnum;
  duration: number;
  likes: ObjectId[];
  comments: ObjectId[];
  reviews: ObjectId[];
  status: TrainingStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
