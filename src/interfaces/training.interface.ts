import { Document, ObjectId } from "mongoose";
import {
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../types/index.js";
import { IComment } from "./comment.interface.ts";
import { IParticipantAttendance } from "./participantAttendance.interface.js";
import { IReview } from "./review.interface.ts";
import { IUser } from "./user.interface.ts";

export interface ITraining extends Document<ObjectId> {
  title: string;
  description: string;
  date: Date;
  address: string;
  location: GeoLocation;
  sport: SportsEnum;
  creator: ObjectId;
  participantAttendance: IParticipantAttendance[];
  difficultyLevel: TrainingLevelEnum;
  duration: number;
  likes: IUser[];
  comments: IComment[];
  reviews: IReview[];
  status: TrainingStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
