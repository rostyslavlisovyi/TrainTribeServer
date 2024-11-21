import { Document, ObjectId } from "mongoose";
export interface ITraining extends Document {
  title: string;
  sport: string;
  date: string;
  time: string;
  distance: string;
  location: object;
  creator: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface ITrainingInput {
  external_id: string;
  title: string;
  sport: string;
  date: string;
  time: string;
  distance: string;
  location: object;
  creator: string;
  participants: string[];
}
