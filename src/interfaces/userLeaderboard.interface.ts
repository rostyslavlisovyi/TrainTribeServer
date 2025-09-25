import { ObjectId } from "mongoose";

export interface IUserLeaderboard {
  _id: ObjectId;
  user: ObjectId;
  points: number;
  createdAt: Date;
}
